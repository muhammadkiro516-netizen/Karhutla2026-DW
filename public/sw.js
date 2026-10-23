// PyroAlert Karhutla '26 Service Worker — v2
// v2: landing page at /, no root redirect cached
const CACHE = "pyroalert-v2";
const PRECACHE = ["/udara", "/sekolah", "/titik-api", "/posko"];
// Note: "/" (landing page) intentionally NOT precached to avoid
// caching any redirect responses. It's always fetched from network.

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  // Delete ALL old caches (eduair-v1, any previous version)
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Only handle GET requests
  if (e.request.method !== "GET") return;

  // Never intercept the root "/" — let it go straight to network
  // to avoid caching redirect responses (iOS Safari issue)
  if (url.pathname === "/") return;

  // Network-first for API routes (10s timeout fallback to cache)
  if (url.pathname.startsWith("/api/")) {
    e.respondWith(
      Promise.race([
        fetch(e.request).then((res) => {
          if (res.ok && res.status < 300) {
            caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
          }
          return res;
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 10000)),
      ]).catch(() =>
        caches.match(e.request).then((cached) => cached ?? Response.error())
      )
    );
    return;
  }

  // Cache-first for app shell pages (/udara, /sekolah, etc.)
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        // Only cache successful non-redirect responses
        if (res.ok && res.status < 300 && res.type !== "opaqueredirect") {
          caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
        }
        return res;
      });
    })
  );
});
