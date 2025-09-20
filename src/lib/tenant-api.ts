import type { TenantApplicationFormData, TenantApplicationResponse } from '../types/tenant-application'

// Use JWT backend API instead of Supabase functions
const API_BASE_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3001'

export async function submitTenantApplication(
  data: TenantApplicationFormData,
  accessToken: string
): Promise<TenantApplicationResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tenant-applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
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
// Admin API functions for managing tenant applications
export interface TenantApplicationsListResponse {
  applications: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export async function fetchTenantApplications(
  accessToken: string,
  params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sort?: string;
    order?: string;
  }
): Promise<TenantApplicationsListResponse> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.status && params.status !== 'all') queryParams.set('status', params.status);
    if (params?.search) queryParams.set('search', params.search);
    if (params?.sort) queryParams.set('sort', params.sort);
    if (params?.order) queryParams.set('order', params.order);

    const url = `${API_BASE_URL}/api/tenant-applications${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Ошибка при получении заявок');
    }

    return result;
  } catch (error) {
    console.error('Error fetching tenant applications:', error);
    throw error;
  }
}

export async function updateTenantApplicationStatus(
  applicationId: string,
  status: string,
  adminNotes: string,
  accessToken: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tenant-applications/${applicationId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status, admin_notes: adminNotes }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Ошибка при обновлении статуса заявки');
    }

    return result;
  } catch (error) {
    console.error('Error updating tenant application status:', error);
    throw error;
  }
}

export async function getTenantApplication(
  applicationId: string,
  accessToken: string
): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tenant-applications/${applicationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Ошибка при получении заявки');
    }

    return result.application;
  } catch (error) {
    console.error('Error fetching tenant application:', error);
    throw error;
  }
}

// Demo mode function for development (kept for backward compatibility)
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
