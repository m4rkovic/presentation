import { isEventApiConfigured, sendEvent } from './eventApi.js'

const PENDING_KEY = 'asca_pending_quiz_submissions'
const LOCAL_RESULTS_KEY = 'asca_local_quiz_results'

function read(key) {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(window.localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}

function write(key, value) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, JSON.stringify(value))
}

function enrich(payload) {
  return {
    ...payload,
    localId:
      payload.localId ||
      `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    storedAt: new Date().toISOString(),
  }
}

export function getPendingSubmissions() {
  return read(PENDING_KEY)
}

export function getLocalResults() {
  return read(LOCAL_RESULTS_KEY)
}

export async function flushQuizSubmissions() {
  if (!isEventApiConfigured()) {
    return { sent: 0, remaining: read(PENDING_KEY).length }
  }

  const pending = read(PENDING_KEY)
  if (!pending.length) return { sent: 0, remaining: 0 }

  const remaining = []
  let sent = 0

  for (const payload of pending) {
    const result = await sendEvent('quiz_result', payload)
    if (result.ok) sent += 1
    else remaining.push(payload)
  }

  write(PENDING_KEY, remaining)
  return { sent, remaining: remaining.length }
}

export async function persistQuizSubmission(payload) {
  const enriched = enrich(payload)
  write(LOCAL_RESULTS_KEY, [...read(LOCAL_RESULTS_KEY), enriched].slice(-250))

  if (!isEventApiConfigured()) {
    return { status: 'local-only', queuedCount: 0 }
  }

  const result = await sendEvent('quiz_result', enriched)

  if (result.ok) {
    return { status: 'sent', queuedCount: read(PENDING_KEY).length }
  }

  const pending = [...read(PENDING_KEY), enriched]
  write(PENDING_KEY, pending)
  return { status: 'queued', queuedCount: pending.length }
}
