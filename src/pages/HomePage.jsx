import { useEffect, useState } from 'react'
import { ArrowDown, ArrowRight, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { eventConfig } from '../data/eventConfig.js'
import { trackEvent } from '../lib/analytics.js'

const reveal = {
  hidden: { opacity: 0, y: 72, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1] },
  },
}

const revealLeft = {
  hidden: { opacity: 0, x: -110, rotateZ: -1.2, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    x: 0,
    rotateZ: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
  },
}

const revealRight = {
  hidden: { opacity: 0, x: 110, rotateZ: 1.2, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    x: 0,
    rotateZ: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
  },
}

const imageReveal = {
  hidden: { opacity: 0, scale: 1.16, y: 34, filter: 'blur(12px)' },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.35, ease: [0.16, 1, 0.3, 1] },
  },
}

const serviceStories = [
  {
    title: 'Development',
    headline: 'You build it. People actually use it.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=88',
    copy: 'Customer apps, internal platforms, integrations and data-heavy systems. The interesting part is not making a demo work once. It is making software survive real users, real rules and years of change.',
    detail: 'You learn how product thinking, architecture and implementation connect when the thing on your screen becomes part of somebody else\'s working day.',
  },
  {
    title: 'DevOps',
    headline: 'Code is useless if nobody can ship it.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1800&q=88',
    copy: 'Cloud, deployment pipelines, infrastructure, monitoring and releases. DevOps is the part that turns “works on my machine” into something the rest of the world can actually run.',
    detail: 'The goal is simple: make delivery repeatable, observable and boring enough that Friday afternoon stops being a horror genre.',
  },
  {
    title: 'Testing',
    headline: 'Find the bug before the customer does.',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1800&q=88',
    copy: 'Quality engineering mixes curiosity, systems thinking, automation and a slightly suspicious attitude toward anything claiming to be “done”.',
    detail: 'That experience also became myQAbee, ASCALab\'s codeless QA automation product for repeatable testing across environments and devices.',
  },
]

const industryStories = [
  {
    title: 'Banking',
    headline: 'Millions of transactions. Zero appetite for guessing.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=88',
    copy: 'Core platforms, reporting, customer applications and integrations. When money moves, “close enough” is not an engineering strategy.',
  },
  {
    title: 'Insurance',
    headline: 'One small rule can change an entire outcome.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2000&q=88',
    copy: 'Claims, policies, billing and risk logic turn business rules into software. Tiny details can have very non-tiny consequences.',
  },
  {
    title: 'Energy',
    headline: 'A lot of data. All the time. It still has to add up.',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=2000&q=88',
    copy: 'Metering, billing and operational data push systems hard. Reliability matters because the real world does not pause while your service restarts.',
  },
  {
    title: 'Telecom',
    headline: 'People notice very quickly when the connection stops.',
    image: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=2000&q=88',
    copy: 'Subscriber systems, self-service platforms and integrations live under constant change. The challenge is shipping that change without turning production into an experiment.',
  },
]

export default function HomePage() {
  const [formSent, setFormSent] = useState(false)
  const [formStarted, setFormStarted] = useState(false)
  const location = useLocation()

  useEffect(() => {
    trackEvent('page_view', { eventSlug: eventConfig.slug })
  }, [])

  return (
    <div className="min-h-screen bg-asca-bg text-white">
      <main>
        <section className="relative min-h-[100svh] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2200&q=88"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,12,.24),rgba(7,9,12,.64)_60%,#07090c_100%)]" />

          <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1500px] flex-col px-6 py-7 md:px-10 md:py-9 lg:px-14">
            <div className="flex items-center justify-between">
              <span className="hidden text-sm font-medium text-white/52 sm:block">{eventConfig.campaignTitle}</span>
              <img src="/ascalab-logo-official.webp" alt="ASCALab" className="h-9 w-auto md:h-11" />
            </div>

            <div className="mt-auto max-w-5xl pb-10 md:pb-16">
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-5xl text-[clamp(3.5rem,8.5vw,8.8rem)] font-semibold leading-[.89] tracking-[-0.065em]"
              >
                Build things that<br />
                <span className="text-white/48">actually matter.</span>
              </motion.h1>

              <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <p className="max-w-2xl text-lg leading-8 text-white/68 md:text-xl">
                  Software. Cloud. QA. Data. Real systems, real users and maybe your next internship.
                </p>
                <a href="#statement" className="inline-flex min-h-12 shrink-0 items-center gap-2 text-sm font-semibold text-white/72 transition hover:text-white">
                  Meet ASCALab <ArrowDown size={17} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/8 px-6 py-9 md:px-10 lg:px-14">
          <div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-y-8 md:grid-cols-4">
            {[
              ['100+', 'Engineers'],
              ['25', 'Years of experience'],
              ['60+', 'Projects delivered'],
              ['9', 'Countries'],
            ].map(([value, label]) => (
              <div key={label} className="md:px-8 md:first:pl-0">
                <div className="text-4xl font-semibold tracking-[-.05em] md:text-5xl">{value}</div>
                <div className="mt-2 text-sm text-white/42">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="statement" className="flex min-h-[86svh] items-center px-6 py-24 md:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-[1500px]">
            <motion.div className="max-w-6xl" variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .35 }}>
              <p className="mb-8 text-xl font-medium text-asca-orange md:text-2xl">
                Technology built around business
              </p>
              <h2 className="text-[clamp(3.3rem,7.5vw,8rem)] font-semibold leading-[.92] tracking-[-.06em]">
                Built to fit.<br />
                Designed to last.<br />
                <span className="text-white/38">Less corporate fog.</span>
              </h2>
              <p className="mt-10 max-w-2xl text-xl leading-9 text-white/58 md:text-2xl md:leading-10">
                ASCALab builds practical digital solutions for complex problems, with enough engineering depth to keep them useful after the launch-day screenshots stop being exciting.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="pb-24 md:pb-36">
          <motion.div className="mx-auto max-w-[1500px] px-6 md:px-10 lg:px-14" variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .35 }}>
            <h2 className="max-w-4xl text-4xl font-semibold tracking-[-.045em] md:text-6xl">
              Three ways to get very good at solving real problems.
            </h2>
          </motion.div>

          <div className="mt-16 space-y-4 md:mt-24 md:space-y-8">
            {serviceStories.map((service, index) => (
              <motion.article key={service.title} className="mx-auto max-w-[1500px] px-4 md:px-8" variants={index % 2 ? revealRight : revealLeft} initial="hidden" whileInView="show" viewport={{ once: true, amount: .18 }}>
                <div className={`grid min-h-[72svh] overflow-hidden rounded-[30px] bg-[#0e1217] md:rounded-[40px] lg:grid-cols-2 ${index % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                  <div className="relative min-h-[42svh] lg:min-h-full">
                    <motion.img src={service.image} alt="" className="absolute inset-0 h-full w-full object-cover" variants={imageReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .25 }} />
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
                    <p className="mt-6 max-w-xl leading-7 text-white/40">{service.detail}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="overflow-hidden border-y border-white/8 py-16 md:py-24">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: .35 }}
            className="mx-auto max-w-[1500px] px-6 md:px-10 lg:px-14"
          >
            <p className="text-sm font-semibold uppercase tracking-[.18em] text-asca-orange">
              Where you could fit
            </p>
            <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-[clamp(2.5rem,5.8vw,6.5rem)] font-semibold leading-none tracking-[-.055em] text-white/82">
              {eventConfig.careers.map((career, index) => (
                <span key={career} className={index % 3 === 1 ? 'text-white/34' : ''}>
                  {career}
                </span>
              ))}
            </div>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/48">
              You do not need to arrive knowing everything. Fundamentals, curiosity and enough stubbornness to keep digging are a pretty good start.
            </p>
          </motion.div>
        </section>

        <section className="px-4 py-10 md:px-8 md:py-16">
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: .3 }}
            className="mx-auto grid max-w-[1180px] gap-8 overflow-hidden rounded-[30px] border border-white/10 bg-[#0e1217] p-7 md:rounded-[38px] md:p-10 lg:grid-cols-[1fr_auto] lg:items-end"
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.18em] text-asca-orange">
                Production is the final boss.
              </p>
              <h2 className="mt-4 max-w-4xl text-4xl font-semibold leading-[.98] tracking-[-.05em] md:text-6xl">
                Think you know tech? Prove it before your friend does.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/48">
                5–8 random questions, an AI image challenge, speed scoring and prize tiers. Every session gets a different mix.
              </p>
            </div>
            <Link
              to={{ pathname: '/quiz', search: location.search }}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-asca-orange px-7 font-semibold text-black transition hover:brightness-105"
            >
              Start quiz <ArrowRight size={18} />
            </Link>
          </motion.div>
        </section>

        <section className="px-6 py-24 md:px-10 md:py-36 lg:px-14">
          <div className="mx-auto max-w-[1500px]">
            <motion.div className="max-w-5xl" variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .4 }}>
              <h2 className="text-[clamp(3.3rem,6.8vw,7rem)] font-semibold leading-[.95] tracking-[-.06em]">
                This is where “it works” stops being enough.
              </h2>
              <p className="mt-8 max-w-2xl text-xl leading-9 text-white/48">
                Money, policies, energy and connectivity all create different problems. The common bit is that people notice when the software gets them wrong.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="space-y-4 px-4 pb-24 md:space-y-8 md:px-8 md:pb-36">
          {industryStories.map((industry, index) => (
            <motion.article key={industry.title} className="industry-cinema relative mx-auto min-h-[68svh] max-w-[1500px] overflow-hidden rounded-[30px] md:rounded-[40px]" variants={index % 2 ? revealRight : revealLeft} initial="hidden" whileInView="show" viewport={{ once: true, amount: .16 }}>
              <motion.img src={industry.image} alt="" className="absolute inset-0 h-full w-full object-cover" variants={imageReveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .2 }} />
              <div className={`absolute inset-0 ${index % 2 === 0 ? 'bg-[linear-gradient(90deg,rgba(5,7,10,.9),rgba(5,7,10,.48)_55%,rgba(5,7,10,.14))]' : 'bg-[linear-gradient(270deg,rgba(5,7,10,.9),rgba(5,7,10,.48)_55%,rgba(5,7,10,.14))]'}`} />
              <div className={`relative z-10 flex min-h-[68svh] items-end p-7 md:p-12 ${index % 2 ? 'justify-end text-right' : ''}`}>
                <div className={`max-w-2xl ${index % 2 ? 'ml-auto' : ''}`}>
                  <p className="text-sm font-semibold uppercase tracking-[.18em] text-asca-orange">
                    {industry.title}
                  </p>
                  <h3 className="mt-4 text-[clamp(3rem,6.5vw,6.8rem)] font-semibold leading-[.93] tracking-[-.06em]">
                    {industry.headline}
                  </h3>
                  <p className={`mt-7 max-w-xl text-lg leading-8 text-white/68 md:text-xl ${index % 2 ? 'ml-auto' : ''}`}>
                    {industry.copy}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </section>

        <section className="px-6 py-24 md:px-10 md:py-36 lg:px-14">
          <div className="mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
            <motion.div variants={revealLeft} initial="hidden" whileInView="show" viewport={{ once: true, amount: .3 }}>
              <h2 className="text-5xl font-semibold leading-[.98] tracking-[-.055em] md:text-7xl">
                Sometimes the internal tool becomes the product.
              </h2>
              <p className="mt-7 max-w-xl text-xl leading-9 text-white/56">
                myQAbee grew out of real testing work: a codeless way to automate scenarios across environments and devices. It is a good example of what happens when engineers stop accepting a repetitive problem as “just how things are”.
              </p>
              <p className="mt-6 max-w-xl leading-7 text-white/38">
                Product thinking is not reserved for product companies. Sometimes the most useful idea starts as a problem your own team is tired of solving manually.
              </p>
            </motion.div>
            <motion.div className="relative min-h-[58svh] overflow-hidden rounded-[34px]" variants={revealRight} initial="hidden" whileInView="show" viewport={{ once: true, amount: .25 }}>
              <img
                src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1800&q=88"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-7 left-7 text-3xl font-semibold tracking-[-.04em] md:bottom-10 md:left-10 md:text-5xl">
                myQAbee
              </div>
            </motion.div>
          </div>
        </section>

        <section className="flex min-h-[76svh] items-center px-6 py-24 md:px-10 lg:px-14">
          <div className="mx-auto grid w-full max-w-[1500px] gap-12 lg:grid-cols-[1fr_1fr]">
            <motion.div variants={revealLeft} initial="hidden" whileInView="show" viewport={{ once: true, amount: .3 }}>
              <p className="text-sm font-semibold uppercase tracking-[.18em] text-asca-orange">
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
                Learn fast. Ask why. Break things somewhere safe. Then make them better.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-24 md:px-10 md:py-32 lg:px-14">
          <div className="mx-auto max-w-[1500px]">
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
                <p className="mt-6 max-w-xl leading-7 text-white/42">
                  Leave your details below for now, then take the event quiz. Each session gets a different mix, so standing next to the smartest person in your group is less useful than you hoped.
                </p>
                <Link
                  to={{ pathname: '/quiz', search: location.search }}
                  className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-asca-orange transition hover:text-white"
                >
                  Preview the student quiz <ArrowRight size={17} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-24 md:px-10 md:py-32 lg:px-14">
          <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
            <motion.div variants={revealLeft} initial="hidden" whileInView="show" viewport={{ once: true, amount: .3 }}>
              <h2 className="max-w-xl text-4xl font-semibold tracking-[-.045em] md:text-6xl">
                Event feedback prototype.
              </h2>
              <p className="mt-5 max-w-md text-lg leading-8 text-white/46">
                We are keeping the current Google Form integration here until the final student lead form is available. The interface is ours; the answers still submit to the published form in the background.
              </p>
            </motion.div>

            <motion.div className="min-h-[760px]" variants={revealRight} initial="hidden" whileInView="show" viewport={{ once: true, amount: .25 }}>
              <iframe title="Google Forms submit target" name="google-form-target" className="hidden" />

              {formSent ? (
                <motion.div
                  initial={{ opacity: 0, scale: .96, y: 14 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: .45, ease: [0.22, 1, 0.36, 1] }}
                  className="grid min-h-[760px] place-items-center rounded-[28px] border border-emerald-400/15 bg-[radial-gradient(circle_at_50%_35%,rgba(16,185,129,.11),transparent_44%),#0f1318] p-8 text-center"
                >
                  <div>
                    <motion.div
                      initial={{ scale: .6, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: .08, type: 'spring', stiffness: 220, damping: 16 }}
                      className="mx-auto grid size-24 place-items-center rounded-full border border-emerald-300/25 bg-emerald-400/10 text-emerald-300 shadow-[0_0_70px_rgba(16,185,129,.12)]"
                    >
                      <Check size={48} strokeWidth={2.4} />
                    </motion.div>
                    <h3 className="mt-8 text-4xl font-semibold tracking-[-.045em] md:text-5xl">
                      Form sent successfully.
                    </h3>
                    <p className="mx-auto mt-4 max-w-md text-lg leading-8 text-white/46">
                      Thanks for the feedback. Your response has been submitted.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form
                  action="https://docs.google.com/forms/d/e/1FAIpQLScRy8VVrCMWDZgcmKenHgR-Y1sjB5TLlBj_fuN_3n2xxLdgBw/formResponse"
                  method="POST"
                  target="google-form-target"
                  className="min-h-[760px] rounded-[28px] border border-white/9 bg-asca-panel p-5 md:p-7"
                  onFocusCapture={() => {
                    if (!formStarted) {
                      setFormStarted(true)
                      trackEvent('form_started', { eventSlug: eventConfig.slug })
                    }
                  }}
                  onSubmit={(event) => {
                    const form = event.currentTarget
                    setFormSent(false)
                    trackEvent('form_completed', { eventSlug: eventConfig.slug })
                    window.setTimeout(() => {
                      form.reset()
                      setFormSent(true)
                    }, 650)
                  }}
                >
                  <fieldset>
                    <legend className="text-lg font-semibold">Overall quality</legend>
                    <p className="mt-1 text-sm text-white/38">Poor → Excellent</p>
                    <div className="mt-4 grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <label key={value} className="survey-choice">
                          <input required type="radio" name="entry.1080979567" value={value} className="sr-only peer" />
                          <span className="survey-choice-box">{value}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="mt-8">
                    <legend className="text-lg font-semibold">Most valuable keynote or topic</legend>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {['Global Market Trends', 'Digital Assets and Blockchain', 'Sustainable Investing', 'Regulatory Updates'].map((option) => (
                        <label key={option} className="survey-option">
                          <input required type="radio" name="entry.795391864" value={option} className="sr-only peer" />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="mt-8">
                    <legend className="text-lg font-semibold">What did you enjoy most?</legend>
                    <label className="survey-option mt-4">
                      <input type="checkbox" name="entry.1322378946" value="Panel discussions" className="sr-only peer" />
                      <span>Panel discussions</span>
                    </label>
                    <p className="mt-2 text-xs text-white/30">Test mapping currently uses the confirmed “Panel discussions” option.</p>
                  </fieldset>

                  <fieldset className="mt-8">
                    <legend className="text-lg font-semibold">Additional rating</legend>
                    <div className="mt-4 grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <label key={value} className="survey-choice">
                          <input required type="radio" name="entry.809343022" value={value} className="sr-only peer" />
                          <span className="survey-choice-box">{value}</span>
                        </label>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-white/30">Question wording will be replaced once we confirm the lower half of the source form.</p>
                  </fieldset>

                  <label className="mt-8 block">
                    <span className="text-lg font-semibold">Additional feedback</span>
                    <textarea required name="entry.239328865" className="field mt-4 min-h-32 resize-none" placeholder="Tell us what you think..." />
                  </label>

                  <button className="mt-6 min-h-14 w-full rounded-2xl bg-white px-6 font-semibold text-black transition hover:bg-asca-orange" type="submit">
                    Send feedback
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </section>

        <section className="px-4 pb-4 md:px-8 md:pb-8">
          <div className="mx-auto max-w-[1180px]">
            <Link
              to={{ pathname: '/quiz', search: location.search }}
              className="quiz-cta group relative flex min-h-[27svh] items-end justify-between gap-6 overflow-hidden rounded-[28px] bg-asca-orange p-6 text-black transition duration-500 md:min-h-[30svh] md:rounded-[34px] md:p-9"
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

        <footer className="px-6 py-8 text-sm text-white/34 md:px-10 lg:px-14">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>ASCALab d.o.o.</span>
            <span>Development · DevOps · Testing</span>
          </div>
        </footer>
      </main>
    </div>
  )
}
