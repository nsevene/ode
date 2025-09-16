import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface GoogleAnalyticsSetupProps {
  measurementId?: string;
}

export const GoogleAnalyticsSetup: React.FC<GoogleAnalyticsSetupProps> = ({ 
  measurementId = 'G-XXXXXXXXXX' 
}) => {
  const location = useLocation();

  useEffect(() => {
    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', {
        page_title: document.title,
        page_location: window.location.href,
        anonymize_ip: true,
        allow_ad_personalization_signals: false,
        cookie_flags: 'SameSite=None;Secure'
      });
    `;
    document.head.appendChild(script2);

    return () => {
      script1?.parentNode && script1.parentNode.removeChild(script1);
      script2?.parentNode && script2.parentNode.removeChild(script2);
    };
  }, [measurementId]);

  // Track page views
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', measurementId, {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location, measurementId]);

  // Custom event tracking functions
  const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, parameters);
    }
  };

  const trackBooking = (bookingType: string, value?: number) => {
    trackEvent('booking_started', {
      event_category: 'booking',
      event_label: bookingType,
      value: value
    });
  };

  const trackContact = (method: string) => {
    trackEvent('contact_initiated', {
      event_category: 'engagement',
      event_label: method
    });
  };

  // Make tracking functions available globally
  useEffect(() => {
    (window as any).odeTracking = {
      trackEvent,
      trackBooking,
      trackContact
    };
  }, []);

  return null;
};