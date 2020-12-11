var cacheName = 'offlineCache-v4';
var contentToCache = [
  '/offline.html',
  '/manifest.json',
  '/dependencies/jquery-3.5.1.min.js',
  '/dependencies/mithril.js',
  '/dependencies/rangeslider.min.js',
  '/dependencies/rangeslider.css',
  '/dependencies/quicksand.woff2',
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

self.addEventListener("activate", function(event) {//clean up old caches
  event.waitUntil(
   caches.keys().then((keyList) => {
     return Promise.all(keyList.map((key) => {
       if(key !== cacheName) {
         return caches.delete(key);
       }
     }));
   })
 );
});

self.addEventListener('fetch', (event) => {
  var url = event.request;
  event.respondWith(
    caches.match(event.request).then(function(response) {//respond with cache first
      return response || fetch(event.request);
    }).catch(function(){
      return caches.match('/offline.html');
    })
  );
});
