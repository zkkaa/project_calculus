'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface CharacterPanelProps {
  team: 'red' | 'blue'
  isWinner?: boolean
}

const emoji = {
  red: { idle: '🧑‍🎓', win: '🎉' },
  blue: { idle: '👩‍🎓', win: '🎊' },
}

export default function CharacterPanel({ team, isWinner = false }: CharacterPanelProps) {
  const isRed = team === 'red'

  return (
    <div className={`flex flex-col items-center gap-2 ${isRed ? 'items-start' : 'items-end'}`}>
      <span
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: isRed ? '#ef4444' : '#3b82f6' }}
      >
        Tim {isRed ? 'Merah' : 'Biru'}
      </span>

      <AnimatePresence mode="wait">
        {isWinner ? (
          <motion.div
            key="win"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-7xl select-none"
            style={{ filter: 'drop-shadow(0 0 12px rgba(99,102,241,0.3))' }}
          >
            {emoji[team].win}
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-8xl select-none"
          >
            {emoji[team].idle}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}