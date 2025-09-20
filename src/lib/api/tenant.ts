import { supabase } from '../supabase'

// Types for tenant operations
export interface TenantProfile {
  id: string
  user_id: string
  full_name: string
  email: string
  phone: string
  company_name: string
  business_type: string
  status: 'active' | 'inactive' | 'pending'
  created_at: string
  last_login?: string
}

export interface TenantApplication {
  id: string
  tenant_id: string
  property_id: string
  status: 'pending' | 'approved' | 'rejected' | 'under_review'
  application_date: string
  lease_start: string
  lease_end: string
  monthly_rent: number
  deposit: number
  notes?: string
  property?: {
    name: string
    address: string
    type: string
    size: number
  }
}

export interface TenantApplicationForm {
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

export interface TenantLease {
  id: string
  tenant_id: string
  property_id: string
  lease_number: string
  start_date: string
  end_date: string
  monthly_rent: number
  deposit: number
  status: 'active' | 'expired' | 'terminated'
  terms: string
  documents: string[]
  payment_history: Array<{
    date: string
    amount: number
    status: 'paid' | 'pending' | 'overdue'
  }>
  property?: {
    name: string
    address: string
    type: string
    size: number
  }
}

export interface TenantPayment {
  id: string
  tenant_id: string
  lease_id: string
  amount: number
  due_date: string
  paid_date?: string
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  payment_method?: string
  reference_number?: string
  description: string
}

export interface TenantMaintenanceRequest {
  id: string
  tenant_id: string
  property_id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
  completed_at?: string
  assigned_to?: string
  notes?: string
}

export interface TenantBooking {
  id: string
  tenant_id: string
  property_id: string
  amenity_type: 'meeting_room' | 'parking' | 'event_space' | 'storage'
  start_time: string
  end_time: string
  status: 'confirmed' | 'pending' | 'cancelled'
  created_at: string
  notes?: string
}

// Tenant API functions
export const tenantApi = {
  // Profile management
  async getProfile(tenantId: string): Promise<TenantProfile | null> {
    const { data, error } = await supabase
      .from('tenant_profiles')
      .select('*')
      .eq('id', tenantId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async updateProfile(tenantId: string, updates: Partial<TenantProfile>): Promise<TenantProfile> {
    const { data, error } = await supabase
      .from('tenant_profiles')
      .update(updates)
      .eq('id', tenantId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Applications management
  async getApplications(tenantId: string): Promise<TenantApplication[]> {
    const { data, error } = await supabase
      .from('tenant_applications')
      .select(`
        *,
        properties (
          name,
          address,
          type,
          size
        )
      `)
      .eq('tenant_id', tenantId)
      .order('application_date', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createApplication(application: Omit<TenantApplication, 'id' | 'application_date'>): Promise<TenantApplication> {
    const { data, error } = await supabase
      .from('tenant_applications')
      .insert({
        ...application,
        application_date: new Date().toISOString()
      })
      .select(`
        *,
        properties (
          name,
          address,
          type,
          size
        )
      `)
      .single()

    if (error) throw error
    return data
  },

  async updateApplicationStatus(id: string, status: string, notes?: string): Promise<void> {
    const { error } = await supabase
      .from('tenant_applications')
      .update({ 
        status,
        notes,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) throw error
  },

  // Leases management
  async getLeases(tenantId: string): Promise<TenantLease[]> {
    const { data, error } = await supabase
      .from('leases')
      .select(`
        *,
        properties (
          name,
          address,
          type
        )
      `)
      .eq('tenant_id', tenantId)
      .order('start_date', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getActiveLease(tenantId: string): Promise<TenantLease | null> {
    const { data, error } = await supabase
      .from('leases')
      .select(`
        *,
        properties (
          name,
          address,
          type
        )
      `)
      .eq('tenant_id', tenantId)
      .eq('status', 'active')
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  // Payments management
  async getPayments(tenantId: string): Promise<TenantPayment[]> {
    const { data, error } = await supabase
      .from('tenant_payments')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('due_date', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getUpcomingPayments(tenantId: string): Promise<TenantPayment[]> {
    const { data, error } = await supabase
      .from('tenant_payments')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('status', 'pending')
      .gte('due_date', new Date().toISOString())
      .order('due_date', { ascending: true })

    if (error) throw error
    return data || []
  },

  async recordPayment(paymentId: string, paymentData: {
    paid_date: string
    payment_method: string
    reference_number?: string
  }): Promise<void> {
    const { error } = await supabase
      .from('tenant_payments')
      .update({
        ...paymentData,
        status: 'paid'
      })
      .eq('id', paymentId)

    if (error) throw error
  },

  // Maintenance requests
  async getMaintenanceRequests(tenantId: string): Promise<TenantMaintenanceRequest[]> {
    const { data, error } = await supabase
      .from('maintenance_requests')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createMaintenanceRequest(request: Omit<TenantMaintenanceRequest, 'id' | 'created_at'>): Promise<TenantMaintenanceRequest> {
    const { data, error } = await supabase
      .from('maintenance_requests')
      .insert({
        ...request,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateMaintenanceRequest(id: string, updates: Partial<TenantMaintenanceRequest>): Promise<void> {
    const { error } = await supabase
      .from('maintenance_requests')
      .update(updates)
      .eq('id', id)

    if (error) throw error
  },

  // Bookings management
  async getBookings(tenantId: string): Promise<TenantBooking[]> {
    const { data, error } = await supabase
      .from('tenant_bookings')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('start_time', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createBooking(booking: Omit<TenantBooking, 'id' | 'created_at'>): Promise<TenantBooking> {
    const { data, error } = await supabase
      .from('tenant_bookings')
      .insert({
        ...booking,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async cancelBooking(id: string): Promise<void> {
    const { error } = await supabase
      .from('tenant_bookings')
      .update({ status: 'cancelled' })
      .eq('id', id)

    if (error) throw error
  },

  // Dashboard statistics
  async getDashboardStats(tenantId: string): Promise<{
    activeLeases: number
    pendingPayments: number
    overduePayments: number
    openMaintenanceRequests: number
    upcomingBookings: number
    totalSpent: number
  }> {
    const [
      leasesResult,
      paymentsResult,
      maintenanceResult,
      bookingsResult
    ] = await Promise.all([
      supabase.from('leases').select('id').eq('tenant_id', tenantId).eq('status', 'active'),
      supabase.from('tenant_payments').select('amount, status, due_date').eq('tenant_id', tenantId),
      supabase.from('maintenance_requests').select('id').eq('tenant_id', tenantId).eq('status', 'open'),
      supabase.from('tenant_bookings').select('id').eq('tenant_id', tenantId).eq('status', 'confirmed')
    ])

    const activeLeases = leasesResult.data?.length || 0
    const openMaintenanceRequests = maintenanceResult.data?.length || 0
    const upcomingBookings = bookingsResult.data?.length || 0

    const payments = paymentsResult.data || []
    const pendingPayments = payments.filter(p => p.status === 'pending').length
    const overduePayments = payments.filter(p => p.status === 'overdue').length
    const totalSpent = payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0)

    return {
      activeLeases,
      pendingPayments,
      overduePayments,
      openMaintenanceRequests,
      upcomingBookings,
      totalSpent
    }
  },

  // Tenant Application Management
  async getTenantApplications(): Promise<TenantApplicationForm[]> {
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

  async getTenantApplicationById(id: string): Promise<TenantApplicationForm> {
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

  async createTenantApplication(application: Partial<TenantApplicationForm>): Promise<TenantApplicationForm> {
    try {
      const { data, error } = await supabase
        .from('tenant_applications')
        .insert([application])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating tenant application:', error)
      throw error
    }
  },

  async updateTenantApplication(id: string, application: Partial<TenantApplicationForm>): Promise<void> {
    try {
      const { error } = await supabase
        .from('tenant_applications')
        .update(application)
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error updating tenant application:', error)
      throw error
    }
  },

  async deleteTenantApplication(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('tenant_applications')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting tenant application:', error)
      throw error
    }
  },

  async uploadApplicationDocuments(id: string, files: File[]): Promise<void> {
    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${id}_${Date.now()}.${fileExt}`
        const filePath = `applications/${id}/${fileName}`

        const { error } = await supabase.storage
          .from('documents')
          .upload(filePath, file)

        if (error) throw error
        return filePath
      })

      const filePaths = await Promise.all(uploadPromises)
      
      const { error } = await supabase
        .from('tenant_applications')
        .update({ documents: filePaths })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error uploading application documents:', error)
      throw error
    }
  },

  // Tenant Lease Management
  async getTenantLeases(): Promise<TenantLease[]> {
    try {
      const { data, error } = await supabase
        .from('leases')
        .select(`
          *,
          property:properties(name, address, type, size)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching tenant leases:', error)
      throw error
    }
  },

  async getTenantLeaseById(id: string): Promise<TenantLease> {
    try {
      const { data, error } = await supabase
        .from('leases')
        .select(`
          *,
          property:properties(name, address, type, size)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching tenant lease:', error)
      throw error
    }
  },

  async makePayment(leaseId: string, payment: {
    amount: number
    method: string
    description: string
  }): Promise<void> {
    try {
      const { error } = await supabase
        .from('tenant_payments')
        .insert([{
          lease_id: leaseId,
          amount: payment.amount,
          payment_method: payment.method,
          description: payment.description,
          due_date: new Date().toISOString(),
          status: 'paid'
        }])

      if (error) throw error
    } catch (error) {
      console.error('Error making payment:', error)
      throw error
    }
  },

  async uploadLeaseDocuments(id: string, files: File[]): Promise<void> {
    try {
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${id}_${Date.now()}.${fileExt}`
        const filePath = `leases/${id}/${fileName}`

        const { error } = await supabase.storage
          .from('documents')
          .upload(filePath, file)

        if (error) throw error
        return filePath
      })

      const filePaths = await Promise.all(uploadPromises)
      
      const { error } = await supabase
        .from('leases')
        .update({ documents: filePaths })
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error uploading lease documents:', error)
      throw error
    }
  }
}
