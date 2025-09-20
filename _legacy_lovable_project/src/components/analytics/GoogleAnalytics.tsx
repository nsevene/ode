import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

interface GoogleAnalyticsProps {
  measurementId?: string;
  trackingId?: string;
}

export const GoogleAnalytics = ({
  measurementId,
  trackingId,
}: GoogleAnalyticsProps) => {
  const location = useLocation();
  const gaId = measurementId || trackingId;

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof document === 'undefined' ||
      !gaId
    )
      return;

    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.text = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}', {
        page_title: 'ODE Food Hall - Gastro Village Ubud',
        page_location: window.location.href,
        send_page_view: true
      });
    `;
    document.head.appendChild(script2);

    return () => {
      script1?.parentNode && script1.parentNode.removeChild(script1);
      script2?.parentNode && script2.parentNode.removeChild(script2);
    };
  }, [gaId]);

  // Track page views on route changes
  useEffect(() => {
    if (window.gtag && gaId) {
      window.gtag('config', gaId, {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location, gaId]);

  return null;
};

// Helper functions for tracking events
export const trackEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'ODE Food Hall',
      event_label: parameters?.label,
      value: parameters?.value,
      ...parameters,
    });
  }
};

export const trackConversion = (conversionType: string, value?: number) => {
  if (window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: 'G-8VJM6RXHF9/conversion',
      event_category: 'conversion',
      event_label: conversionType,
      value: value,
    });
  }
};

export const trackBookingStep = (step: string, bookingData?: any) => {
  trackEvent('booking_progress', {
    event_category: 'booking',
    event_label: step,
    custom_parameters: {
      experience_type: bookingData?.experience_type,
      guest_count: bookingData?.guest_count,
      booking_date: bookingData?.booking_date,
      step_number: getStepNumber(step),
    },
  });
};

export const trackBookingComplete = (bookingData: any) => {
  trackEvent('purchase', {
    transaction_id: bookingData.id,
    value: bookingData.payment_amount / 100, // Convert cents to dollars
    currency: 'USD',
    items: [
      {
        item_id: bookingData.experience_type,
        item_name: `${bookingData.experience_type} Booking`,
        category: 'booking',
        quantity: bookingData.guest_count,
        price: bookingData.payment_amount / 100,
      },
    ],
  });

  trackConversion('booking_complete', bookingData.payment_amount / 100);
};

const getStepNumber = (step: string): number => {
  const steps = [
    'started',
    'date_selected',
    'time_selected',
    'details_entered',
    'payment_initiated',
    'completed',
  ];
  return steps.indexOf(step) + 1;
};
