const CACHE_NAME = "app-cache-v1";
const urlsToCache = ["/", "/index.html"];

// Install event
self.addEventListener("install", (event) => {
  console.log("Service Worker: Install Event");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching Files");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activate Event");
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Service Worker: Clearing Old Cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Make the service worker take control of all pages
});

// Fetch event - Intercept and cache requests
self.addEventListener("fetch", (event) => {
  console.log("Service Worker: Fetch Event", event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Listen for the message from the app to skip waiting and activate new SW
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    console.log("Service Worker: Skip Waiting");
    self.skipWaiting();
  }
});
