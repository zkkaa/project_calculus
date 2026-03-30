'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Button from '@/components/ui/Button'

interface GameResultOverlayProps {
  winnerTeam: 'red' | 'blue' | 'draw'
  winnerName: string
  scoreRed: number
  scoreBlue: number
  nameRed: string
  nameBlue: string
  surrendered: boolean
  onFinish: () => void
}

const teamColor: Record<string, string> = {
  red: 'text-red-500',
  blue: 'text-blue-500',
  draw: 'text-gray-500'
}

const winImage: Record<string, string> = {
  red: '/gift/red-duel.webp',
  blue: '/gift/blue-duel.webp',
  draw: '/gift/win-duel.webp'
}

export default function GameResultOverlay({
  winnerTeam, winnerName, scoreRed, scoreBlue, nameRed, nameBlue, surrendered, onFinish
}: GameResultOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-white/90 backdrop-blur-md gap-6"
    >
      <motion.p
        initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="text-xl font-semibold text-gray-400 uppercase tracking-widest"
      >
        Duel Selesai!
      </motion.p>

      <motion.p
        initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.25, type: 'spring', stiffness: 200 }}
        className={`text-5xl font-black text-center ${teamColor[winnerTeam]}`}
      >
        {winnerTeam === 'draw' ? 'Seri!' : `${winnerName} Menang!`}
      </motion.p>

      {surrendered && (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-sm text-gray-400"
        >
          Lawan menyerah
        </motion.p>
      )}

      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 250, damping: 15 }}
      >
        <Image src={winImage[winnerTeam]} alt="winner" width={180} height={180} className="object-contain" unoptimized />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        className="flex gap-8 text-center"
      >
        <div>
          <p className="text-3xl font-black text-red-500">{scoreRed}</p>
          <p className="text-xs text-gray-400 uppercase tracking-widest">{nameRed}</p>
        </div>
        <div className="text-2xl font-bold text-gray-300 self-center">vs</div>
        <div>
          <p className="text-3xl font-black text-blue-500">{scoreBlue}</p>
          <p className="text-xs text-gray-400 uppercase tracking-widest">{nameBlue}</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
      >
        <Button onClick={onFinish} className="px-10 py-4 text-base">
          Selesai
        </Button>
      </motion.div>
    </motion.div>
  )
}