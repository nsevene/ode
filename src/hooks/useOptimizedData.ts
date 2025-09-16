import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { handleError, displayError } from '@/lib/error-handling';
import { bookingSchema, foodOrderSchema, menuItemSchema } from '@/lib/validation';

// Optimized booking hook
export const useOptimizedBookings = (userId: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['bookings', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!userId,
  });

  const processedData = useMemo(() => {
    if (!data) return null;
    
    const now = new Date();
    return {
      upcoming: data.filter(booking => new Date(booking.booking_date) > now),
      past: data.filter(booking => new Date(booking.booking_date) <= now),
      total: data.length,
      byStatus: data.reduce((acc, booking) => {
        acc[booking.status] = (acc[booking.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }, [data]);

  const createBooking = useMutation({
    mutationFn: async (bookingData: any) => {
      const validatedData = bookingSchema.parse(bookingData);
      const { data, error } = await supabase
        .from('bookings')
        .insert([validatedData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', userId] });
    },
    onError: (error) => {
      const appError = handleError(error);
      displayError(appError);
    },
  });

  const updateBooking = useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      const { data, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', userId] });
    },
    onError: (error) => {
      const appError = handleError(error);
      displayError(appError);
    },
  });

  const cancelBooking = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', userId] });
    },
    onError: (error) => {
      const appError = handleError(error);
      displayError(appError);
    },
  });

  return {
    data: processedData,
    isLoading,
    error,
    createBooking: createBooking.mutate,
    updateBooking: updateBooking.mutate,
    cancelBooking: cancelBooking.mutate,
    isCreating: createBooking.isPending,
    isUpdating: updateBooking.isPending,
    isCancelling: cancelBooking.isPending,
  };
};

// Optimized food orders hook
export const useOptimizedFoodOrders = (userId: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['food-orders', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('food_orders')
        .select(`
          *,
          items:food_order_items(
            *,
            menu_item:menu_items(*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!userId,
  });

  const processedData = useMemo(() => {
    if (!data) return null;
    
    return {
      total: data.length,
      totalSpent: data.reduce((sum, order) => sum + order.total_amount, 0),
      byStatus: data.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recent: data.slice(0, 5),
    };
  }, [data]);

  const createOrder = useMutation({
    mutationFn: async (orderData: any) => {
      const validatedData = foodOrderSchema.parse(orderData);
      const { data, error } = await supabase
        .from('food_orders')
        .insert([validatedData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-orders', userId] });
    },
    onError: (error) => {
      const appError = handleError(error);
      displayError(appError);
    },
  });

  return {
    data: processedData,
    isLoading,
    error,
    createOrder: createOrder.mutate,
    isCreating: createOrder.isPending,
  };
};

// Optimized menu items hook
export const useOptimizedMenuItems = (filters?: {
  category?: string;
  cuisine_type?: string;
  available?: boolean;
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['menu-items', filters],
    queryFn: async () => {
      let query = supabase.from('menu_items').select('*');
      
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters?.cuisine_type) {
        query = query.eq('cuisine_type', filters.cuisine_type);
      }
      
      if (filters?.available !== undefined) {
        query = query.eq('available', filters.available);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });

  const processedData = useMemo(() => {
    if (!data) return null;
    
    return {
      items: data,
      categories: [...new Set(data.map(item => item.category))],
      cuisineTypes: [...new Set(data.map(item => item.cuisine_type).filter(Boolean))],
      byCategory: data.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {} as Record<string, any[]>),
    };
  }, [data]);

  return {
    data: processedData,
    isLoading,
    error,
  };
};

// Optimized events hook
export const useOptimizedEvents = (filters?: {
  status?: string;
  date_from?: string;
  date_to?: string;
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      let query = supabase.from('events').select('*');
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.date_from) {
        query = query.gte('event_date', filters.date_from);
      }
      
      if (filters?.date_to) {
        query = query.lte('event_date', filters.date_to);
      }
      
      const { data, error } = await query.order('event_date');
      
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
  });

  const processedData = useMemo(() => {
    if (!data) return null;
    
    const now = new Date();
    return {
      upcoming: data.filter(event => new Date(event.event_date) > now),
      past: data.filter(event => new Date(event.event_date) <= now),
      total: data.length,
      byStatus: data.reduce((acc, event) => {
        acc[event.status] = (acc[event.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }, [data]);

  return {
    data: processedData,
    isLoading,
    error,
  };
};

// Optimized user profile hook
export const useOptimizedUserProfile = (userId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guest_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!userId,
  });

  const updateProfile = useMutation({
    mutationFn: async (profileData: any) => {
      const { data, error } = await supabase
        .from('guest_profiles')
        .upsert(profileData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onError: (error) => {
      const appError = handleError(error);
      displayError(appError);
    },
  });

  return {
    data,
    isLoading,
    error,
    updateProfile: updateProfile.mutate,
    isUpdating: updateProfile.isPending,
  };
};

// Optimized search hook
export const useOptimizedSearch = (query: string, filters?: any) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['search', query, filters],
    queryFn: async () => {
      if (!query.trim()) return { menu_items: [], events: [], spaces: [] };
      
      const [menuItems, events, spaces] = await Promise.all([
        supabase
          .from('menu_items')
          .select('*')
          .ilike('name', `%${query}%`)
          .limit(10),
        supabase
          .from('events')
          .select('*')
          .ilike('title', `%${query}%`)
          .limit(10),
        supabase
          .from('spaces')
          .select('*')
          .ilike('name', `%${query}%`)
          .limit(10),
      ]);

      return {
        menu_items: menuItems.data || [],
        events: events.data || [],
        spaces: spaces.data || [],
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    enabled: query.length > 2,
  });

  return {
    data,
    isLoading,
    error,
  };
};

// Cache invalidation utilities
export const useCacheInvalidation = () => {
  const queryClient = useQueryClient();

  const invalidateUserData = useCallback((userId: string) => {
    queryClient.invalidateQueries({ queryKey: ['bookings', userId] });
    queryClient.invalidateQueries({ queryKey: ['food-orders', userId] });
    queryClient.invalidateQueries({ queryKey: ['user-profile', userId] });
  }, [queryClient]);

  const invalidateAllData = useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

  const clearCache = useCallback(() => {
    queryClient.clear();
  }, [queryClient]);

  return {
    invalidateUserData,
    invalidateAllData,
    clearCache,
  };
};
