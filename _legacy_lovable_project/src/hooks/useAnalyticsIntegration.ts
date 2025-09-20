import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from './useAnalytics';
import { useAuthStore } from '@/store/authStore';

// Hook for automatic page tracking
export const usePageTracking = () => {
  const location = useLocation();
  const { trackPageView } = useAnalytics();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname, {
      user_id: user?.id,
      is_authenticated: isAuthenticated,
      timestamp: new Date().toISOString(),
    });
  }, [location.pathname, trackPageView, user?.id, isAuthenticated]);
};

// Hook for tracking user interactions
export const useInteractionTracking = () => {
  const { trackButtonClick, trackFormSubmit, trackSearch } = useAnalytics();

  const trackClick = (buttonName: string, properties?: Record<string, any>) => {
    trackButtonClick(buttonName, properties);
  };

  const trackSubmit = (formName: string, properties?: Record<string, any>) => {
    trackFormSubmit(formName, properties);
  };

  const trackSearchQuery = (
    query: string,
    results?: number,
    properties?: Record<string, any>
  ) => {
    trackSearch(query, results, properties);
  };

  return {
    trackClick,
    trackSubmit,
    trackSearchQuery,
  };
};

// Hook for tracking business events
export const useBusinessTracking = () => {
  const { trackBooking, trackOrder, trackConversion } = useAnalytics();

  const trackBookingEvent = (
    action: 'created' | 'cancelled' | 'updated',
    properties?: Record<string, any>
  ) => {
    trackBooking(action, properties);
  };

  const trackOrderEvent = (
    action: 'created' | 'completed' | 'cancelled',
    properties?: Record<string, any>
  ) => {
    trackOrder(action, properties);
  };

  const trackConversionEvent = (
    conversionType: string,
    value?: number,
    properties?: Record<string, any>
  ) => {
    trackConversion(conversionType, value, properties);
  };

  return {
    trackBookingEvent,
    trackOrderEvent,
    trackConversionEvent,
  };
};
