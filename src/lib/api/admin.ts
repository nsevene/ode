import { supabase } from '../supabase'

// Types for admin operations
export interface AdminUser {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'investor' | 'tenant'
  status: 'active' | 'inactive' | 'pending'
  created_at: string
  last_login?: string
  organization_id?: string
}

export interface AdminProperty {
  id: string
  name: string
  address: string
  type: 'office' | 'retail' | 'warehouse' | 'coworking'
  size: number
  price: number
  status: 'available' | 'occupied' | 'maintenance'
  amenities: string[]
  description?: string
  images: string[]
  floor: number
  rooms: number
  bathrooms: number
  parking: number
  yearBuilt: number
  features: string[]
  location: {
    latitude: number
    longitude: number
    district: string
    metro: string
  }
  availability: {
    startDate: string
    endDate: string
    isAvailable: boolean
  }
  createdAt: string
  updatedAt: string
}

export interface AdminApplication {
  id: string
  full_name: string
  brand_name: string
  email: string
  phone_number: string
  concept_description: string
  status: 'pending' | 'approved' | 'rejected' | 'under_review'
  created_at: string
  reviewed_at?: string
  reviewed_by?: string
  notes?: string
}

export interface AdminTenantApplication {
  id: string
  fullName: string
  email: string
  phone: string
  companyName: string
  businessType: 'IT' | 'retail' | 'warehouse' | 'office' | 'restaurant'
  desiredArea: number
  budget: number
  leaseTerm: number
  businessDescription: string
  additionalRequirements?: string
  status: 'pending' | 'approved' | 'rejected' | 'under_review'
  priority: 'high' | 'medium' | 'low'
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  notes?: string
  documents: string[]
  propertyPreferences: string[]
  locationPreferences: string[]
}

export interface AdminLease {
  id: string
  tenantName: string
  tenantEmail: string
  tenantPhone: string
  propertyName: string
  propertyAddress: string
  startDate: string
  endDate: string
  monthlyRent: number
  deposit: number
  status: 'active' | 'expired' | 'terminated' | 'pending'
  leaseType: 'commercial' | 'retail' | 'warehouse' | 'office'
  area: number
  terms: string
  specialConditions?: string
  documents: string[]
  paymentHistory: Array<{
    date: string
    amount: number
    status: 'paid' | 'overdue' | 'pending'
  }>
  createdAt: string
  updatedAt: string
}

export interface AdminAuditLog {
  id: string
  tableName: string
  recordId: string
  action: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT'
  oldData: any
  newData: any
  changedBy: string
  timestamp: string
  ipAddress: string
  userAgent: string
  severity: 'low' | 'medium' | 'high'
  description: string
  metadata?: {
    source?: string
    session_id?: string
    [key: string]: any
  }
}

export interface AdminTransaction {
  id: string
  type: 'income' | 'expense' | 'investment'
  amount: number
  description: string
  category: string
  date: string
  status: 'completed' | 'pending' | 'cancelled'
  reference_id?: string
}

export interface AdminDocument {
  id: string
  name: string
  type: 'contract' | 'invoice' | 'report' | 'other'
  size: number
  url: string
  uploaded_by: string
  uploaded_at: string
  is_public: boolean
}

// Admin API functions
export const adminApi = {
  // Users management
  async getUsers(): Promise<AdminUser[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async updateUserRole(userId: string, role: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)

    if (error) throw error
  },

  async updateUserStatus(userId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', userId)

    if (error) throw error
  },

  // Properties management
  async getProperties(): Promise<AdminProperty[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createProperty(property: Omit<AdminProperty, 'id' | 'created_at' | 'updated_at'>): Promise<AdminProperty> {
    const { data, error } = await supabase
      .from('properties')
      .insert(property)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateProperty(id: string, updates: Partial<AdminProperty>): Promise<AdminProperty> {
    const { data, error } = await supabase
      .from('properties')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteProperty(id: string): Promise<void> {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Applications management
  async getApplications(): Promise<AdminApplication[]> {
    const { data, error } = await supabase
      .from('tenant_applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async updateApplicationStatus(id: string, status: string, notes?: string): Promise<void> {
    const { error } = await supabase
      .from('tenant_applications')
      .update({ 
        status, 
        notes,
        reviewed_at: new Date().toISOString(),
        reviewed_by: (await supabase.auth.getUser()).data.user?.id
      })
      .eq('id', id)

    if (error) throw error
  },

  // Transactions management
  async getTransactions(): Promise<AdminTransaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createTransaction(transaction: Omit<AdminTransaction, 'id'>): Promise<AdminTransaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Documents management
  async getDocuments(): Promise<AdminDocument[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('uploaded_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async uploadDocument(file: File, metadata: Omit<AdminDocument, 'id' | 'url' | 'uploaded_at'>): Promise<AdminDocument> {
    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `documents/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath)

    // Save document metadata to database
    const { data, error } = await supabase
      .from('documents')
      .insert({
        ...metadata,
        url: urlData.publicUrl,
        uploaded_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Tenant Applications Management
  async getTenantApplications(): Promise<AdminTenantApplication[]> {
    try {
      const { data, error } = await supabase
        .from('tenant_applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching tenant applications:', error)
      throw error
    }
  },

  async getTenantApplicationById(id: string): Promise<AdminTenantApplication | null> {
    try {
      const { data, error } = await supabase
        .from('tenant_applications')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching tenant application:', error)
      throw error
    }
  },

  async approveTenantApplication(id: string, notes?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('tenant_applications')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'current_admin',
          notes
        })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error approving tenant application:', error)
      throw error
    }
  },

  async rejectTenantApplication(id: string, reason: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('tenant_applications')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'current_admin',
          notes: reason
        })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error rejecting tenant application:', error)
      throw error
    }
  },

  async updateTenantApplicationStatus(id: string, status: string, notes?: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('tenant_applications')
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: 'current_admin',
          notes
        })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating tenant application status:', error)
      throw error
    }
  },

  // Lease Management
  async getLeases(): Promise<AdminLease[]> {
    try {
      const { data, error } = await supabase
        .from('leases')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching leases:', error)
      throw error
    }
  },

  async getLeaseById(id: string): Promise<AdminLease | null> {
    try {
      const { data, error } = await supabase
        .from('leases')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching lease:', error)
      throw error
    }
  },

  async createLease(leaseData: Partial<AdminLease>): Promise<AdminLease> {
    try {
      const { data, error } = await supabase
        .from('leases')
        .insert(leaseData)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating lease:', error)
      throw error
    }
  },

  async updateLease(id: string, updates: Partial<AdminLease>): Promise<void> {
    try {
      const { error } = await supabase
        .from('leases')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating lease:', error)
      throw error
    }
  },

  async deleteLease(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('leases')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting lease:', error)
      throw error
    }
  },

  async renewLease(id: string, newEndDate: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('leases')
        .update({
          end_date: newEndDate,
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error renewing lease:', error)
      throw error
    }
  },

  async terminateLease(id: string, reason: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('leases')
        .update({
          status: 'terminated',
          termination_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error terminating lease:', error)
      throw error
    }
  },

  // Enhanced Property Management
  async getProperties(): Promise<AdminProperty[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching properties:', error)
      throw error
    }
  },

  async getPropertyById(id: string): Promise<AdminProperty | null> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching property:', error)
      throw error
    }
  },

  async createProperty(propertyData: Partial<AdminProperty>): Promise<AdminProperty> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert(propertyData)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating property:', error)
      throw error
    }
  },

  async updateProperty(id: string, updates: Partial<AdminProperty>): Promise<void> {
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating property:', error)
      throw error
    }
  },

  async deleteProperty(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting property:', error)
      throw error
    }
  },

  async togglePropertyAvailability(id: string): Promise<void> {
    try {
      const property = await this.getPropertyById(id)
      if (!property) throw new Error('Property not found')

      const newStatus = property.status === 'available' ? 'occupied' : 'available'
      await this.updateProperty(id, { status: newStatus })
    } catch (error) {
      console.error('Error toggling property availability:', error)
      throw error
    }
  },

  async uploadPropertyImages(id: string, images: File[]): Promise<string[]> {
    try {
      const uploadedUrls: string[] = []
      
      for (const image of images) {
        const fileName = `${id}_${Date.now()}_${image.name}`
        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(fileName, image)

        if (error) throw error
        
        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName)
        
        uploadedUrls.push(publicUrl)
      }

      // Update property with new image URLs
      const property = await this.getPropertyById(id)
      if (property) {
        await this.updateProperty(id, {
          images: [...property.images, ...uploadedUrls]
        })
      }

      return uploadedUrls
    } catch (error) {
      console.error('Error uploading property images:', error)
      throw error
    }
  },

  async getPropertyAnalytics(id: string): Promise<{
    views: number
    inquiries: number
    applications: number
    averageRating: number
    revenue: number
  }> {
    try {
      // This would typically come from analytics tables
      // For now, returning mock data
      return {
        views: Math.floor(Math.random() * 1000),
        inquiries: Math.floor(Math.random() * 50),
        applications: Math.floor(Math.random() * 20),
        averageRating: 4.5,
        revenue: Math.floor(Math.random() * 1000000)
      }
    } catch (error) {
      console.error('Error fetching property analytics:', error)
      throw error
    }
  },

  // Audit Logs Management
  async getAuditLogs(): Promise<AdminAuditLog[]> {
    try {
      const { data, error } = await supabase
        .from('audit_log')
        .select('*')
        .order('timestamp', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching audit logs:', error)
      throw error
    }
  },

  async getAuditLogById(id: string): Promise<AdminAuditLog | null> {
    try {
      const { data, error } = await supabase
        .from('audit_log')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching audit log:', error)
      throw error
    }
  },

  async exportAuditLogs(logs: AdminAuditLog[]): Promise<void> {
    try {
      // Create CSV content
      const headers = ['ID', 'Table', 'Action', 'Changed By', 'Timestamp', 'Severity', 'Description']
      const csvContent = [
        headers.join(','),
        ...logs.map(log => [
          log.id,
          log.tableName,
          log.action,
          log.changedBy,
          log.timestamp,
          log.severity,
          log.description
        ].join(','))
      ].join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting audit logs:', error)
      throw error
    }
  },

  async clearAuditLogs(): Promise<void> {
    try {
      const { error } = await supabase
        .from('audit_log')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records

      if (error) throw error
    } catch (error) {
      console.error('Error clearing audit logs:', error)
      throw error
    }
  },

  async getAuditLogStats(): Promise<{
    total: number
    high: number
    medium: number
    low: number
    today: number
    thisWeek: number
    thisMonth: number
  }> {
    try {
      const { data, error } = await supabase
        .from('audit_log')
        .select('severity, timestamp')

      if (error) throw error

      const logs = data || []
      const total = logs.length
      const high = logs.filter(log => log.severity === 'high').length
      const medium = logs.filter(log => log.severity === 'medium').length
      const low = logs.filter(log => log.severity === 'low').length

      const today = new Date().toDateString()
      const todayCount = logs.filter(log => new Date(log.timestamp).toDateString() === today).length

      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const thisWeek = logs.filter(log => new Date(log.timestamp) >= weekAgo).length

      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      const thisMonth = logs.filter(log => new Date(log.timestamp) >= monthAgo).length

      return {
        total,
        high,
        medium,
        low,
        today: todayCount,
        thisWeek,
        thisMonth
      }
    } catch (error) {
      console.error('Error fetching audit log stats:', error)
      throw error
    }
  },

  // User Roles Management
  async getUsers(): Promise<AdminUser[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  async getUserById(id: string): Promise<AdminUser | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching user:', error)
      throw error
    }
  },

  async createUser(userData: Partial<AdminUser>): Promise<AdminUser> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert(userData)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  },

  async updateUser(id: string, updates: Partial<AdminUser>): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  },

  async updateUserRole(id: string, role: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating user role:', error)
      throw error
    }
  },

  async updateUserStatus(id: string, status: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating user status:', error)
      throw error
    }
  },

  async bulkUpdateUsers(userIds: string[], updates: Partial<AdminUser>): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .in('id', userIds)

      if (error) throw error
    } catch (error) {
      console.error('Error bulk updating users:', error)
      throw error
    }
  },

  async exportUsers(users: AdminUser[]): Promise<void> {
    try {
      // Create CSV content
      const headers = ['ID', 'Email', 'Full Name', 'Role', 'Status', 'Created At', 'Last Login', 'Organization']
      const csvContent = [
        headers.join(','),
        ...users.map(user => [
          user.id,
          user.email,
          user.full_name,
          user.role,
          user.status,
          user.created_at,
          user.last_login || '',
          user.organization_id || ''
        ].join(','))
      ].join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `users_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting users:', error)
      throw error
    }
  },

  async getUserStats(): Promise<{
    total: number
    active: number
    inactive: number
    pending: number
    admins: number
    investors: number
    tenants: number
  }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, status')

      if (error) throw error

      const users = data || []
      const total = users.length
      const active = users.filter(user => user.status === 'active').length
      const inactive = users.filter(user => user.status === 'inactive').length
      const pending = users.filter(user => user.status === 'pending').length
      const admins = users.filter(user => user.role === 'admin').length
      const investors = users.filter(user => user.role === 'investor').length
      const tenants = users.filter(user => user.role === 'tenant').length

      return {
        total,
        active,
        inactive,
        pending,
        admins,
        investors,
        tenants
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      throw error
    }
  },

  // Analytics and statistics
  async getDashboardStats(): Promise<{
    totalUsers: number
    totalProperties: number
    totalApplications: number
    totalRevenue: number
    pendingApplications: number
    activeProperties: number
  }> {
    const [
      usersResult,
      propertiesResult,
      applicationsResult,
      transactionsResult
    ] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact' }),
      supabase.from('properties').select('id', { count: 'exact' }),
      supabase.from('tenant_applications').select('id, status', { count: 'exact' }),
      supabase.from('transactions').select('amount, type')
    ])

    const totalUsers = usersResult.count || 0
    const totalProperties = propertiesResult.count || 0
    const totalApplications = applicationsResult.count || 0
    
    const pendingApplications = applicationsResult.data?.filter(app => app.status === 'pending').length || 0
    const activeProperties = propertiesResult.data?.filter(prop => prop.status === 'available').length || 0
    
    const totalRevenue = transactionsResult.data
      ?.filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0) || 0

    return {
      totalUsers,
      totalProperties,
      totalApplications,
      totalRevenue,
      pendingApplications,
      activeProperties
    }
  }
}
