import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

interface MetaPixelProps {
  pixelId?: string;
}

export const MetaPixel = ({ pixelId = '1234567890123457' }: MetaPixelProps) => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    
    // Load Meta Pixel script
    const script = document.createElement('script');
    script.text = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

    // Add noscript fallback
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    document.head.appendChild(noscript);

    return () => {
      script?.parentNode && script.parentNode.removeChild(script);
      noscript?.parentNode && noscript.parentNode.removeChild(noscript);
    };
  }, [pixelId]);

  // Track page views on route changes
  useEffect(() => {
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [location]);

  return null;
};

// Helper functions for tracking Meta events
export const trackMetaEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (window.fbq) {
    window.fbq('track', eventName, parameters);
  }
};

export const trackMetaCustomEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (window.fbq) {
    window.fbq('trackCustom', eventName, parameters);
  }
};

export const trackMetaBookingStep = (step: string, bookingData?: any) => {
  const eventMap: Record<string, string> = {
    'started': 'InitiateCheckout',
    'date_selected': 'AddToCart',
    'details_entered': 'AddPaymentInfo',
    'completed': 'Purchase',
  };

  const metaEvent = eventMap[step] || 'CustomBookingStep';
  
  if (metaEvent === 'Purchase' && bookingData) {
    trackMetaEvent('Purchase', {
      value: bookingData.payment_amount / 100,
      currency: 'USD',
      content_name: `${bookingData.experience_type} Booking`,
      content_category: 'booking',
      content_ids: [bookingData.experience_type],
      num_items: bookingData.guest_count,
    });
  } else {
    trackMetaCustomEvent(`Booking${step.charAt(0).toUpperCase() + step.slice(1)}`, {
      experience_type: bookingData?.experience_type,
      guest_count: bookingData?.guest_count,
      step: step,
    });
  }
};

export const trackMetaLead = (leadData?: any) => {
  trackMetaEvent('Lead', {
    content_name: 'Newsletter Signup',
    content_category: 'lead_generation',
    value: 1,
    currency: 'USD',
  });
};

export const trackMetaViewContent = (contentType: string, contentId?: string) => {
  trackMetaEvent('ViewContent', {
    content_type: contentType,
    content_ids: contentId ? [contentId] : undefined,
  });
};