import { ArrowDown, ArrowRight, ShieldCheck, Database, FlaskConical } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const services = [
  {
    number: '01',
    title: 'Development',
    text: 'Architecture and delivery across desktop, web and mobile, from core systems and data warehouses to modern AI-driven applications.',
    icon: Database,
  },
  {
    number: '02',
    title: 'DevOps',
    text: 'Reliable Azure, AWS and GCP pipelines, infrastructure as code, cloud migration, observability and releases without drama.',
    icon: ShieldCheck,
  },
  {
    number: '03',
    title: 'Testing',
    text: 'A controlled testing process across application portfolios, backed by our own codeless automation product, myQAbee.',
    icon: FlaskConical,
  },
]

const industries = [
  ['Banking', 'Core systems, data warehouses and regulatory reporting.'],
  ['Insurance', 'Claims, policy administration and risk calculation.'],
  ['Energy', 'Metering data, billing and operational reporting.'],
  ['Telecom', 'Subscriber systems, integrations and self-service platforms.'],
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-asca-bg text-white">
      <main>
        <section className="relative min-h-[100svh] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2200&q=88"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,12,.38),rgba(7,9,12,.72)_58%,#07090c_100%)]" />

          <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1500px] flex-col px-6 py-7 md:px-10 md:py-9 lg:px-14">
            <div className="flex items-center justify-between">
              <img src="/ascalab-logo.svg" alt="ASCALab" className="h-8 w-auto brightness-[1.25] md:h-10" />
              <span className="hidden text-xs font-semibold uppercase tracking-[0.22em] text-white/55 sm:block">
                Development · DevOps · Testing
              </span>
            </div>

            <div className="mt-auto max-w-5xl pb-10 md:pb-16">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .5 }}
                className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-asca-orange"
              >
                ASCALab
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .7, delay: .05 }}
                className="max-w-5xl text-[clamp(3.5rem,8.5vw,8.8rem)] font-semibold leading-[.89] tracking-[-0.065em]"
              >
                Built to fit.<br />
                <span className="text-white/48">Designed to last.</span>
              </motion.h1>

              <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <p className="max-w-2xl text-lg leading-8 text-white/68 md:text-xl">
                  We plug into the workflows you already run and take ownership of the outcome. Built for regulated, mission-critical systems.
                </p>
                <a href="#story" className="inline-flex min-h-12 shrink-0 items-center gap-2 text-sm font-semibold text-white/72 transition hover:text-white">
                  Scroll to explore <ArrowDown size={17} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="story" className="border-y border-white/8 bg-asca-bg px-6 py-9 md:px-10 lg:px-14">
          <div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-y-8 md:grid-cols-4">
            {[
              ['100+', 'Engineers'],
              ['25', 'Years in regulated systems'],
              ['60+', 'Projects delivered'],
              ['9', 'Countries delivered in'],
            ].map(([value, label]) => (
              <div key={label} className="border-white/10 md:border-l md:first:border-l-0 md:px-8 md:first:pl-0">
                <div className="text-4xl font-semibold tracking-[-.05em] md:text-5xl">{value}</div>
                <div className="mt-2 max-w-40 text-sm leading-5 text-white/44">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-24 md:px-10 md:py-32 lg:px-14">
          <div className="mx-auto max-w-[1500px]">
            <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
              <div>
                <p className="eyebrow">What we do</p>
                <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-.045em] md:text-6xl">
                  Three services. One team that stays in the work.
                </h2>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-white/52 lg:justify-self-end">
                Architecture, delivery, infrastructure and testing for software companies and regulated industries.
              </p>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-[28px] border border-white/8 bg-white/8 lg:grid-cols-3">
              {services.map(({ number, title, text, icon: Icon }) => (
                <article key={title} className="bg-asca-panel p-7 md:p-9">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-asca-orange">{number}</span>
                    <Icon size={22} className="text-white/42" />
                  </div>
                  <h3 className="mt-16 text-3xl font-semibold tracking-[-.04em]">{title}</h3>
                  <p className="mt-4 leading-7 text-white/48">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="photo-band relative mx-4 min-h-[72svh] overflow-hidden rounded-[30px] md:mx-8 md:rounded-[38px]">
          <img
            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2200&q=88"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,8,11,.92),rgba(6,8,11,.55)_48%,rgba(6,8,11,.16))]" />
          <div className="relative z-10 mx-auto flex min-h-[72svh] max-w-[1500px] items-end px-7 py-10 md:px-12 md:py-14">
            <div className="max-w-2xl">
              <p className="eyebrow">Built for regulated environments</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-7xl">
                Complexity is normal. Losing control of it isn't.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/62">
                Banking, insurance, energy and telecom each have different constraints. The need for reliability, traceability and clean delivery does not.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 md:px-10 md:py-32 lg:px-14">
          <div className="mx-auto max-w-[1500px]">
            <p className="eyebrow">Industries</p>
            <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
              {industries.map(([title, text], index) => (
                <div key={title} className="grid gap-3 py-7 md:grid-cols-[90px_1fr_1fr] md:items-center md:py-9">
                  <span className="text-sm font-semibold text-asca-orange">0{index + 1}</span>
                  <h3 className="text-3xl font-semibold tracking-[-.035em] md:text-4xl">{title}</h3>
                  <p className="max-w-xl text-base leading-7 text-white/46 md:justify-self-end">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-4 md:px-8 md:pb-8">
          <div className="relative min-h-[68svh] overflow-hidden rounded-[30px] md:rounded-[38px]">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=2200&q=88"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,9,12,.92),rgba(7,9,12,.67)_54%,rgba(7,9,12,.32))]" />
            <div className="relative z-10 flex min-h-[68svh] items-end px-7 py-10 md:px-12 md:py-14">
              <div className="max-w-2xl">
                <p className="eyebrow">Our product</p>
                <h2 className="mt-4 text-5xl font-semibold tracking-[-.055em] md:text-7xl">myQAbee</h2>
                <p className="mt-5 max-w-xl text-lg leading-8 text-white/62">
                  Codeless QA automation for every environment. No scripts to write, multi-device by design, built from the testing work we do on real platforms.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 md:px-10 md:py-32 lg:px-14">
          <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div>
              <p className="eyebrow">Stay in touch</p>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-.045em] md:text-6xl">
                Leave your details.
              </h2>
              <p className="mt-5 max-w-md text-lg leading-8 text-white/46">
                This form is ready to be wired to the Google form / Sheets flow once the final fields are confirmed.
              </p>
            </div>

            <form className="grid gap-3 rounded-[28px] border border-white/9 bg-asca-panel p-5 md:p-7" onSubmit={(e) => e.preventDefault()}>
              <input className="field" placeholder="Name" />
              <input className="field" placeholder="Company" />
              <input className="field" placeholder="Email" type="email" />
              <textarea className="field min-h-32 resize-none" placeholder="Message" />
              <button className="mt-2 min-h-14 rounded-2xl bg-white px-6 font-semibold text-black transition hover:bg-asca-orange" type="submit">
                Submit
              </button>
            </form>
          </div>
        </section>

        <section className="px-4 pb-4 md:px-8 md:pb-8">
          <Link
            to="/quiz"
            className="group flex min-h-[44svh] items-end justify-between gap-6 rounded-[30px] bg-asca-orange p-7 text-black transition duration-300 hover:brightness-105 md:min-h-[50svh] md:rounded-[38px] md:p-12"
          >
            <div>
              <p className="text-sm font-bold uppercase tracking-[.2em] opacity-60">Ready?</p>
              <h2 className="mt-4 text-[clamp(3.5rem,9vw,9rem)] font-semibold leading-[.86] tracking-[-.065em]">
                Take the quiz.
              </h2>
            </div>
            <div className="mb-2 hidden size-20 shrink-0 place-items-center rounded-full bg-black text-white transition group-hover:translate-x-1 md:grid">
              <ArrowRight size={32} />
            </div>
          </Link>
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
