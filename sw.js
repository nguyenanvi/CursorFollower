const CACHE_NAME = 'offline-cache-v1';
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/img/fullscreen.ico',
    '/img/11.jpeg',
    '/img/12.jpeg',
    '/img/13.jpeg',
    '/img/14.jpeg',
    '/img/15.jpeg',
    '/img/21.jpeg',
    '/img/22.jpeg',
    '/img/23.jpeg',
    '/img/24.jpeg',
    '/img/25.jpeg',
    '/img/31.jpeg',
    '/img/32.jpeg',
    '/img/33.jpeg',
    '/img/34.jpeg',
    '/img/35.jpeg',
    '/img/41.jpeg',
    '/img/42.jpeg',
    '/img/43.jpeg',
    '/img/44.jpeg',
    '/img/45.jpeg',
    '/img/51.jpeg',
    '/img/52.jpeg',
    '/img/53.jpeg',
    '/img/54.jpeg',
    '/img/55.jpeg',
];

// Install the service worker and cache files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching files');
                return cache.addAll(FILES_TO_CACHE);
            })
    );
});

// Serve cached content when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});
