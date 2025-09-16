import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent, trackBookingStep, trackBookingComplete } from './GoogleAnalytics';
import { trackMetaEvent, trackMetaBookingStep, trackMetaViewContent } from './MetaPixel';
import { useAnalytics } from '@/hooks/useAnalytics';

interface ConversionTrackerProps {
  children: React.ReactNode;
}

export const ConversionTracker = ({ children }: ConversionTrackerProps) => {
  const location = useLocation();
  const analytics = useAnalytics();

  // Track page views with detailed information
  useEffect(() => {
    const pageName = getPageName(location.pathname);
    
    // Track in our custom analytics
    analytics.trackPageView(pageName);
    
    // Track content view for Meta
    trackMetaViewContent('page', pageName);
    
    // Track specific page types
    if (location.pathname.includes('/chefs-table')) {
      trackEvent('page_view_chefs_table');
      trackMetaViewContent('experience', 'chefs_table');
    } else if (location.pathname.includes('/taste-compass')) {
      trackEvent('page_view_taste_compass');
      trackMetaViewContent('experience', 'taste_compass');
    } else if (location.pathname.includes('/events')) {
      trackEvent('page_view_events');
      trackMetaViewContent('events', 'events_listing');
    }
  }, [location, analytics]);

  // Set up global conversion tracking functions
  useEffect(() => {
    // Make tracking functions available globally
    (window as any).odeTrack = {
      bookingStep: (step: string, data?: any) => {
        analytics.trackBooking(step, data);
        trackBookingStep(step, data);
        trackMetaBookingStep(step, data);
      },
      bookingComplete: (data: any) => {
        analytics.trackBooking('completed', data);
        trackBookingComplete(data);
        trackMetaBookingStep('completed', data);
      },
      event: (eventName: string, data?: any) => {
        analytics.track(eventName, data);
        trackEvent(eventName, data);
      },
      upsell: (action: string, data?: any) => {
        analytics.trackUpsell(action, data);
        trackEvent(`upsell_${action}`, data);
      },
      referral: (action: string, data?: any) => {
        analytics.trackReferral(action, data);
        trackEvent(`referral_${action}`, data);
      },
      loyalty: (action: string, data?: any) => {
        analytics.trackLoyalty(action, data);
        trackEvent(`loyalty_${action}`, data);
      }
    };
  }, [analytics]);

  return <>{children}</>;
};

const getPageName = (pathname: string): string => {
  const routes: Record<string, string> = {
    '/': 'home',
    '/chefs-table': 'chefs_table',
    '/taste-compass': 'taste_compass',
    '/events': 'events',
    '/auth': 'auth',
    '/dashboard': 'dashboard',
    '/my-bookings': 'my_bookings',
    '/lounge': 'lounge',
    '/wine-staircase': 'wine_staircase',
    '/virtual-tour': 'virtual_tour',
    '/photos': 'photos',
    '/admin': 'admin',
  };

  return routes[pathname] || pathname.replace('/', '').replace(/\//g, '_') || 'unknown';
};