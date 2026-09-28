const PENDING_KEY = 'asca_pending_quiz_submissions'
const SYNCED_KEY = 'asca_synced_quiz_submissions'

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

export function getPendingSubmissions() {
  return read(PENDING_KEY)
}

export function queueQuizSubmission(payload) {
  const pending = read(PENDING_KEY)
  pending.push(payload)
  write(PENDING_KEY, pending)
  return pending.length
}

export function flushQuizSubmissions() {
  const pending = read(PENDING_KEY)
  if (!pending.length) return 0

  const synced = read(SYNCED_KEY)
  write(SYNCED_KEY, [...synced, ...pending])
  write(PENDING_KEY, [])
  return pending.length
}

export function persistQuizSubmission(payload) {
  const enriched = {
    ...payload,
    localId:
      payload.localId ||
      `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    storedAt: new Date().toISOString(),
  }

  if (typeof navigator !== 'undefined' && navigator.onLine) {
    const synced = read(SYNCED_KEY)
    write(SYNCED_KEY, [...synced, enriched])
    flushQuizSubmissions()
    return { status: 'synced', queuedCount: 0 }
  }

  const queuedCount = queueQuizSubmission(enriched)
  return { status: 'queued', queuedCount }
}
