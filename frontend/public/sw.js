const CACHE_NAME = 'sahara-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/google_icon.png',
  '/favicon.ico'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  const reqUrl = new URL(event.request.url);
  const isSameOrigin = reqUrl.origin === self.location.origin;
  const isGet = event.request.method === 'GET';

  // Only cache same-origin GET assets. Let API calls and cross-origin requests bypass SW.
  if (!isSameOrigin || !isGet) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
