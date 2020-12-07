var cacheName = 'offlineCache-v1';
var contentToCache = [
  '/index.html',
];

self.addEventListener('install', (event) => {
  console.log('Service Worker Installed');
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      console.log('Service Worker Caching Files');
      return cache.addAll(contentToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  var url = event.request;
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});
