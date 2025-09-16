import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '@/hooks/useAnalytics';

export const ConversionTracker = () => {
  const location = useLocation();
  const { trackPageView, track } = useAnalytics();

  // Handle page view tracking with error protection
  const handlePageView = useCallback(() => {
    try {
      trackPageView(location.pathname);
    } catch (error) {
      console.warn('Error tracking page view:', error);
    }
  }, [location.pathname, trackPageView]);

  useEffect(() => {
    handlePageView();
  }, [handlePageView]);

  useEffect(() => {
    try {
      // Track session start
      track('session_start');

      // Track when user becomes idle
      let idleTimer: NodeJS.Timeout;
      const resetIdleTimer = () => {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          try {
            track('user_idle', { idle_duration: 30000 });
          } catch (error) {
            console.warn('Error tracking idle:', error);
          }
        }, 30000); // 30 seconds
      };

      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      events.forEach(event => {
        document.addEventListener(event, resetIdleTimer, true);
      });

      resetIdleTimer();

      // Track page visibility changes
      const handleVisibilityChange = () => {
        try {
          if (document.hidden) {
            track('page_hidden');
          } else {
            track('page_visible');
          }
        } catch (error) {
          console.warn('Error tracking visibility:', error);
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Track exit intent
      const handleMouseLeave = (e: MouseEvent) => {
        try {
          if (e.clientY <= 0) {
            track('exit_intent');
          }
        } catch (error) {
          console.warn('Error tracking exit intent:', error);
        }
      };

      document.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        clearTimeout(idleTimer);
        events.forEach(event => {
          document.removeEventListener(event, resetIdleTimer, true);
        });
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    } catch (error) {
      console.warn('Error initializing conversion tracker:', error);
    }
  }, [track]);

  return null; // This component doesn't render anything
};