// Service Worker for PWA functionality
const CACHE_NAME = 'ode-food-hall-v4';
const STATIC_CACHE = 'ode-static-v4';
const IMAGE_CACHE = 'ode-images-v4';
const ASSETS_CACHE = 'ode-assets-v4';

// Core assets to cache immediately
const urlsToCache = [
  '/',
  '/wine-staircase',
  '/manifest.json',
  '/ode-logo.png'
];

// Image extensions to cache
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('PWA: Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('PWA: Caching core assets');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  
  // Skip third-party requests (e.g., Google Maps, analytics) to avoid caching issues
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  // Handle static assets (JS, CSS) with cache-first strategy for long-term caching
  if (requestUrl.pathname.includes('/assets/') || 
      requestUrl.pathname.endsWith('.js') || 
      requestUrl.pathname.endsWith('.css') ||
      requestUrl.pathname.includes('lovable-uploads/')) {
    event.respondWith(
      caches.open(ASSETS_CACHE)
        .then(cache => {
          return cache.match(event.request)
            .then(response => {
              if (response) {
                console.log('PWA: Serving static asset from cache:', requestUrl.pathname);
                return response;
              }
              
              return fetch(event.request)
                .then(fetchResponse => {
                  if (fetchResponse.ok) {
                    // Cache static assets for long term
                    const responseToCache = fetchResponse.clone();
                    cache.put(event.request, responseToCache);
                  }
                  return fetchResponse;
                })
                .catch(() => {
                  return new Response('Asset not available offline', {
                    status: 503,
                    statusText: 'Service Unavailable'
                  });
                });
            });
        })
    );
    return;
  }

  // Handle images with cache-first strategy
  if (imageExtensions.some(ext => requestUrl.pathname.includes(ext))) {
    event.respondWith(
      caches.open(IMAGE_CACHE)
        .then(cache => {
          return cache.match(event.request)
            .then(response => {
              if (response) {
                console.log('PWA: Serving image from cache:', requestUrl.pathname);
                return response;
              }
              
              return fetch(event.request)
                .then(fetchResponse => {
                  if (fetchResponse.ok) {
                    cache.put(event.request, fetchResponse.clone());
                  }
                  return fetchResponse;
                })
                .catch(() => {
                  // Return a fallback image if available
                  return new Response('Image not available offline', {
                    status: 503,
                    statusText: 'Service Unavailable'
                  });
                });
            });
        })
    );
    return;
  }
  
  // Handle other requests with network-first strategy
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone response for caching
        const responseClone = response.clone();
        
        // Cache successful responses for pages and documents
        if (response.ok && (event.request.method === 'GET')) {
          caches.open(STATIC_CACHE)
            .then(cache => {
              cache.put(event.request, responseClone);
            });
        }
        
        return response;
      })
      .catch(() => {
        // Fallback to cache when network fails
        return caches.match(event.request)
          .then(response => {
            if (response) {
              console.log('PWA: Serving from cache (offline):', event.request.url);
              return response;
            }
            
            // Return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            
            return new Response('Content not available offline', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('PWA: Service Worker activating...');
  const cacheWhitelist = [STATIC_CACHE, IMAGE_CACHE, ASSETS_CACHE];
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log('PWA: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('PWA: Service Worker activated');
        return self.clients.claim();
      })
  );
});