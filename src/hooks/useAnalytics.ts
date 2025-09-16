import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

// Enhanced analytics with real-time data sync

interface AnalyticsEvent {
  event_name: string;
  user_id?: string;
  session_id: string;
  properties?: Record<string, any>;
  page_url?: string;
  timestamp: string;
}

export const useAnalytics = () => {
  const { user } = useAuth();

  // Generate or get session ID
  const getSessionId = () => {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  };

  // Track page view
  const trackPageView = (page: string) => {
    try {
      const event: AnalyticsEvent = {
        event_name: 'page_view',
        user_id: user?.id,
        session_id: getSessionId(),
        properties: { page },
        page_url: window.location.href,
        timestamp: new Date().toISOString(),
      };
      
      // Store in localStorage for now (could be sent to analytics service)
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      events.push(event);
      localStorage.setItem('analytics_events', JSON.stringify(events.slice(-100))); // Keep last 100 events
    } catch (error) {
      console.warn('Error tracking page view:', error);
    }
  };

  // Track custom event with enhanced data
  const track = (eventName: string, properties?: Record<string, any>) => {
    try {
      const event: AnalyticsEvent = {
        event_name: eventName,
        user_id: user?.id,
        session_id: getSessionId(),
        properties: {
          ...properties,
          user_agent: navigator.userAgent,
          screen_resolution: `${screen.width}x${screen.height}`,
          viewport_size: `${window.innerWidth}x${window.innerHeight}`,
          referrer: document.referrer,
          timestamp_local: new Date().toLocaleString(),
        },
        page_url: window.location.href,
        timestamp: new Date().toISOString(),
      };

      // Store locally
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      events.push(event);
      localStorage.setItem('analytics_events', JSON.stringify(events.slice(-100)));

      // Send to external analytics if available
      if ((window as any).gtag) {
        (window as any).gtag('event', eventName, properties);
      }
      if ((window as any).fbq) {
        (window as any).fbq('trackCustom', eventName, properties);
      }

      // Also log to console for debugging
      console.log('Analytics Event:', event);

      // Try to sync to database for persistent analytics
      if (user?.id) {
        syncEventToDatabase(event).catch(console.error);
      }
    } catch (error) {
      console.warn('Error tracking event:', error);
    }
  };

  // Sync event to Supabase for persistent analytics (using existing tables)
  const syncEventToDatabase = async (event: AnalyticsEvent) => {
    try {
      // For now, we'll store analytics data locally until we create the analytics_events table
      // We can use user_notifications table as a temporary solution or create the table via migration
      console.log('Analytics event logged:', event);
      
      // Optionally store in user_notifications for tracking user actions
      if (event.user_id && ['booking_completed', 'conversion', 'purchase'].includes(event.event_name)) {
        await supabase.from('user_notifications').insert({
          user_id: event.user_id,
          type: 'analytics',
          title: 'Action Tracked',
          message: `${event.event_name} completed`,
          data: event.properties,
        });
      }
    } catch (error) {
      console.warn('Failed to sync analytics event:', error);
    }
  };

  // Track booking events
  const trackBooking = (step: string, bookingData?: any) => {
    track(`booking_${step}`, {
      experience_type: bookingData?.experience_type,
      guest_count: bookingData?.guest_count,
      booking_date: bookingData?.booking_date,
      time_slot: bookingData?.time_slot,
      ...bookingData
    });
  };

  // Track upsell events
  const trackUpsell = (action: string, upsellData?: any) => {
    track(`upsell_${action}`, upsellData);
  };

  // Track referral events
  const trackReferral = (action: string, referralData?: any) => {
    track(`referral_${action}`, referralData);
  };

  // Track loyalty events
  const trackLoyalty = (action: string, loyaltyData?: any) => {
    track(`loyalty_${action}`, loyaltyData);
  };

  // Get analytics data for admin
  const getAnalyticsData = () => {
    return JSON.parse(localStorage.getItem('analytics_events') || '[]');
  };

  // Enhanced conversion tracking
  const trackConversion = (conversionType: string, value?: number, metadata?: any) => {
    track('conversion', {
      conversion_type: conversionType,
      conversion_value: value,
      ...metadata,
    });
  };

  // Track user engagement metrics
  const trackEngagement = (engagementType: string, duration?: number) => {
    track('engagement', {
      engagement_type: engagementType,
      duration_seconds: duration,
      timestamp: Date.now(),
    });
  };

  // Track performance metrics
  const trackPerformance = (metric: string, value: number) => {
    track('performance', {
      metric_name: metric,
      metric_value: value,
      user_agent: navigator.userAgent,
    });
  };

  return {
    trackPageView,
    track,
    trackBooking,
    trackUpsell,
    trackReferral,
    trackLoyalty,
    trackConversion,
    trackEngagement,
    trackPerformance,
    getAnalyticsData,
    syncEventToDatabase,
  };
};