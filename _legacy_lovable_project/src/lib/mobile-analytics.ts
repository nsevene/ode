// Mobile analytics and tracking
import { mobileAPI } from './mobile-api';

export interface MobileAnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  userId?: string;
  sessionId: string;
  timestamp: number;
  platform: 'ios' | 'android' | 'web';
  appVersion?: string;
  deviceInfo?: {
    model: string;
    os: string;
    osVersion: string;
    screenSize: string;
  };
}

export interface UserJourney {
  userId: string;
  sessionId: string;
  events: MobileAnalyticsEvent[];
  startTime: number;
  endTime?: number;
  duration?: number;
}

export class MobileAnalytics {
  private static instance: MobileAnalytics;
  private sessionId: string;
  private currentJourney: UserJourney | null = null;

  static getInstance(): MobileAnalytics {
    if (!MobileAnalytics.instance) {
      MobileAnalytics.instance = new MobileAnalytics();
    }
    return MobileAnalytics.instance;
  }

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  // Track user action
  async track(
    event: string,
    properties: Record<string, any> = {},
    userId?: string
  ): Promise<void> {
    const analyticsEvent: MobileAnalyticsEvent = {
      event,
      properties,
      userId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      platform: this.detectPlatform(),
      appVersion: this.getAppVersion(),
      deviceInfo: await this.getDeviceInfo(),
    };

    // Add to current journey
    if (this.currentJourney) {
      this.currentJourney.events.push(analyticsEvent);
    }

    // Send to analytics service
    await mobileAPI.trackEvent(userId || 'anonymous', event, properties);
  }

  // Track screen view
  async trackScreenView(screenName: string, userId?: string): Promise<void> {
    await this.track(
      'screen_view',
      {
        screen_name: screenName,
        screen_class: screenName,
      },
      userId
    );
  }

  // Track user engagement
  async trackEngagement(
    action: string,
    element: string,
    userId?: string
  ): Promise<void> {
    await this.track(
      'user_engagement',
      {
        action,
        element,
        engagement_time: Date.now(),
      },
      userId
    );
  }

  // Track order events
  async trackOrderEvent(
    event: string,
    orderId: string,
    amount?: number,
    userId?: string
  ): Promise<void> {
    await this.track(
      'order_event',
      {
        event,
        order_id: orderId,
        amount,
        currency: 'USD',
      },
      userId
    );
  }

  // Track booking events
  async trackBookingEvent(
    event: string,
    bookingId: string,
    userId?: string
  ): Promise<void> {
    await this.track(
      'booking_event',
      {
        event,
        booking_id: bookingId,
      },
      userId
    );
  }

  // Track NFC interactions
  async trackNFCInteraction(
    tagId: string,
    zoneName: string,
    userId?: string
  ): Promise<void> {
    await this.track(
      'nfc_interaction',
      {
        tag_id: tagId,
        zone_name: zoneName,
        interaction_type: 'scan',
      },
      userId
    );
  }

  // Track mission completion
  async trackMissionCompletion(
    missionId: string,
    pointsEarned: number,
    userId?: string
  ): Promise<void> {
    await this.track(
      'mission_completion',
      {
        mission_id: missionId,
        points_earned: pointsEarned,
        completion_time: Date.now(),
      },
      userId
    );
  }

  // Track app performance
  async trackPerformance(
    metric: string,
    value: number,
    userId?: string
  ): Promise<void> {
    await this.track(
      'performance_metric',
      {
        metric,
        value,
        unit: 'ms',
      },
      userId
    );
  }

  // Track error
  async trackError(
    error: Error,
    context: string,
    userId?: string
  ): Promise<void> {
    await this.track(
      'error',
      {
        error_message: error.message,
        error_stack: error.stack,
        context,
        severity: 'error',
      },
      userId
    );
  }

  // Start user journey
  startJourney(userId: string): void {
    this.currentJourney = {
      userId,
      sessionId: this.sessionId,
      events: [],
      startTime: Date.now(),
    };
  }

  // End user journey
  async endJourney(): Promise<void> {
    if (!this.currentJourney) return;

    this.currentJourney.endTime = Date.now();
    this.currentJourney.duration =
      this.currentJourney.endTime - this.currentJourney.startTime;

    // Send journey data
    await this.track(
      'user_journey_complete',
      {
        journey_duration: this.currentJourney.duration,
        event_count: this.currentJourney.events.length,
        session_id: this.currentJourney.sessionId,
      },
      this.currentJourney.userId
    );

    this.currentJourney = null;
  }

  // Get user analytics
  async getUserAnalytics(
    userId: string,
    startDate?: string,
    endDate?: string
  ): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('mobile_analytics')
        .select('*')
        .eq('user_id', userId)
        .gte(
          'timestamp',
          startDate ||
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        )
        .lte('timestamp', endDate || new Date().toISOString())
        .order('timestamp', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get user analytics error:', error);
      return [];
    }
  }

  // Get app analytics
  async getAppAnalytics(startDate?: string, endDate?: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('mobile_analytics')
        .select('*')
        .gte(
          'timestamp',
          startDate ||
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        )
        .lte('timestamp', endDate || new Date().toISOString());

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get app analytics error:', error);
      return [];
    }
  }

  // Helper methods
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private detectPlatform(): 'ios' | 'android' | 'web' {
    if (typeof window === 'undefined') return 'web';

    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes('iphone') || userAgent.includes('ipad'))
      return 'ios';
    if (userAgent.includes('android')) return 'android';
    return 'web';
  }

  private getAppVersion(): string | undefined {
    // This would be implemented with your app version system
    return '1.0.0';
  }

  private async getDeviceInfo(): Promise<MobileAnalyticsEvent['deviceInfo']> {
    if (typeof window === 'undefined') return undefined;

    return {
      model: navigator.userAgent,
      os: navigator.platform,
      osVersion: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`,
    };
  }
}

// Export instance
export const mobileAnalytics = MobileAnalytics.getInstance();
