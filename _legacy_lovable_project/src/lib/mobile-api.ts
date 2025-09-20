// Mobile API integration for iOS and Android apps
import { supabase } from '@/integrations/supabase/client';

export interface MobileUser {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  role: 'guest' | 'tenant' | 'investor' | 'admin';
  created_at: string;
}

export interface MobileOrder {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  status:
    | 'pending'
    | 'confirmed'
    | 'preparing'
    | 'ready'
    | 'delivered'
    | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  kitchen_id: string;
  special_instructions?: string;
}

export interface MobileBooking {
  id: string;
  user_id: string;
  date: string;
  time_slot: string;
  guest_count: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface NFCExperience {
  id: string;
  nfc_tag_id: string;
  title: string;
  description: string;
  experience_type: 'taste_zone' | 'mission' | 'reward';
  zone_id: string;
  points_reward: number;
  is_active: boolean;
}

export class MobileAPI {
  private static instance: MobileAPI;

  static getInstance(): MobileAPI {
    if (!MobileAPI.instance) {
      MobileAPI.instance = new MobileAPI();
    }
    return MobileAPI.instance;
  }

  // Authentication
  async authenticateUser(
    email: string,
    password: string
  ): Promise<MobileUser | null> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return {
        id: data.user.id,
        email: data.user.email!,
        display_name: data.user.user_metadata?.display_name || '',
        avatar_url: data.user.user_metadata?.avatar_url,
        role: data.user.user_metadata?.role || 'guest',
        created_at: data.user.created_at,
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  // User profile
  async getUserProfile(userId: string): Promise<MobileUser | null> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }

  // Orders
  async createOrder(
    userId: string,
    items: OrderItem[]
  ): Promise<MobileOrder | null> {
    try {
      const totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          items: items,
          total_amount: totalAmount,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create order error:', error);
      return null;
    }
  }

  async getUserOrders(userId: string): Promise<MobileOrder[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user orders error:', error);
      return [];
    }
  }

  // Bookings
  async createBooking(
    userId: string,
    date: string,
    timeSlot: string,
    guestCount: number
  ): Promise<MobileBooking | null> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: userId,
          date,
          time_slot: timeSlot,
          guest_count: guestCount,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create booking error:', error);
      return null;
    }
  }

  async getUserBookings(userId: string): Promise<MobileBooking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user bookings error:', error);
      return [];
    }
  }

  // NFC Experiences
  async getNFCExperience(tagId: string): Promise<NFCExperience | null> {
    try {
      const { data, error } = await supabase
        .from('nfc_experiences')
        .select('*')
        .eq('nfc_tag_id', tagId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get NFC experience error:', error);
      return null;
    }
  }

  async completeNFCExperience(
    userId: string,
    experienceId: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from('user_nfc_completions').insert({
        user_id: userId,
        experience_id: experienceId,
        completed_at: new Date().toISOString(),
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Complete NFC experience error:', error);
      return false;
    }
  }

  // Push notifications
  async registerForPushNotifications(
    userId: string,
    deviceToken: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from('user_push_tokens').upsert({
        user_id: userId,
        device_token: deviceToken,
        platform: this.detectPlatform(),
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Register push notifications error:', error);
      return false;
    }
  }

  // Analytics
  async trackEvent(
    userId: string,
    event: string,
    properties: Record<string, any>
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from('mobile_analytics').insert({
        user_id: userId,
        event,
        properties,
        timestamp: new Date().toISOString(),
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Track event error:', error);
      return false;
    }
  }

  // Helper methods
  private detectPlatform(): 'ios' | 'android' | 'web' {
    if (typeof window === 'undefined') return 'web';

    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes('iphone') || userAgent.includes('ipad'))
      return 'ios';
    if (userAgent.includes('android')) return 'android';
    return 'web';
  }
}

// Export instance
export const mobileAPI = MobileAPI.getInstance();
