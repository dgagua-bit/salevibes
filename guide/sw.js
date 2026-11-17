/* Georgia Guide service worker: precache the app shell + data so everything except map tiles works offline. */
const VERSION = "gg-v1";
const SHELL = [
  "./", "./index.html", "./arrival.html", "./routes.html", "./route.html", "./places.html", "./place.html", "./food.html", "./plan.html", "./qr.html",
  "./manifest.webmanifest", "./assets/css/guide.css",
  "./assets/js/i18n.js", "./assets/js/store.js", "./assets/js/ui.js", "./assets/js/map.js",
  "./assets/js/data/places.js", "./assets/js/data/routes.js", "./assets/js/data/stops.js", "./assets/js/data/food.js", "./assets/js/data/arrival.js",
  "./assets/js/pages/home.js", "./assets/js/pages/arrival.js", "./assets/js/pages/routes.js", "./assets/js/pages/route.js", "./assets/js/pages/places.js", "./assets/js/pages/place.js", "./assets/js/pages/food.js", "./assets/js/pages/plan.js", "./assets/js/pages/qr.js",
  "./assets/vendor/leaflet/leaflet.js", "./assets/vendor/leaflet/leaflet.css", "./assets/vendor/leaflet/images/marker-icon.png", "./assets/vendor/leaflet/images/marker-shadow.png", "./assets/vendor/qrcode.js",
  "./assets/img/icon-48.png", "./assets/img/icon-192.png", "./assets/img/icon-512.png"
];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  // Map tiles & fonts: network first, cache a copy (tiles for recently viewed areas keep working offline).
  if (url.hostname.endsWith("openstreetmap.org") || url.hostname.includes("gstatic") || url.hostname.includes("googleapis")) {
    e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSION + "-ext").then(c => c.put(e.request, copy)).catch(() => {}); return r; }).catch(() => caches.match(e.request)));
    return;
  }
  if (url.origin !== location.origin) return;
  // App shell: cache first, refresh in background.
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(cached => {
    const net = fetch(e.request).then(r => { if (r.ok) caches.open(VERSION).then(c => c.put(e.request, r.clone())).catch(() => {}); return r; }).catch(() => cached);
    return cached || net;
  }));
});
