import { useEffect } from 'react';

const PreloadResources = () => {
  useEffect(() => {
    // Preload only hero critical images
    const criticalImages = [
      '/assets/hero-food-hall.jpg',
      '/assets/ode-logo.png',
    ];

    criticalImages.forEach((src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Preload critical fonts
    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    ];

    criticalFonts.forEach((href) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      document.head.appendChild(link);
    });

    // Enhanced analytics tracking for internal links
    const trackInternalLinks = () => {
      document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', function (e) {
          const href = this.getAttribute('href');
          if (window.gtag) {
            window.gtag('event', 'click', {
              event_category: 'Anchor Link',
              event_label: href,
              page: window.location.pathname,
            });
          }
        });
      });
    };

    // Track after component mount
    setTimeout(trackInternalLinks, 1000);

    return () => {
      // Cleanup preload links if needed
      const preloadLinks = document.querySelectorAll('link[rel="preload"]');
      preloadLinks.forEach((link) => {
        if (criticalImages.includes(link.getAttribute('href') || '')) {
          link.remove();
        }
      });
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PreloadResources;
