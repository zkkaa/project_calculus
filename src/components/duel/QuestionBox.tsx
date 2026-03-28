'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface QuestionBoxProps {
  questionNumber: number
  questionText: string
  onSubmit: (answer: string) => void
  disabled?: boolean
  totalQuestions: number
}

export default function QuestionBox({
  questionNumber,
  questionText,
  onSubmit,
  disabled = false,
  totalQuestions
}: QuestionBoxProps) {
  const [answer, setAnswer] = useState('')

  function handleSubmit() {
    if (answer.trim() === '') return
    onSubmit(answer.trim())
    setAnswer('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-6 w-full max-w-lg"
    >
      <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest">
        Pertanyaan ke-{questionNumber} dari {totalQuestions}
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl px-8 py-6 text-center shadow-sm w-full">
        <p className="text-2xl font-bold text-gray-800 leading-relaxed">{questionText}</p>
      </div>

      <div className="flex gap-3 w-full" onKeyDown={handleKeyDown}>
        <Input
          value={answer}
          onChange={setAnswer}
          placeholder="Ketik jawabanmu..."
          disabled={disabled}
          autoFocus
          className="flex-1 text-center text-lg font-semibold"
        />
        <Button onClick={handleSubmit} disabled={disabled || answer.trim() === ''}>
          Jawab
        </Button>
      </div>

      {disabled && (
        <p className="text-sm text-gray-400 animate-pulse">Menunggu hasil...</p>
      )}
    </motion.div>
  )
}