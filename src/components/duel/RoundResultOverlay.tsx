'use client'

import { motion } from 'framer-motion'

interface RoundResultOverlayProps {
  questionNumber: number
  winnerTeam: 'red' | 'blue'
}

const teamLabel = { red: 'Tim Merah', blue: 'Tim Biru' }
const teamColor = { red: 'text-red-500', blue: 'text-blue-500' }
const winEmoji = { red: '🎉', blue: '🎊' }

export default function RoundResultOverlay({ questionNumber, winnerTeam }: RoundResultOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-white/85 backdrop-blur-sm gap-4"
    >
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-lg font-semibold text-gray-500"
      >
        Pertanyaan ke-{questionNumber}
      </motion.p>

      <motion.p
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className={`text-4xl font-black ${teamColor[winnerTeam]}`}
      >
        dimenangkan oleh {teamLabel[winnerTeam]}!
      </motion.p>

      {/* Karakter pemenang bergerak ke tengah */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.35, type: 'spring', stiffness: 260, damping: 18 }}
        className="text-8xl"
      >
        {winEmoji[winnerTeam]}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-gray-400"
      >
        Lanjut ke soal berikutnya...
      </motion.p>
    </motion.div>
  )
}