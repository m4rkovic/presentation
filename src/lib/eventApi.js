const API_URL = import.meta.env.VITE_EVENT_API_URL?.trim()

export function isEventApiConfigured() {
  return Boolean(API_URL)
}

export async function sendEvent(kind, payload) {
  if (!API_URL) {
    return { ok: false, reason: 'not-configured' }
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        kind,
        payload,
        sentAt: new Date().toISOString(),
      }),
      keepalive: true,
    })

    if (!response.ok) {
      return { ok: false, reason: `http-${response.status}` }
    }

    return { ok: true }
  } catch {
    return { ok: false, reason: 'network-error' }
  }
}
