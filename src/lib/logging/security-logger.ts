// =====================================================
// SECURITY LOGGING SYSTEM FOR ODPORTAL B2B
// =====================================================

import { supabase } from '../supabase'

export interface SecurityEvent {
  id: string
  eventType: SecurityEventType
  severity: SecuritySeverity
  userId?: string
  sessionId?: string
  ipAddress?: string
  userAgent?: string
  resource?: string
  action?: string
  details: Record<string, any>
  timestamp: string
  resolved: boolean
}

export type SecurityEventType = 
  | 'authentication'
  | 'authorization'
  | 'data_access'
  | 'data_modification'
  | 'security_violation'
  | 'suspicious_activity'
  | 'system_error'
  | 'configuration_change'
  | 'user_management'
  | 'api_access'

export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical'

export interface SecurityLogFilter {
  eventType?: SecurityEventType
  severity?: SecuritySeverity
  userId?: string
  dateFrom?: string
  dateTo?: string
  resolved?: boolean
}

export interface SecurityMetrics {
  totalEvents: number
  eventsByType: Record<SecurityEventType, number>
  eventsBySeverity: Record<SecuritySeverity, number>
  criticalEvents: number
  unresolvedEvents: number
  averageResponseTime: number
}

// =====================================================
// SECURITY LOGGER CLASS
// =====================================================

export class SecurityLogger {
  private static instance: SecurityLogger
  private events: SecurityEvent[] = []
  private observers: Array<(event: SecurityEvent) => void> = []
  private isEnabled: boolean = true

  private constructor() {
    this.initializeLogging()
  }

  public static getInstance(): SecurityLogger {
    if (!SecurityLogger.instance) {
      SecurityLogger.instance = new SecurityLogger()
    }
    return SecurityLogger.instance
  }

  // Initialize security logging
  private initializeLogging(): void {
    // Monitor authentication events
    this.monitorAuthentication()
    
    // Monitor authorization events
    this.monitorAuthorization()
    
    // Monitor data access events
    this.monitorDataAccess()
    
    // Monitor API access events
    this.monitorAPIAccess()
    
    // Monitor suspicious activities
    this.monitorSuspiciousActivities()
  }

  // =====================================================
  // EVENT LOGGING METHODS
  // =====================================================

  // Log authentication event
  public logAuthentication(
    action: 'login' | 'logout' | 'login_failed' | 'password_reset' | 'account_locked',
    userId?: string,
    details?: Record<string, any>
  ): void {
    const severity = this.getAuthenticationSeverity(action)
    
    this.logEvent({
      eventType: 'authentication',
      severity,
      userId,
      action,
      details: {
        ...details,
        action,
        timestamp: new Date().toISOString()
      }
    })
  }

  // Log authorization event
  public logAuthorization(
    action: 'access_granted' | 'access_denied' | 'permission_changed' | 'role_changed',
    userId: string,
    resource: string,
    details?: Record<string, any>
  ): void {
    const severity = this.getAuthorizationSeverity(action)
    
    this.logEvent({
      eventType: 'authorization',
      severity,
      userId,
      resource,
      action,
      details: {
        ...details,
        action,
        resource,
        timestamp: new Date().toISOString()
      }
    })
  }

  // Log data access event
  public logDataAccess(
    action: 'read' | 'write' | 'delete' | 'export',
    userId: string,
    resource: string,
    recordCount?: number,
    details?: Record<string, any>
  ): void {
    const severity = this.getDataAccessSeverity(action, recordCount)
    
    this.logEvent({
      eventType: 'data_access',
      severity,
      userId,
      resource,
      action,
      details: {
        ...details,
        action,
        resource,
        recordCount,
        timestamp: new Date().toISOString()
      }
    })
  }

  // Log security violation
  public logSecurityViolation(
    violationType: 'unauthorized_access' | 'data_breach' | 'malicious_activity' | 'policy_violation',
    userId?: string,
    resource?: string,
    details?: Record<string, any>
  ): void {
    this.logEvent({
      eventType: 'security_violation',
      severity: 'critical',
      userId,
      resource,
      action: violationType,
      details: {
        ...details,
        violationType,
        timestamp: new Date().toISOString()
      }
    })
  }

  // Log suspicious activity
  public logSuspiciousActivity(
    activityType: 'unusual_access_pattern' | 'multiple_failed_logins' | 'data_exfiltration' | 'privilege_escalation',
    userId?: string,
    details?: Record<string, any>
  ): void {
    this.logEvent({
      eventType: 'suspicious_activity',
      severity: 'high',
      userId,
      action: activityType,
      details: {
        ...details,
        activityType,
        timestamp: new Date().toISOString()
      }
    })
  }

  // Log system error
  public logSystemError(
    errorType: 'database_error' | 'api_error' | 'authentication_error' | 'authorization_error',
    error: Error,
    userId?: string,
    details?: Record<string, any>
  ): void {
    this.logEvent({
      eventType: 'system_error',
      severity: 'medium',
      userId,
      action: errorType,
      details: {
        ...details,
        errorType,
        errorMessage: error.message,
        errorStack: error.stack,
        timestamp: new Date().toISOString()
      }
    })
  }

  // Log configuration change
  public logConfigurationChange(
    changeType: 'user_role_changed' | 'permissions_updated' | 'security_policy_changed' | 'system_config_updated',
    userId: string,
    targetUserId?: string,
    details?: Record<string, any>
  ): void {
    this.logEvent({
      eventType: 'configuration_change',
      severity: 'medium',
      userId,
      action: changeType,
      details: {
        ...details,
        changeType,
        targetUserId,
        timestamp: new Date().toISOString()
      }
    })
  }

  // Log API access
  public logAPIAccess(
    endpoint: string,
    method: string,
    statusCode: number,
    responseTime: number,
    userId?: string,
    details?: Record<string, any>
  ): void {
    const severity = this.getAPISeverity(statusCode, responseTime)
    
    this.logEvent({
      eventType: 'api_access',
      severity,
      userId,
      resource: endpoint,
      action: method,
      details: {
        ...details,
        endpoint,
        method,
        statusCode,
        responseTime,
        timestamp: new Date().toISOString()
      }
    })
  }

  // =====================================================
  // CORE LOGGING METHOD
  // =====================================================

  // Log security event
  private logEvent(event: Omit<SecurityEvent, 'id' | 'timestamp' | 'resolved'>): void {
    if (!this.isEnabled) return

    const securityEvent: SecurityEvent = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      resolved: false,
      ...event,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      sessionId: this.getSessionId()
    }

    // Add to local cache
    this.events.push(securityEvent)
    
    // Keep only last 1000 events in memory
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000)
    }

    // Send to backend
    this.sendToBackend(securityEvent)

    // Notify observers
    this.notifyObservers(securityEvent)

    // Check for critical events
    if (securityEvent.severity === 'critical') {
      this.handleCriticalEvent(securityEvent)
    }
  }

  // Send event to backend
  private async sendToBackend(event: SecurityEvent): Promise<void> {
    try {
      const { error } = await supabase
        .from('security_logs')
        .insert({
          event_type: event.eventType,
          severity: event.severity,
          user_id: event.userId,
          session_id: event.sessionId,
          ip_address: event.ipAddress,
          user_agent: event.userAgent,
          resource: event.resource,
          action: event.action,
          details: event.details,
          timestamp: event.timestamp,
          resolved: event.resolved
        })

      if (error) {
        console.error('Error logging security event:', error)
      }
    } catch (error) {
      console.error('Error sending security event to backend:', error)
    }
  }

  // =====================================================
  // MONITORING METHODS
  // =====================================================

  // Monitor authentication events
  private monitorAuthentication(): void {
    // Override localStorage to monitor auth changes
    const originalSetItem = localStorage.setItem
    localStorage.setItem = function(key, value) {
      if (key.includes('auth') || key.includes('token')) {
        SecurityLogger.getInstance().logAuthentication('login', undefined, {
          key,
          hasValue: !!value
        })
      }
      return originalSetItem.call(this, key, value)
    }

    const originalRemoveItem = localStorage.removeItem
    localStorage.removeItem = function(key) {
      if (key.includes('auth') || key.includes('token')) {
        SecurityLogger.getInstance().logAuthentication('logout', undefined, {
          key
        })
      }
      return originalRemoveItem.call(this, key)
    }
  }

  // Monitor authorization events
  private monitorAuthorization(): void {
    // Monitor route changes for authorization
    const originalPushState = history.pushState
    history.pushState = function(state, title, url) {
      SecurityLogger.getInstance().logAuthorization(
        'access_granted',
        'current_user', // This would be the actual user ID
        url as string,
        { state, title }
      )
      return originalPushState.call(this, state, title, url)
    }
  }

  // Monitor data access events
  private monitorDataAccess(): void {
    // Monitor Supabase queries
    const originalFrom = supabase.from
    supabase.from = function(table) {
      SecurityLogger.getInstance().logDataAccess(
        'read',
        'current_user',
        table,
        undefined,
        { table }
      )
      return originalFrom.call(this, table)
    }
  }

  // Monitor API access events
  private monitorAPIAccess(): void {
    // Override fetch to monitor API calls
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const startTime = performance.now()
      const url = args[0] as string
      const method = (args[1] as RequestInit)?.method || 'GET'

      try {
        const response = await originalFetch(...args)
        const endTime = performance.now()
        const responseTime = endTime - startTime

        SecurityLogger.getInstance().logAPIAccess(
          url,
          method,
          response.status,
          responseTime,
          'current_user', // This would be the actual user ID
          {
            requestBody: args[1]?.body,
            responseHeaders: Object.fromEntries(response.headers.entries())
          }
        )

        return response
      } catch (error) {
        const endTime = performance.now()
        const responseTime = endTime - startTime

        SecurityLogger.getInstance().logAPIAccess(
          url,
          method,
          500,
          responseTime,
          'current_user',
          { error: error instanceof Error ? error.message : 'Unknown error' }
        )

        throw error
      }
    }
  }

  // Monitor suspicious activities
  private monitorSuspiciousActivities(): void {
    // Monitor for unusual patterns
    let loginAttempts = 0
    let lastLoginAttempt = 0

    setInterval(() => {
      const now = Date.now()
      if (now - lastLoginAttempt < 60000) { // Within 1 minute
        loginAttempts++
        if (loginAttempts > 5) {
          SecurityLogger.getInstance().logSuspiciousActivity(
            'multiple_failed_logins',
            undefined,
            { attemptCount: loginAttempts }
          )
        }
      } else {
        loginAttempts = 0
      }
      lastLoginAttempt = now
    }, 60000) // Check every minute
  }

  // =====================================================
  // SEVERITY DETERMINATION
  // =====================================================

  // Get authentication severity
  private getAuthenticationSeverity(action: string): SecuritySeverity {
    switch (action) {
      case 'login_failed':
      case 'account_locked':
        return 'high'
      case 'password_reset':
        return 'medium'
      default:
        return 'low'
    }
  }

  // Get authorization severity
  private getAuthorizationSeverity(action: string): SecuritySeverity {
    switch (action) {
      case 'access_denied':
        return 'high'
      case 'permission_changed':
      case 'role_changed':
        return 'medium'
      default:
        return 'low'
    }
  }

  // Get data access severity
  private getDataAccessSeverity(action: string, recordCount?: number): SecuritySeverity {
    if (action === 'delete') return 'high'
    if (action === 'export' && (recordCount || 0) > 1000) return 'high'
    if (action === 'write') return 'medium'
    return 'low'
  }

  // Get API severity
  private getAPISeverity(statusCode: number, responseTime: number): SecuritySeverity {
    if (statusCode >= 500) return 'high'
    if (statusCode >= 400) return 'medium'
    if (responseTime > 5000) return 'medium'
    return 'low'
  }

  // =====================================================
  // EVENT HANDLING
  // =====================================================

  // Handle critical events
  private handleCriticalEvent(event: SecurityEvent): void {
    console.error('CRITICAL SECURITY EVENT:', event)
    
    // Send immediate alert
    this.sendCriticalAlert(event)
    
    // Take immediate action if needed
    if (event.eventType === 'security_violation') {
      this.handleSecurityViolation(event)
    }
  }

  // Send critical alert
  private sendCriticalAlert(event: SecurityEvent): void {
    // In a real application, this would send alerts to administrators
    console.error('CRITICAL ALERT:', {
      type: event.eventType,
      severity: event.severity,
      userId: event.userId,
      details: event.details,
      timestamp: event.timestamp
    })
  }

  // Handle security violation
  private handleSecurityViolation(event: SecurityEvent): void {
    // In a real application, this might:
    // - Lock the user account
    // - Revoke sessions
    // - Send alerts to administrators
    // - Log additional details
    
    console.error('SECURITY VIOLATION DETECTED:', event)
  }

  // =====================================================
  // QUERY METHODS
  // =====================================================

  // Get events with filter
  public getEvents(filter?: SecurityLogFilter): SecurityEvent[] {
    let filteredEvents = [...this.events]

    if (filter) {
      if (filter.eventType) {
        filteredEvents = filteredEvents.filter(e => e.eventType === filter.eventType)
      }
      if (filter.severity) {
        filteredEvents = filteredEvents.filter(e => e.severity === filter.severity)
      }
      if (filter.userId) {
        filteredEvents = filteredEvents.filter(e => e.userId === filter.userId)
      }
      if (filter.dateFrom) {
        filteredEvents = filteredEvents.filter(e => e.timestamp >= filter.dateFrom!)
      }
      if (filter.dateTo) {
        filteredEvents = filteredEvents.filter(e => e.timestamp <= filter.dateTo!)
      }
      if (filter.resolved !== undefined) {
        filteredEvents = filteredEvents.filter(e => e.resolved === filter.resolved)
      }
    }

    return filteredEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  // Get security metrics
  public getSecurityMetrics(): SecurityMetrics {
    const totalEvents = this.events.length
    const eventsByType = this.events.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1
      return acc
    }, {} as Record<SecurityEventType, number>)
    
    const eventsBySeverity = this.events.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1
      return acc
    }, {} as Record<SecuritySeverity, number>)
    
    const criticalEvents = this.events.filter(e => e.severity === 'critical').length
    const unresolvedEvents = this.events.filter(e => !e.resolved).length
    
    const responseTimes = this.events
      .filter(e => e.details.responseTime)
      .map(e => e.details.responseTime)
    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
      : 0

    return {
      totalEvents,
      eventsByType,
      eventsBySeverity,
      criticalEvents,
      unresolvedEvents,
      averageResponseTime
    }
  }

  // Resolve event
  public resolveEvent(eventId: string): void {
    const event = this.events.find(e => e.id === eventId)
    if (event) {
      event.resolved = true
    }
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  // Get client IP (simplified)
  private getClientIP(): string {
    // In a real application, this would get the actual IP
    return 'unknown'
  }

  // Get session ID
  private getSessionId(): string {
    // In a real application, this would get the actual session ID
    return 'session_' + Math.random().toString(36).substr(2, 9)
  }

  // Generate unique ID
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  // =====================================================
  // OBSERVER PATTERN
  // =====================================================

  // Add observer
  public addObserver(observer: (event: SecurityEvent) => void): void {
    this.observers.push(observer)
  }

  // Remove observer
  public removeObserver(observer: (event: SecurityEvent) => void): void {
    const index = this.observers.indexOf(observer)
    if (index > -1) {
      this.observers.splice(index, 1)
    }
  }

  // Notify observers
  private notifyObservers(event: SecurityEvent): void {
    this.observers.forEach(observer => {
      try {
        observer(event)
      } catch (error) {
        console.error('Error in security observer:', error)
      }
    })
  }

  // =====================================================
  // CONTROL METHODS
  // =====================================================

  // Enable/disable logging
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
  }

  // Clear events
  public clearEvents(): void {
    this.events = []
  }

  // Export events
  public exportEvents(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['id', 'eventType', 'severity', 'userId', 'timestamp', 'resolved']
      const rows = this.events.map(event => 
        headers.map(header => event[header as keyof SecurityEvent] || '')
      )
      return [headers, ...rows].map(row => row.join(',')).join('\n')
    }
    
    return JSON.stringify(this.events, null, 2)
  }
}

// =====================================================
// EXPORT SINGLETON INSTANCE
// =====================================================

export const securityLogger = SecurityLogger.getInstance()

// =====================================================
// SECURITY LOGGING UTILITIES
// =====================================================

// Log authentication attempt
export const logAuthAttempt = (success: boolean, userId?: string, details?: Record<string, any>) => {
  securityLogger.logAuthentication(
    success ? 'login' : 'login_failed',
    userId,
    details
  )
}

// Log data access
export const logDataAccess = (action: string, userId: string, resource: string, recordCount?: number) => {
  securityLogger.logDataAccess(
    action as any,
    userId,
    resource,
    recordCount
  )
}

// Log security violation
export const logSecurityViolation = (violationType: string, userId?: string, resource?: string, details?: Record<string, any>) => {
  securityLogger.logSecurityViolation(
    violationType as any,
    userId,
    resource,
    details
  )
}

// Log API access
export const logAPIAccess = (endpoint: string, method: string, statusCode: number, responseTime: number, userId?: string) => {
  securityLogger.logAPIAccess(
    endpoint,
    method,
    statusCode,
    responseTime,
    userId
  )
}
