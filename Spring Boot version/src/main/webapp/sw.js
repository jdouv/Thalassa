const cacheName = `Thalassa`;
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll([
                `/`,
                `/index.html`,
                `/localization`,
                `/bin/background.jpg`,
                `/bin/background-blurred.jpg`,
                `/bin/common.css`,
                `/bin/dark.css`,
                `/bin/light.css`,
                `/bin/favicon.ico`,
                `/bin/logo72.png`,
                `/bin/logo96.png`,
                `/bin/logo128.png`,
                `/bin/logo144.png`,
                `/bin/logo152.png`,
                `/bin/logo192.png`,
                `/bin/logo384.png`,
                `/bin/logo512.png`,
                `/bin/main.js`,
                `/bin/qrcodegen.js`,
                `/bin/instascan.min.js`,
                `/bin/moment.js`,
                `/bin/jquery.serializejson.min.js`,
                `/bin/preact.js`,
                `/bin/manifest.json`,
                `/bin/reset.css`,
                `https://code.jquery.com/jquery-3.4.1.min.js`,
                `https://necolas.github.io/normalize.css/latest/normalize.css`,
                `https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css`,
                `https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js`
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
                        cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});