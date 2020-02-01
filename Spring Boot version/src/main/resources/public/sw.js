const cacheName = 'Thalassa';

self.addEventListener('install', e => {
    const contextPath = new URL(location.href).searchParams.get('contextPath');

    e.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll([
                contextPath + '/',
                contextPath + '/sw.js',
                contextPath + '/index.html',
                contextPath + '/favicon.ico',
                contextPath + '/manifest.json',
                contextPath + '/localization',
                contextPath + '/css/common.css',
                contextPath + '/css/dark.css',
                contextPath + '/css/light.css',
                contextPath + '/css/reset.css',
                contextPath + '/img/background.jpg',
                contextPath + '/img/background-blurred.jpg',
                contextPath + '/img/logo72.png',
                contextPath + '/img/logo96.png',
                contextPath + '/img/logo128.png',
                contextPath + '/img/logo144.png',
                contextPath + '/img/logo152.png',
                contextPath + '/img/logo192.png',
                contextPath + '/img/logo384.png',
                contextPath + '/img/logo512.png',
                contextPath + '/js/htm.js',
                contextPath + '/js/main.js',
                contextPath + '/js/qrcodegen.js',
                contextPath + '/js/instascan.min.js',
                contextPath + '/js/moment.js',
                contextPath + '/js/jquery.serializejson.min.js',
                contextPath + '/js/preact.js',
                'https://code.jquery.com/jquery-3.4.1.min.js',
                'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js',
                'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js'
            ])
                .then(() => self.skipWaiting());
        })
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.open(cacheName).then(function(cache) {
            return cache.match(event.request).then(function (response) {
                return response || fetch(event.request).then(function(response) {
                    if (event.request.method.toUpperCase() === 'GET')
                        cache.put(event.request, response.clone()).then(() => {void(0);});
                    return response;
                });
            });
        })
    );
});