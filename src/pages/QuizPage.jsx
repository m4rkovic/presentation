import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Check, Clock3, Trophy, Wifi, WifiOff, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { eventConfig } from '../data/eventConfig.js'
import { questionPool } from '../data/questionPool.js'
import {
  flushQuizSubmissions,
  getPendingSubmissions,
  persistQuizSubmission,
} from '../lib/quizSession.js'
import { getEventSource, trackEvent } from '../lib/analytics.js'

function shuffle(array) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildQuestionSet() {
  const aiQuestions = questionPool.filter((question) => question.type === 'aiImageCompare')
  const standardQuestions = questionPool.filter((question) => question.type !== 'aiImageCompare')
  const max = Math.min(eventConfig.quiz.maxQuestions, questionPool.length)
  const count =
    eventConfig.quiz.minQuestions +
    Math.floor(Math.random() * (max - eventConfig.quiz.minQuestions + 1))

  const selectedAi = shuffle(aiQuestions).slice(0, 1)
  const selectedStandard = shuffle(standardQuestions).slice(0, count - selectedAi.length)

  return shuffle([...selectedStandard, ...selectedAi])
}

function getPrizeOutcome({ accuracy, elapsedSeconds }) {
  if (accuracy === 1 && elapsedSeconds <= eventConfig.quiz.fastTrackThresholdSeconds) {
    return eventConfig.prizes.tier1
  }

  if (accuracy === 1) {
    return eventConfig.prizes.tier2
  }

  return eventConfig.prizes.tier3
}

export default function QuizPage() {
  const navigate = useNavigate()
  const answerLock = useRef(false)

  const [stage, setStage] = useState('intro')
  const [sessionQuestions, setSessionQuestions] = useState([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [responses, setResponses] = useState([])
  const [sessionStartedAt, setSessionStartedAt] = useState(null)
  const [timeLeft, setTimeLeft] = useState(eventConfig.quiz.defaultTimePerQuestion)
  const [resultMeta, setResultMeta] = useState(null)
  const [resetCountdown, setResetCountdown] = useState(eventConfig.quiz.kioskResetSeconds)
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  )
  const [pendingCount, setPendingCount] = useState(() => getPendingSubmissions().length)

  const currentQuestion = sessionQuestions[questionIndex]

  const accuracy = useMemo(() => {
    if (!sessionQuestions.length) return 0
    return correctCount / sessionQuestions.length
  }, [correctCount, sessionQuestions.length])

  useEffect(() => {
    trackEvent('quiz_page_view', { eventSlug: eventConfig.slug })
  }, [])

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      const flushed = flushQuizSubmissions()
      setPendingCount(getPendingSubmissions().length)
      if (flushed) {
        trackEvent('offline_quiz_submissions_flushed', { count: flushed })
      }
    }

    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (stage !== 'active' || !currentQuestion) return
    answerLock.current = false
    setTimeLeft(currentQuestion.timeLimit || eventConfig.quiz.defaultTimePerQuestion)
  }, [questionIndex, currentQuestion, stage])

  useEffect(() => {
    if (stage !== 'active' || !currentQuestion) return undefined

    const timer = window.setTimeout(() => {
      if (timeLeft <= 1) {
        handleAnswer(null)
      } else {
        setTimeLeft((value) => value - 1)
      }
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [timeLeft, stage, currentQuestion])

  useEffect(() => {
    if (stage !== 'result') return undefined

    setResetCountdown(eventConfig.quiz.kioskResetSeconds)

    const interval = window.setInterval(() => {
      setResetCountdown((value) => {
        if (value <= 1) {
          window.clearInterval(interval)
          resetAndGoHome()
          return 0
        }

        return value - 1
      })
    }, 1000)

    return () => window.clearInterval(interval)
  }, [stage])

  function startQuiz() {
    const questions = buildQuestionSet()

    setSessionQuestions(questions)
    setQuestionIndex(0)
    setCorrectCount(0)
    setResponses([])
    setSessionStartedAt(Date.now())
    setResultMeta(null)
    answerLock.current = false
    setStage('active')

    trackEvent('quiz_started', {
      eventSlug: eventConfig.slug,
      questionCount: questions.length,
      hasAiChallenge: questions.some((question) => question.type === 'aiImageCompare'),
    })
  }

  function resetAndGoHome() {
    setStage('intro')
    setSessionQuestions([])
    setQuestionIndex(0)
    setCorrectCount(0)
    setResponses([])
    setSessionStartedAt(null)
    setResultMeta(null)
    answerLock.current = false
    navigate('/')
  }

  function finishQuiz(nextCorrectCount, nextResponses) {
    const finishedAt = Date.now()
    const elapsedSeconds = Math.max(
      1,
      Math.round((finishedAt - sessionStartedAt) / 1000),
    )
    const finalAccuracy = nextCorrectCount / sessionQuestions.length
    const outcome = getPrizeOutcome({
      accuracy: finalAccuracy,
      elapsedSeconds,
    })

    const payload = {
      eventSlug: eventConfig.slug,
      source: getEventSource(),
      finishedAt: new Date(finishedAt).toISOString(),
      score: nextCorrectCount,
      totalQuestions: sessionQuestions.length,
      accuracy: finalAccuracy,
      elapsedSeconds,
      averageSecondsPerQuestion: Number(
        (elapsedSeconds / sessionQuestions.length).toFixed(2),
      ),
      prizeTier: outcome.label,
      responses: nextResponses,
    }

    const submissionState = persistQuizSubmission(payload)

    setPendingCount(getPendingSubmissions().length)
    setCorrectCount(nextCorrectCount)
    setResultMeta({
      outcome,
      elapsedSeconds,
      averageSecondsPerQuestion: payload.averageSecondsPerQuestion,
      submissionState,
    })
    setStage('result')

    trackEvent('quiz_completed', {
      eventSlug: eventConfig.slug,
      score: nextCorrectCount,
      totalQuestions: sessionQuestions.length,
      accuracy: finalAccuracy,
      elapsedSeconds,
      prizeTier: outcome.label,
    })
  }

  function handleAnswer(answerIndex) {
    if (!currentQuestion || answerLock.current) return

    answerLock.current = true

    const isCorrect = answerIndex === currentQuestion.correctAnswer
    const nextCorrectCount = correctCount + (isCorrect ? 1 : 0)
    const nextResponses = [
      ...responses,
      {
        questionId: currentQuestion.id,
        type: currentQuestion.type,
        selectedAnswer: answerIndex,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect,
        timeSpentSeconds:
          (currentQuestion.timeLimit || eventConfig.quiz.defaultTimePerQuestion) -
          Math.max(timeLeft, 0),
      },
    ]

    if (questionIndex === sessionQuestions.length - 1) {
      finishQuiz(nextCorrectCount, nextResponses)
      return
    }

    setResponses(nextResponses)
    setCorrectCount(nextCorrectCount)
    setQuestionIndex((index) => index + 1)
  }

  const progress = sessionQuestions.length
    ? ((questionIndex + 1) / sessionQuestions.length) * 100
    : 0

  const timePercent = currentQuestion
    ? Math.max(
        0,
        (timeLeft /
          (currentQuestion.timeLimit || eventConfig.quiz.defaultTimePerQuestion)) *
          100,
      )
    : 0

  if (stage === 'intro') {
    return (
      <main className="min-h-[100svh] bg-asca-bg px-5 py-8 text-white md:grid md:place-items-center md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: .85, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl rounded-[30px] border border-white/10 bg-asca-panel p-6 shadow-2xl shadow-black/30 md:p-10"
        >
          <div className="flex items-start justify-between gap-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-sm font-medium text-white/50 transition hover:text-white"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
                isOnline
                  ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                  : 'border-amber-400/20 bg-amber-400/10 text-amber-300'
              }`}
            >
              {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
              {isOnline ? 'Online' : `Offline · ${pendingCount} queued`}
            </div>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.2em] text-asca-orange">
                {eventConfig.campaignTitle}
              </p>
              <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[.92] tracking-[-.055em] md:text-7xl">
                Test your tech instincts.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/60">
                {eventConfig.studentIntro}
              </p>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[.03] p-4">
                  <div className="text-sm text-white/45">Question set</div>
                  <div className="mt-2 text-xl font-semibold">
                    {eventConfig.quiz.minQuestions}–{eventConfig.quiz.maxQuestions} random
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[.03] p-4">
                  <div className="text-sm text-white/45">Challenge modes</div>
                  <div className="mt-2 text-xl font-semibold">Trivia + AI images</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[.03] p-4">
                  <div className="text-sm text-white/45">Scoring</div>
                  <div className="mt-2 text-xl font-semibold">Accuracy + speed</div>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-black/20 p-6 md:p-7">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[.16em] text-asca-orange">
                <Trophy size={16} /> Prize logic
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/[.025] p-4">
                  <div className="font-semibold">Tier 1 contender</div>
                  <div className="mt-1 text-sm leading-6 text-white/50">
                    Perfect accuracy plus a very fast time.
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[.025] p-4">
                  <div className="font-semibold">Tier 2 unlocked</div>
                  <div className="mt-1 text-sm leading-6 text-white/50">
                    100% accuracy earns a secondary reward.
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[.025] p-4">
                  <div className="font-semibold">Tier 3 unlocked</div>
                  <div className="mt-1 text-sm leading-6 text-white/50">
                    Finish the quiz and join the participation giveaway.
                  </div>
                </div>
              </div>

              <button
                onClick={startQuiz}
                className="mt-8 min-h-14 w-full rounded-2xl bg-asca-orange px-6 font-semibold text-black transition hover:brightness-105"
              >
                Start quiz
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    )
  }

  if (stage === 'result' && resultMeta) {
    const pendingText =
      resultMeta.submissionState.status === 'queued'
        ? `Saved offline. ${resultMeta.submissionState.queuedCount} submission(s) waiting to sync.`
        : 'Result stored for this event prototype.'

    return (
      <main className="grid min-h-[100svh] place-items-center bg-asca-bg px-5 py-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: .985, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: .8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl rounded-[30px] border border-white/10 bg-asca-panel p-8 shadow-2xl shadow-black/30 md:p-12"
        >
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <div className="grid size-20 place-items-center rounded-full bg-emerald-500/12 text-emerald-400">
                <Check size={42} strokeWidth={2.5} />
              </div>
              <p className="mt-7 text-sm font-semibold uppercase tracking-[.18em] text-asca-orange">
                {resultMeta.outcome.label}
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-.045em] md:text-6xl">
                {resultMeta.outcome.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/58">
                {resultMeta.outcome.description}
              </p>
              <p className="mt-4 text-sm leading-6 text-white/42">
                Reward track: {resultMeta.outcome.reward}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
                <div className="text-sm text-white/42">Score</div>
                <div className="mt-2 text-3xl font-semibold">
                  {correctCount} / {sessionQuestions.length}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
                <div className="text-sm text-white/42">Accuracy</div>
                <div className="mt-2 text-3xl font-semibold">
                  {Math.round(accuracy * 100)}%
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
                <div className="text-sm text-white/42">Total time</div>
                <div className="mt-2 text-3xl font-semibold">
                  {resultMeta.elapsedSeconds}s
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
                <div className="text-sm text-white/42">Avg / question</div>
                <div className="mt-2 text-3xl font-semibold">
                  {resultMeta.averageSecondsPerQuestion}s
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 rounded-[24px] border border-white/10 bg-black/20 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-semibold">Show this screen to the ASCALab team.</div>
              <div className="mt-1 text-sm leading-6 text-white/48">{pendingText}</div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.03] px-4 py-2 text-sm text-white/72">
              <Clock3 size={15} /> Resetting in {resetCountdown}s
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={startQuiz}
              className="min-h-14 flex-1 rounded-2xl border border-white/10 bg-white/[.03] px-6 font-semibold transition hover:bg-white/[.06]"
            >
              Play again
            </button>
            <button
              onClick={resetAndGoHome}
              className="min-h-14 flex-1 rounded-2xl bg-asca-orange px-6 font-semibold text-black transition hover:brightness-105"
            >
              Done
            </button>
          </div>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-[100svh] bg-asca-bg px-5 py-7 text-white md:grid md:place-items-center md:px-8">
      <div className="w-full max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[.16em] text-asca-orange">
              {eventConfig.eventName}
            </div>
            <div className="mt-2 text-sm font-semibold text-white/55">
              Question {questionIndex + 1} / {sessionQuestions.length} ·{' '}
              {currentQuestion.category}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
                isOnline
                  ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                  : 'border-amber-400/20 bg-amber-400/10 text-amber-300'
              }`}
            >
              {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
              {isOnline ? 'Online' : `Offline · ${pendingCount} queued`}
            </div>
            <span className="rounded-full border border-white/10 bg-white/[.04] px-4 py-2 tabular-nums text-sm font-semibold">
              00:{String(timeLeft).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/8">
          <div
            className="h-full bg-asca-orange transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <section className="rounded-[30px] border border-white/10 bg-asca-panel p-6 md:p-10">
          <div className="mb-8 h-1 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full bg-white/60 transition-all duration-1000"
              style={{ width: `${timePercent}%` }}
            />
          </div>

          <h1 className="max-w-4xl text-3xl font-semibold tracking-[-.035em] md:text-5xl">
            {currentQuestion.question}
          </h1>

          {currentQuestion.prompt ? (
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/52">
              {currentQuestion.prompt}
            </p>
          ) : null}

          {currentQuestion.type === 'multipleChoice' ? (
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {currentQuestion.answers.map((answer, index) => (
                <button
                  key={answer}
                  onClick={() => handleAnswer(index)}
                  className="min-h-20 rounded-2xl border border-white/10 bg-white/[.035] px-5 py-4 text-left font-medium text-white/82 transition hover:border-asca-orange/60 hover:bg-asca-orange hover:text-black active:scale-[.99]"
                >
                  {answer}
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {[
                { ...currentQuestion.media.left, value: 0 },
                { ...currentQuestion.media.right, value: 1 },
              ].map((image) => (
                <button
                  key={image.label}
                  onClick={() => handleAnswer(image.value)}
                  className="group overflow-hidden rounded-[24px] border border-white/10 bg-black/20 text-left transition hover:border-asca-orange/60"
                >
                  <div className="overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 p-5">
                    <div>
                      <div className="text-sm uppercase tracking-[.16em] text-white/42">
                        {image.label}
                      </div>
                      <div className="mt-1 text-lg font-semibold">
                        Select {image.label}
                      </div>
                    </div>
                    <div className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-white/60">
                      Choose
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
