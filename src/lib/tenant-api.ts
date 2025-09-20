import type { TenantApplicationFormData, TenantApplicationResponse } from '../types/tenant-application'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export async function submitTenantApplication(
  data: TenantApplicationFormData
): Promise<TenantApplicationResponse> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/submit-tenant-application`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Ошибка при отправке заявки')
    }

    return result
  } catch (error) {
    console.error('Error submitting tenant application:', error)
    throw error
  }
}

// Demo mode function for development
export async function submitTenantApplicationDemo(
  data: TenantApplicationFormData
): Promise<TenantApplicationResponse> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Simulate validation
  if (!data.full_name || !data.brand_name || !data.phone_number || !data.email) {
    throw new Error('Обязательные поля не заполнены')
  }

  // Simulate email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email)) {
    throw new Error('Некорректный формат email')
  }

  // Simulate success response
  return {
    success: true,
    message: 'Заявка успешно отправлена (демо режим)',
    application_id: `demo-${Date.now()}`
  }
}
