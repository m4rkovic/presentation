import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Clock3 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { eventConfig } from '../data/eventConfig.js'
import { questionPool } from '../data/questionPool.js'
import {
  flushQuizSubmissions,
  getPendingSubmissions,
  persistQuizSubmission,
} from '../lib/quizSession.js'
import { flushAnalytics, getEventSource, trackEvent } from '../lib/analytics.js'
import { isEventApiConfigured } from '../lib/eventApi.js'

function shuffle(array) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function prepareQuestion(question) {
  if (question.type === 'aiImageCompare') {
    const choices = [
      { ...question.media.left, originalIndex: 0, isCorrect: question.correctAnswer === 0 },
      { ...question.media.right, originalIndex: 1, isCorrect: question.correctAnswer === 1 },
    ]
    const shuffled = shuffle(choices)

    return {
      ...question,
      mediaChoices: shuffled.map((choice, index) => ({
        ...choice,
        label: `Image ${index === 0 ? 'A' : 'B'}`,
        value: index,
      })),
      correctAnswer: shuffled.findIndex((choice) => choice.isCorrect),
    }
  }

  const choices = question.answers.map((answer, index) => ({
    answer,
    originalIndex: index,
    isCorrect: index === question.correctAnswer,
  }))
  const shuffled = shuffle(choices)

  return {
    ...question,
    answers: shuffled.map((choice) => choice.answer),
    answerOrder: shuffled.map((choice) => choice.originalIndex),
    correctAnswer: shuffled.findIndex((choice) => choice.isCorrect),
  }
}

function preloadImage(src, timeoutMs = 5000) {
  return new Promise((resolve) => {
    const image = new Image()
    let settled = false

    const finish = (ok) => {
      if (settled) return
      settled = true
      resolve(ok)
    }

    const timeout = window.setTimeout(() => finish(false), timeoutMs)
    image.onload = () => {
      window.clearTimeout(timeout)
      finish(true)
    }
    image.onerror = () => {
      window.clearTimeout(timeout)
      finish(false)
    }
    image.src = src
  })
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

  return shuffle([...selectedStandard, ...selectedAi]).map(prepareQuestion)
}

function getPrizeOutcome({ accuracy, elapsedSeconds }) {
  if (accuracy === 1 && elapsedSeconds <= eventConfig.quiz.fastTrackThresholdSeconds) {
    return eventConfig.prizes.tier1
  }

  if (accuracy === 1) return eventConfig.prizes.tier2
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

  const currentQuestion = sessionQuestions[questionIndex]

  const accuracy = useMemo(() => {
    if (!sessionQuestions.length) return 0
    return correctCount / sessionQuestions.length
  }, [correctCount, sessionQuestions.length])

  useEffect(() => {
    trackEvent('quiz_page_view', { eventSlug: eventConfig.slug })

    const flush = async () => {
      const [quizResult, analyticsResult] = await Promise.all([
        flushQuizSubmissions(),
        flushAnalytics(),
      ])

      if (quizResult.sent > 0) {
        trackEvent('queued_quiz_results_sent', { count: quizResult.sent })
      }

      if (analyticsResult.sent > 0) {
        trackEvent('queued_analytics_sent', { count: analyticsResult.sent })
      }
    }

    flush()
    window.addEventListener('online', flush)
    return () => window.removeEventListener('online', flush)
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
      setResetCountdown((value) => Math.max(0, value - 1))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [stage])

  useEffect(() => {
    if (stage === 'result' && resetCountdown === 0) {
      resetAndGoHome()
    }
  }, [stage, resetCountdown])

  async function startQuiz() {
    let questions = buildQuestionSet()
    const aiQuestion = questions.find((question) => question.type === 'aiImageCompare')

    if (aiQuestion?.mediaChoices?.length) {
      const mediaReady = await Promise.all(
        aiQuestion.mediaChoices.map((choice) => preloadImage(choice.src)),
      )

      if (mediaReady.some((ready) => !ready)) {
        const alreadySelected = new Set(questions.map((question) => question.id))
        const replacement = shuffle(
          questionPool.filter(
            (question) =>
              question.type !== 'aiImageCompare' && !alreadySelected.has(question.id),
          ),
        )[0]

        questions = questions
          .filter((question) => question.type !== 'aiImageCompare')
          .concat(replacement ? [prepareQuestion(replacement)] : [])

        questions = shuffle(questions)
        trackEvent('ai_challenge_skipped', {
          eventSlug: eventConfig.slug,
          reason: 'media-unavailable',
        })
      }
    }

    setSessionQuestions(questions)
    setQuestionIndex(0)
    setCorrectCount(0)
    setResponses([])
    setSessionStartedAt(Date.now())
    setResultMeta(null)
    setResetCountdown(eventConfig.quiz.kioskResetSeconds)
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
    setResetCountdown(eventConfig.quiz.kioskResetSeconds)
    answerLock.current = false
    navigate('/')
  }

  async function finishQuiz(nextCorrectCount, nextResponses) {
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
      provisionalPrizeTier: outcome.label,
      responses: nextResponses.map(({ isCorrect, ...response }) => response),
    }

    const submissionState = await persistQuizSubmission(payload)

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
      provisionalPrizeTier: outcome.label,
    })
  }

  function handleAnswer(answerIndex) {
    if (!currentQuestion || answerLock.current) return
    answerLock.current = true

    const isCorrect = answerIndex === currentQuestion.correctAnswer
    const nextCorrectCount = correctCount + (isCorrect ? 1 : 0)
    const selectedOriginalIndex =
      answerIndex === null
        ? null
        : currentQuestion.type === 'aiImageCompare'
          ? currentQuestion.mediaChoices?.[answerIndex]?.originalIndex ?? null
          : currentQuestion.answerOrder?.[answerIndex] ?? null

    const nextResponses = [
      ...responses,
      {
        questionId: currentQuestion.id,
        type: currentQuestion.type,
        selectedOriginalIndex,
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
      <main className="min-h-[100svh] bg-asca-bg px-5 py-7 text-white md:px-8 md:py-10">
        <div className="mx-auto flex min-h-[calc(100svh-3.5rem)] w-full max-w-6xl flex-col">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-sm font-medium text-white/58 transition hover:text-white"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <img
              src="/ascalab-logo-official.webp"
              alt="ASCALab"
              className="h-9 w-auto opacity-90 md:h-11"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .7, ease: [0.16, 1, 0.3, 1] }}
            className="my-auto grid gap-12 py-14 lg:grid-cols-[1.35fr_.65fr] lg:items-stretch"
          >
            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold text-asca-orange md:text-base">
                ASCALab @ Arena Tehnologij
              </p>

              <h1 className="mt-5 max-w-4xl text-[clamp(3.9rem,8vw,7.8rem)] font-semibold leading-[.9] tracking-[-.065em]">
                Test your<br />
                <span className="text-asca-toxic">tech</span>{' '}
                <span className="text-asca-orange">instincts.</span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/62 md:text-xl">
                {eventConfig.studentIntro}
              </p>

              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-white/56 md:text-base">
                <span><b className="font-semibold text-white">{eventConfig.quiz.minQuestions}–{eventConfig.quiz.maxQuestions}</b> random questions</span>
                <span className="text-asca-orange">•</span>
                <span><b className="font-semibold text-white">1</b> AI image challenge</span>
                <span className="text-asca-orange">•</span>
                <span><b className="font-semibold text-white">Speed</b> matters</span>
              </div>

              <p className="mt-6 text-sm text-white/44">
                Answer order changes every run. On-screen prize status is provisional.
              </p>
            </div>

            <div className="flex min-h-[430px] flex-col justify-between bg-asca-orange p-7 text-black md:p-9">
              <div>
                <p className="text-sm font-semibold">THE QUICK VERSION</p>
                <h2 className="mt-4 text-4xl font-semibold leading-[.98] tracking-[-.045em] md:text-5xl">
                  Got a minute?<br />Make it count.
                </h2>
                <p className="mt-5 max-w-sm text-base leading-7 text-black/68">
                  No sign-up before the quiz. Pick answers fast, do not trust your friend blindly, and see where you land.
                </p>
              </div>

              <button
                onClick={startQuiz}
                className="group mt-10 flex min-h-16 w-full items-center justify-between bg-black px-6 text-left text-base font-bold text-white transition hover:bg-[#111]"
              >
                <span>Start quiz</span>
                <ArrowRight size={20} className="transition group-hover:translate-x-1.5" />
              </button>
            </div>
          </motion.div>

          <div className="grid gap-5 border-t border-white/10 py-6 sm:grid-cols-3">
            <div>
              <div className="text-sm font-semibold text-asca-orange">Perfect + fast</div>
              <p className="mt-1 text-sm text-white/48">Premium reward contender.</p>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Perfect</div>
              <p className="mt-1 text-sm text-white/48">Secondary reward contender.</p>
            </div>
            <div>
              <div className="text-sm font-semibold text-asca-toxic">Finish it</div>
              <p className="mt-1 text-sm text-white/48">Participation track.</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (stage === 'result' && resultMeta) {
    const storageText =
      resultMeta.submissionState.status === 'sent'
        ? 'Result submitted to the event backend.'
        : resultMeta.submissionState.status === 'queued'
          ? `Connection issue. Result saved on this device; ${resultMeta.submissionState.queuedCount} result(s) waiting to retry.`
          : 'This result was saved on this device only.'

    return (
      <main className="grid min-h-[100svh] place-items-center bg-asca-bg px-5 py-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: .99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: .65, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl rounded-[30px] border border-white/10 bg-asca-panel p-8 shadow-2xl shadow-black/30 md:p-12"
        >
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <div className="grid size-20 place-items-center rounded-full bg-asca-toxic/10 text-asca-toxic">
                <Check size={42} strokeWidth={2.5} />
              </div>
              <p className="mt-7 text-sm font-semibold uppercase tracking-[.18em] text-asca-orange">
                Provisional result
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-.045em] md:text-6xl">
                {resultMeta.outcome.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/64">
                {resultMeta.outcome.description}
              </p>
              <p className="mt-4 text-sm leading-6 text-white/50">
                Reward track: {resultMeta.outcome.reward}. Staff confirmation required.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
                <div className="text-sm text-white/50">Score</div>
                <div className="mt-2 text-3xl font-semibold">{correctCount} / {sessionQuestions.length}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
                <div className="text-sm text-white/50">Accuracy</div>
                <div className="mt-2 text-3xl font-semibold">{Math.round(accuracy * 100)}%</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
                <div className="text-sm text-white/50">Total time</div>
                <div className="mt-2 text-3xl font-semibold">{resultMeta.elapsedSeconds}s</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
                <div className="text-sm text-white/50">Avg / question</div>
                <div className="mt-2 text-3xl font-semibold">{resultMeta.averageSecondsPerQuestion}s</div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 rounded-[24px] border border-white/10 bg-black/20 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-semibold">Show this screen to the ASCALab team.</div>
              <div className="mt-1 text-sm leading-6 text-white/52">{storageText}</div>
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
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[.16em] text-asca-orange">
              {eventConfig.eventName}
            </div>
            <div className="mt-2 text-sm font-semibold text-white/60">
              Question {questionIndex + 1} / {sessionQuestions.length} · {currentQuestion.category}
            </div>
          </div>

          <span className="rounded-full border border-white/10 bg-white/[.04] px-4 py-2 tabular-nums text-sm font-semibold">
            00:{String(timeLeft).padStart(2, '0')}
          </span>
        </div>

        <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/8">
          <div className="h-full bg-asca-orange transition-all" style={{ width: `${progress}%` }} />
        </div>

        <section className="rounded-[30px] border border-white/10 bg-asca-panel p-6 md:p-10">
          <div className="mb-8 h-1 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full bg-white/70 transition-all duration-1000"
              style={{ width: `${timePercent}%` }}
            />
          </div>

          <h1 className="max-w-4xl text-3xl font-semibold tracking-[-.035em] md:text-5xl">
            {currentQuestion.question}
          </h1>

          {currentQuestion.prompt ? (
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
              {currentQuestion.prompt}
            </p>
          ) : null}

          {currentQuestion.type === 'multipleChoice' ? (
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {currentQuestion.answers.map((answer, index) => (
                <button
                  key={answer}
                  onClick={() => handleAnswer(index)}
                  className="min-h-20 rounded-2xl border border-white/10 bg-white/[.035] px-5 py-4 text-left font-medium text-white/88 transition hover:border-asca-orange/70 hover:bg-asca-orange hover:text-black active:scale-[.99]"
                >
                  {answer}
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {currentQuestion.mediaChoices.map((image) => (
                <button
                  key={image.label}
                  onClick={() => handleAnswer(image.value)}
                  className="group overflow-hidden rounded-[24px] border border-white/10 bg-black/20 text-left transition hover:border-asca-orange/70"
                >
                  <div className="overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      width="720"
                      height="540"
                      loading="eager"
                      decoding="async"
                      className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 p-5">
                    <div>
                      <div className="text-sm uppercase tracking-[.16em] text-white/50">{image.label}</div>
                      <div className="mt-1 text-lg font-semibold">Select {image.label}</div>
                    </div>
                    <div className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-white/66">
                      Choose
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {!isEventApiConfigured() ? (
          <p className="mt-4 text-center text-xs text-white/40">
            Results are being stored on this device only.
          </p>
        ) : getPendingSubmissions().length > 0 ? (
          <p className="mt-4 text-center text-xs text-white/40">
            {getPendingSubmissions().length} result(s) are waiting for the connection to recover.
          </p>
        ) : null}
      </div>
    </main>
  )
}
