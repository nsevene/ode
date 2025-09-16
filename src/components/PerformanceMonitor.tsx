import { useEffect } from 'react';

const PerformanceMonitor = () => {
  useEffect(() => {
    // Monitor page load performance
    const monitorPerformance = () => {
      if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - 
                        window.performance.timing.navigationStart;
        
        if (loadTime > 0) {
          console.log(`Page load time: ${loadTime}ms`);
          
          // Send to analytics if needed
          if (window.gtag) {
            window.gtag('event', 'page_load_time', {
              'custom_parameter': loadTime,
              'event_category': 'Performance'
            });
          }
        }
      }

      // Monitor Core Web Vitals
      if ('web-vital' in window) {
        // This would integrate with web-vitals library if added
        console.log('Core Web Vitals monitoring ready');
      }
    };

    // Run after page load
    if (document.readyState === 'complete') {
      monitorPerformance();
    } else {
      window.addEventListener('load', monitorPerformance);
    }

    return () => {
      window.removeEventListener('load', monitorPerformance);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;