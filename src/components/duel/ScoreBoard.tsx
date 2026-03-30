'use client'

import { motion } from 'framer-motion'

interface ScoreBoardProps {
  scoreRed: number
  scoreBlue: number
  totalQuestions: number
  currentQuestion: number
  nameRed: string
  nameBlue: string
}

export default function ScoreBoard({
  scoreRed, scoreBlue, totalQuestions, currentQuestion, nameRed, nameBlue
}: ScoreBoardProps) {
  return (
    <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-4 pointer-events-none z-10">
      <motion.div
        className="flex flex-col items-center bg-red-50 border border-red-200 rounded-2xl px-6 py-3 min-w-25"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 0.3 }}
        key={`red-${scoreRed}`}
      >
        <span className="text-xs font-semibold text-red-400 uppercase tracking-widest truncate max-w-22.5 text-center">{nameRed}</span>
        <span className="text-4xl font-black text-red-500 leading-tight">{scoreRed}</span>
        <span className="text-xs text-red-300">/ {totalQuestions}</span>
      </motion.div>

      <div className="flex flex-col items-center pt-1">
        <span className="text-xs text-gray-400 font-medium">Soal ke</span>
        <span className="text-lg font-bold text-gray-500">{currentQuestion} / {totalQuestions}</span>
      </div>

      <motion.div
        className="flex flex-col items-center bg-blue-50 border border-blue-200 rounded-2xl px-6 py-3 min-w-25"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 0.3 }}
        key={`blue-${scoreBlue}`}
      >
        <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest truncate max-w-22.5 text-center">{nameBlue}</span>
        <span className="text-4xl font-black text-blue-500 leading-tight">{scoreBlue}</span>
        <span className="text-xs text-blue-300">/ {totalQuestions}</span>
      </motion.div>
    </div>
  )
}