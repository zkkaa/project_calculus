'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface Player {
  id: string
  name: string
  avatar: string
  score: number
  is_eliminated: boolean
  is_correct?: boolean
}

interface RoundResultProps {
  correctAnswer: string
  allPlayers: Player[]
  questionNumber: number
  totalQuestions: number
  isLastQuestion: boolean
  onContinue: () => void
  isAdmin: boolean
  allEliminated: boolean
  // Data personal user ini
  myPlayerId: string
  mySelectedAnswer?: string
}

export default function RoundResult({
  correctAnswer,
  allPlayers,
  questionNumber,
  isLastQuestion,
  onContinue,
  isAdmin,
  allEliminated,
  myPlayerId,
  mySelectedAnswer,
}: RoundResultProps) {
  const myPlayer = allPlayers.find(p => p.id === myPlayerId)
  const isCorrect = myPlayer?.is_correct ?? false
  const isTimeout = mySelectedAnswer === '' || mySelectedAnswer === '__timeout__'

  // ── Auto-countdown: hanya admin yang trigger onContinue ──
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!isAdmin) return
    if (allEliminated) return
    setCountdown(5)

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          onContinue()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  // onContinue sengaja tidak di-include agar tidak re-trigger
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, questionNumber, allEliminated])

  // ── Countdown display untuk pemain ──
  const [playerCountdown, setPlayerCountdown] = useState(5)

  useEffect(() => {
    if (isAdmin || allEliminated) return
    setPlayerCountdown(5)

    const interval = setInterval(() => {
      setPlayerCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isAdmin, questionNumber, allEliminated])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-indigo-950/90 backdrop-blur flex flex-col items-center justify-center p-6 gap-5"
    >

      {/* ── Banner hasil personal ── */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="text-center"
      >
        {allEliminated ? (
          <div className="flex flex-col items-center gap-3">
            <div className="text-6xl">💥</div>
            <h2 className="text-3xl font-black text-white">Semua Pemain Gugur!</h2>
            <p className="text-red-300 text-sm">Game berakhir.</p>
          </div>
        ) : isCorrect ? (
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-7xl"
            >
              🎉
            </motion.div>
            <h2 className="text-4xl font-black text-white">Jawaban Anda Benar!</h2>
            <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-xl px-5 py-2 mt-1">
              <span className="text-green-400 text-sm font-semibold">+10 poin</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={{ x: [-8, 8, -8, 8, 0] }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-7xl"
            >
              😢
            </motion.div>
            <h2 className="text-4xl font-black text-white">
              {isTimeout ? 'Waktu Habis!' : 'Jawaban Anda Salah'}
            </h2>
            <p className="text-white/50 text-sm mt-1">Kamu tereliminasi dari babak ini</p>

            <div className="flex flex-col items-center gap-1 mt-2">
              <p className="text-white/40 text-xs uppercase tracking-widest font-semibold">
                Jawaban yang benar adalah
              </p>
              <div className="bg-green-500/20 border border-green-400/40 rounded-xl px-6 py-3">
                <p className="text-green-300 font-black text-xl">{correctAnswer}</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Skor sementara ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="w-full max-w-sm bg-white/10 border border-white/20 rounded-2xl p-4"
      >
        <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-3 text-center">
          Skor Sementara
        </p>
        <div className="flex flex-col gap-2">
          {[...allPlayers]
            .sort((a, b) => b.score - a.score)
            .map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.07 }}
                className={`flex items-center gap-3 p-2 rounded-xl transition-all ${
                  p.id === myPlayerId
                    ? isCorrect
                      ? 'bg-green-500/10 border border-green-400/30'
                      : 'bg-red-500/10 border border-red-400/20'
                    : ''
                } ${p.is_eliminated ? 'opacity-40' : ''}`}
              >
                <span className="text-white/40 text-sm w-6 text-center font-bold">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                </span>
                <Image
                  src={`/gift/${p.avatar}`}
                  width={32}
                  height={32}
                  className={`w-8 h-8 object-contain ${p.is_eliminated ? 'grayscale' : ''}`}
                  alt={p.name}
                  unoptimized
                />
                <span className={`text-sm font-semibold flex-1 truncate ${
                  p.id === myPlayerId ? 'text-yellow-300' : 'text-white'
                }`}>
                  {p.name}
                  {p.id === myPlayerId && (
                    <span className="text-yellow-400/50 font-normal"> (kamu)</span>
                  )}
                </span>
                {p.is_eliminated && (
                  <span className="text-red-400/70 text-xs mr-1">💀</span>
                )}
                <span className="text-indigo-300 text-sm font-bold">{p.score} poin</span>
              </motion.div>
            ))}
        </div>
      </motion.div>

      {/* ── Countdown + tombol fallback (admin only) ── */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col items-center gap-2"
        >
          {/* Hitung mundur kecil */}
          {countdown > 0 && !allEliminated && !isLastQuestion && (
            <p className="text-indigo-300/60 text-xs">
              Lanjut otomatis dalam{' '}
              <motion.span
                key={countdown}
                initial={{ scale: 1.4, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-bold text-indigo-200"
              >
                {countdown}
              </motion.span>
              {' '}detik...
            </p>
          )}

          {/* Hanya tampilkan tombol final saat semua pemain gugur */}
          {allEliminated && (
            <button
              onClick={onContinue}
              className="px-10 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              🏆 Lihat Hasil Akhir
            </button>
          )}
        </motion.div>
      )}

      {!isAdmin && !allEliminated && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-indigo-300 text-sm"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 animate-pulse mr-2" />
          Soal berikutnya dalam{' '}
          <motion.span
            key={playerCountdown}
            initial={{ scale: 1.4, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-bold text-indigo-200"
          >
            {playerCountdown}
          </motion.span>
          {' '}detik...
        </motion.p>
      )}
    </motion.div>
  )
}