import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import QuizPage from './pages/QuizPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/quiz" element={<QuizPage />} />
    </Routes>
  )
}
