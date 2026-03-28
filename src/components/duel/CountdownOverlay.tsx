'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CountdownOverlayProps {
  onComplete: () => void
}

export default function CountdownOverlay({ onComplete }: CountdownOverlayProps) {
  const steps = ['Game dimulai!', '3', '2', '1', 'MULAI!']
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (step >= steps.length) return
    const delay = step === 0 ? 1800 : 900
    const timer = setTimeout(() => setStep(s => s + 1), delay)
    return () => clearTimeout(timer)
  }, [step])

  return (
    <div className="absolute inset-0 flex items-center justify-center z-30 bg-white/80 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        {step < steps.length && (
          <motion.div
            key={step}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-center"
          >
            {step === 0 ? (
              <p className="text-4xl font-bold text-indigo-700">Game dimulai!</p>
            ) : (
              <p className="text-9xl font-black text-indigo-600">{steps[step]}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}