const CACHE_NAME = 'asca-event-shell-v3'

const APP_SHELL = [
  '/',
  '/ascalab-logo-official.webp',
  '/media/hero.webp',
  '/media/development.webp',
  '/media/devops.webp',
  '/media/testing.webp',
  '/media/insurance.webp',
  '/media/energy.webp',
  '/media/telecom.webp',
  '/media/myqabee.webp',
  '/media/portrait-real.webp',
  '/media/portrait-ai.png',
]

async function cacheBuildAssets() {
  const cache = await caches.open(CACHE_NAME)

  try {
    const response = await fetch('/', { cache: 'no-store' })
    if (!response.ok) return

    const html = await response.clone().text()
    await cache.put('/', response)

    const assetPaths = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
      .map((match) => match[1])
      .filter((path) => path.startsWith('/assets/'))

    await Promise.all(
      [...new Set(assetPaths)].map(async (path) => {
        const assetResponse = await fetch(path, { cache: 'no-store' })
        if (assetResponse.ok) await cache.put(path, assetResponse)
      }),
    )
  } catch {
    // If install happens without a working connection, normal runtime caching still applies.
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
      cacheBuildAssets(),
    ]),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
        ),
      ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put('/', copy))
          return response
        })
        .catch(() => caches.match('/')),
    )
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200) return response
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
          return response
        })
    }),
  )
})
