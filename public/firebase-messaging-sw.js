// LuxeCore Firebase Cloud Messaging Background Service Worker
// Dynamically parses Firebase credentials passed during registration

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Parse configuration from query string
const params = new URLSearchParams(self.location.search);
const firebaseConfig = {
  apiKey: params.get('apiKey'),
  authDomain: params.get('authDomain'),
  projectId: params.get('projectId'),
  storageBucket: params.get('storageBucket'),
  messagingSenderId: params.get('messagingSenderId'),
  appId: params.get('appId'),
};

if (firebaseConfig.messagingSenderId) {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  // Listen to background messages when the tab is closed
  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);
    
    const notificationTitle = payload.notification?.title || payload.data?.title || 'LuxeCore';
    const notificationOptions = {
      body: payload.notification?.body || payload.data?.body || 'Sizda yangi taklif bor!',
      icon: payload.notification?.image || payload.data?.image || '/favicon.ico',
      badge: '/favicon.ico',
      data: {
        url: payload.data?.url || '/'
      }
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} else {
  console.warn('[firebase-messaging-sw.js] Firebase config parameters missing from query string.');
}
// Handle notification clicks - redirects user to target URL
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const targetUrl = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a tab is already open with the URL, focus it
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new tab
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// ==========================================
// PREMIUM PWA OFFLINE CACHE INTEGRATION
// ==========================================

const CACHE_NAME = 'luxecore-cache-v1';
const PRECACHE_ASSETS = [
  '/uz',
  '/ru',
  '/en',
  '/manifest.json',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/logo.jpg',
  '/pwa-192x192.png',
  '/pwa-512x512.png'
];

// SW Install: Pre-cache essential static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching static assets for PWA installability');
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.error('[Service Worker] Pre-cache failed for some assets:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// SW Activate: Clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// SW Fetch: Intelligent offline caching strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Exclude non-GET, third-party/extensions, Next.js HMR, hot updates, webpack, and API routes
  if (
    event.request.method !== 'GET' ||
    url.protocol.startsWith('chrome-extension') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('webpack') ||
    url.pathname.includes('hot-update') ||
    url.search.includes('_next-data')
  ) {
    return;
  }

  // Network First with Cache Fallback for dynamic document navigation/HTML
  const isHTML = event.request.headers.get('accept')?.includes('text/html') || event.request.destination === 'document';
  
  if (isHTML) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If offline, check if the request is in the cache, or fallback to localized default pages
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Fallback to basic language pages
            if (url.pathname.startsWith('/ru')) {
              return caches.match('/ru');
            } else if (url.pathname.startsWith('/en')) {
              return caches.match('/en');
            } else {
              return caches.match('/uz');
            }
          });
        })
    );
    return;
  }

  // Cache First for static images, icons, styles, scripts, and fonts
  const isStaticAsset = 
    event.request.destination === 'image' || 
    event.request.destination === 'style' || 
    event.request.destination === 'script' || 
    event.request.destination === 'font' ||
    PRECACHE_ASSETS.some((asset) => url.pathname.endsWith(asset));

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Fetch from network in the background to update cache (Stale-While-Revalidate)
          fetch(event.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          }).catch(() => {/* Ignore network errors for background fetch */});
          
          return cachedResponse;
        }

        // Cache miss: fetch from network and cache it
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Fallback if offline and not cached
          if (event.request.destination === 'image') {
            return caches.match('/logo.jpg');
          }
        });
      })
    );
  }
});
