'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

interface QuestionPanelProps {
  questionNumber: number
  totalQuestions: number
  questionText: string
  options: string[]
  timeLimit: number
  startedAt: number          // ← BARU: timestamp dari Supabase
  onAnswer: (answer: string) => void
  disabled: boolean
  selectedAnswer?: string
  correctAnswer?: string
  showResult: boolean
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']
const OPTION_COLORS = [
  'from-red-500 to-rose-600',
  'from-blue-500 to-indigo-600',
  'from-yellow-500 to-amber-600',
  'from-green-500 to-emerald-600',
]

export default function QuestionPanel({
  questionNumber, totalQuestions, questionText, options,
  timeLimit, startedAt, onAnswer, disabled, selectedAnswer, correctAnswer, showResult,
}: QuestionPanelProps) {
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const hasTimedOut = useRef(false)

  useEffect(() => {
    hasTimedOut.current = false

    const tick = () => {
      const elapsed = (Date.now() - startedAt) / 1000
      const remaining = Math.max(0, timeLimit - elapsed)
      setTimeLeft(Math.ceil(remaining))

      if (remaining <= 0 && !hasTimedOut.current && !disabled && !showResult) {
        hasTimedOut.current = true
        onAnswer('__timeout__')
      }
    }

    tick() // langsung hitung sekali
    const interval = setInterval(tick, 200) // update tiap 200ms untuk akurasi
    return () => clearInterval(interval)
  }, [questionNumber, startedAt, timeLimit, disabled, showResult, onAnswer])

  const timerPercent = (timeLeft / timeLimit) * 100
  const timerColor = timeLeft > 10 ? 'bg-green-400' : timeLeft > 5 ? 'bg-yellow-400' : 'bg-red-400'

  function getOptionState(opt: string) {
    if (!showResult) return 'default'
    if (opt === correctAnswer) return 'correct'
    if (opt === selectedAnswer && opt !== correctAnswer) return 'wrong'
    return 'dim'
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between text-white/70 text-sm font-semibold">
        <span>Soal {questionNumber} / {totalQuestions}</span>
        <motion.span key={timeLeft} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
          className={`text-2xl font-black ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>
          {timeLeft}s
        </motion.span>
      </div>

      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${timerColor} transition-colors duration-300`}
          animate={{ width: `${timerPercent}%` }}
          transition={{ duration: 0.2, ease: 'linear' }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={questionNumber}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
          className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 text-center"
        >
          <p className="text-white font-bold text-xl leading-relaxed">{questionText}</p>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => {
          const state = getOptionState(opt)
          return (
            <motion.button key={opt}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={!disabled && !showResult ? { scale: 1.03 } : {}}
              whileTap={!disabled && !showResult ? { scale: 0.97 } : {}}
              onClick={() => !disabled && !showResult && onAnswer(opt)}
              className={`
                relative rounded-2xl p-4 text-left font-bold text-white transition-all duration-300
                bg-linear-to-br ${OPTION_COLORS[i]}
                ${state === 'correct' ? 'ring-4 ring-green-300 scale-105 brightness-110' : ''}
                ${state === 'wrong' ? 'ring-4 ring-red-300 brightness-75' : ''}
                ${state === 'dim' ? 'brightness-50 scale-95' : ''}
                ${disabled || showResult ? 'cursor-default' : 'hover:brightness-110 cursor-pointer'}
              `}
            >
              <span className="text-white/60 text-xs font-black uppercase tracking-widest block mb-1">
                {OPTION_LABELS[i]}
              </span>
              <span className="text-base">{opt}</span>
              {showResult && state === 'correct' && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute top-2 right-2 text-xl">✅</motion.span>
              )}
              {showResult && state === 'wrong' && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute top-2 right-2 text-xl">❌</motion.span>
              )}
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {disabled && !showResult && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-center text-indigo-200 text-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse mr-2" />
            Jawaban terkirim! Menunggu pemain lain...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}