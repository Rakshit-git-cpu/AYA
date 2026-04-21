const CACHE_NAME = 'aya-cache-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Otherwise fetch from network
        return fetch(event.request).catch(() => {
          // If network fetch fails, maybe return a fallback page
          // For now returning the root which should load the offline bundle if cached
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
  );
});
