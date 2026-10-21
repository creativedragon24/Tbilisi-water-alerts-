// Bump VERSION whenever you change any file, so phones pick up the update.
const VERSION = 'tbwater-v2';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest',
  'fonts/inter-latin.woff2', 'fonts/noto-sans-georgian.woff2',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png', 'icons/favicon.svg', 'icons/favicon-32.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Outage data: network first, cached copy when offline
  if (url.hostname === 'raw.githubusercontent.com') {
    e.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)).catch(() => {}); return res; })
        .catch(() => caches.match(req))
    );
    return;
  }

  // App files: cache first, refreshed in the background
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(req, {ignoreSearch: true}).then(hit => {
        const net = fetch(req)
          .then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)).catch(() => {}); return res; })
          .catch(() => hit);
        return hit || net;
      })
    );
  }
});
