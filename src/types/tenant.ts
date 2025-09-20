export interface TenantApplication {
  id: string
  company_name: string
  contact_name: string
  email: string
  phone: string
  business_type: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export interface TenantApplicationForm {
  company_name: string
  contact_name: string
  email: string
  phone: string
  business_type: string
  description: string
}

