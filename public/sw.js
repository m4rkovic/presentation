const CACHE_NAME = 'asca-event-shell-v7'

const APP_SHELL = [
  '/',
  '/ascalab-logo-orange-white.webp',
  '/arena-tehnologij-logo-white.png',
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

async function cacheIfAvailable(cache, url) {
  try {
    const response = await fetch(url, { cache: 'no-store' })
    if (response.ok) {
      await cache.put(url, response)
      return true
    }
  } catch {
    // Optional cache warm-up must never make service-worker installation fail.
  }

  return false
}

async function cacheBuildAssets(cache) {
  try {
    const response = await fetch('/', { cache: 'no-store' })
    if (!response.ok) return

    const html = await response.clone().text()
    await cache.put('/', response)

    const assetPaths = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
      .map((match) => match[1])
      .filter((path) => path.startsWith('/assets/'))

    await Promise.allSettled(
      [...new Set(assetPaths)].map((path) => cacheIfAvailable(cache, path)),
    )
  } catch {
    // Runtime caching will fill anything that was unavailable during install.
  }
}

async function primeCache() {
  const cache = await caches.open(CACHE_NAME)

  await Promise.allSettled(
    APP_SHELL.map((path) => cacheIfAvailable(cache, path)),
  )

  await cacheBuildAssets(cache)
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    primeCache().then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
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

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200) return response
        const copy = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
        return response
      })
    }),
  )
})
