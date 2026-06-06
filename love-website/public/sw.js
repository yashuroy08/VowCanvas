const CACHE_NAME = 'lovecraft-cache-v1';
const IMAGE_CACHE_NAME = 'lovecraft-images-v1';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/index.css',
];

// Install Event - cache core shell assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event - clear old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== IMAGE_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - intercept requests
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Check if it's an image request (from unsplash, imgbb, or picsum)
  const isImage = 
    e.request.destination === 'image' ||
    url.hostname.includes('unsplash.com') ||
    url.hostname.includes('imgbb.com') ||
    url.hostname.includes('picsum.photos');

  if (isImage) {
    // Cache First strategy for images
    e.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        return cache.match(e.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse; // Return cache instantly
          }
          // Fetch, cache, and return
          return fetch(e.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(e.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Offline fallback or empty response
            return new Response('', { status: 404 });
          });
        });
      })
    );
  } else {
    // Network First strategy for other assets (to ensure live updates)
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          if (response.status === 200 && url.origin === location.origin) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(e.request);
        })
    );
  }
});
