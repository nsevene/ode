import { supabase } from '../supabase'
import type { UserRole } from '../../types/auth'

// =====================================================
// SECURITY UTILITIES FOR ODPORTAL B2B
// =====================================================

export interface SecurityContext {
  userId: string
  role: UserRole
  organizationId?: string
  permissions: string[]
  sessionValid: boolean
}

export interface AuditLog {
  id: string
  tableName: string
  operation: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT'
  oldData?: any
  newData?: any
  userId: string
  timestamp: string
  ipAddress?: string
  userAgent?: string
}

export interface RateLimitConfig {
  maxAttempts: number
  timeWindow: number // in milliseconds
  actionType: string
}

// =====================================================
// SECURITY CONTEXT MANAGEMENT
// =====================================================

export class SecurityManager {
  private static instance: SecurityManager
  private securityContext: SecurityContext | null = null
  private rateLimitCache: Map<string, { count: number; resetTime: number }> = new Map()

  private constructor() {}

  public static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager()
    }
    return SecurityManager.instance
  }

  // Initialize security context for current user
  public async initializeSecurityContext(): Promise<SecurityContext | null> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        this.securityContext = null
        return null
      }

      // Get user profile and role
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role, organization_id, status')
        .eq('user_id', user.id)
        .single()

      if (profileError || !profile) {
        console.error('Error fetching user profile:', profileError)
        return null
      }

      // Check if user is active
      if (profile.status !== 'active') {
        console.warn('User account is not active')
        return null
      }

      // Get user permissions based on role
      const permissions = this.getPermissionsForRole(profile.role as UserRole)

      this.securityContext = {
        userId: user.id,
        role: profile.role as UserRole,
        organizationId: profile.organization_id,
        permissions,
        sessionValid: true
      }

      return this.securityContext
    } catch (error) {
      console.error('Error initializing security context:', error)
      return null
    }
  }

  // Get current security context
  public getSecurityContext(): SecurityContext | null {
    return this.securityContext
  }

  // Check if user has specific permission
  public hasPermission(permission: string): boolean {
    if (!this.securityContext) return false
    return this.securityContext.permissions.includes(permission) || 
           this.securityContext.permissions.includes('admin')
  }

  // Check if user has role
  public hasRole(role: UserRole): boolean {
    if (!this.securityContext) return false
    return this.securityContext.role === role
  }

  // Check if user is admin
  public isAdmin(): boolean {
    return this.hasRole('admin')
  }

  // Check if user is investor
  public isInvestor(): boolean {
    return this.hasRole('investor')
  }

  // Check if user is tenant
  public isTenant(): boolean {
    return this.hasRole('tenant')
  }

  // Get permissions for specific role
  private getPermissionsForRole(role: UserRole): string[] {
    const basePermissions = ['view_own_data', 'edit_own_data']
    
    switch (role) {
      case 'admin':
        return [
          ...basePermissions,
          'view_all_data',
          'edit_all_data',
          'delete_data',
          'manage_users',
          'manage_properties',
          'manage_applications',
          'manage_financials',
          'manage_documents',
          'view_audit_logs',
          'manage_organizations'
        ]
      case 'investor':
        return [
          ...basePermissions,
          'view_investment_opportunities',
          'manage_portfolio',
          'submit_investment_interest',
          'manage_favorites',
          'view_market_data',
          'manage_investor_documents'
        ]
      case 'tenant':
        return [
          ...basePermissions,
          'view_tenant_opportunities',
          'submit_tenant_application',
          'manage_tenant_documents',
          'view_payment_history',
          'submit_maintenance_request'
        ]
      default:
        return basePermissions
    }
  }

  // =====================================================
  // RATE LIMITING
  // =====================================================

  // Check rate limit for specific action
  public async checkRateLimit(config: RateLimitConfig): Promise<boolean> {
    const key = `${this.securityContext?.userId || 'anonymous'}_${config.actionType}`
    const now = Date.now()
    
    const cached = this.rateLimitCache.get(key)
    
    if (cached) {
      if (now < cached.resetTime) {
        if (cached.count >= config.maxAttempts) {
          return false
        }
        cached.count++
      } else {
        // Reset counter
        this.rateLimitCache.set(key, { count: 1, resetTime: now + config.timeWindow })
      }
    } else {
      this.rateLimitCache.set(key, { count: 1, resetTime: now + config.timeWindow })
    }

    return true
  }

  // =====================================================
  // AUDIT LOGGING
  // =====================================================

  // Log security event
  public async logSecurityEvent(
    operation: string,
    tableName: string,
    oldData?: any,
    newData?: any,
    metadata?: any
  ): Promise<void> {
    try {
      if (!this.securityContext) return

      const auditData = {
        table_name: tableName,
        operation,
        old_data: oldData,
        new_data: newData,
        user_id: this.securityContext.userId,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          ip_address: await this.getClientIP(),
          user_agent: navigator.userAgent
        }
      }

      const { error } = await supabase
        .from('audit_logs')
        .insert(auditData)

      if (error) {
        console.error('Error logging security event:', error)
      }
    } catch (error) {
      console.error('Error in logSecurityEvent:', error)
    }
  }

  // Get client IP (simplified for browser environment)
  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip || 'unknown'
    } catch {
      return 'unknown'
    }
  }

  // =====================================================
  // DATA VALIDATION
  // =====================================================

  // Validate email format
  public validateEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    return emailRegex.test(email)
  }

  // Validate phone format
  public validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    return phoneRegex.test(phone)
  }

  // Validate role
  public validateRole(role: string): role is UserRole {
    return ['admin', 'investor', 'tenant'].includes(role)
  }

  // Sanitize input data
  public sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      return input.trim().replace(/[<>]/g, '')
    }
    if (Array.isArray(input)) {
      return input.map(item => this.sanitizeInput(item))
    }
    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {}
      for (const key in input) {
        sanitized[key] = this.sanitizeInput(input[key])
      }
      return sanitized
    }
    return input
  }

  // =====================================================
  // SESSION MANAGEMENT
  // =====================================================

  // Check if session is valid
  public async isSessionValid(): Promise<boolean> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) return false

      // Check if user exists in our database and is active
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('status')
        .eq('user_id', user.id)
        .single()

      if (profileError || !profile) return false

      return profile.status === 'active'
    } catch (error) {
      console.error('Error checking session validity:', error)
      return false
    }
  }

  // Refresh security context
  public async refreshSecurityContext(): Promise<SecurityContext | null> {
    return await this.initializeSecurityContext()
  }

  // Clear security context
  public clearSecurityContext(): void {
    this.securityContext = null
  }

  // =====================================================
  // SECURITY CHECKS
  // =====================================================

  // Check if user can access resource
  public canAccessResource(resourceType: string, resourceId?: string): boolean {
    if (!this.securityContext) return false

    // Admin can access everything
    if (this.isAdmin()) return true

    // Check specific resource access rules
    switch (resourceType) {
      case 'own_profile':
        return true
      case 'own_documents':
        return true
      case 'own_applications':
        return true
      case 'investment_opportunities':
        return this.isInvestor() || this.isAdmin()
      case 'portfolio':
        return this.isInvestor()
      case 'tenant_applications':
        return this.isTenant()
      case 'admin_panel':
        return this.isAdmin()
      default:
        return false
    }
  }

  // Check if user can perform action
  public canPerformAction(action: string, resourceType?: string): boolean {
    if (!this.securityContext) return false

    // Admin can perform all actions
    if (this.isAdmin()) return true

    // Check specific action permissions
    switch (action) {
      case 'view':
        return this.hasPermission('view_own_data')
      case 'edit':
        return this.hasPermission('edit_own_data')
      case 'delete':
        return this.hasPermission('delete_data')
      case 'create':
        return this.hasPermission('edit_own_data')
      case 'manage_users':
        return this.hasPermission('manage_users')
      case 'manage_properties':
        return this.hasPermission('manage_properties')
      case 'submit_investment_interest':
        return this.isInvestor()
      case 'submit_tenant_application':
        return this.isTenant()
      default:
        return false
    }
  }
}

// =====================================================
// SECURITY HOOKS AND UTILITIES
// =====================================================

// Get security manager instance
export const getSecurityManager = (): SecurityManager => {
  return SecurityManager.getInstance()
}

// Security context hook
export const useSecurityContext = (): SecurityContext | null => {
  const securityManager = getSecurityManager()
  return securityManager.getSecurityContext()
}

// Permission check hook
export const usePermission = (permission: string): boolean => {
  const securityManager = getSecurityManager()
  return securityManager.hasPermission(permission)
}

// Role check hook
export const useRole = (role: UserRole): boolean => {
  const securityManager = getSecurityManager()
  return securityManager.hasRole(role)
}

// =====================================================
// SECURITY MIDDLEWARE
// =====================================================

// API security middleware
export const withSecurity = async <T>(
  operation: () => Promise<T>,
  requiredPermission?: string,
  resourceType?: string
): Promise<T> => {
  const securityManager = getSecurityManager()
  
  // Check if user is authenticated
  if (!securityManager.getSecurityContext()) {
    throw new Error('Authentication required')
  }

  // Check specific permission if required
  if (requiredPermission && !securityManager.hasPermission(requiredPermission)) {
    throw new Error('Insufficient permissions')
  }

  // Check resource access if specified
  if (resourceType && !securityManager.canAccessResource(resourceType)) {
    throw new Error('Access denied to resource')
  }

  try {
    const result = await operation()
    
    // Log successful operation
    await securityManager.logSecurityEvent(
      'SUCCESS',
      resourceType || 'unknown',
      undefined,
      { operation: operation.name }
    )
    
    return result
  } catch (error) {
    // Log failed operation
    await securityManager.logSecurityEvent(
      'ERROR',
      resourceType || 'unknown',
      undefined,
      { 
        operation: operation.name,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    )
    
    throw error
  }
}

// =====================================================
// SECURITY CONSTANTS
// =====================================================

export const SECURITY_CONSTANTS = {
  RATE_LIMITS: {
    LOGIN_ATTEMPTS: { maxAttempts: 5, timeWindow: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
    API_CALLS: { maxAttempts: 100, timeWindow: 60 * 1000 }, // 100 calls per minute
    PASSWORD_RESET: { maxAttempts: 3, timeWindow: 60 * 60 * 1000 }, // 3 attempts per hour
    FILE_UPLOAD: { maxAttempts: 10, timeWindow: 60 * 1000 } // 10 uploads per minute
  },
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIREMENTS: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  }
} as const

// =====================================================
// SECURITY VALIDATION FUNCTIONS
// =====================================================

// Validate password strength
export const validatePasswordStrength = (password: string): {
  isValid: boolean
  score: number
  feedback: string[]
} => {
  const feedback: string[] = []
  let score = 0

  if (password.length < SECURITY_CONSTANTS.PASSWORD_REQUIREMENTS.minLength) {
    feedback.push('Password must be at least 8 characters long')
  } else {
    score += 1
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push('Password must contain at least one uppercase letter')
  } else {
    score += 1
  }

  if (!/[a-z]/.test(password)) {
    feedback.push('Password must contain at least one lowercase letter')
  } else {
    score += 1
  }

  if (!/[0-9]/.test(password)) {
    feedback.push('Password must contain at least one number')
  } else {
    score += 1
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    feedback.push('Password must contain at least one special character')
  } else {
    score += 1
  }

  return {
    isValid: score >= 4,
    score,
    feedback
  }
}

// Validate input data
export const validateInput = (data: any, schema: any): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []
  
  // Basic validation logic
  for (const field in schema) {
    const rules = schema[field]
    const value = data[field]

    if (rules.required && (!value || value === '')) {
      errors.push(`${field} is required`)
    }

    if (value && rules.type && typeof value !== rules.type) {
      errors.push(`${field} must be of type ${rules.type}`)
    }

    if (value && rules.minLength && value.length < rules.minLength) {
      errors.push(`${field} must be at least ${rules.minLength} characters`)
    }

    if (value && rules.maxLength && value.length > rules.maxLength) {
      errors.push(`${field} must be no more than ${rules.maxLength} characters`)
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      errors.push(`${field} format is invalid`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
