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

  var staticCacheName = 'mws-restaurant-cache-v1';

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

  self.addEventListener('fetch', function(event) {
    console.log('Service worker is fetching: ', event.request.url);
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request).then(function(response) {
          if (response.url.includes("1337")) {
             var reply = response.clone();
             reply.json().then(function(data) {
               console.log('Service worker is adding ' + reply.url + ' to indexed database: ', data);

               // https://gist.github.com/BigstickCarpet/a0d6389a5d0e3a24814b
               const indexedDBName = 'mws-restaurant-db-v1';
               const storeName = 'mws-restaurant-store-v1';
               const request = indexedDB.open(indexedDBName, 1 );

               request.onupgradeneeded = function(event) {
                   var db = event.target.result;
                   var store = db.createObjectStore(storeName, {keyPath: "id"});
               };

               request.onsuccess = function(event) {
                   var db = event.target.result;
                   var tx = db.transaction(storeName, "readwrite");
                   var store = tx.objectStore(storeName);

                   data.forEach(function (item) {
                     store.put(item);
                   })

                   tx.oncomplete = function() {
                       db.close();
                   };
               }
             })
          }

          return response;
        });
      })
    );
  });

})();
