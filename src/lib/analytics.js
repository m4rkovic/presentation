const ANALYTICS_KEY = 'asca_event_analytics'

export function getEventSource() {
  if (typeof window === 'undefined') return 'unknown'
  const value = new URLSearchParams(window.location.search).get('source')
  return value || 'direct'
}

export function trackEvent(name, payload = {}) {
  if (typeof window === 'undefined') return

  let events = []
  try {
    events = JSON.parse(window.localStorage.getItem(ANALYTICS_KEY) || '[]')
  } catch {
    events = []
  }

  events.push({
    name,
    payload,
    source: getEventSource(),
    at: new Date().toISOString(),
  })

  window.localStorage.setItem(ANALYTICS_KEY, JSON.stringify(events.slice(-500)))
}
