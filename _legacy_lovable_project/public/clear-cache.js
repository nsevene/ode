// Clear Cache Script for Development
(function () {
  console.log('🧹 Clearing all caches...');

  // Clear Service Worker registrations
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      console.log('🗑️ Unregistering', registrations.length, 'service workers');
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  }

  // Clear all caches
  if ('caches' in window) {
    caches.keys().then(function (cacheNames) {
      console.log('🗑️ Deleting', cacheNames.length, 'caches');
      return Promise.all(
        cacheNames.map(function (cacheName) {
          console.log('🗑️ Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    });
  }

  // Clear localStorage
  localStorage.clear();
  console.log('🗑️ Cleared localStorage');

  // Clear sessionStorage
  sessionStorage.clear();
  console.log('🗑️ Cleared sessionStorage');

  // Clear IndexedDB
  if ('indexedDB' in window) {
    try {
      indexedDB.deleteDatabase('zustand');
      console.log('🗑️ Cleared IndexedDB');
    } catch (e) {
      console.log('⚠️ Could not clear IndexedDB:', e);
    }
  }

  console.log('✅ Cache clearing complete! Reloading page...');

  // Reload page after a short delay
  setTimeout(function () {
    window.location.reload(true);
  }, 1000);
})();
