import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar.jsx'

const services = [
  'Software Development',
  'Business Analysis',
  'Digital Transformation',
  'Consulting',
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-asca-cream text-asca-dark">
      <Navbar />

      <main>
        <section className="mx-auto flex min-h-screen max-w-7xl items-center px-5 pt-24 lg:px-8">
          <div className="max-w-5xl">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 text-sm font-semibold uppercase tracking-[0.24em] text-asca-orange"
            >
              Technology built around business
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="max-w-5xl text-5xl font-semibold tracking-[-0.05em] sm:text-7xl lg:text-8xl"
            >
              Clear thinking. Better software. Less corporate fog.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-8 max-w-2xl text-lg leading-8 text-asca-gray sm:text-xl"
            >
              ASCALab designs and delivers practical digital solutions for complex business problems.
            </motion.p>

            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              href="#services"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-asca-orange px-6 py-3 font-semibold text-white transition hover:scale-[1.02]"
            >
              Explore ASCALab <ArrowRight size={18} />
            </motion.a>
          </div>
        </section>

        <section id="services" className="bg-white px-5 py-28 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-asca-orange">What we do</p>
            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Serious work, presented like humans might actually want to read it.
            </h2>

            <div className="mt-14 grid gap-4 md:grid-cols-2">
              {services.map((service, index) => (
                <div
                  key={service}
                  className="rounded-[2rem] bg-asca-surface p-8 transition hover:-translate-y-1"
                >
                  <span className="text-sm font-semibold text-asca-orange">0{index + 1}</span>
                  <h3 className="mt-8 text-2xl font-semibold">{service}</h3>
                  <p className="mt-3 max-w-md leading-7 text-asca-gray">
                    Placeholder copy. We will replace this with the actual ASCALab offering once the content is locked.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="px-5 py-28 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-asca-orange">Contact</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Let’s build something useful.</h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-asca-gray">
                This block is ready for the custom form that will feed into Google Sheets / Apps Script later.
              </p>
            </div>

            <form className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8" onSubmit={(event) => event.preventDefault()}>
              <div className="grid gap-5">
                <input className="rounded-2xl bg-asca-surface px-4 py-4 outline-none ring-asca-orange focus:ring-2" placeholder="Name" />
                <input className="rounded-2xl bg-asca-surface px-4 py-4 outline-none ring-asca-orange focus:ring-2" placeholder="Company" />
                <input className="rounded-2xl bg-asca-surface px-4 py-4 outline-none ring-asca-orange focus:ring-2" placeholder="Email" type="email" />
                <textarea className="min-h-32 rounded-2xl bg-asca-surface px-4 py-4 outline-none ring-asca-orange focus:ring-2" placeholder="Message" />
                <button className="rounded-full bg-asca-dark px-5 py-3 font-semibold text-white transition hover:bg-asca-orange" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}
