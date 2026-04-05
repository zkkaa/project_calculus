'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface GameExpandProps {
  visible: boolean
}

const features = [
  {
    icon: '⚔️',
    title: 'Duel 1v1',
    desc: 'Tantang temanmu secara langsung. Siapa yang lebih cepat menjawab dengan benar, dialah yang menang di ronde itu.',
    color: '#ef4444',
  },
  {
    icon: '👑',
    title: 'Battle Royale',
    desc: 'Bermain ramai-ramai. Jawab salah = kamu gugur. Bertahan hingga akhir untuk menjadi juara kalkulus sejati.',
    color: '#f59e0b',
  },
  {
    icon: '📊',
    title: 'Soal Berkualitas',
    desc: 'Setiap soal dirancang untuk menguji pemahaman konsep kalkulus, mulai dari turunan hingga integral.',
    color: '#10b981',
  },
  {
    icon: '⚡',
    title: 'Real-time Multiplayer',
    desc: 'Semua game terhubung secara real-time menggunakan Supabase. Tidak ada delay, langsung seru!',
    color: '#4f46e5',
  },
]

export default function GameExpand({ visible }: GameExpandProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.section
          key="game-expand"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #fafafa 0%, #f5f3ff 100%)' }}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-14">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-10"
            >
              <h2
                className="text-2xl md:text-3xl font-black text-gray-900 mb-2"
                style={{ fontFamily: '"Georgia", serif' }}
              >
                Kenapa harus main di SIGMA?
              </h2>
              <p className="text-gray-400 text-sm max-w-lg">
                Game di SIGMA bukan sekadar hiburan — setiap sesi dirancang untuk memperkuat pemahaman kalkulus kamu secara tidak terasa.
              </p>
            </motion.div>

            {/* Feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col gap-3 group hover:shadow-lg transition-shadow duration-300"
                >
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                    style={{ background: `${f.color}18` }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">{f.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Quote/highlight bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 rounded-2xl px-8 py-6 flex flex-col md:flex-row items-center gap-4 md:gap-8"
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              }}
            >
              <div className="text-4xl shrink-0">🧠</div>
              <div>
                <p className="text-white font-bold text-base md:text-lg">
                  &quot;Kalkulus lebih mudah dipahami ketika kamu terlibat aktif di dalamnya.&quot;
                </p>
                <p className="text-indigo-200 text-xs mt-1">Filosofi SIGMA · Kelompok 9</p>
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}