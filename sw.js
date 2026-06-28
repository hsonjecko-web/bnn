const CACHE_NAME = 'bunnan-v3';
const urlsToCache = [
    '/bnn/',
    '/bnn/index.html',
    '/bnn/home.html',
    '/bnn/ideas.html',
    '/bnn/quotes.html',
    '/bnn/service-request.html',
    '/bnn/company.html',
    '/bnn/order-tracking.html',
    '/bnn/execute.html',
    '/bnn/product.html',
    '/bnn/market.html',
    '/bnn/account.html',
    '/bnn/css/style.css',
    '/bnn/icon-192.png',
    '/bnn/icon-512.png',
    '/bnn/js/nav.js',
    '/bnn/js/header.js',
    '/bnn/js/bottom-nav.js',
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
