const cacheName = 'vildoku-v1';
const assets = [
  './',
  './index.html',
  './style.css',
  './game.js',
  './manifest.json'
];

// Dosyaları önbelleğe al
self.addEventListener('install', e => {
  e.waitUntil(caches.open(cacheName).then(cache => cache.addAll(assets)));
});

// Çevrimdışı modda önbellekten servis et
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
