'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Player {
  id: string
  name: string
  avatar: string
  score: number
  is_eliminated: boolean
}

interface FinalResultProps {
  players: Player[]
  myPlayerId: string
  onFinish: () => void
}

const CONFETTI_DATA = [...Array(20)].map((_, i) => ({
  color: ['#fbbf24', '#34d399', '#f87171', '#60a5fa', '#a78bfa'][i % 5],
  left: `${(i * 5.1) % 100}%`,
  duration: 2 + (i % 5) * 0.4,
  delay: (i % 7) * 0.3,
}))

export default function FinalResult({ players, myPlayerId, onFinish }: FinalResultProps) {
  const sorted = useMemo(() => [...players].sort((a, b) => b.score - a.score), [players])
  const winner = sorted[0]
  const isWinner = winner?.id === myPlayerId

  const podium = [sorted[1], sorted[0], sorted[2]].filter(Boolean)
  const podiumHeights = ['h-24', 'h-32', 'h-16']
  const podiumColors = ['bg-gray-400', 'bg-yellow-400', 'bg-amber-600']
  const podiumLabels = ['🥈', '🥇', '🥉']

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-indigo-800 flex flex-col items-center justify-center p-6 gap-8 relative overflow-hidden">

      {/* Confetti */}
      {CONFETTI_DATA.map((c, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-sm pointer-events-none"
          style={{ background: c.color, left: c.left, top: '-10px' }}
          animate={{ y: '110vh', rotate: 720, opacity: [1, 1, 0] }}
          transition={{ duration: c.duration, delay: c.delay, ease: 'easeIn' }}
        />
      ))}

      {/* Judul */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="text-6xl mb-2">{isWinner ? '🏆' : '🎮'}</div>
        <h1 className="text-4xl font-black text-white">
          {isWinner ? 'Kamu Menang!' : 'Game Selesai!'}
        </h1>
        {winner && (
          <p className="text-indigo-200 mt-1">
            🥇 Pemenang: <span className="font-bold text-yellow-300">{winner.name}</span>
          </p>
        )}
      </motion.div>

      {/* Podium */}
      {sorted.length >= 2 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-end justify-center gap-3"
        >
          {podium.map((p, i) => p && (
            <div key={p.id} className="flex flex-col items-center gap-2">
              <Image src={`/gift/${p.avatar}`} width={56} height={56} className="w-14 h-14 object-contain" alt={p.name} unoptimized/>
              <p className="text-white text-xs font-bold text-center w-20 truncate">{p.name}</p>
              <p className="text-indigo-300 text-xs">{p.score} poin</p>
              <div className={`${podiumHeights[i]} w-20 ${podiumColors[i]} rounded-t-xl flex items-start justify-center pt-2`}>
                <span className="text-2xl">{podiumLabels[i]}</span>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm bg-white/10 border border-white/20 rounded-2xl p-4"
      >
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3 text-center">
          Hasil Akhir
        </p>
        <div className="flex flex-col gap-2">
          {sorted.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              className={`flex items-center gap-3 p-2 rounded-xl ${p.id === myPlayerId ? 'bg-yellow-400/10 border border-yellow-400/30' : ''}`}
            >
              <span className="text-white/40 text-sm w-6 text-center font-bold">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
              </span>
              <Image
                src={`/gift/${p.avatar}`}
                width={32}
                height={32}
                className={`w-8 h-8 object-contain ${p.is_eliminated ? 'grayscale opacity-50' : ''}`}
                alt={p.name}
                unoptimized
              />
              <span className={`text-sm font-semibold flex-1 truncate ${p.id === myPlayerId ? 'text-yellow-300' : 'text-white'}`}>
                {p.name} {p.id === myPlayerId && '(kamu)'}
              </span>
              <span className="text-indigo-300 text-sm font-bold">{p.score} poin</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tombol selesai */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={onFinish}
        className="px-10 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-lg transition-all hover:scale-105 active:scale-95"
      >
        Keluar Game
      </motion.button>
    </div>
  )
}