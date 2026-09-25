import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6 md:pt-5">
      <div className="pointer-events-auto mx-auto flex h-14 max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-black/45 px-4 shadow-2xl shadow-black/10 backdrop-blur-xl md:h-16 md:px-5">
        <Link to="/" className="flex items-center">
          <img src="/ascalab-logo.svg" alt="ASCALab" className="h-6 w-auto brightness-[1.12] md:h-7" />
        </Link>
        <a
          href="#contact"
          className="rounded-full border border-white/14 px-4 py-2 text-xs font-semibold text-white/78 transition hover:border-asca-orange/60 hover:text-asca-orange md:text-sm"
        >
          Connect
        </a>
      </div>
    </header>
  )
}
