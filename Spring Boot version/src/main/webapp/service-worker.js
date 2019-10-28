const cacheName = `Thalassa`;
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll([
                `/`,
                `/index`,
                `/home`,
                `/welcome`,
                `/register`,
                `/login`,
                `/rightNavLogin`,
                `/rightNavLogout`,
                `/logout`,
                `/navbarRegisterLogin`,
                `/validateBlockchain`,
                `/newContract`,
                `/testEnableClause`,
                `/bin/background.jpg`,
                `/bin/background-blurred.jpg`,
                `/bin/common.css`,
                `/bin/dark.css`,
                `/bin/light.css`,
                `/bin/favicon.ico`,
                `/bin/locales.json`,
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
                `/bin/manifest.json`,
                `/bin/reset.css`,
                `extra.jsp`,
                `generatedKeys.jsp`,
                `index.jsp`,
                `/dashboards/Admin/dashboardAdmin.jsp`,
                `/dashboards/Admin/validateBlockchain.jsp`,
                `/dashboards/LegalEngineer/contract.jsp`,
                `/dashboards/LegalEngineer/contracts.jsp`,
                `/dashboards/LegalEngineer/dashboardLegalEngineer.jsp`,
                `/dashboards/LegalEngineer/newContract.jsp`,
                `/dashboards/Shipbroker/dashboardShipbroker.jsp`,
                `https://code.jquery.com/jquery-3.4.1.min.js`,
                `https://necolas.github.io/normalize.css/latest/normalize.css`,
                `https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css`,
                `https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js`,
                `https://momentjs.com/downloads/moment-with-locales.js`,
                `https://rawgit.com/schmich/instascan-builds/master/instascan.min.js`
            ])
                .then(() => self.skipWaiting());
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open(cacheName)
            .then(cache => cache.match(event.request, {ignoreSearch: true}))
            .then(response => {
                return response || fetch(event.request);
            })
    );
});