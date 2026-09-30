import { isEventApiConfigured, sendEvent } from './eventApi.js'

const LOCAL_LEADS_KEY = 'asca_local_student_leads'
const PENDING_LEADS_KEY = 'asca_pending_student_leads'

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
      `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    capturedAt: new Date().toISOString(),
  }
}

export async function persistLead(payload) {
  const lead = enrich(payload)
  write(LOCAL_LEADS_KEY, [...read(LOCAL_LEADS_KEY), lead].slice(-500))

  if (!isEventApiConfigured()) {
    return { status: 'local-only' }
  }

  const result = await sendEvent('lead', lead)
  if (result.ok) return { status: 'sent' }

  const pending = [...read(PENDING_LEADS_KEY), lead]
  write(PENDING_LEADS_KEY, pending)
  return { status: 'queued', queuedCount: pending.length }
}

export async function flushLeads() {
  if (!isEventApiConfigured()) {
    return { sent: 0, remaining: read(PENDING_LEADS_KEY).length }
  }

  const pending = read(PENDING_LEADS_KEY)
  if (!pending.length) return { sent: 0, remaining: 0 }

  const remaining = []
  let sent = 0

  for (const lead of pending) {
    const result = await sendEvent('lead', lead)
    if (result.ok) sent += 1
    else remaining.push(lead)
  }

  write(PENDING_LEADS_KEY, remaining)
  return { sent, remaining: remaining.length }
}

export function getLocalLeads() {
  return read(LOCAL_LEADS_KEY)
}

export function exportLocalLeadsCsv() {
  if (typeof window === 'undefined') return false

  const leads = getLocalLeads()
  if (!leads.length) return false

  const fields = ['name', 'email', 'studyField', 'interest', 'source', 'capturedAt']
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
  const csv = [
    fields.join(','),
    ...leads.map((lead) => fields.map((field) => escape(lead[field])).join(',')),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `ascalab-leads-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
  return true
}
