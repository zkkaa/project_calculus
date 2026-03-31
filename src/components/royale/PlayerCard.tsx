'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface PlayerCardProps {
  id: string
  name: string
  avatar: string
  score: number
  isEliminated: boolean
  isMe: boolean
  rank?: number
}

export default function PlayerCard({ name, avatar, score, isEliminated, isMe, rank }: PlayerCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: isEliminated ? 0.35 : 1,
        scale: isEliminated ? 0.92 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`
        relative flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all
        ${isMe ? 'border-yellow-400 bg-yellow-400/10' : 'border-white/20 bg-white/10'}
        ${isEliminated ? 'grayscale' : ''}
      `}
    >
      {/* Rank badge */}
      {rank !== undefined && rank <= 3 && !isEliminated && (
        <div className="absolute -top-2 -right-2 text-lg">
          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
        </div>
      )}

      {/* Eliminated overlay */}
      {isEliminated && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/30 z-10">
          <span className="text-2xl">💀</span>
        </div>
      )}

      {/* Avatar */}
      <Image
        src={`/gift/${avatar}`}
        alt={name}
        width={56}
        height={56}
        className="w-14 h-14 object-contain rounded-xl"
      />

      {/* Nama */}
      <p className={`text-xs font-bold text-center truncate w-full ${isMe ? 'text-yellow-300' : 'text-white'}`}>
        {name}
        {isMe && <span className="block text-yellow-400/60 font-normal text-xs">(kamu)</span>}
      </p>

      {/* Skor */}
      <div className="bg-white/10 rounded-lg px-2 py-0.5 text-xs font-black text-indigo-200">
        {score} poin
      </div>
    </motion.div>
  )
}