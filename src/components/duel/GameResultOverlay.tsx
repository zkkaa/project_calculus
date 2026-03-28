'use client'

import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'

interface GameResultOverlayProps {
  winnerTeam: 'red' | 'blue'
  scoreRed: number
  scoreBlue: number
  onFinish: () => void
}

const teamLabel = { red: 'Tim Merah', blue: 'Tim Biru' }
const teamColor = { red: 'text-red-500', blue: 'text-blue-500' }
const winEmoji = { red: '🏆', blue: '🏆' }

export default function GameResultOverlay({
  winnerTeam,
  scoreRed,
  scoreBlue,
  onFinish
}: GameResultOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-white/90 backdrop-blur-md gap-6"
    >
      <motion.p
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-xl font-semibold text-gray-400 uppercase tracking-widest"
      >
        Duel Selesai!
      </motion.p>

      <motion.p
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.25, type: 'spring', stiffness: 200 }}
        className={`text-5xl font-black ${teamColor[winnerTeam]}`}
      >
        {teamLabel[winnerTeam]} Menang!
      </motion.p>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 250, damping: 15 }}
        className="text-9xl"
      >
        {winEmoji[winnerTeam]}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="flex gap-8 text-center"
      >
        <div>
          <p className="text-3xl font-black text-red-500">{scoreRed}</p>
          <p className="text-xs text-gray-400 uppercase tracking-widest">Tim Merah</p>
        </div>
        <div className="text-2xl font-bold text-gray-300 self-center">vs</div>
        <div>
          <p className="text-3xl font-black text-blue-500">{scoreBlue}</p>
          <p className="text-xs text-gray-400 uppercase tracking-widest">Tim Biru</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Button onClick={onFinish} className="px-10 py-4 text-base">
          Selesai
        </Button>
      </motion.div>
    </motion.div>
  )
}