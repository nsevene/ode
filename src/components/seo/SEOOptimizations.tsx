import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

export const SEOOptimizations = () => {
  useEffect(() => {
    // Предварительная загрузка важных страниц
    const preloadPages = [
      '/chefs-table',
      '/taste-compass', 
      '/wine-staircase',
      '/events'
    ];

    preloadPages.forEach(page => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = page;
      document.head.appendChild(link);
    });

    // Lazy loading изображений с правильными атрибутами
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));

    return () => {
      imageObserver.disconnect();
    };
  }, []);

  return (
    <Helmet>
      {/* Preconnect к важным внешним ресурсам */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://maps.googleapis.com" />
      
      {/* DNS prefetch для внешних ресурсов */}
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//connect.facebook.net" />
      
      {/* Preload критичных ресурсов */}
      <link rel="preload" href="/src/index.css" as="style" />
      <link rel="preload" href="/src/assets/ode-logo.png" as="image" />
      
      {/* Критичные мета-теги для SEO */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Для локального бизнеса */}
      <meta name="geo.region" content="ID-BA" />
      <meta name="geo.placename" content="Ubud, Bali" />
      <meta name="geo.position" content="-8.5069;115.2625" />
      <meta name="ICBM" content="-8.5069, 115.2625" />
      
      {/* Альтернативные языки */}
      <link rel="alternate" hrefLang="ru" href={window.location.href} />
      <link rel="alternate" hrefLang="en" href={`${window.location.origin}/en${window.location.pathname}`} />
      <link rel="alternate" hrefLang="x-default" href={window.location.href} />
      
      {/* Канонический URL */}
      <link rel="canonical" href={window.location.href} />
      
      {/* RSS фид для событий */}
      <link rel="alternate" type="application/rss+xml" title="ODE Food Hall Events" href="/feed.xml" />
    </Helmet>
  );
};

// Компонент для отслеживания производительности
export const WebVitalsTracking = () => {
  useEffect(() => {
    // Простое отслеживание времени загрузки
    const trackPageLoad = () => {
      if (window.gtag && window.performance) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        window.gtag('event', 'page_load_time', {
          value: Math.round(loadTime),
          event_category: 'Performance'
        });
      }
    };

    if (document.readyState === 'complete') {
      trackPageLoad();
    } else {
      window.addEventListener('load', trackPageLoad);
      return () => window.removeEventListener('load', trackPageLoad);
    }
  }, []);

  return null;
};