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
  isGoogleFormsConfigured,
  persistLead,
} from '../lib/leadCapture.js'
import { exportLocalQuizResultsCsv, getLocalResults } from '../lib/quizSession.js'

const techStack = [
  'Java',
  '.NET',
  'React',
  'TypeScript',
  'Python',
  'C / C++',
  'Embedded / Firmware',
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
      'We build, test and scale mission-critical systems for banking, energy and SaaS platforms across Europe — 100+ engineers, AWS/Azure and ISO-certified delivery.',
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
  {
    eyebrow: 'QA & in-house product',
    title: 'Testing we build for ourselves, too.',
    body:
      'Our QA teams work with automation and our own in-house testing product, myQAbee — built from the same delivery experience we bring to client projects.',
    image: '/media/myqabee.webp',
    items: ['QA Automation', 'myQAbee', 'Testing', 'Quality Engineering'],
    accent: 'orange',
  },
]

const offers = [
  {
    title: 'Internships',
    copy: 'Turn fundamentals into real project experience from our Rožna dolina office in Ljubljana — close to the faculties and close to the team you will learn from.',
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
  const [interestOtherEnabled, setInterestOtherEnabled] = useState(false)
  const [contactQuestion, setContactQuestion] = useState('')
  const [quizCharge, setQuizCharge] = useState(0)
  const quizChargeFrame = useRef(null)
  const quizChargeStartedAt = useRef(0)
  const quizChargeTriggered = useRef(false)

  const location = useLocation()
  const navigate = useNavigate()
  const backendConfigured = isEventApiConfigured() || isGoogleFormsConfigured()
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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setWorkSlide((current) => (current + 1) % workSlides.length)
    }, 7000)

    return () => window.clearTimeout(timer)
  }, [workSlide])

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
                src="/ascalab-logo-exact.webp"
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
                  <p className="welcome-lede max-w-2xl text-base leading-7 text-white/70 md:text-lg">
                    Software. Cloud. QA. Data. Real systems, real users and maybe your next internship.
                  </p>
                  <p className="welcome-buildline mt-3 font-mono text-xs text-white/46 md:text-sm">
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
                    : 'Lead submission is not connected on this deployment. Submitted details will stay on this device only.'}
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
                      ? 'Details submitted.'
                      : leadStatus === 'queued'
                        ? 'Saved. We will retry.'
                        : 'Saved on this device.'}
                  </h3>
                  <p className="mt-3 max-w-lg text-sm leading-6 text-white/58">
                    {leadStatus === 'sent'
                      ? 'Your contact details were submitted to the ASCALab registration form.'
                      : leadStatus === 'queued'
                        ? 'The connection failed, so this entry is queued locally and will retry when the browser comes back online.'
                        : 'Your details were saved on this event device for the ASCALab team.'}
                  </p>
                  <div className="funnel-actions-row mt-6 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setLeadStatus('idle')}
                      className="min-h-11 rounded-xl bg-asca-toxic px-5 font-semibold text-black transition hover:brightness-105"
                    >
                      Add another
                    </button>
                    <SectionArrow href="#quiz" label="Finish with the quiz" tone="green" />
                  </div>
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
                    const interestSelections = data.getAll('interest').map((value) => String(value))
                    const interestOther = String(data.get('interestOther') || '').trim()
                    const questionOther = String(data.get('questionOther') || '').trim()

                    const result = await persistLead({
                      eventSlug: eventConfig.slug,
                      source: getEventSource(),
                      name: String(data.get('name') || '').trim(),
                      email: String(data.get('email') || '').trim(),
                      phone: String(data.get('phone') || '').trim(),
                      studyField: String(data.get('studyField') || '').trim(),
                      interests: interestSelections,
                      interestOther,
                      contactQuestion: String(data.get('contactQuestion') || '').trim(),
                      questionOther,
                      consent: String(data.get('consent') || '').trim(),
                    })

                    setLocalLeadCount(getLocalLeads().length)
                    setLeadStatus(result.status)
                    form.reset()
                    setInterestOtherEnabled(false)
                    setContactQuestion('')
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
                      <input required name="name" autoComplete="name" className="field mt-2" placeholder="First and last name" />
                    </label>
                    <label>
                      <span className="text-sm font-semibold text-white/80">Email</span>
                      <input required type="email" name="email" autoComplete="email" className="field mt-2" placeholder="you@example.com" />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label>
                      <span className="text-sm font-semibold text-white/80">Phone number</span>
                      <input type="tel" name="phone" autoComplete="tel" className="field mt-2" placeholder="+381..." />
                    </label>
                    <label>
                      <span className="text-sm font-semibold text-white/80">School / faculty / field</span>
                      <input required name="studyField" className="field mt-2" placeholder="Where are you currently studying?" />
                    </label>
                  </div>

                  <fieldset className="rounded-2xl border border-white/10 bg-white/[.025] p-4 md:p-5">
                    <legend className="px-1 text-sm font-semibold text-white/80">Interested in</legend>
                    <div className="mt-2 grid gap-3 sm:grid-cols-2">
                      {eventConfig.careers.map((career) => (
                        <label key={career} className="flex items-center gap-3 text-sm text-white/72">
                          <input
                            type="checkbox"
                            name="interest"
                            value={career}
                            className="size-4 accent-[#f68523]"
                          />
                          <span>{career}</span>
                        </label>
                      ))}
                      <label className="flex items-center gap-3 text-sm text-white/72">
                        <input
                          type="checkbox"
                          name="interest"
                          value="Other"
                          className="size-4 accent-[#f68523]"
                          onChange={(event) => setInterestOtherEnabled(event.target.checked)}
                        />
                        <span>Other</span>
                      </label>
                    </div>

                    {interestOtherEnabled ? (
                      <input
                        name="interestOther"
                        className="field mt-4"
                        placeholder="Tell us what interests you"
                      />
                    ) : null}
                  </fieldset>

                  <fieldset className="rounded-2xl border border-white/10 bg-white/[.025] p-4 md:p-5">
                    <legend className="px-1 text-sm font-semibold text-white/80">
                      Do you have anything you want to ask us or inform us about?
                    </legend>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-3">
                      {['Yes', 'No', 'Other'].map((option) => (
                        <label key={option} className="flex items-center gap-2.5 text-sm text-white/72">
                          <input
                            type="radio"
                            name="contactQuestion"
                            value={option}
                            checked={contactQuestion === option}
                            onChange={(event) => setContactQuestion(event.target.value)}
                            className="size-4 accent-[#f68523]"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>

                    {contactQuestion === 'Other' ? (
                      <input
                        name="questionOther"
                        className="field mt-4"
                        placeholder="Write your note or question"
                      />
                    ) : null}
                  </fieldset>

                  <fieldset className="rounded-2xl border border-white/10 bg-white/[.025] p-4 md:p-5">
                    <legend className="px-1 text-sm font-semibold text-white/80">
                      I agree that ASCALab may use these details to contact me about internships, student opportunities or relevant roles.
                    </legend>
                    <div className="mt-2">
                      <label className="flex items-center gap-2.5 text-sm text-white/72">
                        <input required type="checkbox" name="consent" value="Yes" className="size-4 accent-[#f68523]" />
                        <span>Yes, I Agree</span>
                      </label>
                    </div>
                  </fieldset>

                  <p className="text-xs leading-5 text-white/42">
                    Submitted details are handled by ASCALab for recruitment follow-up and student opportunities.
                  </p>

                  <div className="funnel-actions-row flex items-center justify-between gap-4">
                    <button
                      disabled={leadStatus === 'sending'}
                      className="inline-flex min-h-12 w-fit items-center gap-2 rounded-xl bg-asca-toxic px-6 font-bold text-black transition hover:brightness-105 disabled:cursor-wait disabled:opacity-60"
                      type="submit"
                    >
                      {leadStatus === 'sending' ? 'Saving…' : 'Leave my details'} <ArrowRight size={17} />
                    </button>
                    <SectionArrow href="#quiz" label="Finish with the quiz" tone="green" />
                  </div>
                </form>
              )}
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

                <p className="quiz-embedded-copy mt-7 max-w-2xl text-lg leading-8 text-white/62 md:text-xl">
                  {eventConfig.studentIntro}
                </p>

                <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-white/56 md:text-base">
                  <span><b className="font-semibold text-white">{eventConfig.quiz.maxQuestions}</b> random questions</span>
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
                    className={`cyber-go-button relative isolate grid size-40 select-none place-items-center rounded-full outline-none md:size-44 ${quizCharge > 0 ? 'is-charging' : ''
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
                      <svg viewBox="0 0 100 120" fill="none" stroke="#daff67" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                        <path strokeDasharray="22.7 4.8 30.7 4.7 23.6 4.8 18.1 4.7 25.7 5.0" d="M53.6 72.0C53.6 71.7 53.8 70.9 53.6 70.4C53.5 69.9 53.2 69.4 52.8 69.1C52.4 68.8 51.8 68.6 51.3 68.6C50.8 68.5 50.4 68.7 50.0 69.0C49.5 69.2 49.1 69.8 48.8 70.2C48.5 70.6 48.3 71.0 48.2 71.6C48.1 72.2 48.1 73.1 48.2 73.8C48.2 74.4 48.4 74.9 48.7 75.4C48.9 75.9 49.3 76.4 49.7 76.8C50.1 77.2 50.6 77.6 51.1 77.8C51.6 78.0 52.2 78.1 52.7 78.1C53.3 78.1 53.9 78.0 54.5 77.7C55.0 77.5 55.7 77.0 56.1 76.6C56.5 76.2 56.7 76.0 57.0 75.5C57.3 74.9 57.7 73.9 57.9 73.3C58.1 72.7 58.1 72.4 58.1 71.7C58.1 71.0 58.0 69.8 57.9 69.1C57.8 68.4 57.6 68.0 57.4 67.4C57.1 66.9 56.8 66.4 56.5 65.9C56.2 65.5 55.8 65.0 55.3 64.7C54.9 64.3 54.4 64.0 54.0 63.8C53.5 63.5 52.9 63.3 52.4 63.2C51.9 63.1 51.3 63.1 50.8 63.2C50.2 63.2 49.6 63.3 49.1 63.5C48.6 63.8 48.0 64.0 47.5 64.4C47.0 64.7 46.6 65.0 46.1 65.7C45.6 66.3 44.9 67.3 44.5 68.3C44.1 69.3 43.8 70.4 43.7 71.5C43.6 72.7 43.6 73.9 43.8 75.0C44.0 76.2 44.4 77.3 44.9 78.4C45.4 79.4 46.1 80.3 46.9 81.1C47.7 81.9 48.8 82.6 49.6 83.0C50.4 83.4 50.8 83.5 51.7 83.5C52.6 83.6 53.9 83.6 54.9 83.3C56.0 83.0 57.0 82.4 58.0 81.7C58.9 81.0 59.9 79.8 60.5 78.9C61.1 78.0 61.3 77.6 61.7 76.5C62.0 75.4 62.4 73.5 62.6 72.3C62.7 71.1 62.6 70.3 62.5 69.4C62.4 68.4 62.2 67.4 61.9 66.5C61.6 65.5 61.4 64.8 60.8 63.8C60.2 62.8 59.0 61.2 58.2 60.4C57.4 59.6 56.7 59.3 55.9 58.9C55.2 58.4 54.3 58.1 53.4 57.9C52.6 57.7 51.7 57.6 50.8 57.7C49.9 57.7 49.0 57.9 48.2 58.2C47.3 58.5 46.6 58.7 45.6 59.4C44.7 60.1 43.3 61.3 42.4 62.5C41.5 63.8 40.6 65.3 40.1 66.9C39.6 68.5 39.3 71.1 39.1 72.0" />
                        <path strokeDasharray="16.6 4.5 16.5 5.0 26.8 4.2 31.7 5.2" d="M50.5 53.7C50.0 53.8 48.6 54.0 47.7 54.3C46.8 54.7 45.8 55.2 44.9 55.7C44.0 56.3 43.2 56.9 42.5 57.7C41.7 58.5 41.0 59.4 40.3 60.3C39.7 61.2 39.2 62.2 38.7 63.3C38.2 64.4 37.8 65.5 37.5 66.7C37.2 67.9 37.1 69.1 37.0 70.3C36.9 71.5 36.9 72.6 37.0 73.7C37.1 74.9 37.3 76.2 37.6 77.3C37.9 78.5 38.3 79.5 38.8 80.5C39.2 81.6 39.9 82.6 40.5 83.5C41.1 84.4 41.8 85.2 42.5 85.9C43.3 86.7 44.2 87.4 45.1 88.0C46.0 88.6 46.9 89.1 47.9 89.5C48.9 89.8 49.9 90.1 50.9 90.3C51.9 90.4 52.9 90.5 53.9 90.4C54.9 90.3 55.9 90.1 56.8 89.7C57.8 89.4 58.7 89.0 59.5 88.4C60.4 87.9 61.2 87.1 61.9 86.4C62.6 85.6 63.2 84.9 63.8 83.9C64.4 83.0 65.0 81.8 65.5 80.7C65.9 79.6 66.3 78.5 66.5 77.3C66.8 76.2 67.0 75.0 67.1 73.7C67.1 72.5 67.1 71.2 67.0 69.9C66.9 68.7 66.7 67.4 66.4 66.3C66.1 65.2 65.7 64.1 65.2 63.1C64.8 62.1 64.1 61.0 63.5 60.1C62.9 59.2 62.3 58.4 61.5 57.7C60.8 57.0 60.0 56.3 59.1 55.8C58.3 55.2 57.2 54.7 56.3 54.3C55.4 54.0 54.5 53.8 53.5 53.7C52.5 53.6 51.0 53.7 50.5 53.7" />
                        <path strokeDasharray="26.1 4.8 17.7 4.2 24.0 4.3 18.2 4.4 15.5 4.7 22.5 5.0" d="M49.7 48.3C49.1 48.4 47.1 48.8 45.9 49.3C44.7 49.8 43.4 50.5 42.3 51.2C41.2 52.0 40.2 52.9 39.2 53.9C38.2 54.9 37.3 56.1 36.5 57.3C35.8 58.5 35.0 59.9 34.5 61.3C33.9 62.7 33.4 64.1 33.1 65.7C32.7 67.3 32.5 69.2 32.4 70.7C32.4 72.2 32.5 73.3 32.7 74.7C32.9 76.2 33.3 77.9 33.8 79.3C34.2 80.8 34.8 82.2 35.5 83.5C36.2 84.9 37.1 86.2 38.0 87.3C38.9 88.5 40.0 89.6 41.1 90.6C42.2 91.6 43.4 92.5 44.7 93.2C46.0 93.9 47.4 94.5 48.7 95.0C50.0 95.4 51.4 95.7 52.7 95.8C54.0 96.0 55.4 95.9 56.7 95.7C58.0 95.6 59.2 95.2 60.3 94.8C61.5 94.3 62.5 93.7 63.5 92.9C64.5 92.2 65.5 91.3 66.3 90.3C67.2 89.2 68.0 88.0 68.6 86.7C69.3 85.5 69.9 84.0 70.3 82.5C70.8 81.1 71.1 79.4 71.4 77.9C71.6 76.4 71.7 75.2 71.6 73.5C71.6 71.8 71.5 69.4 71.3 67.7C71.1 66.0 70.8 64.9 70.3 63.5C69.9 62.1 69.3 60.8 68.7 59.5C68.1 58.2 67.3 57.0 66.5 55.9C65.7 54.8 64.7 53.7 63.7 52.8C62.7 51.9 61.6 51.1 60.5 50.5C59.4 49.8 58.3 49.3 57.1 48.9C55.9 48.5 54.7 48.3 53.5 48.2C52.3 48.0 50.3 48.2 49.7 48.3" />
                        <path strokeDasharray="23.8 4.8 23.5 4.9 22.8 4.5 32.0 5.2 29.3 4.9 20.4 4.4" d="M50.5 42.7C49.7 42.8 47.2 43.1 45.7 43.6C44.2 44.1 42.7 44.8 41.3 45.7C39.9 46.5 38.5 47.6 37.3 48.7C36.0 49.9 34.9 51.2 33.9 52.6C32.8 54.1 31.9 55.8 31.1 57.4C30.3 59.1 29.6 60.8 29.1 62.7C28.6 64.6 28.3 67.2 28.1 68.7C27.8 70.3 27.9 71.1 27.9 71.9C27.9 72.8 27.8 72.4 28.1 73.7C28.4 75.0 28.9 77.8 29.5 79.7C30.1 81.6 30.9 83.4 31.8 85.1C32.7 86.8 33.7 88.5 34.9 90.0C36.0 91.5 37.3 92.9 38.8 94.2C40.2 95.4 41.8 96.6 43.5 97.6C45.2 98.6 47.2 99.5 48.9 100.1C50.6 100.7 52.2 101.1 53.9 101.3C55.6 101.5 57.3 101.4 58.9 101.2C60.5 101.0 61.9 100.6 63.4 100.0C64.8 99.4 66.2 98.5 67.5 97.6C68.8 96.6 69.9 95.4 70.9 94.2C72.0 92.9 72.9 91.5 73.6 89.9C74.3 88.4 74.8 86.8 75.2 85.1C75.6 83.4 76.0 81.5 76.1 79.7C76.3 78.0 76.3 76.9 76.3 74.7C76.2 72.6 76.0 69.1 75.7 66.9C75.5 64.7 75.1 63.4 74.6 61.7C74.1 60.0 73.4 58.4 72.7 56.9C71.9 55.4 71.1 54.0 70.1 52.6C69.2 51.3 68.1 50.0 66.9 48.9C65.8 47.8 64.4 46.8 63.1 45.9C61.8 45.1 60.5 44.4 59.1 43.9C57.7 43.4 56.3 43.0 54.9 42.8C53.5 42.6 51.2 42.7 50.5 42.7" />
                        <path strokeDasharray="5.3 4.6 25.4 5.2 3.6 5.1 19.0 4.6 12.2 5.0 4.0 5.2 3.7 4.3 12.0 4.4 20.5 4.4 4.9 4.3 18.2 4.5 27.5 4.5" d="M49.5 37.2C48.6 37.4 45.8 37.9 44.1 38.5C42.4 39.1 40.7 39.9 39.1 40.9C37.5 41.8 36.0 43.0 34.6 44.3C33.2 45.6 31.9 47.1 30.7 48.8C29.5 50.4 28.4 52.2 27.5 54.1C26.5 56.0 25.7 58.0 25.1 60.1C24.5 62.2 24.0 64.6 23.7 66.7C23.5 68.8 23.3 70.5 23.5 72.7C23.8 74.9 24.5 77.6 25.3 79.9C26.0 82.3 27.0 84.5 28.1 86.7C29.3 88.9 30.7 91.2 32.2 93.2C33.7 95.1 35.4 96.9 37.1 98.5C38.8 100.0 41.1 101.6 42.5 102.6C43.9 103.5 44.5 103.7 45.5 104.2C46.5 104.7 47.5 105.1 48.5 105.4C49.5 105.8 50.5 106.1 51.5 106.3C52.5 106.5 53.5 106.7 54.5 106.8C55.5 106.9 56.5 106.9 57.5 106.9C58.5 106.9 59.2 106.9 60.5 106.6C61.9 106.3 64.4 105.6 65.7 105.1C67.0 104.6 67.5 104.3 68.3 103.8C69.1 103.3 69.5 103.1 70.6 102.2C71.6 101.2 73.4 99.7 74.6 98.2C75.8 96.6 76.9 94.8 77.8 93.0C78.7 91.2 79.3 89.3 79.8 87.3C80.3 85.4 80.7 83.1 80.9 81.1C81.1 79.2 81.1 78.4 81.0 75.7C80.8 73.1 80.5 68.1 80.1 65.3C79.7 62.5 79.2 61.1 78.6 59.1C77.9 57.1 77.2 55.3 76.2 53.5C75.3 51.7 74.3 50.1 73.1 48.5C71.9 46.9 70.5 45.4 69.1 44.1C67.7 42.8 66.3 41.7 64.7 40.8C63.2 39.8 61.6 39.1 59.9 38.5C58.2 37.9 56.4 37.5 54.7 37.3C53.0 37.1 50.4 37.2 49.5 37.2" />
                        <path strokeDasharray="26.0 4.6 25.5 4.3 27.8 4.5 24.1 4.5" d="M50.7 31.6C50.2 31.7 48.5 31.8 47.5 32.0C46.5 32.2 45.5 32.4 44.5 32.7C43.5 33.0 42.5 33.3 41.5 33.7C40.5 34.1 39.4 34.6 38.5 35.1C37.5 35.7 36.6 36.2 35.7 36.9C34.7 37.5 34.1 37.8 32.9 39.0C31.6 40.2 29.5 42.2 28.1 44.1C26.6 45.9 25.3 47.9 24.2 50.1C23.1 52.2 22.1 54.5 21.3 56.9C20.5 59.3 19.9 61.8 19.5 64.3C19.1 66.8 18.7 69.4 18.9 71.9C19.1 74.5 19.8 77.0 20.5 79.5C21.3 82.0 22.2 84.6 23.3 86.9C24.4 89.3 25.7 91.6 27.2 93.8C28.6 95.9 30.2 97.9 31.9 99.8C33.5 101.6 35.4 103.3 37.3 104.8C39.2 106.3 41.2 107.6 43.3 108.7C45.3 109.7 47.4 110.6 49.5 111.2C51.6 111.8 54.8 112.1 55.9 112.3" />
                        <path strokeDasharray="4.7 4.4 21.2 4.7 27.3 4.8" d="M85.6 77.3C85.4 75.4 85.1 69.0 84.7 65.9C84.3 62.8 83.7 60.5 83.3 58.7C82.8 56.9 82.5 56.1 82.0 54.8C81.5 53.6 80.9 52.3 80.3 51.1C79.7 49.9 79.1 48.8 78.4 47.7C77.7 46.6 77.0 45.5 76.2 44.5C75.4 43.4 74.5 42.3 73.5 41.3C72.6 40.4 71.7 39.5 70.7 38.7C69.8 37.9 68.8 37.2 67.7 36.5C66.7 35.8 65.6 35.2 64.5 34.6C63.4 34.1 62.3 33.6 61.1 33.2C60.0 32.8 58.9 32.5 57.7 32.2C56.6 32.0 55.5 31.8 54.3 31.7C53.1 31.6 51.3 31.7 50.7 31.6" />
                        <path strokeDasharray="25.7 4.4 26.4 4.4 14.2 5.1 14.3 5.1 21.3 4.3" d="M49.5 26.2C48.5 26.4 45.6 26.7 43.7 27.3C41.8 27.8 39.8 28.6 38.0 29.4C36.1 30.3 34.3 31.4 32.7 32.7C31.0 33.9 29.4 35.3 27.9 36.8C26.4 38.4 24.9 40.1 23.6 41.9C22.4 43.7 21.2 45.6 20.1 47.7C19.1 49.7 18.2 51.9 17.4 54.1C16.6 56.3 16.0 58.8 15.5 60.9C15.1 63.0 14.9 64.6 14.7 66.5C14.5 68.4 14.3 70.2 14.4 72.1C14.6 74.1 15.1 76.3 15.6 78.3C16.2 80.4 16.8 82.4 17.6 84.5C18.4 86.6 19.4 88.9 20.4 91.0C21.5 93.0 22.7 95.1 23.9 97.0C25.2 98.9 26.6 100.7 28.1 102.4C29.6 104.1 32.1 106.4 32.9 107.2" />
                        <path strokeDasharray="11.7 4.4 23.0 5.0 21.1 4.4" d="M87.3 56.3C86.9 55.2 85.8 51.6 84.8 49.5C83.8 47.4 82.7 45.4 81.4 43.5C80.2 41.6 78.8 39.8 77.4 38.1C75.9 36.5 74.2 34.9 72.5 33.6C70.9 32.2 69.0 31.0 67.2 30.1C65.4 29.1 63.5 28.2 61.5 27.6C59.6 27.0 57.5 26.6 55.5 26.3C53.5 26.1 50.5 26.2 49.5 26.2" />
                        <path strokeDasharray="3.7 4.8 25.5 4.5 26.6 4.2 15.6 4.3 14.0 4.8" d="M83.6 38.1C83.0 37.3 81.2 34.9 79.8 33.5C78.5 32.0 77.0 30.6 75.6 29.4C74.1 28.2 72.5 27.1 70.9 26.1C69.3 25.1 67.6 24.3 65.9 23.5C64.2 22.8 62.5 22.2 60.7 21.8C59.0 21.3 57.3 21.0 55.5 20.8C53.7 20.6 51.9 20.6 50.1 20.7C48.3 20.8 46.6 21.0 44.9 21.4C43.2 21.7 41.4 22.3 39.7 22.9C38.0 23.5 36.3 24.3 34.7 25.2C33.0 26.1 31.5 27.1 29.9 28.2C28.4 29.4 27.0 30.6 25.7 31.9C24.3 33.3 22.9 34.8 21.6 36.4C20.4 38.0 19.3 39.6 18.2 41.3C17.2 43.1 16.2 45.0 15.3 46.9C14.4 48.8 13.4 51.7 13.0 52.7" />
                        <path strokeDasharray="13.2 5.1 27.7 4.9 3.1 4.2 26.5 5.2" d="M75.6 22.9C74.4 22.3 70.5 19.9 68.7 18.9C67.0 18.0 66.4 17.9 65.1 17.5C63.9 17.0 62.6 16.6 61.3 16.3C60.1 16.0 58.8 15.7 57.5 15.5C56.2 15.4 55.0 15.2 53.7 15.2C52.4 15.1 51.2 15.1 49.9 15.2C48.6 15.3 47.4 15.4 46.1 15.6C44.8 15.8 43.5 16.1 42.3 16.4C41.0 16.7 39.9 17.1 38.7 17.5C37.5 18.0 36.3 18.5 35.1 19.0C33.9 19.6 32.6 20.3 31.5 21.0C30.3 21.7 29.2 22.4 28.1 23.2C27.0 24.0 26.4 24.4 24.8 25.8C23.3 27.2 20.0 30.8 19.0 31.9" />
                        <path strokeDasharray="11.4 4.7 23.4 5.2" d="M57.1 10.0C56.2 9.9 53.5 9.6 51.7 9.7C49.9 9.7 48.1 9.8 46.3 10.0C44.5 10.3 42.8 10.6 41.1 11.1C39.3 11.6 36.7 12.6 35.9 12.8" />
                      </svg>
                    </span>
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
