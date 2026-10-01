import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { eventConfig } from '../data/eventConfig.js'
import {
  exportLocalAnalyticsCsv,
  flushAnalytics,
  getEventSource,
  getLocalAnalytics,
  trackEvent,
} from '../lib/analytics.js'
import { isEventApiConfigured } from '../lib/eventApi.js'
import {
  exportLocalLeadsCsv,
  flushLeads,
  getLocalLeads,
  persistLead,
} from '../lib/leadCapture.js'
import { exportLocalQuizResultsCsv, getLocalResults } from '../lib/quizSession.js'

const techStack = [
  'Java',
  '.NET',
  'React',
  'TypeScript',
  'Python',
  'SQL',
  'Azure',
  'AWS',
  'CI/CD',
  'QA Automation',
  'Data / AI',
]

const workSlides = [
  {
    eyebrow: 'What we build',
    title: 'Development that survives real users.',
    body:
      'Customer applications, internal platforms, integrations and data-heavy systems. The interesting part starts after the demo works.',
    image: '/media/development.webp',
    items: ['Backend', 'Frontend', 'Embedded / Firmware', 'Integrations'],
    accent: 'orange',
  },
  {
    eyebrow: 'Client environments',
    title: 'Serious systems. Different rules.',
    body:
      'Our work lives in industries where software is tied directly to the business and reliability is not a decorative requirement.',
    image: '/media/insurance.webp',
    items: ['Banking', 'Insurance', 'Energy', 'Telecom'],
    accent: 'orange',
  },
  {
    eyebrow: 'Engineering around delivery',
    title: 'Build it, ship it, prove it works.',
    body:
      'Development, DevOps and QA stay close together so delivery does not become a relay race made entirely of handovers and crossed fingers.',
    image: '/media/devops.webp',
    items: ['Development', 'DevOps', 'Testing', 'Automation'],
    accent: 'orange',
  },
]

const offers = [
  {
    title: 'Internships',
    copy: 'A place to turn fundamentals into real project experience with people who already ship production software.',
  },
  {
    title: 'Employment',
    copy: 'A path into engineering, QA, DevOps, data and adjacent roles when the fit is right.',
  },
  {
    title: 'Modern technology',
    copy: 'Work with current stacks, cloud platforms, automation and systems that have real users and real constraints.',
  },
  {
    title: 'Agile development',
    copy: 'Short feedback loops, visible work and teams close enough together to fix assumptions before production does it for them.',
  },
]

const reveal = {
  hidden: { opacity: 0, y: 34 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: .72, ease: [0.16, 1, 0.3, 1] },
  },
}

function SectionArrow({ href, label }) {
  const toneClass = 'border-asca-toxic/55 bg-asca-toxic text-black'

  return (
    <a href={href} className="section-orbit group inline-flex items-center gap-4">
      <span className="text-sm font-semibold text-white/72 transition group-hover:text-white">{label}</span>
      <span className={`grid size-14 place-items-center rounded-full border transition duration-300 group-hover:scale-105 md:size-16 ${toneClass}`}>
        <ArrowDown size={20} className="transition duration-300 group-hover:translate-y-1" />
      </span>
    </a>
  )
}

export default function HomePage() {
  const [workSlide, setWorkSlide] = useState(0)
  const [formStarted, setFormStarted] = useState(false)
  const [leadStatus, setLeadStatus] = useState('idle')
  const [localLeadCount, setLocalLeadCount] = useState(() => getLocalLeads().length)
  const [quizCharge, setQuizCharge] = useState(0)
  const quizChargeFrame = useRef(null)
  const quizChargeStartedAt = useRef(0)
  const quizChargeTriggered = useRef(false)

  const location = useLocation()
  const navigate = useNavigate()
  const backendConfigured = isEventApiConfigured()
  const isStaffView = new URLSearchParams(location.search).get('staff') === '1'

  useEffect(() => {
    trackEvent('page_view', { eventSlug: eventConfig.slug })

    const flush = async () => {
      const [leadResult, analyticsResult] = await Promise.all([
        flushLeads(),
        flushAnalytics(),
      ])

      if (leadResult.sent > 0) {
        trackEvent('queued_leads_sent', { count: leadResult.sent })
      }

      if (analyticsResult.sent > 0) {
        trackEvent('queued_analytics_sent', { count: analyticsResult.sent })
      }
    }

    flush()
    window.addEventListener('online', flush)
    return () => window.removeEventListener('online', flush)
  }, [])

  useEffect(() => {
    return () => {
      if (quizChargeFrame.current) {
        window.cancelAnimationFrame(quizChargeFrame.current)
      }
    }
  }, [])

  const launchQuiz = () => {
    if (quizChargeTriggered.current) return
    quizChargeTriggered.current = true
    setQuizCharge(1)
    trackEvent('quiz_charge_completed', { eventSlug: eventConfig.slug, holdMs: 3000 })

    const params = new URLSearchParams(location.search)
    params.set('autostart', '1')
    navigate({ pathname: '/quiz', search: `?${params.toString()}` })
  }

  const beginQuizCharge = () => {
    if (quizChargeFrame.current || quizChargeTriggered.current) return

    quizChargeStartedAt.current = performance.now()
    setQuizCharge(0)

    const tick = (now) => {
      const progress = Math.min(1, (now - quizChargeStartedAt.current) / 3000)
      setQuizCharge(progress)

      if (progress >= 1) {
        quizChargeFrame.current = null
        launchQuiz()
        return
      }

      quizChargeFrame.current = window.requestAnimationFrame(tick)
    }

    quizChargeFrame.current = window.requestAnimationFrame(tick)
  }

  const cancelQuizCharge = () => {
    if (quizChargeTriggered.current) return
    if (quizChargeFrame.current) {
      window.cancelAnimationFrame(quizChargeFrame.current)
      quizChargeFrame.current = null
    }
    setQuizCharge(0)
  }

  const activeWork = workSlides[workSlide]

  const goWork = (direction) => {
    setWorkSlide((current) => {
      const next = current + direction
      if (next < 0) return workSlides.length - 1
      if (next >= workSlides.length) return 0
      return next
    })
  }

  return (
    <div className="event-site bg-asca-bg text-white">
      <main>
        <section id="welcome" className="event-section welcome-section relative overflow-hidden">
          <img
            src="/media/hero.webp"
            alt=""
            width="1600"
            height="1000"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,12,.16),rgba(7,9,12,.58)_58%,#07090c_100%)]" />
          <div className="pointer-events-none absolute -bottom-36 right-[8%] size-[32rem] rounded-full bg-asca-toxic/10 blur-[90px]" />

          <div className="event-shell relative z-10 flex h-full flex-col">
            <header className="welcome-header flex items-center justify-between gap-6">
              <img
                src="/arena-tehnologij-logo-white.png"
                alt="Arena Tehnologij"
                className="hidden h-10 w-auto object-contain sm:block md:h-12 lg:h-14"
              />

              <img
                src="/ascalab-logo-header-transparent.webp"
                alt="ASCALab"
                className="welcome-logo-official h-11 w-auto drop-shadow-[0_2px_12px_rgba(0,0,0,.32)] md:h-13"
              />
            </header>

            <div className="welcome-content mt-auto max-w-5xl pb-3">
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 text-xs font-bold uppercase tracking-[.17em] text-asca-toxic md:text-sm"
              >
                Students · internships · real engineering
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .9, ease: [0.16, 1, 0.3, 1] }}
                className="welcome-title font-semibold leading-[.9] tracking-[-.055em]"
              >
                Build things that<br />
                <span className="text-asca-orange">actually matter.</span>
              </motion.h1>

              <div className="welcome-bottom mt-6 flex items-end justify-between gap-8">
                <div>
                  <p className="max-w-2xl text-base leading-7 text-white/70 md:text-lg">
                    Software. Cloud. QA. Data. Real systems, real users and maybe your next internship.
                  </p>
                  <p className="mt-3 font-mono text-xs text-white/46 md:text-sm">
                    build / break / learn / ship
                  </p>
                </div>

                <SectionArrow href="#work" label="Explore ASCALab" tone="green" />
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="event-section work-section">
          <div className="event-shell flex h-full flex-col">
            <div className="flex items-start justify-between gap-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[.16em] text-asca-orange">What we do</p>
                <h2 className="mt-3 max-w-3xl text-4xl font-semibold leading-[.96] tracking-[-.045em] md:text-5xl">
                  Technology, clients and the work between them.
                </h2>
              </div>

              <div className="hidden items-center gap-2 md:flex">
                {workSlides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    onClick={() => setWorkSlide(index)}
                    aria-label={`Show ${slide.eyebrow}`}
                    aria-current={index === workSlide ? 'true' : undefined}
                    className={`size-3 rounded-full transition ${index === workSlide ? 'bg-asca-orange' : 'bg-white/20'}`}
                  />
                ))}
              </div>
            </div>

            <div
              className="work-carousel relative mt-6 min-h-0 flex-1 overflow-hidden"
              role="region"
              aria-roledescription="carousel"
              aria-label="ASCALab work overview"
              aria-live="polite"
              aria-atomic="true"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.article
                  key={activeWork.title}
                  initial={{ opacity: 0, x: 52 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -52 }}
                  transition={{ duration: .42, ease: [0.16, 1, 0.3, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.12}
                  onDragEnd={(_, info) => {
                    if (info.offset.x <= -60) goWork(1)
                    if (info.offset.x >= 60) goWork(-1)
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${workSlide + 1} of ${workSlides.length}: ${activeWork.eyebrow}`}
                  className="grid h-full cursor-grab overflow-hidden rounded-[28px] bg-[#0e1217] active:cursor-grabbing md:grid-cols-[1.05fr_.95fr]"
                >
                  <div className="relative min-h-[14rem] overflow-hidden md:min-h-0">
                    <img
                      src={activeWork.image}
                      alt=""
                      width="1400"
                      height="900"
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                  </div>

                  <div className="flex min-h-0 flex-col justify-center p-6 md:p-8 lg:p-10">
                    <p className="text-sm font-semibold uppercase tracking-[.16em] text-asca-orange">
                      {activeWork.eyebrow}
                    </p>
                    <h3 className="mt-3 text-3xl font-semibold leading-[.98] tracking-[-.045em] md:text-4xl lg:text-5xl">
                      {activeWork.title}
                    </h3>
                    <p className="mt-5 max-w-xl text-base leading-7 text-white/62 md:text-lg">
                      {activeWork.body}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2.5">
                      {activeWork.items.map((item) => (
                        <span key={item} className="rounded-full border border-white/12 px-3.5 py-2 text-sm text-white/76">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>

              <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 md:px-4">
                <button
                  type="button"
                  onClick={() => goWork(-1)}
                  className="pointer-events-auto grid size-11 place-items-center rounded-full bg-black/65 text-white backdrop-blur transition hover:bg-asca-toxic hover:text-black"
                  aria-label="Previous slide"
                >
                  <ArrowLeft size={19} />
                </button>
                <button
                  type="button"
                  onClick={() => goWork(1)}
                  className="pointer-events-auto grid size-11 place-items-center rounded-full bg-black/65 text-white backdrop-blur transition hover:bg-asca-toxic hover:text-black"
                  aria-label="Next slide"
                >
                  <ArrowRight size={19} />
                </button>
              </div>
            </div>

            <div className="tech-marquee mt-5 border-y border-white/8 py-3">
              <div className="tech-marquee-track">
                {[...techStack, ...techStack].map((item, index) => (
                  <span key={`${item}-${index}`} className="tech-marquee-item">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <SectionArrow href="#offer" label="What we offer" tone="green" />
            </div>
          </div>
        </section>

        <section id="offer" className="event-section offer-section">
          <div className="event-shell flex h-full flex-col">
            <div className="grid flex-1 items-center gap-8 lg:grid-cols-[.82fr_1.18fr]">
              <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .35 }}>
                <p className="text-sm font-semibold uppercase tracking-[.16em] text-asca-orange">What we offer</p>
                <h2 className="mt-4 max-w-2xl text-5xl font-semibold leading-[.94] tracking-[-.05em] md:text-6xl">
                  Start somewhere real.
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">
                  Practice, employment and the chance to learn how modern software is actually built with a team around you.
                </p>
              </motion.div>

              <div className="offer-grid grid gap-3 sm:grid-cols-2">
                {offers.map((offer, index) => (
                  <motion.article
                    key={offer.title}
                    variants={reveal}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: .3 }}
                    className={`offer-card p-5 md:p-6 ${index === 0 || index === 3 ? 'bg-asca-orange text-black' : 'bg-white/[.035] text-white'}`}
                  >
                    <h3 className="text-xl font-semibold tracking-[-.025em] md:text-2xl">{offer.title}</h3>
                    <p
                      className={`mt-3 text-sm leading-6 md:text-base ${index === 0 || index === 3 ? 'text-black/65' : 'text-white/56'}`}
                    >
                      {offer.copy}
                    </p>
                  </motion.article>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <SectionArrow href="#contact" label="Leave your details" />
            </div>
          </div>
        </section>

        <section id="contact" className="event-section funnel-section">
          <div className="event-shell grid h-full items-center gap-8 lg:grid-cols-[.72fr_1.28fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.16em] text-asca-orange">Stay in touch</p>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-[.96] tracking-[-.045em] md:text-5xl">
                Interested in building with us?
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-white/58 md:text-lg">
                Leave your contact details and tell us what kind of work you are curious about.
              </p>

              {!backendConfigured ? (
                <p className="mt-5 max-w-md rounded-xl border border-amber-300/20 bg-amber-300/8 p-3.5 text-xs leading-5 text-amber-100/80">
                  {isStaffView
                    ? 'Staff note: central event storage is not connected. Export local data before clearing browser storage.'
                    : 'Central event storage is not connected on this deployment. Submitted details will stay on this device only.'}
                </p>
              ) : null}

              {isStaffView ? (
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold">
                  <button type="button" onClick={() => exportLocalLeadsCsv()} className="text-asca-orange underline underline-offset-4">
                    Export {localLeadCount} leads
                  </button>
                  <button type="button" onClick={() => exportLocalQuizResultsCsv()} className="text-white/70 underline underline-offset-4">
                    Export {getLocalResults().length} quiz results
                  </button>
                  <button type="button" onClick={() => exportLocalAnalyticsCsv()} className="text-white/70 underline underline-offset-4">
                    Export {getLocalAnalytics().length} analytics events
                  </button>
                </div>
              ) : null}
            </div>

            <div>
              {leadStatus === 'sent' || leadStatus === 'queued' || leadStatus === 'local-only' ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[24px] border border-white/10 bg-white/[.025] p-7"
                >
                  <div className="grid size-14 place-items-center rounded-full bg-asca-toxic/10 text-asca-toxic">
                    <Check size={28} strokeWidth={2.2} />
                  </div>
                  <h3 className="mt-5 text-3xl font-semibold tracking-[-.04em]">
                    {leadStatus === 'sent'
                      ? 'Details sent.'
                      : leadStatus === 'queued'
                        ? 'Saved. We will retry.'
                        : 'Saved on this device.'}
                  </h3>
                  <p className="mt-3 max-w-lg text-sm leading-6 text-white/58">
                    {leadStatus === 'sent'
                      ? 'Your contact details reached the event backend.'
                      : leadStatus === 'queued'
                        ? 'The connection failed, so this entry is queued locally and will retry when the browser comes back online.'
                        : 'Your details were saved on this event device for the ASCALab team.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setLeadStatus('idle')}
                    className="mt-6 min-h-11 rounded-xl bg-asca-toxic px-5 font-semibold text-black transition hover:brightness-105"
                  >
                    Add another
                  </button>
                </motion.div>
              ) : (
                <form
                  className="funnel-form grid gap-4"
                  onFocusCapture={() => {
                    if (!formStarted) {
                      setFormStarted(true)
                      trackEvent('lead_form_started', { eventSlug: eventConfig.slug })
                    }
                  }}
                  onSubmit={async (event) => {
                    event.preventDefault()
                    const form = event.currentTarget
                    const data = new FormData(form)

                    if (String(data.get('companyWebsite') || '').trim()) {
                      trackEvent('lead_form_bot_rejected', { eventSlug: eventConfig.slug })
                      form.reset()
                      return
                    }

                    setLeadStatus('sending')
                    const result = await persistLead({
                      eventSlug: eventConfig.slug,
                      source: getEventSource(),
                      name: String(data.get('name') || '').trim(),
                      email: String(data.get('email') || '').trim(),
                      studyField: String(data.get('studyField') || '').trim(),
                      interest: String(data.get('interest') || '').trim(),
                      consent: data.get('consent') === 'yes',
                    })

                    setLocalLeadCount(getLocalLeads().length)
                    setLeadStatus(result.status)
                    form.reset()
                    trackEvent('lead_form_completed', {
                      eventSlug: eventConfig.slug,
                      deliveryStatus: result.status,
                    })
                  }}
                >
                  <label className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                    Company website
                    <input
                      type="text"
                      name="companyWebsite"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label>
                      <span className="text-sm font-semibold text-white/80">Name</span>
                      <input required name="name" autoComplete="name" className="field mt-2" placeholder="Your name" />
                    </label>
                    <label>
                      <span className="text-sm font-semibold text-white/80">Email</span>
                      <input required type="email" name="email" autoComplete="email" className="field mt-2" placeholder="you@example.com" />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label>
                      <span className="text-sm font-semibold text-white/80">School / faculty / field</span>
                      <input required name="studyField" className="field mt-2" placeholder="Computer Science, ETF..." />
                    </label>
                    <label>
                      <span className="text-sm font-semibold text-white/80">Interested in</span>
                      <select required name="interest" className="field mt-2">
                        <option value="">Choose an area</option>
                        {eventConfig.careers.map((career) => (
                          <option key={career} value={career}>{career}</option>
                        ))}
                        <option value="Not sure yet">Not sure yet</option>
                      </select>
                    </label>
                  </div>

                  <label className="flex items-start gap-3 text-xs leading-5 text-white/58 md:text-sm">
                    <input required type="checkbox" name="consent" value="yes" className="mt-1 size-4 accent-[#f68523]" />
                    <span>
                      I agree that ASCALab may use these details to contact me about internships, student opportunities or relevant roles.
                    </span>
                  </label>

                  <p className="text-xs leading-5 text-white/42">
                    Submitted details are handled by ASCALab for recruitment follow-up. Ask the ASCALab team at the booth for the applicable storage and retention details.
                  </p>

                  <button
                    disabled={leadStatus === 'sending'}
                    className="inline-flex min-h-12 w-fit items-center gap-2 rounded-xl bg-asca-toxic px-6 font-bold text-black transition hover:brightness-105 disabled:cursor-wait disabled:opacity-60"
                    type="submit"
                  >
                    {leadStatus === 'sending' ? 'Saving…' : 'Leave my details'} <ArrowRight size={17} />
                  </button>
                </form>
              )}

              <div className="mt-5 flex justify-end">
                <SectionArrow href="#quiz" label="Finish with the quiz" tone="green" />
              </div>
            </div>
          </div>
        </section>

        <section id="quiz" className="event-section quiz-final-section">
          <div className="event-shell flex h-full flex-col justify-center">
            <div className="quiz-embedded-grid grid items-stretch gap-10 lg:grid-cols-[1.35fr_.65fr]">
              <motion.div
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: .3 }}
                className="flex flex-col justify-center"
              >
                <p className="text-sm font-semibold text-asca-orange md:text-base">
                  ASCALab @ Arena Tehnologij
                </p>

                <h2 className="quiz-embedded-title mt-5 max-w-4xl text-[clamp(3.7rem,7vw,7rem)] font-semibold leading-[.9] tracking-[-.06em]">
                  Test your<br />
                  <span className="text-asca-orange">tech instincts.</span>
                </h2>

                <p className="mt-7 max-w-2xl text-lg leading-8 text-white/62 md:text-xl">
                  {eventConfig.studentIntro}
                </p>

                <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-white/56 md:text-base">
                  <span><b className="font-semibold text-white">{eventConfig.quiz.minQuestions}–{eventConfig.quiz.maxQuestions}</b> random questions</span>
                  <span className="text-asca-orange">•</span>
                  <span><b className="font-semibold text-white">1</b> AI image challenge</span>
                  <span className="text-asca-orange">•</span>
                  <span><b className="font-semibold text-white">Speed</b> matters</span>
                </div>

                <p className="mt-5 text-sm text-white/44">
                  Answer order changes every run. On-screen prize status is provisional.
                </p>
              </motion.div>

              <motion.div
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: .3 }}
                className="quiz-launch-panel flex min-h-[430px] flex-col justify-between bg-asca-orange p-7 text-black md:p-9"
              >
                <div>
                  <p className="text-sm font-semibold">THE QUICK VERSION</p>
                  <h3 className="mt-4 text-4xl font-semibold leading-[.98] tracking-[-.045em] md:text-5xl">
                    Got a minute?<br />Make it count.
                  </h3>
                  <p className="mt-5 max-w-sm text-base leading-7 text-black/68">
                    No sign-up before the quiz. Pick answers fast, do not trust your friend blindly, and see where you land.
                  </p>
                </div>

                <div className="mt-8 flex flex-col items-center">
                  <button
                    type="button"
                    className={`cyber-go-button relative isolate grid size-40 select-none place-items-center rounded-full outline-none md:size-44 ${
                      quizCharge > 0 ? 'is-charging' : ''
                    }`}
                    style={{ '--charge': quizCharge }}
                    aria-label="Press and hold to initialize the quiz"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={Math.round(quizCharge * 100)}
                    onPointerDown={(event) => {
                      event.preventDefault()
                      beginQuizCharge()
                    }}
                    onPointerUp={cancelQuizCharge}
                    onPointerCancel={cancelQuizCharge}
                    onPointerLeave={cancelQuizCharge}
                    onKeyDown={(event) => {
                      if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) {
                        event.preventDefault()
                        beginQuizCharge()
                      }
                    }}
                    onKeyUp={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        cancelQuizCharge()
                      }
                    }}
                    onContextMenu={(event) => event.preventDefault()}
                  >
                    <span
                      className="cyber-go-charge-ring"
                      style={{
                        background: `conic-gradient(#c7ff00 ${quizCharge * 360}deg, rgba(0,0,0,.16) ${quizCharge * 360}deg)`,
                      }}
                    />
                    <span className="cyber-go-halo halo-one" />
                    <span className="cyber-go-halo halo-two" />
                    <span className="cyber-go-shell" />
                    <span className="cyber-go-core" />

                    <span className="cyber-go-root root-n" />
                    <span className="cyber-go-root root-ne" />
                    <span className="cyber-go-root root-e" />
                    <span className="cyber-go-root root-se" />
                    <span className="cyber-go-root root-s" />
                    <span className="cyber-go-root root-sw" />
                    <span className="cyber-go-root root-w" />
                    <span className="cyber-go-root root-nw" />

                    <span className="cyber-go-fingerprint" aria-hidden="true">
                      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M32 8C19.85 8 10 17.85 10 30v4" />
                        <path d="M32 14C23.16 14 16 21.16 16 30v8" />
                        <path d="M32 20C26.48 20 22 24.48 22 30v10" />
                        <path d="M32 26c-2.21 0-4 1.79-4 4v11" />
                        <path d="M36 30v10.5c0 5.7-1.45 10.8-4 15" />
                        <path d="M22 45c0 3.6-.8 6.8-2.2 9.5" />
                        <path d="M41 30v10c0 7.2-2.1 13.2-5.7 18" />
                        <path d="M46 30v8.5c0 6.1-.8 11-2.3 15.2" />
                        <path d="M51 30.5v5.5c0 4.4-.45 8.2-1.45 11.6" />
                        <path d="M11.5 36.5c0 4.2.65 8 1.9 11.4" />
                        <path d="M16.5 39c0 5.1 1 9.5 2.9 13.1" />
                        <path d="M27.7 14.6A17 17 0 0 1 49 30" />
                      </svg>
                    </span>

                    <span className="cyber-go-scan" />
                  </button>

                  <p className="cyber-go-status">
                    <span className="cyber-go-status-dot" />
                    Press and hold to initialize
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="quiz-reward-strip mt-8 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-3">
              <div>
                <div className="text-sm font-semibold text-asca-orange">Perfect + fast</div>
                <p className="mt-1 text-sm text-white/48">Premium reward contender.</p>
              </div>
              <div>
                <div className="text-sm font-semibold text-asca-orange">Perfect</div>
                <p className="mt-1 text-sm text-white/48">Secondary reward contender.</p>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Finish it</div>
                <p className="mt-1 text-sm text-white/48">Participation track.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
