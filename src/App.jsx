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

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/quiz" element={<QuizPage />} />
    </Routes>
  )
}
