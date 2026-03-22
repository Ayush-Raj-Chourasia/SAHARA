const CACHE_NAME = 'sahara-v3';
const urlsToCache = [
  '/google_icon.png',
  '/favicon.ico'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const reqUrl = new URL(event.request.url);
  const isSameOrigin = reqUrl.origin === self.location.origin;
  const isGet = event.request.method === 'GET';
  const isApiRequest = reqUrl.pathname.startsWith('/api/') || reqUrl.origin.includes('railway.app');
  const isNavigation = event.request.mode === 'navigate';

  // Never cache app shell html/navigation; always go network-first to avoid stale JS bundle.
  if (isNavigation) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Only cache same-origin GET assets. Let API calls and cross-origin requests bypass SW.
  if (!isSameOrigin || !isGet || isApiRequest) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request)
          .then(networkRes => {
            // Do not cache opaque/error responses.
            if (networkRes && networkRes.status === 200 && networkRes.type === 'basic') {
              const copy = networkRes.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
            }
            return networkRes;
          });
      })
  );
});
