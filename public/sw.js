/* Cache-first for saved course files. Scope comes from this file's URL (GitHub Pages base path too). */
const BASE = self.location.pathname.replace(/\/sw\.js$/, '')
const CACHE_PREFIX = 'ladf-'

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim()
      try {
        const manifest = await fetch(`${BASE}/course-data/manifest.json`, { cache: 'no-store' }).then((res) => res.json())
        const keep = `${CACHE_PREFIX}${manifest.version}`
        const keys = await caches.keys()
        await Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== keep).map((key) => caches.delete(key)))
      } catch {
        // Offline activate: keep existing caches.
      }
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return

  event.respondWith(
    (async () => {
      const cached = await caches.match(event.request)
      const isCourseFile =
        url.pathname.includes('/course-data/') || url.pathname.includes('/rules-data/') || url.pathname.includes('/_next/static/')

      if (cached && (isCourseFile || event.request.mode !== 'navigate')) {
        if (event.request.mode === 'navigate') {
          fetch(event.request)
            .then((res) => {
              if (res.ok) caches.open(`${CACHE_PREFIX}runtime`).then((cache) => cache.put(event.request, res.clone()))
            })
            .catch(() => {})
        }
        return cached
      }

      try {
        const res = await fetch(event.request)
        if (res.ok) {
          const cache = await caches.open(`${CACHE_PREFIX}runtime`)
          cache.put(event.request, res.clone())
        }
        return res
      } catch (error) {
        if (cached) return cached
        if (event.request.mode === 'navigate') {
          const home = await caches.match(`${BASE}/`)
          if (home) return home
        }
        throw error
      }
    })(),
  )
})
