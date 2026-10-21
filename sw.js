// Bump VERSION whenever you change any file, so phones pick up the update.
const VERSION = 'tbwater-v3';
importScripts('watch.js');
const DATA_URL = 'https://raw.githubusercontent.com/creativedragon24/potential-telegram-water/main/current_alerts.json';
const SHELL = [
  './', 'index.html', 'watch.js', 'manifest.webmanifest',
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
      .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== 'tbw-state').map(k => caches.delete(k))))
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

// Best-effort background check (installed Chrome on Android only; the browser decides how often it runs)
self.addEventListener('periodicsync', e => { if (e.tag === 'tbw-check') e.waitUntil(checkWatch()); });
async function checkWatch(){
  const c = await caches.open('tbw-state'), r = await c.match('state.json');
  const st = r ? await r.json() : {};
  if (!(st.list || []).length) return;
  const j = await (await fetch(DATA_URL, {cache: 'no-store'})).json();
  const seen = new Set(st.seen || []);
  for (const a of j.alerts || []) {
    if (seen.has(a.id) || !st.list.some(w => TBW.hit(w, a))) continue;
    seen.add(a.id);
    await self.registration.showNotification(st.title || 'Water cut on your street', {body: a.address, icon: 'icons/icon-192.png', tag: a.id});
  }
  st.seen = [...seen].slice(-200);
  await c.put('state.json', new Response(JSON.stringify(st)));
}
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({type: 'window'}).then(l => l.length ? l[0].focus() : clients.openWindow('./')));
});
