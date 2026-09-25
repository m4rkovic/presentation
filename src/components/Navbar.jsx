import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-asca-cream/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="flex items-center">
          <img src="/ascalab-logo.svg" alt="ASCALab" className="h-7 w-auto" />
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <a href="#services" className="hidden transition hover:text-asca-orange sm:block">Services</a>
          <a href="#contact" className="hidden transition hover:text-asca-orange sm:block">Contact</a>
          <Link
            to="/quiz"
            className="rounded-full bg-asca-dark px-4 py-2 text-white transition hover:bg-asca-orange"
          >
            Take the quiz
          </Link>
        </nav>
      </div>
    </header>
  )
}
