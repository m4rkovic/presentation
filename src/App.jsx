import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import QuizPage from './pages/QuizPage.jsx'

export default function App() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== '/') return

    const phoneInput = document.querySelector('input[name="phone"]')
    if (phoneInput) phoneInput.placeholder = '+386...'
  }, [location.pathname])

  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) return

    const targetId = decodeURIComponent(location.hash.slice(1))
    let cancelled = false
    const timers = []

    const scrollToTarget = () => {
      if (cancelled) return
      const target = document.getElementById(targetId)
      if (!target) return
      target.scrollIntoView({ block: 'start', behavior: 'auto' })
    }

    requestAnimationFrame(() => requestAnimationFrame(scrollToTarget))
    ;[120, 350, 800, 1400].forEach((delay) => {
      timers.push(window.setTimeout(scrollToTarget, delay))
    })

    if (document.readyState !== 'complete') {
      window.addEventListener('load', scrollToTarget, { once: true })
    }

    return () => {
      cancelled = true
      timers.forEach((timer) => window.clearTimeout(timer))
      window.removeEventListener('load', scrollToTarget)
    }
  }, [location.pathname, location.hash])

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/quiz" element={<QuizPage />} />
    </Routes>
  )
}
