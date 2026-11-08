/* Pas à pas · v3.0 */
const CACHE = "pas-a-pas-v3-0";
const AUDIO = "pas-a-pas-audio";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./logo.png", "./favicon.ico", "./favicon-32.png", "./apple-touch-icon.png", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png",
  "./fonts/bvp-Regular.woff2", "./fonts/bvp-Medium.woff2", "./fonts/bvp-SemiBold.woff2", "./fonts/bvp-Bold.woff2", "./fonts/fraunces.woff2", "./fonts/newsreader-italic.woff2"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== AUDIO).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  /* Recorded audio packs never change for a given ?v=: cache first, and drop older versions of the same pack. */
  if (/\/audio\/[^/]+\.bin$/.test(u.pathname)) {
    e.respondWith(caches.open(AUDIO).then(async c => {
      const hit = await c.match(e.request); if (hit) return hit;
      const r = await fetch(e.request);
      if (r.ok) { const old = await c.keys(); old.filter(q => new URL(q.url).pathname === u.pathname && q.url !== e.request.url).forEach(q => c.delete(q)); c.put(e.request, r.clone()); }
      return r;
    }));
    return;
  }
  if (/\/fonts\//.test(u.pathname)) { e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))); return; }
  /* Everything else: network first, so a fresh GitHub Pages upload wins when online; the cache is the offline fallback. */
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); } return r; })
    .catch(() => caches.match(e.request).then(r => r || (e.request.mode === "navigate" ? caches.match("./index.html") : Response.error()))));
});
