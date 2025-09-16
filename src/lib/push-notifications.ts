// Push notifications for mobile apps
import { mobileAPI } from './mobile-api';

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  imageUrl?: string;
  actionUrl?: string;
  scheduledAt?: string;
  userId?: string;
  userSegment?: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  body: string;
  category: 'order' | 'booking' | 'promotion' | 'mission' | 'general';
  isActive: boolean;
}

export class PushNotificationManager {
  private static instance: PushNotificationManager;

  static getInstance(): PushNotificationManager {
    if (!PushNotificationManager.instance) {
      PushNotificationManager.instance = new PushNotificationManager();
    }
    return PushNotificationManager.instance;
  }

  // Send notification to specific user
  async sendToUser(userId: string, notification: Omit<PushNotification, 'id' | 'userId'>): Promise<boolean> {
    try {
      const fullNotification: PushNotification = {
        id: this.generateId(),
        userId,
        ...notification
      };

      // Send via Supabase Edge Function
      const { error } = await supabase.functions.invoke('send-push-notification', {
        body: fullNotification
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Send notification error:', error);
      return false;
    }
  }

  // Send notification to user segment
  async sendToSegment(segment: string, notification: Omit<PushNotification, 'id' | 'userSegment'>): Promise<boolean> {
    try {
      const fullNotification: PushNotification = {
        id: this.generateId(),
        userSegment: segment,
        ...notification
      };

      const { error } = await supabase.functions.invoke('send-push-notification', {
        body: fullNotification
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Send segment notification error:', error);
      return false;
    }
  }

  // Send order update notification
  async sendOrderUpdate(userId: string, orderId: string, status: string): Promise<boolean> {
    const templates = {
      confirmed: {
        title: "Order Confirmed! 🍽️",
        body: "Your order has been confirmed and is being prepared"
      },
      preparing: {
        title: "Cooking in Progress 👨‍🍳",
        body: "Your delicious meal is being prepared with love"
      },
      ready: {
        title: "Order Ready! 🎉",
        body: "Your order is ready for pickup at the counter"
      },
      delivered: {
        title: "Order Delivered! ✅",
        body: "Enjoy your meal! Don't forget to rate your experience"
      }
    };

    const template = templates[status as keyof typeof templates];
    if (!template) return false;

    return await this.sendToUser(userId, {
      title: template.title,
      body: template.body,
      data: { orderId, status },
      actionUrl: `/orders/${orderId}`
    });
  }

  // Send booking reminder
  async sendBookingReminder(userId: string, bookingId: string, bookingTime: string): Promise<boolean> {
    return await this.sendToUser(userId, {
      title: "Booking Reminder 📅",
      body: `Your table reservation is in 1 hour at ${bookingTime}`,
      data: { bookingId },
      actionUrl: `/bookings/${bookingId}`
    });
  }

  // Send mission notification
  async sendMissionNotification(userId: string, missionTitle: string, zoneName: string): Promise<boolean> {
    return await this.sendToUser(userId, {
      title: "New Mission Available! 🎯",
      body: `Complete "${missionTitle}" in the ${zoneName} zone`,
      data: { missionTitle, zoneName },
      actionUrl: "/missions"
    });
  }

  // Send promotion notification
  async sendPromotion(userSegment: string, promotionTitle: string, discount: string): Promise<boolean> {
    return await this.sendToSegment(userSegment, {
      title: "Special Offer! 🎉",
      body: `${promotionTitle} - Get ${discount} off your next order`,
      data: { promotionTitle, discount },
      actionUrl: "/promotions"
    });
  }

  // Schedule notification
  async scheduleNotification(notification: PushNotification, scheduledAt: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('scheduled_notifications')
        .insert({
          ...notification,
          scheduled_at: scheduledAt,
          status: 'scheduled'
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Schedule notification error:', error);
      return false;
    }
  }

  // Get notification templates
  async getTemplates(): Promise<NotificationTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('notification_templates')
        .select('*')
        .eq('is_active', true)
        .order('category');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get templates error:', error);
      return [];
    }
  }

  // Create notification template
  async createTemplate(template: Omit<NotificationTemplate, 'id'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notification_templates')
        .insert(template);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Create template error:', error);
      return false;
    }
  }

  // Get user notification preferences
  async getUserPreferences(userId: string): Promise<Record<string, boolean>> {
    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data?.preferences || {};
    } catch (error) {
      console.error('Get user preferences error:', error);
      return {};
    }
  }

  // Update user notification preferences
  async updateUserPreferences(userId: string, preferences: Record<string, boolean>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_notification_preferences')
        .upsert({
          user_id: userId,
          preferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Update preferences error:', error);
      return false;
    }
  }

  // Helper methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Notification categories
export const NOTIFICATION_CATEGORIES = {
  ORDER: 'order',
  BOOKING: 'booking',
  PROMOTION: 'promotion',
  MISSION: 'mission',
  GENERAL: 'general'
} as const;

// User segments
export const USER_SEGMENTS = {
  ALL_USERS: 'all_users',
  NEW_USERS: 'new_users',
  FREQUENT_VISITORS: 'frequent_visitors',
  TENANTS: 'tenants',
  INVESTORS: 'investors'
} as const;

// Export instance
export const pushNotificationManager = PushNotificationManager.getInstance();
