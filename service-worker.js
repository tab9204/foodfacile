var cacheName = 'offlineCache-v1';
var contentToCache = [
  '/index.html',
  '/dependencies/jquery-3.5.1.min.js',
  '/dependencies/maps-api.js',
  '/dependencies/mithril.js',
  '/dependencies/rangeslider.min.js',
  '/dependencies/rangeslider.css',
  '/public/googleMaps.js',
  '/public/script.js',
  '/public/views.js',
  '/public/styles.css',
  '/public/back.png',
  '/public/logo.png',
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
    caches.match(event.request).then(function(response) {//respond with cache first
      return response || fetch(event.request);
    })
  );
});
