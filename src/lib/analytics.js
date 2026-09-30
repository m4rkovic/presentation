import { isEventApiConfigured, sendEvent } from './eventApi.js'

const ANALYTICS_KEY = 'asca_event_analytics'

function readEvents() {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(window.localStorage.getItem(ANALYTICS_KEY) || '[]')
  } catch {
    return []
  }
}

function writeEvents(events) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ANALYTICS_KEY, JSON.stringify(events.slice(-500)))
}

export function getEventSource() {
  if (typeof window === 'undefined') return 'unknown'
  const value = new URLSearchParams(window.location.search).get('source')
  return value || 'direct'
}

export async function flushAnalytics() {
  if (!isEventApiConfigured()) return { sent: 0, remaining: readEvents().length }

  const queued = readEvents()
  if (!queued.length) return { sent: 0, remaining: 0 }

  const remaining = []
  let sent = 0

  for (const event of queued) {
    const result = await sendEvent('analytics', event)
    if (result.ok) sent += 1
    else remaining.push(event)
  }

  writeEvents(remaining)
  return { sent, remaining: remaining.length }
}

export function trackEvent(name, payload = {}) {
  if (typeof window === 'undefined') return

  const event = {
    name,
    payload,
    source: getEventSource(),
    at: new Date().toISOString(),
  }

  if (!isEventApiConfigured()) {
    writeEvents([...readEvents(), event])
    return
  }

  sendEvent('analytics', event).then((result) => {
    if (!result.ok) {
      writeEvents([...readEvents(), event])
    }
  })
}


export function getLocalAnalytics() {
  return readEvents()
}

export function exportLocalAnalyticsCsv() {
  if (typeof window === 'undefined') return false
  const events = readEvents()
  if (!events.length) return false

  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
  const rows = [
    ['name', 'source', 'at', 'payload'].join(','),
    ...events.map((event) =>
      [
        escape(event.name),
        escape(event.source),
        escape(event.at),
        escape(JSON.stringify(event.payload || {})),
      ].join(','),
    ),
  ]

  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `ascalab-analytics-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
  return true
}
