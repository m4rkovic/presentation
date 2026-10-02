import { isEventApiConfigured, sendEvent } from './eventApi.js'

const LOCAL_LEADS_KEY = 'asca_local_student_leads'
const PENDING_LEADS_KEY = 'asca_pending_student_leads'

const GOOGLE_FORM_ACTION =
  'https://docs.google.com/forms/d/e/1FAIpQLSd5bpR6efmurCbW2StUNzMc-OIA8uWZ0CG10gz40EL2zndtxw/formResponse'

const GOOGLE_FORM_FIELDS = {
  name: 'entry.1781500597',
  email: 'entry.1640447617',
  phone: 'entry.297979220',
  studyField: 'entry.839497779',
  interests: 'entry.144118240',
  interestOther: 'entry.144118240.other_option_response',
  contactQuestion: 'entry.2040870261',
  contactQuestionOther: 'entry.2040870261.other_option_response',
  consent: 'entry.1432236062',
}

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

export function isGoogleFormsConfigured() {
  return Boolean(GOOGLE_FORM_ACTION)
}

async function submitGoogleForm(lead) {
  if (!GOOGLE_FORM_ACTION) {
    return { ok: false, reason: 'not-configured' }
  }

  const body = new URLSearchParams()
  body.set(GOOGLE_FORM_FIELDS.name, lead.name || '')
  body.set(GOOGLE_FORM_FIELDS.email, lead.email || '')
  body.set(GOOGLE_FORM_FIELDS.phone, lead.phone || '')
  body.set(GOOGLE_FORM_FIELDS.studyField, lead.studyField || '')

  for (const interest of lead.interests || []) {
    if (interest === 'Other') {
      body.append(GOOGLE_FORM_FIELDS.interests, '__other_option__')
    } else {
      body.append(GOOGLE_FORM_FIELDS.interests, interest)
    }
  }

  if ((lead.interests || []).includes('Other') && lead.interestOther) {
    body.set(GOOGLE_FORM_FIELDS.interestOther, lead.interestOther)
  }

  if (lead.contactQuestion === 'Other') {
    body.set(GOOGLE_FORM_FIELDS.contactQuestion, '__other_option__')
    if (lead.questionOther) {
      body.set(GOOGLE_FORM_FIELDS.contactQuestionOther, lead.questionOther)
    }
  } else if (lead.contactQuestion) {
    body.set(GOOGLE_FORM_FIELDS.contactQuestion, lead.contactQuestion)
  }

  if (lead.consent) {
    body.set(GOOGLE_FORM_FIELDS.consent, lead.consent)
  }

  try {
    await fetch(GOOGLE_FORM_ACTION, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body,
      keepalive: true,
    })

    return { ok: true }
  } catch {
    return { ok: false, reason: 'network-error' }
  }
}

export async function persistLead(payload) {
  const lead = enrich(payload)
  write(LOCAL_LEADS_KEY, [...read(LOCAL_LEADS_KEY), lead].slice(-500))

  const [googleResult, apiResult] = await Promise.all([
    submitGoogleForm(lead),
    isEventApiConfigured()
      ? sendEvent('lead', lead)
      : Promise.resolve({ ok: false, reason: 'not-configured' }),
  ])

  if (googleResult.ok || apiResult.ok) {
    return {
      status: 'sent',
      googleSubmitted: googleResult.ok,
      apiSubmitted: apiResult.ok,
    }
  }

  const pending = [...read(PENDING_LEADS_KEY), lead]
  write(PENDING_LEADS_KEY, pending)
  return { status: 'queued', queuedCount: pending.length }
}

export async function flushLeads() {
  const pending = read(PENDING_LEADS_KEY)
  if (!pending.length) return { sent: 0, remaining: 0 }

  const remaining = []
  let sent = 0

  for (const lead of pending) {
    const [googleResult, apiResult] = await Promise.all([
      submitGoogleForm(lead),
      isEventApiConfigured()
        ? sendEvent('lead', lead)
        : Promise.resolve({ ok: false, reason: 'not-configured' }),
    ])

    if (googleResult.ok || apiResult.ok) sent += 1
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

  const fields = [
    'name',
    'email',
    'phone',
    'studyField',
    'interests',
    'interestOther',
    'contactQuestion',
    'questionOther',
    'consent',
    'source',
    'capturedAt',
  ]
  const escape = (value) => {
    const normalized = Array.isArray(value) ? value.join(' | ') : value
    return `"${String(normalized ?? '').replaceAll('"', '""')}"`
  }
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
