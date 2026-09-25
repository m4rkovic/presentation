import { ArrowDown, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const services = [
  {
    kicker: 'Development',
    title: 'Software that has to survive the real world.',
    text: 'We work on systems where reliability matters more than novelty: core business platforms, portals, integrations, data-heavy applications and internal tools. The focus is practical architecture, maintainable code and a delivery model that can live inside an existing organisation without creating another layer of chaos.',
    detail: 'From discovery and solution design through implementation, migration and production support, the team can join at the point where the work actually starts.',
  },
  {
    kicker: 'DevOps',
    title: 'Infrastructure should disappear into the background.',
    text: 'Cloud environments, delivery pipelines, observability and release processes are treated as part of the product, not as an afterthought. We help teams reduce fragile manual steps and make deployments more repeatable across Azure, AWS and GCP.',
    detail: 'That includes infrastructure as code, migration work, CI/CD, monitoring and the boring operational detail that usually becomes very interesting only when something breaks at 2 a.m.',
  },
  {
    kicker: 'Testing',
    title: 'Quality is a system, not a final checkbox.',
    text: 'Testing is built into the delivery process across complex application portfolios. Manual testing, automation, device coverage and repeatable validation are combined so releases can move faster without turning production into a live experiment.',
    detail: 'Our own codeless automation product, myQAbee, comes from the same problem space: making broad test coverage easier to manage without forcing every team to build a custom automation stack.',
  },
]

const industries = [
  {
    title: 'Banking',
    text: 'Core systems, data warehouses, reporting, customer-facing applications and integrations often sit across years of accumulated technology. We help modernise around what already works instead of pretending every system can be replaced in one heroic rewrite.',
  },
  {
    title: 'Insurance',
    text: 'Policy administration, claims, billing, reporting and risk logic need careful changes because the business rules are dense and the consequences of small mistakes are not small. This is exactly the kind of environment our teams are used to working in.',
  },
  {
    title: 'Energy',
    text: 'Metering, billing, operational data and reporting demand systems that are dependable, traceable and able to handle large volumes without becoming opaque. We build around those constraints instead of fighting them.',
  },
  {
    title: 'Telecom',
    text: 'Subscriber platforms, integrations, self-service applications and large operational datasets create a constant flow of change. Our work focuses on making that change safer, clearer and easier to ship.',
  },
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
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,12,.28),rgba(7,9,12,.68)_60%,#07090c_100%)]" />

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
                  We build and support software for organisations that cannot afford vague delivery, fragile systems or fashionable technology for its own sake.
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
              <div key={label} className="md:px-8 md:first:pl-0">
                <div className="text-4xl font-semibold tracking-[-.05em] md:text-5xl">{value}</div>
                <div className="mt-2 max-w-40 text-sm leading-5 text-white/44">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-24 md:px-10 md:py-32 lg:px-14">
          <div className="mx-auto max-w-[1500px]">
            <div className="max-w-4xl">
              <p className="eyebrow">What we do</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-.045em] md:text-6xl">
                We join complex projects where technology has to answer to the business.
              </h2>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-white/52 md:text-xl">
                ASCALab works across development, infrastructure and quality engineering. The shape changes from client to client, but the principle stays the same: understand the existing system, reduce unnecessary risk and leave the product easier to operate than we found it.
              </p>
            </div>

            <div className="mt-20 space-y-24 md:mt-28 md:space-y-32">
              {services.map((service, index) => (
                <article key={service.kicker} className="service-editorial grid gap-8 md:grid-cols-[180px_1fr] lg:grid-cols-[260px_1fr]">
                  <div className="relative">
                    <span className="service-index">0{index + 1}</span>
                    <p className="eyebrow relative z-10 pt-3">{service.kicker}</p>
                  </div>
                  <div className="max-w-4xl border-t border-white/12 pt-8">
                    <h3 className="text-3xl font-semibold tracking-[-.04em] md:text-5xl">{service.title}</h3>
                    <div className="mt-7 grid gap-6 lg:grid-cols-2">
                      <p className="text-lg leading-8 text-white/68">{service.text}</p>
                      <p className="leading-7 text-white/42">{service.detail}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="photo-band relative mx-4 min-h-[74svh] overflow-hidden rounded-[30px] md:mx-8 md:rounded-[38px]">
          <img
            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2200&q=88"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,8,11,.94),rgba(6,8,11,.58)_50%,rgba(6,8,11,.2))]" />
          <div className="relative z-10 mx-auto flex min-h-[74svh] max-w-[1500px] items-end px-7 py-10 md:px-12 md:py-14">
            <div className="max-w-2xl">
              <p className="eyebrow">Built for regulated environments</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-7xl">
                Complexity is normal. Losing control of it isn't.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/62">
                Banking, insurance, energy and telecom all carry different operational and regulatory constraints. What they share is the need for systems that are understandable, testable and dependable long after the first release.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 md:px-10 md:py-32 lg:px-14">
          <div className="mx-auto max-w-[1500px]">
            <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
              <div className="lg:sticky lg:top-10 lg:self-start">
                <p className="eyebrow">Industries</p>
                <h2 className="mt-4 max-w-md text-4xl font-semibold tracking-[-.045em] md:text-6xl">
                  Different sectors. Same requirement: trust the system.
                </h2>
                <p className="mt-6 max-w-md leading-7 text-white/44">
                  The details change, but regulated businesses tend to share the same hard problems: old and new systems living together, critical data moving between them and changes that need to be explained as clearly as they are implemented.
                </p>
              </div>

              <div>
                {industries.map((industry, index) => (
                  <article key={industry.title} className="industry-story border-t border-white/12 py-10 md:py-14">
                    <div className="grid gap-5 md:grid-cols-[90px_1fr]">
                      <span className="text-sm font-semibold text-asca-orange">0{index + 1}</span>
                      <div>
                        <h3 className="text-4xl font-semibold tracking-[-.04em] md:text-5xl">{industry.title}</h3>
                        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/55">{industry.text}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 md:px-10 md:pb-32 lg:px-14">
          <div className="mx-auto grid max-w-[1500px] gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-stretch">
            <div className="relative min-h-[520px] overflow-hidden rounded-[30px]">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=88"
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,12,.1),rgba(7,9,12,.82))]" />
              <div className="relative z-10 flex h-full min-h-[520px] items-end p-7 md:p-10">
                <div>
                  <p className="eyebrow">myQAbee</p>
                  <h2 className="mt-3 text-4xl font-semibold tracking-[-.05em] md:text-6xl">
                    Codeless automation, built from real testing work.
                  </h2>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[30px] bg-[#101419] p-7 md:p-10">
              <div>
                <p className="text-lg leading-8 text-white/62">
                  myQAbee is our own codeless QA automation product. It is designed to reduce the amount of custom scripting needed to cover broad application portfolios and multi-device scenarios.
                </p>
                <p className="mt-6 leading-7 text-white/42">
                  For now this section is intentionally content-heavy enough to establish the rhythm of the page. Once the final event messaging is approved, we can replace the placeholder depth with product-specific features, screenshots, metrics or a short demo flow.
                </p>
              </div>
              <div className="mt-12 border-t border-white/10 pt-6 text-sm uppercase tracking-[.18em] text-white/36">
                Product · Testing · Automation
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 md:px-10 md:py-32 lg:px-14">
          <div className="mx-auto max-w-[1500px]">
            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
              <div>
                <p className="eyebrow">How we work</p>
                <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-.045em] md:text-6xl">
                  Enough process to stay in control. Not enough to slow everything down.
                </h2>
              </div>
              <div className="space-y-8 text-lg leading-8 text-white/55">
                <p>
                  We start by understanding the system as it exists, not as a diagram says it exists. That means talking to the people who use it, reading the constraints, mapping dependencies and identifying where change is genuinely risky.
                </p>
                <p>
                  From there, delivery is broken into pieces that can be validated early. Architecture, implementation, testing and operational concerns move together instead of waiting for one another in a sequence of handovers.
                </p>
                <p>
                  The exact engagement model can change. The expectation does not: clear ownership, visible progress and fewer surprises when software reaches production.
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
                This will be connected to the final Google form / Sheets flow once the event fields are confirmed.
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
