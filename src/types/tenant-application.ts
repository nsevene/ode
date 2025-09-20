export interface TenantApplication {
  id?: string
  created_at?: string
  status: 'pending' | 'approved' | 'rejected' | 'contacted'
  full_name: string
  brand_name: string
  phone_number: string
  email: string
  concept_description?: string
  presentation_url?: string
  notes?: string
}

export interface TenantApplicationFormData {
  full_name: string
  brand_name: string
  phone_number: string
  email: string
  concept_description: string
  presentation_url: string
  notes: string
}

export interface TenantApplicationResponse {
  success: boolean
  message?: string
  application_id?: string
  error?: string
}
