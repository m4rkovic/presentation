import { useEffect, useMemo, useState } from 'react'
import { Check, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { passingScore, quizQuestions } from '../data/quizQuestions.js'

export default function QuizPage() {
  const navigate = useNavigate()
  const [questionIndex, setQuestionIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const currentQuestion = quizQuestions[questionIndex]
  const [timeLeft, setTimeLeft] = useState(currentQuestion?.timeLimit ?? 15)

  const passed = useMemo(
    () => correctCount / quizQuestions.length >= passingScore,
    [correctCount],
  )

  function advance(answerIndex = null) {
    const isCorrect = answerIndex === currentQuestion.correctAnswer
    const nextCorrectCount = correctCount + (isCorrect ? 1 : 0)

    if (questionIndex === quizQuestions.length - 1) {
      setCorrectCount(nextCorrectCount)
      setFinished(true)
      return
    }

    setCorrectCount(nextCorrectCount)
    setQuestionIndex((index) => index + 1)
  }

  useEffect(() => {
    if (finished) return
    setTimeLeft(currentQuestion.timeLimit)
  }, [questionIndex, currentQuestion, finished])

  useEffect(() => {
    if (finished) return
    if (timeLeft <= 0) {
      advance(null)
      return
    }

    const timer = window.setTimeout(() => setTimeLeft((time) => time - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [timeLeft, finished])

  if (finished) {
    return (
      <main className="grid min-h-screen place-items-center bg-asca-cream px-5">
        <div className="w-full max-w-xl rounded-[2rem] bg-white p-10 text-center shadow-sm">
          <div className={`mx-auto grid size-20 place-items-center rounded-full ${passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {passed ? <Check size={42} strokeWidth={2.5} /> : <X size={42} strokeWidth={2.5} />}
          </div>
          <h1 className="mt-7 text-4xl font-semibold tracking-[-0.04em]">
            {passed ? 'You passed the quiz.' : 'Not this time.'}
          </h1>
          <p className="mt-3 text-asca-gray">
            Score: {correctCount} / {quizQuestions.length}
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-8 rounded-full bg-asca-dark px-6 py-3 font-semibold text-white transition hover:bg-asca-orange"
          >
            OK
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="grid min-h-screen place-items-center bg-asca-cream px-5 py-10">
      <div className="w-full max-w-3xl">
        <div className="mb-6 flex items-center justify-between text-sm font-semibold">
          <span>Question {questionIndex + 1} / {quizQuestions.length}</span>
          <span className="rounded-full bg-white px-4 py-2 tabular-nums shadow-sm">00:{String(timeLeft).padStart(2, '0')}</span>
        </div>

        <section className="rounded-[2rem] bg-white p-7 shadow-sm sm:p-10">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{currentQuestion.question}</h1>
          <div className="mt-8 grid gap-3">
            {currentQuestion.answers.map((answer, index) => (
              <button
                key={answer}
                onClick={() => advance(index)}
                className="rounded-2xl bg-asca-surface px-5 py-4 text-left font-medium transition hover:bg-asca-orange hover:text-white"
              >
                {answer}
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
