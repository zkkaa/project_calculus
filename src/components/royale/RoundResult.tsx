'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

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
  winners: Player[]
  eliminated: Player[]
  allPlayers: Player[]
  questionNumber: number
  totalQuestions: number
  isLastQuestion: boolean
  onContinue: () => void
  isAdmin: boolean
}

export default function RoundResult({
  correctAnswer,
  winners,
  eliminated,
  allPlayers,
  questionNumber,
  totalQuestions,
  isLastQuestion,
  onContinue,
  isAdmin,
}: RoundResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-indigo-950/90 backdrop-blur flex flex-col items-center justify-center p-6 gap-6"
    >
      {/* Jawaban benar */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="text-center"
      >
        <p className="text-indigo-300 text-sm font-semibold uppercase tracking-widest mb-2">Jawaban Benar</p>
        <div className="text-4xl font-black text-white bg-green-500/20 border border-green-400/40 rounded-2xl px-8 py-4">
          {correctAnswer}
        </div>
      </motion.div>

      {/* Yang menjawab benar */}
      {winners.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-green-400 text-sm font-bold mb-3">
            ✅ {winners.length} pemain menjawab benar!
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {winners.map(p => (
              <div key={p.id} className="flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-xl px-3 py-2">
                <Image src={`/gift/${p.avatar}`} width={32} height={32} className="w-8 h-8 object-contain" alt={''} />
                <span className="text-white text-sm font-semibold">{p.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Yang eliminated */}
      {eliminated.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-red-400 text-sm font-bold mb-3">
            💀 {eliminated.length} pemain tereliminasi!
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {eliminated.map(p => (
              <div key={p.id} className="flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-xl px-3 py-2 opacity-60">
                <Image src={`/gift/${p.avatar}`} width={32} height={32} className="w-8 h-8 object-contain grayscale" alt={''} />
                <span className="text-white text-sm">{p.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Leaderboard sementara */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="w-full max-w-sm bg-white/10 border border-white/20 rounded-2xl p-4"
      >
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3 text-center">
          Skor Sementara
        </p>
        <div className="flex flex-col gap-2">
          {[...allPlayers]
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map((p, i) => (
              <div key={p.id} className={`flex items-center gap-3 ${p.is_eliminated ? 'opacity-40' : ''}`}>
                <span className="text-white/40 text-sm w-5 text-center font-bold">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                </span>
                <Image src={`/gift/${p.avatar}`} width={28} height={28} className="w-7 h-7 object-contain" alt={''} />
                <span className="text-white text-sm font-semibold flex-1 truncate">{p.name}</span>
                <span className="text-indigo-300 text-sm font-bold">{p.score} poin</span>
              </div>
            ))}
        </div>
      </motion.div>

      {/* Tombol lanjut (admin only) */}
      {isAdmin && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          onClick={onContinue}
          className="px-10 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          {isLastQuestion ? '🏆 Lihat Hasil Akhir' : `➡️ Soal Berikutnya (${questionNumber}/${totalQuestions})`}
        </motion.button>
      )}

      {!isAdmin && (
        <p className="text-indigo-300 text-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 animate-pulse mr-2" />
          Menunggu host melanjutkan...
        </p>
      )}
    </motion.div>
  )
}