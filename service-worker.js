(function() {
  'use strict';

  var filesToCache = [
    '.',
    '/',
    'css/styles.css',
    'js/dbhelper.js',
    'js/main.js',
    'js/restaurant_info.js',
    'img/1.jpg',
    'img/2.jpg',
    'img/3.jpg',
    'img/4.jpg',
    'img/5.jpg',
    'img/6.jpg',
    'img/7.jpg',
    'img/8.jpg',
    'img/9.jpg',
    'img/10.jpg',
    'data/restaurants.json',
    'index.html',
    'restaurant.html'
  ];

  var staticCacheName = 'mws-restaurant-v1';

  self.addEventListener('install', function(event) {
    console.log('Service worker installing...');
    event.waitUntil(
      caches.open(staticCacheName)
      .then(function(cache) {
        return cache.addAll(filesToCache);
      })
    );
  });

  self.addEventListener('activate', function(event) {
    console.log('Service worker activating...');
  });

  // I'm a new service worker

  self.addEventListener('fetch', function(event) {
    console.log('Service worker is fetching: ', event.request.url);
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });

})();
