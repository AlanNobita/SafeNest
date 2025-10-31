/**
 * SafeNest Service Worker
 * Handles caching, offline functionality, and resource management
 */

const CACHE_NAME = 'safenest-enterprise-v1.2.0';
const API_CACHE_NAME = 'safenest-api-v1.0.0';
const STATIC_CACHE_NAME = 'safenest-static-v1.0.0';

// Files to cache on install
const STATIC_FILES = [
  '/',
  '/static/css/critical.css',
  '/static/css/enterprise.css',
  '/static/css/enterprise-design-system.css',
  '/static/css/main.css',
  '/static/js/enterprise-components.js',
  '/static/js/enterprise-loading-optimizer.js',
  '/static/js/main.js',
  '/static/js/notifications.js',
  '/static/js/performance-monitor.js',
  '/static/images/logo.svg',
  '/static/images/favicon.ico',
  '/static/images/apple-touch-icon.png',
  '/templates/base.html',
  '/templates/enterprise-dashboard.html'
];

// Install event - cache static resources
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => self.skipWaiting())
      .catch(error => {
        console.error('Service Worker: Cache failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cache => {
            if (cache !== CACHE_NAME && cache !== API_CACHE_NAME && cache !== STATIC_CACHE_NAME) {
              console.log('Service Worker: Deleting old cache:', cache);
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Handle API requests with cache-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          // Return cached version if available
          if (response) {
            return response;
          }
          
          // Otherwise, fetch from network
          return fetch(request)
            .then(networkResponse => {
              // Cache the response for future use
              if (networkResponse.status === 200) {
                const cache = caches.open(API_CACHE_NAME);
                cache.then(cache => cache.put(request, networkResponse.clone()));
              }
              return networkResponse;
            })
            .catch(() => {
              // If both cache and network fail, return a basic offline response
              return new Response(
                JSON.stringify({
                  error: 'Offline',
                  message: 'You are currently offline. Please check your connection.'
                }),
                {
                  status: 503,
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            });
        })
    );
    return;
  }
  
  // Handle static assets with cache-first strategy
  if (request.destination === 'script' || request.destination === 'style' || request.destination === 'image') {
    event.respondWith(
      caches.match(request)
        .then(response => {
          // Return cached version if available
          if (response) {
            return response;
          }
          
          // Otherwise, fetch from network
          return fetch(request)
            .then(networkResponse => {
              // Cache the response for future use
              if (networkResponse.status === 200) {
                const cache = caches.open(STATIC_CACHE_NAME);
                cache.then(cache => cache.put(request, networkResponse.clone()));
              }
              return networkResponse;
            });
        })
    );
    return;
  }
  
  // Handle HTML requests with network-first strategy
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          // Cache the HTML response
          if (networkResponse.status === 200) {
            const cache = caches.open(CACHE_NAME);
            cache.then(cache => cache.put(request, networkResponse.clone()));
          }
          return networkResponse;
        })
        .catch(() => {
          // If network fails, return cached version
          return caches.match(request);
        })
    );
    return;
  }
  
  // For all other requests, use network-first strategy
  event.respondWith(
    fetch(request)
      .then(networkResponse => {
        // Cache successful responses
        if (networkResponse.status === 200) {
          const cache = caches.open(CACHE_NAME);
          cache.then(cache => cache.put(request, networkResponse.clone()));
        }
        return networkResponse;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(request);
      })
  );
});

// Handle background sync
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Perform sync operations
      performBackgroundSync()
    );
  }
});

// Handle push notifications
self.addEventListener('push', event => {
  console.log('Service Worker: Push received');
  
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/static/images/logo.svg',
      badge: '/static/images/badge.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification click received');
  
  event.notification.close();
  
  if (event.action === 'view-details') {
    // Open the dashboard or specific page
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync function
async function performBackgroundSync() {
  try {
    // Get pending sync operations
    const pendingOperations = await getPendingSyncOperations();
    
    // Process each operation
    for (const operation of pendingOperations) {
      await processSyncOperation(operation);
    }
    
    // Clear completed operations
    await clearCompletedSyncOperations();
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Get pending sync operations
async function getPendingSyncOperations() {
  // In a real implementation, this would fetch from IndexedDB
  return [];
}

// Process sync operation
async function processSyncOperation(operation) {
  // In a real implementation, this would process the operation
  console.log('Processing sync operation:', operation);
}

// Clear completed sync operations
async function clearCompletedSyncOperations() {
  // In a real implementation, this would clean up IndexedDB
  console.log('Clearing completed sync operations');
}

// Handle message events
self.addEventListener('message', event => {
  console.log('Service Worker: Message received');
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});