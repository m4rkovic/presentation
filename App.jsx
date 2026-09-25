import { ArrowDown, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

const photos = {
  hero: 'https://images.unsplash.com/photo-1774332020870-dc0628e40aae?auto=format&fit=crop&q=82&w=2200',
  team: 'https://images.unsplash.com/photo-1758873271835-0ab4b611e659?auto=format&fit=crop&q=82&w=1800',
  servers: 'https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?auto=format&fit=crop&q=82&w=1800',
}

const services = [
  {
    number: '01',
    title: 'Development as a Service',
    text: 'Architecture and delivery across desktop, web and mobile, from core banking systems and data warehouses to AI-driven applications.',
    tags: ['Solution architecture', 'Data warehousing', 'Modernisation'],
  },
  {
    number: '02',
    title: 'DevOps as a Service',
    text: 'Azure, AWS and GCP delivery pipelines built for reliability, from infrastructure as code through to release and observability.',
    tags: ['CI/CD', 'Cloud migration', 'Observability'],
  },
  {
    number: '03',
    title: 'Testing as a Service',
    text: 'A controlled testing process across the application portfolio, backed by ASCALab’s own codeless test automation product, myQAbee.',
    tags: ['myQAbee', 'Automation', 'Performance'],
  },
]

const industries = [
  ['Banking', 'Core systems, data warehouses and regulatory reporting.'],
  ['Insurance', 'Claims, policy administration and risk calculation.'],
  ['Energy', 'Metering data, billing and operational reporting.'],
  ['Telecom', 'Subscriber systems, integrations and self-service platforms.'],
]

const stats = [
  ['100+', 'Engineers'],
  ['25', 'Years in regulated systems'],
  ['60+', 'Projects delivered'],
  ['9', 'Countries delivered in'],
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-asca-bg text-asca-text selection:bg-asca-orange selection:text-black">
      <Navbar />

      <main>
        <section className="relative min-h-[92vh] overflow-hidden border-b border-white/10">
          <img
            src={photos.hero}
            alt="Modern corporate architecture"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#090b0f_0%,rgba(9,11,15,.86)_42%,rgba(9,11,15,.4)_72%,rgba(9,11,15,.78)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(247,149,84,.13),transparent_30%)]" />

          <div className="relative mx-auto flex min-h-[92vh] max-w-7xl items-end px-6 pb-16 pt-32 md:px-10 md:pb-20 lg:px-12">
            <div className="max-w-4xl">
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-5 text-xs font-semibold uppercase tracking-[0.26em] text-asca-orange md:text-sm"
              >
                Development · DevOps · Testing
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.05 }}
                className="max-w-4xl text-[clamp(3.6rem,9vw,8.5rem)] font-semibold leading-[0.88] tracking-[-0.065em] text-white"
              >
                Built to fit. <span className="text-white/52">Designed to last.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.14 }}
                className="mt-8 max-w-2xl text-lg leading-8 text-white/70 md:text-xl"
              >
                Engineering for regulated, mission-critical systems, with teams that plug into the way your business already works.
              </motion.p>

              <motion.a
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.22 }}
                href="#services"
                className="mt-9 inline-flex items-center gap-3 border-b border-white/40 pb-2 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:border-asca-orange hover:text-asca-orange"
              >
                Explore ASCALab <ArrowDown size={17} />
              </motion.a>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-asca-panel px-6 py-8 md:px-10 lg:px-12">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-7 md:grid-cols-4">
            {stats.map(([value, label]) => (
              <div key={label}>
                <div className="text-3xl font-semibold tracking-[-0.04em] text-white md:text-4xl">{value}</div>
                <div className="mt-1 text-sm leading-5 text-white/45">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="services" className="px-6 py-24 md:px-10 md:py-32 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
              <div>
                <p className="eyebrow">What we do best</p>
                <h2 className="section-title">Three disciplines. One engineering organisation.</h2>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-white/54 lg:justify-self-end">
                Development, DevOps and testing stay under one roof, so responsibility does not get passed around when the work gets difficult.
              </p>
            </div>

            <div className="mt-14 grid overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.025] lg:grid-cols-3">
              {services.map((service) => (
                <article key={service.title} className="group border-b border-white/10 p-7 last:border-b-0 md:p-9 lg:border-b-0 lg:border-r lg:last:border-r-0">
                  <span className="text-sm font-semibold text-asca-orange">{service.number}</span>
                  <h3 className="mt-12 text-2xl font-semibold tracking-[-0.03em] text-white md:text-3xl">{service.title}</h3>
                  <p className="mt-4 leading-7 text-white/52">{service.text}</p>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/58">{tag}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 md:px-10 md:pb-32 lg:px-12">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-asca-panel">
            <div className="grid lg:grid-cols-2">
              <div className="min-h-[420px] overflow-hidden lg:min-h-[650px]">
                <img src={photos.team} alt="Software team working together" className="h-full w-full object-cover grayscale-[18%]" />
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12 lg:p-14">
                <p className="eyebrow">Regulated industries</p>
                <h2 className="section-title mt-3">Domain knowledge where mistakes are expensive.</h2>
                <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
                  {industries.map(([name, text], index) => (
                    <div key={name} className="grid grid-cols-[44px_1fr] gap-4 py-5">
                      <span className="text-sm text-asca-orange">0{index + 1}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{name}</h3>
                        <p className="mt-1 text-sm leading-6 text-white/48">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#0d1116] px-6 py-24 md:px-10 md:py-32 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="eyebrow">Our product</p>
              <h2 className="section-title mt-3">myQAbee</h2>
              <p className="mt-5 max-w-xl text-xl leading-8 text-white/62">
                Codeless QA automation designed for repeatable testing across environments and devices.
              </p>
              <div className="mt-8 space-y-4">
                {['Codeless test creation', 'No scripts to write', 'Multi-device workflows'].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-white/78">
                    <CheckCircle2 size={18} className="text-asca-orange" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10">
              <img src={photos.servers} alt="Data centre infrastructure" className="aspect-[4/3] h-full w-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            </div>
          </div>
        </section>

        <section className="px-6 py-24 md:px-10 md:py-32 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 border-b border-white/10 pb-20 lg:grid-cols-2 lg:items-end">
              <div>
                <p className="eyebrow">Security & compliance</p>
                <h2 className="section-title mt-3">Reliable by design.</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:justify-self-end">
                {['EU GDPR', 'ISO 9001', 'ISO 27001'].map((item) => (
                  <div key={item} className="flex min-h-24 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-5">
                    <ShieldCheck size={19} className="shrink-0 text-asca-orange" />
                    <span className="font-medium text-white/78">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div id="contact" className="grid gap-10 pt-20 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="eyebrow">Stay in touch</p>
                <h2 className="mt-3 max-w-lg text-4xl font-semibold tracking-[-0.045em] text-white md:text-5xl">Tell us where to continue the conversation.</h2>
                <p className="mt-5 max-w-md leading-7 text-white/48">
                  This custom form is ready to connect to Google Sheets or Apps Script once the event workflow is confirmed.
                </p>
              </div>

              <form className="grid gap-3 sm:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
                <input className="field" placeholder="Name" />
                <input className="field" placeholder="Company" />
                <input className="field sm:col-span-2" placeholder="Email" type="email" />
                <textarea className="field min-h-32 sm:col-span-2" placeholder="Message" />
                <button className="mt-2 inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-white px-6 font-semibold text-black transition hover:bg-asca-orange sm:col-span-2" type="submit">
                  Submit details <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="px-4 pb-4 md:px-6 md:pb-6">
          <Link
            to="/quiz"
            className="group relative mx-auto flex min-h-[46vh] max-w-[1600px] items-end overflow-hidden rounded-[2rem] border border-asca-orange/35 bg-asca-orange p-7 text-black transition duration-500 hover:brightness-105 md:min-h-[54vh] md:p-12"
          >
            <div className="absolute -right-20 -top-28 size-[420px] rounded-full border border-black/10 md:size-[620px]" />
            <div className="absolute -right-6 -top-10 size-[260px] rounded-full border border-black/10 md:size-[440px]" />
            <div className="relative flex w-full items-end justify-between gap-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/55">Ready?</p>
                <h2 className="mt-3 max-w-5xl text-[clamp(3.8rem,10vw,9rem)] font-semibold leading-[0.82] tracking-[-0.07em]">
                  Take the quiz.
                </h2>
              </div>
              <div className="hidden size-20 shrink-0 place-items-center rounded-full bg-black text-white transition group-hover:translate-x-1 md:grid">
                <ArrowRight size={30} />
              </div>
            </div>
          </Link>
        </section>
      </main>
    </div>
  )
}
