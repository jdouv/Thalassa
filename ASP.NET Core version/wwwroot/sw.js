const cacheName = `Thalassa`;
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll([
                `/`,
                `/sw.js`,
                `/Index.html`,
                `/favicon.ico`,
                `/manifest.json`,
                `/User/Localization`,
                `/img/background.jpg`,
                `/img/background-blurred.jpg`,
                `/css/common.css`,
                `/css/dark.css`,
                `/css/light.css`,
                `/css/reset.css`,
                `/img/logo72.png`,
                `/img/logo96.png`,
                `/img/logo128.png`,
                `/img/logo144.png`,
                `/img/logo152.png`,
                `/img/logo192.png`,
                `/img/logo384.png`,
                `/img/logo512.png`,
                `/js/main.js`,
                `/js/qrcodegen.js`,
                `/js/instascan.min.js`,
                `/js/moment.js`,
                `/js/jquery.serializejson.min.js`,
                `/js/preact.js`,
                `https://code.jquery.com/jquery-3.4.1.min.js`,
                `https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js`,
                `https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js`
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