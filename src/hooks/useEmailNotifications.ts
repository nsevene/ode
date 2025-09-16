import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface EmailNotification {
  type: 'referral_bonus' | 'welcome_bonus' | 'booking_confirmation' | 'booking_reminder';
  user_id: string;
  referrer_id?: string;
  points?: number;
  booking_data?: any;
}

export const useEmailNotifications = () => {
  const sendReferralEmail = useCallback(async (
    type: 'referral_bonus' | 'welcome_bonus',
    userId: string,
    points: number,
    referrerId?: string
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-referral-emails', {
        body: {
          type,
          user_id: userId,
          referrer_id: referrerId,
          points
        }
      });

      if (error) throw error;
      
      console.log('Referral email sent successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Failed to send referral email:', error);
      return { success: false, error };
    }
  }, []);

  const sendBookingEmail = useCallback(async (
    type: 'booking_confirmation' | 'booking_reminder',
    bookingData: any
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-booking-email', {
        body: {
          type,
          booking_data: bookingData
        }
      });

      if (error) throw error;
      
      console.log('Booking email sent successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Failed to send booking email:', error);
      return { success: false, error };
    }
  }, []);

  const sendTenantNotification = useCallback(async (
    bookingId: string,
    status: 'approved' | 'rejected' | 'pending',
    adminComment?: string,
    notifyAdmins: boolean = false
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-tenant-notification', {
        body: {
          booking_id: bookingId,
          status,
          admin_comment: adminComment,
          notify_admins: notifyAdmins
        }
      });

      if (error) throw error;
      
      console.log('Tenant notification sent successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Failed to send tenant notification:', error);
      return { success: false, error };
    }
  }, []);

  return {
    sendReferralEmail,
    sendBookingEmail,
    sendTenantNotification
  };
};