// EduAir Service Worker — network-first for /api/*, cache-first for assets
const CACHE = "eduair-v1";
const PRECACHE = ["/", "/udara", "/sekolah", "/titik-api", "/posko"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Network-first for API routes (10 s timeout then stale cache)
  if (url.pathname.startsWith("/api/")) {
    e.respondWith(
      Promise.race([
        fetch(e.request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 10000)),
      ]).catch(() => caches.match(e.request).then((cached) => cached ?? Response.error()))
    );
    return;
  }

  // Cache-first for everything else
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((res) => {
        if (res.ok && e.request.method === "GET") {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
