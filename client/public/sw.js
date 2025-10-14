self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open('wizqo-static-v1');
    await cache.addAll([
      '/',
      '/index.html',
      '/favicon.ico',
      '/favicon.svg'
    ]);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open('wizqo-static-v1');
      const cached = await cache.match(event.request);
      if (cached) return cached;
      try {
        const resp = await fetch(event.request);
        if (resp && resp.status === 200 && event.request.method === 'GET') {
          cache.put(event.request, resp.clone());
        }
        return resp;
      } catch (e) {
        return cached || Response.error();
      }
    })());
  }
});
