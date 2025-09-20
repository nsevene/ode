import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/store/authStore';

// Analytics event types
export type AnalyticsEvent =
  | 'page_view'
  | 'button_click'
  | 'form_submit'
  | 'search'
  | 'booking_created'
  | 'booking_cancelled'
  | 'order_created'
  | 'order_completed'
  | 'user_signup'
  | 'user_login'
  | 'user_logout'
  | 'error_occurred'
  | 'feature_used'
  | 'conversion'
  | 'custom';

export interface AnalyticsEventData {
  event: AnalyticsEvent;
  properties?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  timestamp?: Date;
  page?: string;
  referrer?: string;
  userAgent?: string;
}

// Analytics hook
export const useAnalytics = () => {
  const { user, isAuthenticated } = useAuth();
  const sessionId = useRef<string>(generateSessionId());
  const eventQueue = useRef<AnalyticsEventData[]>([]);
  const isOnline = useRef<boolean>(navigator.onLine);

  // Generate unique session ID
  function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Track page view
  const trackPageView = useCallback(
    (page: string, properties?: Record<string, any>) => {
      const eventData: AnalyticsEventData = {
        event: 'page_view',
        properties: {
          page,
          ...properties,
        },
        userId: user?.id,
        sessionId: sessionId.current,
        timestamp: new Date(),
        page,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      };

      sendEvent(eventData);
    },
    [user]
  );

  // Track button clicks
  const trackButtonClick = useCallback(
    (buttonName: string, properties?: Record<string, any>) => {
      const eventData: AnalyticsEventData = {
        event: 'button_click',
        properties: {
          button_name: buttonName,
          ...properties,
        },
        userId: user?.id,
        sessionId: sessionId.current,
        timestamp: new Date(),
        page: window.location.pathname,
      };

      sendEvent(eventData);
    },
    [user]
  );

  // Track form submissions
  const trackFormSubmit = useCallback(
    (formName: string, properties?: Record<string, any>) => {
      const eventData: AnalyticsEventData = {
        event: 'form_submit',
        properties: {
          form_name: formName,
          ...properties,
        },
        userId: user?.id,
        sessionId: sessionId.current,
        timestamp: new Date(),
        page: window.location.pathname,
      };

      sendEvent(eventData);
    },
    [user]
  );

  // Track searches
  const trackSearch = useCallback(
    (query: string, results?: number, properties?: Record<string, any>) => {
      const eventData: AnalyticsEventData = {
        event: 'search',
        properties: {
          query,
          results_count: results,
          ...properties,
        },
        userId: user?.id,
        sessionId: sessionId.current,
        timestamp: new Date(),
        page: window.location.pathname,
      };

      sendEvent(eventData);
    },
    [user]
  );

  // Track bookings
  const trackBooking = useCallback(
    (
      action: 'created' | 'cancelled' | 'updated',
      properties?: Record<string, any>
    ) => {
      const eventData: AnalyticsEventData = {
        event:
          action === 'created'
            ? 'booking_created'
            : action === 'cancelled'
              ? 'booking_cancelled'
              : 'booking_updated',
        properties: {
          action,
          ...properties,
        },
        userId: user?.id,
        sessionId: sessionId.current,
        timestamp: new Date(),
        page: window.location.pathname,
      };

      sendEvent(eventData);
    },
    [user]
  );

  // Track orders
  const trackOrder = useCallback(
    (
      action: 'created' | 'completed' | 'cancelled',
      properties?: Record<string, any>
    ) => {
      const eventData: AnalyticsEventData = {
        event:
          action === 'created'
            ? 'order_created'
            : action === 'completed'
              ? 'order_completed'
              : 'order_cancelled',
        properties: {
          action,
          ...properties,
        },
        userId: user?.id,
        sessionId: sessionId.current,
        timestamp: new Date(),
        page: window.location.pathname,
      };

      sendEvent(eventData);
    },
    [user]
  );

  // Track user actions
  const trackUserAction = useCallback(
    (
      action: 'signup' | 'login' | 'logout',
      properties?: Record<string, any>
    ) => {
      const eventData: AnalyticsEventData = {
        event:
          action === 'signup'
            ? 'user_signup'
            : action === 'login'
              ? 'user_login'
              : 'user_logout',
        properties: {
          action,
          ...properties,
        },
        userId: user?.id,
        sessionId: sessionId.current,
        timestamp: new Date(),
        page: window.location.pathname,
      };

      sendEvent(eventData);
    },
    [user]
  );

  // Track errors
  const trackError = useCallback(
    (error: Error, context?: string, properties?: Record<string, any>) => {
      const eventData: AnalyticsEventData = {
        event: 'error_occurred',
        properties: {
          error_message: error.message,
          error_stack: error.stack,
          context,
          ...properties,
        },
        userId: user?.id,
        sessionId: sessionId.current,
        timestamp: new Date(),
        page: window.location.pathname,
      };

      sendEvent(eventData);
    },
    [user]
  );

  // Track feature usage
  const trackFeatureUsage = useCallback(
    (feature: string, properties?: Record<string, any>) => {
      const eventData: AnalyticsEventData = {
        event: 'feature_used',
        properties: {
          feature,
          ...properties,
        },
        userId: user?.id,
        sessionId: sessionId.current,
        timestamp: new Date(),
        page: window.location.pathname,
      };

      sendEvent(eventData);
    },
    [user]
  );

  // Track conversions
  const trackConversion = useCallback(
    (
      conversionType: string,
      value?: number,
      properties?: Record<string, any>
    ) => {
      const eventData: AnalyticsEventData = {
        event: 'conversion',
        properties: {
          conversion_type: conversionType,
          value,
          ...properties,
        },
        userId: user?.id,
        sessionId: sessionId.current,
        timestamp: new Date(),
        page: window.location.pathname,
      };

      sendEvent(eventData);
    },
    [user]
  );

  // Track custom events
  const trackCustomEvent = useCallback(
    (eventName: string, properties?: Record<string, any>) => {
      const eventData: AnalyticsEventData = {
        event: 'custom',
        properties: {
          custom_event: eventName,
          ...properties,
        },
        userId: user?.id,
        sessionId: sessionId.current,
        timestamp: new Date(),
        page: window.location.pathname,
      };

      sendEvent(eventData);
    },
    [user]
  );

  // Send event to analytics service
  const sendEvent = useCallback((eventData: AnalyticsEventData) => {
    // Add to queue if offline
    if (!isOnline.current) {
      eventQueue.current.push(eventData);
      return;
    }

    // Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', eventData.event, {
        event_category: 'user_interaction',
        event_label:
          eventData.properties?.button_name ||
          eventData.properties?.form_name ||
          'unknown',
        value: eventData.properties?.value || 0,
        custom_parameters: eventData.properties,
        user_id: eventData.userId,
        session_id: eventData.sessionId,
      });
    }

    // Send to custom analytics endpoint
    sendToCustomAnalytics(eventData);
  }, []);

  // Send to custom analytics endpoint
  const sendToCustomAnalytics = useCallback(
    async (eventData: AnalyticsEventData) => {
      try {
        // In production, you would send this to your analytics service
        console.log('Analytics event:', eventData);

        // Example: Send to Supabase
        // await supabase.from('analytics_events').insert([eventData]);
      } catch (error) {
        console.error('Failed to send analytics event:', error);
      }
    },
    []
  );

  // Process queued events when coming back online
  useEffect(() => {
    const handleOnline = () => {
      isOnline.current = true;

      // Process queued events
      while (eventQueue.current.length > 0) {
        const event = eventQueue.current.shift();
        if (event) {
          sendEvent(event);
        }
      }
    };

    const handleOffline = () => {
      isOnline.current = false;
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [sendEvent]);

  // Track page views on route changes
  useEffect(() => {
    trackPageView(window.location.pathname);
  }, [trackPageView]);

  return {
    trackPageView,
    trackButtonClick,
    trackFormSubmit,
    trackSearch,
    trackBooking,
    trackOrder,
    trackUserAction,
    trackError,
    trackFeatureUsage,
    trackConversion,
    trackCustomEvent,
  };
};

// Performance analytics hook
export const usePerformanceAnalytics = () => {
  const { trackCustomEvent } = useAnalytics();

  const trackPageLoad = useCallback(() => {
    const navigation = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;

    if (navigation) {
      trackCustomEvent('page_load_performance', {
        load_time: navigation.loadEventEnd - navigation.loadEventStart,
        dom_content_loaded:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
        first_paint:
          performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        first_contentful_paint:
          performance.getEntriesByName('first-contentful-paint')[0]
            ?.startTime || 0,
        largest_contentful_paint:
          performance.getEntriesByName('largest-contentful-paint')[0]
            ?.startTime || 0,
      });
    }
  }, [trackCustomEvent]);

  const trackResourceLoad = useCallback(
    (resourceName: string, loadTime: number) => {
      trackCustomEvent('resource_load_performance', {
        resource_name: resourceName,
        load_time: loadTime,
      });
    },
    [trackCustomEvent]
  );

  const trackUserInteraction = useCallback(
    (interactionType: string, delay: number) => {
      trackCustomEvent('user_interaction_performance', {
        interaction_type: interactionType,
        delay,
      });
    },
    [trackCustomEvent]
  );

  return {
    trackPageLoad,
    trackResourceLoad,
    trackUserInteraction,
  };
};

// Business analytics hook
export const useBusinessAnalytics = () => {
  const { trackCustomEvent } = useAnalytics();

  const trackRevenue = useCallback(
    (amount: number, currency: string = 'USD', source: string) => {
      trackCustomEvent('revenue', {
        amount,
        currency,
        source,
      });
    },
    [trackCustomEvent]
  );

  const trackCustomerAcquisition = useCallback(
    (source: string, cost?: number) => {
      trackCustomEvent('customer_acquisition', {
        source,
        cost,
      });
    },
    [trackCustomEvent]
  );

  const trackRetention = useCallback(
    (period: string, rate: number) => {
      trackCustomEvent('retention', {
        period,
        rate,
      });
    },
    [trackCustomEvent]
  );

  return {
    trackRevenue,
    trackCustomerAcquisition,
    trackRetention,
  };
};
