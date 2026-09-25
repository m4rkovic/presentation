import { ArrowDown, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const reveal = {
  hidden: { opacity: 0, y: 34 },
  show: { opacity: 1, y: 0, transition: { duration: .72, ease: [0.22, 1, 0.36, 1] } },
}

const revealLeft = {
  hidden: { opacity: 0, x: -46 },
  show: { opacity: 1, x: 0, transition: { duration: .78, ease: [0.22, 1, 0.36, 1] } },
}

const revealRight = {
  hidden: { opacity: 0, x: 46 },
  show: { opacity: 1, x: 0, transition: { duration: .78, ease: [0.22, 1, 0.36, 1] } },
}

const imageReveal = {
  hidden: { opacity: 0, scale: 1.055 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.05, ease: [0.22, 1, 0.36, 1] } },
}

const serviceStories = [
  {
    title: 'Development',
    headline: 'Build the thing that has to keep working.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=88',
    copy: 'We design and deliver software for organisations where the product has to survive real users, real integrations, real regulations and years of change. That can mean customer portals, internal platforms, data-heavy applications, core-system extensions or a new product sitting on top of an old estate.',
    detail: 'The work starts with understanding the business process and the systems already in the room. From there, we shape the architecture, build in sensible increments and keep the result maintainable enough for the next team to understand.',
  },
  {
    title: 'DevOps',
    headline: 'Make delivery boring. In the best possible way.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1800&q=88',
    copy: 'Cloud environments, deployment pipelines, observability and infrastructure are part of the product. We help teams replace fragile manual steps with repeatable delivery across Azure, AWS and GCP.',
    detail: 'Infrastructure as code, CI/CD, migration, monitoring and release discipline are not the glamorous part of software. They are the part everyone suddenly cares about when a release fails on Friday afternoon. We prefer to make that moment less interesting.',
  },
  {
    title: 'Testing',
    headline: 'Confidence before production, not explanations after it.',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1800&q=88',
    copy: 'Quality engineering is treated as a continuous part of delivery. We combine manual testing, automation, device coverage and repeatable validation so teams can move quickly without turning production into an experiment.',
    detail: 'That same experience led to myQAbee, our codeless QA automation product. It is built around a simple idea: broad, repeatable test coverage should not require every team to maintain its own mountain of scripts.',
  },
]

const industryStories = [
  {
    title: 'Banking',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=88',
    copy: 'Core platforms, data warehouses, reporting, customer applications and integrations often span years of accumulated technology. We modernise around the parts that already work instead of treating every programme as an excuse for a heroic rewrite.',
  },
  {
    title: 'Insurance',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2000&q=88',
    copy: 'Policy administration, claims, billing, reporting and risk logic are dense with business rules. Small changes can have very non-small consequences, so analysis, traceability and controlled delivery matter as much as code.',
  },
  {
    title: 'Energy',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=2000&q=88',
    copy: 'Metering, billing, operational data and reporting demand systems that remain dependable under volume. We work with the constraints: large datasets, critical integrations, legacy estates and the need to explain exactly what happened.',
  },
  {
    title: 'Telecom',
    image: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=2000&q=88',
    copy: 'Subscriber systems, self-service platforms, integrations and operational data create constant change. The job is not to stop that change. It is to make it safer, clearer and easier to ship.',
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
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,12,.24),rgba(7,9,12,.64)_60%,#07090c_100%)]" />

          <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1500px] flex-col px-6 py-7 md:px-10 md:py-9 lg:px-14">
            <div className="flex items-center justify-between">
              <img src="/ascalab-logo.svg" alt="ASCALab" className="h-8 w-auto brightness-[1.25] md:h-10" />
              <span className="hidden text-sm text-white/48 sm:block">Belgrade · Niš · Europe</span>
            </div>

            <div className="mt-auto max-w-5xl pb-10 md:pb-16">
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .7 }}
                className="max-w-5xl text-[clamp(3.5rem,8.5vw,8.8rem)] font-semibold leading-[.89] tracking-[-0.065em]"
              >
                Built to fit.<br />
                <span className="text-white/48">Designed to last.</span>
              </motion.h1>

              <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <p className="max-w-2xl text-lg leading-8 text-white/68 md:text-xl">
                  Software engineering, quality and infrastructure for organisations where technology is part of the business, not decoration around it.
                </p>
                <a href="#statement" className="inline-flex min-h-12 shrink-0 items-center gap-2 text-sm font-semibold text-white/72 transition hover:text-white">
                  Explore <ArrowDown size={17} />
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
                Clear thinking.<br />
                Better software.<br />
                <span className="text-white/38">Less corporate fog.</span>
              </h2>
              <p className="mt-10 max-w-2xl text-xl leading-9 text-white/58 md:text-2xl md:leading-10">
                ASCALab designs and delivers practical digital solutions for complex business problems.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="pb-24 md:pb-36">
          <motion.div className="mx-auto max-w-[1500px] px-6 md:px-10 lg:px-14" variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .35 }}>
            <h2 className="max-w-4xl text-4xl font-semibold tracking-[-.045em] md:text-6xl">
              We do three things. We prefer to do them properly.
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

        <section className="px-6 py-24 md:px-10 md:py-36 lg:px-14">
          <div className="mx-auto max-w-[1500px]">
            <motion.div className="max-w-5xl" variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .4 }}>
              <h2 className="text-[clamp(3.3rem,6.8vw,7rem)] font-semibold leading-[.95] tracking-[-.06em]">
                Software gets serious when somebody's money, policy, power or connection depends on it.
              </h2>
              <p className="mt-8 max-w-2xl text-xl leading-9 text-white/48">
                That is the environment we know. Four industries, different rules, same expectation: the system has to be trustworthy.
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
                  <h3 className="text-[clamp(3.5rem,8vw,8rem)] font-semibold leading-none tracking-[-.065em]">
                    {industry.title}
                  </h3>
                  <p className={`mt-7 text-lg leading-8 text-white/68 md:text-xl ${index % 2 ? 'ml-auto' : ''}`}>
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
                Quality became a product.
              </h2>
              <p className="mt-7 max-w-xl text-xl leading-9 text-white/56">
                myQAbee grew out of the testing work itself: a codeless way to automate broad scenarios across environments and devices without asking every team to become an automation framework company on the side.
              </p>
              <p className="mt-6 max-w-xl leading-7 text-white/38">
                This block will eventually carry real product screenshots, features and event-specific messaging. For now it holds the rhythm and space the final content will need.
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
            <motion.h2 className="max-w-2xl text-5xl font-semibold leading-[.98] tracking-[-.055em] md:text-7xl" variants={revealLeft} initial="hidden" whileInView="show" viewport={{ once: true, amount: .3 }}>
              Enough process to stay in control. Not enough to hide behind it.
            </motion.h2>
            <motion.div className="space-y-8 self-end text-lg leading-8 text-white/56" variants={revealRight} initial="hidden" whileInView="show" viewport={{ once: true, amount: .3 }}>
              <p>
                We start with the system as it exists, not the version of it living in a PowerPoint diagram. That means talking to the people who use it, tracing dependencies and understanding which parts of the business cannot simply stop while a new solution is being built.
              </p>
              <p>
                Delivery then moves in pieces that can be understood and validated early. Analysis, architecture, implementation, testing and operations stay close enough together that important details are not lost in a chain of handovers.
              </p>
              <p>
                The engagement model can change. The expectation does not: clear ownership, visible progress and fewer surprises in production.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-24 md:px-10 md:py-32 lg:px-14">
          <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <motion.div variants={revealLeft} initial="hidden" whileInView="show" viewport={{ once: true, amount: .3 }}>
              <h2 className="max-w-xl text-4xl font-semibold tracking-[-.045em] md:text-6xl">
                Leave your details.
              </h2>
              <p className="mt-5 max-w-md text-lg leading-8 text-white/46">
                This will be connected to the final Google form / Sheets flow once the event fields are confirmed.
              </p>
            </motion.div>

            <motion.form variants={revealRight} initial="hidden" whileInView="show" viewport={{ once: true, amount: .3 }} className="grid gap-3 rounded-[28px] border border-white/9 bg-asca-panel p-5 md:p-7" onSubmit={(e) => e.preventDefault()}>
              <input className="field" placeholder="Name" />
              <input className="field" placeholder="Company" />
              <input className="field" placeholder="Email" type="email" />
              <textarea className="field min-h-32 resize-none" placeholder="Message" />
              <button className="mt-2 min-h-14 rounded-2xl bg-white px-6 font-semibold text-black transition hover:bg-asca-orange" type="submit">
                Submit
              </button>
            </motion.form>
          </div>
        </section>

        <section className="px-4 pb-4 md:px-8 md:pb-8">
          <div className="mx-auto max-w-[1180px]">
            <Link
              to="/quiz"
              className="quiz-cta group relative flex min-h-[27svh] items-end justify-between gap-6 overflow-hidden rounded-[28px] bg-asca-orange p-6 text-black transition duration-500 md:min-h-[30svh] md:rounded-[34px] md:p-9"
            >
            <div className="relative z-10">
              <p className="text-base font-semibold opacity-55">One more thing.</p>
              <h2 className="mt-3 text-[clamp(2.7rem,6vw,6.5rem)] font-semibold leading-[.9] tracking-[-.06em]">
                Take the quiz.
              </h2>
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
