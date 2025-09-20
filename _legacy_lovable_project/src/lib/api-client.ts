import { supabase } from '@/integrations/supabase/client';
import { errorHandler, AppError, ErrorType } from './error-handling';
import { useNotifications } from '@/hooks/useNotifications';

// API Response types
export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Client class
export class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  private constructor() {
    this.baseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new AppError(
          `HTTP ${response.status}: ${response.statusText}`,
          this.getErrorType(response.status),
          'HTTP_ERROR',
          response.status
        );
      }

      const data = await response.json();
      return {
        data,
        error: null,
        success: true,
      };
    } catch (error) {
      const appError = errorHandler.handleError(
        error,
        `API Request to ${endpoint}`
      );
      return {
        data: null,
        error: appError.message,
        success: false,
      };
    }
  }

  // Get error type from HTTP status
  private getErrorType(status: number): ErrorType {
    switch (status) {
      case 401:
        return ErrorType.UNAUTHORIZED;
      case 403:
        return ErrorType.FORBIDDEN;
      case 404:
        return ErrorType.NOT_FOUND;
      case 422:
        return ErrorType.VALIDATION;
      case 500:
        return ErrorType.SERVER;
      default:
        return ErrorType.UNKNOWN;
    }
  }

  // GET request
  public async get<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return this.request<T>(url.pathname + url.search, {
      method: 'GET',
    });
  }

  // POST request
  public async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  public async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH request
  public async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  public async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // Supabase-specific methods
  public async supabaseQuery<T>(
    table: string,
    query: {
      select?: string;
      filters?: Record<string, any>;
      order?: { column: string; ascending?: boolean };
      limit?: number;
      offset?: number;
    }
  ): Promise<ApiResponse<T[]>> {
    try {
      let supabaseQuery = supabase.from(table);

      if (query.select) {
        supabaseQuery = supabaseQuery.select(query.select);
      }

      if (query.filters) {
        Object.entries(query.filters).forEach(([key, value]) => {
          supabaseQuery = supabaseQuery.eq(key, value);
        });
      }

      if (query.order) {
        supabaseQuery = supabaseQuery.order(query.order.column, {
          ascending: query.order.ascending ?? true,
        });
      }

      if (query.limit) {
        supabaseQuery = supabaseQuery.limit(query.limit);
      }

      if (query.offset) {
        supabaseQuery = supabaseQuery.range(
          query.offset,
          query.offset + (query.limit || 10) - 1
        );
      }

      const { data, error } = await supabaseQuery;

      if (error) {
        throw new AppError(error.message, ErrorType.SERVER, 'SUPABASE_ERROR');
      }

      return {
        data: data as T[],
        error: null,
        success: true,
      };
    } catch (error) {
      const appError = errorHandler.handleError(
        error,
        `Supabase query on ${table}`
      );
      return {
        data: null,
        error: appError.message,
        success: false,
      };
    }
  }

  public async supabaseInsert<T>(
    table: string,
    data: any
  ): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) {
        throw new AppError(error.message, ErrorType.SERVER, 'SUPABASE_ERROR');
      }

      return {
        data: result as T,
        error: null,
        success: true,
      };
    } catch (error) {
      const appError = errorHandler.handleError(
        error,
        `Supabase insert into ${table}`
      );
      return {
        data: null,
        error: appError.message,
        success: false,
      };
    }
  }

  public async supabaseUpdate<T>(
    table: string,
    id: string,
    data: any
  ): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new AppError(error.message, ErrorType.SERVER, 'SUPABASE_ERROR');
      }

      return {
        data: result as T,
        error: null,
        success: true,
      };
    } catch (error) {
      const appError = errorHandler.handleError(
        error,
        `Supabase update on ${table}`
      );
      return {
        data: null,
        error: appError.message,
        success: false,
      };
    }
  }

  public async supabaseDelete<T>(
    table: string,
    id: string
  ): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new AppError(error.message, ErrorType.SERVER, 'SUPABASE_ERROR');
      }

      return {
        data: result as T,
        error: null,
        success: true,
      };
    } catch (error) {
      const appError = errorHandler.handleError(
        error,
        `Supabase delete from ${table}`
      );
      return {
        data: null,
        error: appError.message,
        success: false,
      };
    }
  }
}

// Global API client instance
export const apiClient = ApiClient.getInstance();

// Hook for using API client with notifications
export const useApiClient = () => {
  const notifications = useNotifications();

  const handleApiResponse = <T>(
    response: ApiResponse<T>,
    successMessage?: string,
    errorMessage?: string
  ): T | null => {
    if (response.success && response.data) {
      if (successMessage) {
        notifications.showSuccess(successMessage);
      }
      return response.data;
    } else {
      if (errorMessage) {
        notifications.showError(errorMessage);
      } else if (response.error) {
        notifications.showError(response.error);
      }
      return null;
    }
  };

  return {
    apiClient,
    handleApiResponse,
  };
};

// ====================================================================
// Specific API clients for different parts of the application
// ====================================================================
import type {
  Vendor,
  MenuItem,
  Event,
  Booking,
  Document,
  TenantApplication,
} from '@/types/database';

/**
 * Vendor API Client
 */
export const vendorApi = {
  getAll: async () => supabase.from('vendors').select('*'),
  getById: async (id: string) =>
    supabase.from('vendors').select('*').eq('id', id).single(),
  create: async (vendorData: Partial<Vendor>) =>
    supabase.from('vendors').insert(vendorData).select().single(),
  update: async (id: string, updates: Partial<Vendor>) =>
    supabase.from('vendors').update(updates).eq('id', id).select().single(),
  delete: async (id: string) => supabase.from('vendors').delete().eq('id', id),
};

/**
 * Menu Item API Client
 */
export const menuApi = {
  getByVendor: async (vendorId: string) =>
    supabase.from('menu_items').select('*').eq('vendor_id', vendorId),
  create: async (itemData: Partial<MenuItem>) =>
    supabase.from('menu_items').insert(itemData).select().single(),
  update: async (id: string, updates: Partial<MenuItem>) =>
    supabase.from('menu_items').update(updates).eq('id', id).select().single(),
  delete: async (id: string) =>
    supabase.from('menu_items').delete().eq('id', id),
};

/**
 * Event API Client
 */
export const eventApi = {
  getAll: async () => supabase.from('events').select('*').order('event_date'),
  getById: async (id: string) =>
    supabase.from('events').select('*').eq('id', id).single(),
  create: async (eventData: Partial<Event>) =>
    supabase.from('events').insert(eventData).select().single(),
  update: async (id: string, updates: Partial<Event>) =>
    supabase.from('events').update(updates).eq('id', id).select().single(),
  delete: async (id: string) => supabase.from('events').delete().eq('id', id),
};

/**
 * Booking API Client
 */
export const bookingApi = {
  getUserBookings: async (userId: string) =>
    supabase.from('bookings').select('*, events(*)').eq('user_id', userId),
  create: async (bookingData: Partial<Booking>) =>
    supabase.from('bookings').insert(bookingData).select().single(),
  cancel: async (id: string) =>
    supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single(),
};

/**
 * Tenant Application API Client
 */
export const applicationApi = {
  getAll: async () =>
    supabase
      .from('tenant_applications')
      .select('*')
      .order('created_at', { ascending: false }),
  updateStatus: async (
    id: string,
    status: TenantApplication['status'],
    review_notes?: string
  ) =>
    supabase
      .from('tenant_applications')
      .update({ status, review_notes })
      .eq('id', id)
      .select()
      .single(),
};
