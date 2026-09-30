import { useEffect, useState } from 'react'
import { ArrowDown, ArrowRight, Check } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { eventConfig } from '../data/eventConfig.js'
import { exportLocalAnalyticsCsv, flushAnalytics, getEventSource, getLocalAnalytics, trackEvent } from '../lib/analytics.js'
import { isEventApiConfigured } from '../lib/eventApi.js'
import {
  exportLocalLeadsCsv,
  flushLeads,
  getLocalLeads,
  persistLead,
} from '../lib/leadCapture.js'
import { exportLocalQuizResultsCsv, getLocalResults } from '../lib/quizSession.js'

const reveal = {
  hidden: { opacity: 0, y: 56 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: .85, ease: [0.16, 1, 0.3, 1] },
  },
}

const revealLeft = {
  hidden: { opacity: 0, x: -84, rotateZ: -.6 },
  show: {
    opacity: 1,
    x: 0,
    rotateZ: 0,
    transition: { duration: .9, ease: [0.16, 1, 0.3, 1] },
  },
}

const revealRight = {
  hidden: { opacity: 0, x: 84, rotateZ: .6 },
  show: {
    opacity: 1,
    x: 0,
    rotateZ: 0,
    transition: { duration: .9, ease: [0.16, 1, 0.3, 1] },
  },
}

const imageReveal = {
  hidden: { opacity: 0, scale: 1.08, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1] },
  },
}

const serviceStories = [
  {
    title: 'Development',
    headline: 'You build it. People actually use it.',
    image: '/media/development.webp',
    copy: 'Customer apps, internal platforms, integrations and data-heavy systems. The interesting part is not making a demo work once. It is making software survive real users, real rules and years of change.',
    detail: 'You learn how product thinking, architecture and implementation connect when the thing on your screen becomes part of somebody else\'s working day.',
  },
  {
    title: 'DevOps',
    headline: 'Code is useless if nobody can ship it.',
    image: '/media/devops.webp',
    copy: 'Cloud, deployment pipelines, infrastructure, monitoring and releases. DevOps is the part that turns “works on my machine” into something the rest of the world can actually run.',
    detail: 'The goal is simple: make delivery repeatable, observable and boring enough that Friday afternoon stops being a horror genre.',
  },
  {
    title: 'Testing',
    headline: 'Find the bug before the customer does.',
    image: '/media/testing.webp',
    copy: 'Quality engineering mixes curiosity, systems thinking, automation and a slightly suspicious attitude toward anything claiming to be “done”.',
    detail: 'That experience also became myQAbee, ASCALab\'s codeless QA automation product for repeatable testing across environments and devices.',
  },
]

const techStack = ['Java', '.NET', 'React', 'TypeScript', 'Python', 'SQL', 'Azure', 'AWS', 'CI/CD', 'QA Automation', 'Data / AI']

const serviceNextTargets = ['#service-devops', '#service-testing', '#career-paths']

const industryStories = [
  {
    title: 'Banking',
    headline: 'Millions of transactions. Zero appetite for guessing.',
    image: '/media/hero.webp',
    copy: 'Core platforms, reporting, customer applications and integrations. When money moves, “close enough” is not an engineering strategy.',
  },
  {
    title: 'Insurance',
    headline: 'One small rule can change an entire outcome.',
    image: '/media/insurance.webp',
    copy: 'Claims, policies, billing and risk logic turn business rules into software. Tiny details can have very non-tiny consequences.',
  },
  {
    title: 'Energy',
    headline: 'A lot of data. All the time. It still has to add up.',
    image: '/media/energy.webp',
    copy: 'Metering, billing and operational data push systems hard. Reliability matters because the real world does not pause while your service restarts.',
  },
  {
    title: 'Telecom',
    headline: 'People notice very quickly when the connection stops.',
    image: '/media/telecom.webp',
    copy: 'Subscriber systems, self-service platforms and integrations live under constant change. The challenge is shipping that change without turning production into an experiment.',
  },
]

function SectionJump({ href, label, variant = 'line' }) {
  const family =
    variant === 'orb'
      ? 'orb'
      : variant === 'ghost'
        ? 'outline'
        : variant === 'square' || variant === 'toxic'
          ? 'filled'
          : 'line'

  const classes = {
    line: 'group inline-flex items-center gap-3 text-sm font-semibold text-white/72 transition hover:text-white',
    orb: 'group inline-flex size-14 items-center justify-center rounded-full border border-white/22 bg-white/[.04] text-white transition hover:border-asca-toxic/70 hover:text-asca-toxic',
    outline: 'group inline-flex min-h-12 items-center gap-3 rounded-full border border-white/18 px-5 text-sm font-semibold text-white/78 transition hover:border-white/38 hover:bg-white/[.04] hover:text-white',
    filled: 'group inline-flex min-h-12 items-center gap-3 rounded-xl bg-asca-toxic px-5 text-sm font-bold text-black transition hover:translate-y-[-1px]',
  }

  return (
    <a href={href} className={classes[family]}>
      {family === 'line' ? <span className="h-px w-8 bg-asca-toxic/70 transition group-hover:w-11" /> : null}
      {family === 'orb' ? <ArrowDown size={20} /> : <span>{label}</span>}
      {family === 'orb' ? null : <ArrowDown size={16} className="transition group-hover:translate-y-1" />}
    </a>
  )
}

export default function HomePage() {
  const [formStarted, setFormStarted] = useState(false)
  const [leadStatus, setLeadStatus] = useState('idle')
  const [localLeadCount, setLocalLeadCount] = useState(() => getLocalLeads().length)
  const [activeIndustry, setActiveIndustry] = useState(0)
  const location = useLocation()
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

  return (
    <div className="min-h-screen bg-asca-bg text-white">
      <main>
        <section className="relative min-h-[100svh] overflow-hidden">
          <img
            src="/media/hero.webp"
            alt=""
            width="1600"
            height="1000"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,12,.18),rgba(7,9,12,.64)_60%,#07090c_100%)]" />
          <div className="pointer-events-none absolute -bottom-40 right-[8%] size-[38rem] rounded-full bg-asca-toxic/10 blur-[110px]" />

          <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1500px] flex-col px-6 py-8 md:px-10 md:py-10 lg:px-14">
            <div className="flex items-center justify-between gap-6">
              <span className="hidden items-center gap-3 text-base font-semibold text-white/82 sm:flex md:text-lg">
                <span className="size-2.5 rounded-full bg-asca-toxic shadow-[0_0_20px_rgba(199,255,0,.80)]" />
                {eventConfig.campaignTitle}
              </span>
              <div className="relative isolate pr-1">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-x-8 -inset-y-5 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.72)_0%,rgba(255,255,255,.34)_38%,rgba(255,255,255,.10)_58%,transparent_76%)] blur-xl"
                />
                <img
                  src="/ascalab-logo-official.webp"
                  alt="ASCALab"
                  className="h-12 w-auto drop-shadow-[0_2px_12px_rgba(0,0,0,.30)] md:h-14 lg:h-16"
                />
              </div>
            </div>

            <div className="mt-auto max-w-5xl pb-10 md:pb-16">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .8, delay: .04, ease: [0.16, 1, 0.3, 1] }}
                className="mb-5 flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-[.17em] text-asca-toxic md:text-sm"
              >
                <span>Students</span>
                <span className="text-white/50">/</span>
                <span>Internships</span>
                <span className="text-white/50">/</span>
                <span>Tech quiz</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-5xl text-[clamp(3.5rem,8.5vw,8.8rem)] font-semibold leading-[.92] tracking-[-0.045em]"
              >
                <span className="block">Build things that</span>
                <span className="block tracking-[-0.03em] text-asca-toxic">actually matter.</span>
              </motion.h1>

              <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="max-w-2xl text-lg leading-8 text-white/68 md:text-xl">
                    Software. Cloud. QA. Data. Real systems, real users and maybe your next internship.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs text-white/52 md:text-sm">
                    <span className="text-asca-toxic">{'{'} curiosity &gt; buzzwords {'}'}</span>
                    <span>build</span>
                    <span className="text-white/18">/</span>
                    <span>break</span>
                    <span className="text-white/18">/</span>
                    <span>learn</span>
                    <span className="text-white/18">/</span>
                    <span>ship</span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-4">
                  <Link
                    to={{ pathname: '/quiz', search: location.search }}
                    className="inline-flex min-h-12 items-center gap-2 rounded-full bg-asca-toxic px-5 text-sm font-bold text-black transition hover:scale-[1.02]"
                  >
                    Start quiz <ArrowRight size={17} />
                  </Link>
                  <a href="#statement" className="hero-scroll-cue inline-flex min-h-12 items-center gap-3 text-sm font-semibold text-white/76 transition hover:text-white">
                    <span className="h-px w-8 bg-asca-toxic/70" />
                    Scroll the booth <ArrowDown size={17} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="statement" className="section-screen flex min-h-[100svh] items-center px-6 py-20 md:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-[1500px]">
            <motion.div className="max-w-6xl" variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .35 }}>
              <p className="mb-8 text-xl font-medium text-asca-orange md:text-2xl">
                Technology built around business
              </p>
              <h2 className="text-[clamp(3.3rem,7.5vw,8rem)] font-semibold leading-[.92] tracking-[-.06em]">
                Built to fit.<br />
                Designed to last.<br />
                <span className="text-asca-toxic/75">Less corporate fog.</span>
              </h2>
              <p className="mt-10 max-w-2xl text-xl leading-9 text-white/58 md:text-2xl md:leading-10">
                ASCALab builds practical digital solutions for complex problems, with enough engineering depth to keep them useful after the launch-day screenshots stop being exciting.
              </p>
              <div className="mt-12">
                <SectionJump href="#services" label="See what we build" variant="bracket" />
              </div>
            </motion.div>
          </div>
        </section>

        <section id="services" className="section-screen flex min-h-[62svh] items-center py-16 md:py-20">
          <motion.div className="mx-auto w-full max-w-[1500px] px-6 md:px-10 lg:px-14" variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .35 }}>
            <h2 className="max-w-4xl text-4xl font-semibold tracking-[-.045em] md:text-6xl">
              Three ways to get very good at solving real problems.
            </h2>
            <div className="mt-10">
              <SectionJump href="#service-development" label="Start with Development" variant="line" />
            </div>
          </motion.div>
        </section>

        <section className="pb-8 md:pb-16">
          <div className="space-y-0">
            {serviceStories.map((service, index) => (
              <motion.article
                key={service.title}
                id={`service-${service.title.toLowerCase()}`}
                className="section-screen mx-auto flex min-h-[100svh] max-w-[1500px] items-center px-4 py-8 md:px-8 md:py-10" variants={index % 2 ? revealRight : revealLeft} initial="hidden" whileInView="show" viewport={{ once: true, amount: .18 }}>
                <div className={`grid min-h-[72svh] overflow-hidden rounded-[30px] bg-[#0e1217] md:rounded-[40px] lg:grid-cols-2 ${index % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                  <div className="relative min-h-[42svh] lg:min-h-full">
                    <motion.img src={service.image} alt="" width="1400" height="900" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" variants={imageReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .25 }} />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,12,.05),rgba(7,9,12,.35))]" />
                    <div className="absolute left-6 top-6 rounded-full bg-black/45 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-md md:left-8 md:top-8">
                      {service.title}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center p-7 md:p-12 lg:p-14">
                    <h3 className="max-w-xl text-4xl font-semibold leading-[1.02] tracking-[-.05em] md:text-6xl">
                      {service.headline}
                    </h3>
                    <p className="mt-8 max-w-xl text-lg leading-8 text-white/66">{service.copy}</p>
                    <p className="mt-6 max-w-xl leading-7 text-white/54">{service.detail}</p>
                    <div className="mt-9">
                      <SectionJump
                        href={serviceNextTargets[index]}
                        label={index === 0 ? 'Next: DevOps' : index === 1 ? 'Next: Testing' : 'Find your lane'}
                        variant={index === 0 ? 'square' : index === 1 ? 'ghost' : 'toxic'}
                      />
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="tech-marquee border-y border-white/8 bg-[#0a0d10] py-5">
          <div className="tech-marquee-track">
            {[...techStack, ...techStack].map((item, index) => (
              <span key={`${item}-${index}`} className="tech-marquee-item">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section id="career-paths" className="section-screen flex min-h-[100svh] items-center overflow-hidden border-y border-white/8 py-16 md:py-20">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: .35 }}
            className="mx-auto max-w-[1500px] px-6 md:px-10 lg:px-14"
          >
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-asca-toxic">
              Where you could fit
            </p>
            <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-[clamp(2.5rem,5.8vw,6.5rem)] font-semibold leading-none tracking-[-.055em] text-white/82">
              {eventConfig.careers.map((career, index) => (
                <span key={career} className={index % 3 === 1 ? 'text-asca-toxic' : 'text-white/82'}>
                  {career}
                </span>
              ))}
            </div>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/60">
              You do not need to arrive knowing everything. Fundamentals, curiosity and enough stubbornness to keep digging are a pretty good start.
            </p>
            <p className="mt-5 font-mono text-sm text-asca-toxic/85">
              // no perfect profile required
            </p>
            <div className="mt-10">
              <SectionJump href="#quiz-teaser" label="Try something less corporate" variant="orb" />
            </div>
          </motion.div>
        </section>

        <section id="quiz-teaser" className="section-screen flex min-h-[100svh] items-center px-4 py-10 md:px-8 md:py-16">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: .3 }}
            className="student-quiz-band mx-auto grid max-w-[1180px] gap-8 overflow-hidden rounded-[30px] border border-asca-toxic/35 bg-asca-toxic p-7 text-black md:rounded-[38px] md:p-10 lg:grid-cols-[1fr_auto] lg:items-end"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.18em] text-black/55">
                Production is the final boss.
              </p>
              <h2 className="mt-4 max-w-4xl text-4xl font-semibold leading-[.98] tracking-[-.05em] md:text-6xl">
                Think you know tech? Prove it before your friend does.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-black/62">
                5–8 random questions, an AI image challenge, speed scoring and prize tiers. Every session gets a different mix.
              </p>
              <p className="mt-4 font-mono text-sm font-semibold text-black/50">
                friend assistance not guaranteed to help :)
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 lg:items-end">
              <Link
                to={{ pathname: '/quiz', search: location.search }}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-black px-7 font-semibold text-white transition hover:scale-[1.02]"
              >
                Start quiz <ArrowRight size={18} />
              </Link>
              <a href="#industries" className="group inline-flex items-center gap-2 text-sm font-semibold text-black/55 transition hover:text-black">
                Keep exploring <ArrowDown size={16} className="transition group-hover:translate-y-1" />
              </a>
            </div>
          </motion.div>
        </section>

        <section id="industries" className="section-screen flex min-h-[100svh] items-center px-6 py-20 md:px-10 lg:px-14">
          <div className="mx-auto max-w-[1500px]">
            <motion.div className="max-w-5xl" variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .4 }}>
              <h2 className="text-[clamp(3.3rem,6.8vw,7rem)] font-semibold leading-[.95] tracking-[-.06em]">
                This is where “it works” stops being enough.
              </h2>
              <p className="mt-8 max-w-2xl text-xl leading-9 text-white/60">
                Money, policies, energy and connectivity all create different problems. The common bit is that people notice when the software gets them wrong.
              </p>
              <div className="mt-12">
                <SectionJump href="#industry-story" label="Enter the real-world problems" variant="ghost" />
              </div>
            </motion.div>
          </div>
        </section>

        <section id="industry-story" className="relative px-4 pb-16 md:px-8 md:pb-24">
          <div className="relative h-[360svh]">
            <div className="sticky top-0 z-10 flex h-[100svh] items-start pt-[4svh] md:pt-[5svh]">
              <div className="relative mx-auto h-[88svh] w-full max-w-[1500px] overflow-hidden rounded-[30px] bg-[#0b0f13] md:h-[86svh] md:rounded-[40px]">
                <AnimatePresence initial={false} mode="sync">
                  <motion.div
                    key={industryStories[activeIndustry].title}
                    initial={{
                      opacity: 0,
                      x: activeIndustry % 2 === 0 ? -180 : 180,
                      scale: .985,
                      filter: 'blur(10px)',
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: 1,
                                          }}
                    exit={{
                      opacity: 0,
                      x: activeIndustry % 2 === 0 ? 90 : -90,
                      scale: 1.015,
                      filter: 'blur(6px)',
                    }}
                    transition={{ duration: .78, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <motion.img
                      key={industryStories[activeIndustry].image}
                      src={industryStories[activeIndustry].image}
                      alt=""
                      width="1400"
                      height="900"
                      loading="lazy"
                      decoding="async"
                      initial={{ scale: 1.06 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />

                    <div
                      className={`absolute inset-0 ${
                        activeIndustry % 2 === 0
                          ? 'bg-[linear-gradient(90deg,rgba(5,7,10,.92),rgba(5,7,10,.48)_58%,rgba(5,7,10,.12))]'
                          : 'bg-[linear-gradient(270deg,rgba(5,7,10,.92),rgba(5,7,10,.48)_58%,rgba(5,7,10,.12))]'
                      }`}
                    />

                    <div
                      className={`relative z-10 flex h-full items-end p-7 md:p-12 lg:p-14 ${
                        activeIndustry % 2 ? 'justify-end text-right' : ''
                      }`}
                    >
                      <div className={`max-w-2xl ${activeIndustry % 2 ? 'ml-auto' : ''}`}>
                        <p className="text-sm font-semibold uppercase tracking-[.18em] text-asca-toxic">
                          {industryStories[activeIndustry].title}
                        </p>
                        <h3 className="mt-4 text-[clamp(3rem,6.5vw,6.8rem)] font-semibold leading-[.93] tracking-[-.06em]">
                          {industryStories[activeIndustry].headline}
                        </h3>
                        <p className={`mt-7 max-w-xl text-lg leading-8 text-white/68 md:text-xl ${activeIndustry % 2 ? 'ml-auto' : ''}`}>
                          {industryStories[activeIndustry].copy}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="pointer-events-none absolute left-7 right-7 top-7 z-20 flex items-center justify-between md:left-10 md:right-10 md:top-9">
                  <p className="text-xs font-semibold uppercase tracking-[.18em] text-white/56">
                    Scroll to switch
                  </p>
                  <div className="flex items-center gap-2">
                    {industryStories.map((industry, index) => (
                      <span
                        key={industry.title}
                        className={`h-1 rounded-full transition-all duration-500 ${
                          index === activeIndustry
                            ? 'w-8 bg-asca-toxic'
                            : 'w-3 bg-white/22'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {activeIndustry === industryStories.length - 1 ? (
                    <motion.a
                      href="#myqabee"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      className="absolute bottom-7 right-7 z-30 inline-flex min-h-12 items-center gap-2 rounded-full bg-asca-toxic px-5 text-sm font-bold text-black transition hover:scale-[1.02] md:bottom-10 md:right-10"
                    >
                      Next chapter <ArrowDown size={16} />
                    </motion.a>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 z-0">
              {industryStories.map((industry, index) => (
                <motion.div
                  key={industry.title}
                  className="h-[90svh]"
                  onViewportEnter={() => setActiveIndustry(index)}
                  viewport={{ amount: .55 }}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="myqabee" className="section-screen flex min-h-[100svh] items-center px-6 py-16 md:px-10 lg:px-14">
          <div className="mx-auto grid w-full max-w-[1500px] gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
            <motion.div variants={revealLeft} initial="hidden" whileInView="show" viewport={{ once: true, amount: .3 }}>
              <h2 className="text-5xl font-semibold leading-[.98] tracking-[-.055em] md:text-7xl">
                Sometimes the internal tool becomes the product.
              </h2>
              <p className="mt-7 max-w-xl text-xl leading-9 text-white/56">
                myQAbee grew out of real testing work: a codeless way to automate scenarios across environments and devices. It is a good example of what happens when engineers stop accepting a repetitive problem as “just how things are”.
              </p>
              <p className="mt-6 max-w-xl leading-7 text-white/54">
                Product thinking is not reserved for product companies. Sometimes the most useful idea starts as a problem your own team is tired of solving manually.
              </p>
              <div className="mt-9">
                <SectionJump href="#mindset" label="One more thing" variant="text" />
              </div>
            </motion.div>
            <motion.div className="relative min-h-[58svh] overflow-hidden rounded-[34px]" variants={revealRight} initial="hidden" whileInView="show" viewport={{ once: true, amount: .25 }}>
              <img
                src="/media/myqabee.webp"
                alt=""
                width="1400"
                height="900"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-7 left-7 text-3xl font-semibold tracking-[-.04em] md:bottom-10 md:left-10 md:text-5xl">
                myQAbee
              </div>
            </motion.div>
          </div>
        </section>

        <section id="mindset" className="section-screen flex min-h-[100svh] items-center px-6 py-20 md:px-10 lg:px-14">
          <div className="mx-auto grid w-full max-w-[1500px] gap-12 lg:grid-cols-[1fr_1fr]">
            <motion.div variants={revealLeft} initial="hidden" whileInView="show" viewport={{ once: true, amount: .3 }}>
              <p className="text-sm font-semibold uppercase tracking-[.18em] text-asca-toxic">
                A useful thing to know
              </p>
              <h2 className="mt-4 max-w-3xl text-5xl font-semibold leading-[.98] tracking-[-.055em] md:text-7xl">
                You do not need to know everything.
              </h2>
            </motion.div>
            <motion.div className="space-y-8 self-end text-lg leading-8 text-white/56" variants={revealRight} initial="hidden" whileInView="show" viewport={{ once: true, amount: .3 }}>
              <p>
                Nobody serious expects a student to arrive as a finished engineer. Strong fundamentals, curiosity and the habit of asking good questions matter more than pretending you have seen every framework already.
              </p>
              <p>
                The work itself teaches the rest: how systems connect, how requirements become software, why testing matters and why production has a talent for finding assumptions nobody wrote down.
              </p>
              <p className="text-white/82">
                Learn fast. Ask why. Break things somewhere safe. <span className="text-asca-toxic">Then make them better.</span>
              </p>
              <div className="pt-2">
                <SectionJump href="#student-path" label="See where you could start" variant="square" />
              </div>
            </motion.div>
          </div>
        </section>

        <section id="student-path" className="section-screen flex min-h-[100svh] items-center px-6 py-20 md:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-[1500px]">
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: .3 }}
              className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-end"
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-[.18em] text-asca-orange">
                  {eventConfig.campaignTitle}
                </p>
                <h2 className="mt-4 max-w-4xl text-5xl font-semibold leading-[.96] tracking-[-.055em] md:text-7xl">
                  Your first serious project has to start somewhere.
                </h2>
                <p className="mt-7 max-w-2xl text-xl leading-9 text-white/52">
                  Internships and future roles can start from very different technical paths. The point is not to fit one perfect profile. It is to find where your brain gets curious enough to keep going.
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-x-6 gap-y-4 border-y border-white/10 py-7 text-xl font-medium text-white/78 md:text-2xl">
                  {eventConfig.careers.map((career) => (
                    <span key={career}>{career}</span>
                  ))}
                </div>
                <p className="mt-6 max-w-xl leading-7 text-white/52">
                  Interested in an internship or future role? Leave your contact details, choose the area you care about, then take the event quiz. Each session gets a different mix.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-5">
                  <Link
                    to={{ pathname: '/quiz', search: location.search }}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-asca-toxic transition hover:text-white"
                  >
                    Preview the student quiz <ArrowRight size={17} />
                  </Link>
                  <SectionJump href="#contact" label="Leave your details" variant="bracket" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="contact" className="section-screen flex min-h-[100svh] items-center px-6 py-16 md:px-10 lg:px-14">
          <div className="mx-auto grid w-full max-w-[1500px] gap-12 lg:grid-cols-[.78fr_1.22fr] lg:items-center">
            <motion.div variants={revealLeft} initial="hidden" whileInView="show" viewport={{ once: true, amount: .3 }}>
              <p className="text-sm font-semibold uppercase tracking-[.18em] text-asca-toxic">
                Stay in touch
              </p>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-.045em] md:text-6xl">
                Interested in building with us?
              </h2>
              <p className="mt-5 max-w-md text-lg leading-8 text-white/58">
                Leave your name, email and the area you are curious about. This replaces the unrelated conference feedback form that used to live here.
              </p>

              {!backendConfigured ? (
                <p className="mt-6 max-w-md rounded-xl border border-amber-300/20 bg-amber-300/8 p-4 text-sm leading-6 text-amber-100/80">
                  Event backend is not configured on this deployment. Entries are saved only in this browser until <code>VITE_EVENT_API_URL</code> is connected.
                </p>
              ) : null}

              {isStaffView ? (
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold">
                  <button
                    type="button"
                    onClick={() => exportLocalLeadsCsv()}
                    className="text-asca-toxic underline decoration-asca-toxic/35 underline-offset-4"
                  >
                    Export {localLeadCount} local lead{localLeadCount === 1 ? '' : 's'}
                  </button>
                  <button
                    type="button"
                    onClick={() => exportLocalQuizResultsCsv()}
                    className="text-white/72 underline decoration-white/20 underline-offset-4 hover:text-white"
                  >
                    Export {getLocalResults().length} quiz result{getLocalResults().length === 1 ? '' : 's'}
                  </button>
                  <button
                    type="button"
                    onClick={() => exportLocalAnalyticsCsv()}
                    className="text-white/72 underline decoration-white/20 underline-offset-4 hover:text-white"
                  >
                    Export {getLocalAnalytics().length} analytics event{getLocalAnalytics().length === 1 ? '' : 's'}
                  </button>
                </div>
              ) : null}

              <div className="mt-8">
                <SectionJump href="#final-quiz" label="Skip to the quiz" variant="text" />
              </div>
            </motion.div>

            <motion.div variants={revealRight} initial="hidden" whileInView="show" viewport={{ once: true, amount: .25 }}>
              {leadStatus === 'sent' || leadStatus === 'queued' || leadStatus === 'local-only' ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-[28px] border border-white/10 bg-white/[.025] p-8 md:p-10"
                >
                  <div className="grid size-16 place-items-center rounded-full bg-asca-toxic/10 text-asca-toxic">
                    <Check size={32} strokeWidth={2.2} />
                  </div>
                  <h3 className="mt-7 text-3xl font-semibold tracking-[-.04em] md:text-4xl">
                    {leadStatus === 'sent'
                      ? 'Details sent.'
                      : leadStatus === 'queued'
                        ? 'Saved. We will retry.'
                        : 'Saved on this device.'}
                  </h3>
                  <p className="mt-4 max-w-lg text-base leading-7 text-white/58">
                    {leadStatus === 'sent'
                      ? 'Your contact details reached the event backend.'
                      : leadStatus === 'queued'
                        ? 'The connection failed, so this entry is queued locally and will retry when the browser comes back online.'
                        : 'There is no central event backend configured yet, so this entry exists only in this browser. Staff can export local entries from staff mode.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setLeadStatus('idle')}
                    className="mt-7 min-h-12 rounded-xl bg-white px-5 font-semibold text-black transition hover:bg-asca-toxic"
                  >
                    Add another
                  </button>
                </motion.div>
              ) : (
                <form
                  className="space-y-7"
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
                  <div className="grid gap-6 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-semibold text-white/80">Name</span>
                      <input
                        required
                        name="name"
                        autoComplete="name"
                        className="field mt-2"
                        placeholder="Your name"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-white/80">Email</span>
                      <input
                        required
                        type="email"
                        name="email"
                        autoComplete="email"
                        className="field mt-2"
                        placeholder="you@example.com"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-sm font-semibold text-white/80">School / faculty / field</span>
                    <input
                      required
                      name="studyField"
                      className="field mt-2"
                      placeholder="e.g. Computer Science, ETF, Elektronski..."
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-white/80">What are you interested in?</span>
                    <select required name="interest" className="field mt-2">
                      <option value="">Choose an area</option>
                      {eventConfig.careers.map((career) => (
                        <option key={career} value={career}>{career}</option>
                      ))}
                      <option value="Not sure yet">Not sure yet</option>
                    </select>
                  </label>

                  <label className="flex items-start gap-3 text-sm leading-6 text-white/60">
                    <input required type="checkbox" name="consent" value="yes" className="mt-1 size-4 accent-[#c7ff00]" />
                    <span>
                      I agree that ASCALab may use these details to contact me about internships, student opportunities or relevant roles.
                    </span>
                  </label>

                  <button
                    disabled={leadStatus === 'sending'}
                    className="inline-flex min-h-14 items-center gap-2 rounded-xl bg-asca-toxic px-7 font-bold text-black transition hover:brightness-105 disabled:cursor-wait disabled:opacity-60"
                    type="submit"
                  >
                    {leadStatus === 'sending' ? 'Saving…' : 'Leave my details'} <ArrowRight size={17} />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </section>

        <section id="final-quiz" className="section-screen flex min-h-[72svh] items-center px-4 py-10 md:px-8 md:py-14">
          <div className="mx-auto max-w-[1180px]">
            <Link
              to={{ pathname: '/quiz', search: location.search }}
              className="quiz-cta group relative flex min-h-[27svh] items-end justify-between gap-6 overflow-hidden rounded-[28px] bg-asca-toxic p-6 text-black transition duration-500 md:min-h-[30svh] md:rounded-[34px] md:p-9"
            >
            <div className="relative z-10">
              <p className="text-base font-semibold opacity-55">{eventConfig.eventName} · 5–8 random questions · no mercy from the timer</p>
              <h2 className="mt-3 text-[clamp(2.7rem,6vw,6.5rem)] font-semibold leading-[.9] tracking-[-.06em]">
                Take the student quiz.
              </h2>
              <p className="mt-4 max-w-xl text-sm font-medium opacity-55 md:text-base">
                Accuracy + speed · AI image challenge · prize tiers
              </p>
            </div>
            <span className="quiz-sheen" aria-hidden="true" />
            <div className="quiz-arrow mb-1 hidden size-16 shrink-0 place-items-center rounded-full bg-black text-white transition duration-500 md:grid">
              <ArrowRight size={32} />
            </div>
            </Link>
          </div>
        </section>

        <footer className="px-6 py-8 text-sm text-white/52 md:px-10 lg:px-14">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>ASCALab d.o.o.</span>
            <span>Development · DevOps · Testing</span>
          </div>
        </footer>
      </main>
    </div>
  )
}
