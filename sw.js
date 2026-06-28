const CACHE_NAME = 'bunnan-v3';
const urlsToCache = [
    '/',
    '/index.html',
    '/home.html',
    '/ideas.html',
    '/quotes.html',
    '/service-request.html',
    '/company.html',
    '/order-tracking.html',
    '/execute.html',
    '/product.html',
    '/market.html',
    '/account.html',
    '/css/style.css',
    '/icon-192.png',
    '/icon-512.png',
    '/js/nav.js',
    '/js/header.js',
    '/js/bottom-nav.js',
    'https://unpkg.com/vue@3/dist/vue.global.js',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap',
    'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
