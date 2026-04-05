'use client'

import { motion } from 'framer-motion'

const stats = [
  { icon: '🎯', label: 'Soal tersedia', value: '50+' },
  { icon: '⚡', label: 'Real-time multiplayer', value: '100%' },
  { icon: '🏆', label: 'Mode permainan', value: '2' },
  { icon: '📐', label: 'Topik kalkulus', value: '5+' },
]

const howToPlay = [
  { step: '01', title: 'Pilih game', desc: 'Pilih antara Calculus Duel (1v1) atau Calculus Royale (battle royale).' },
  { step: '02', title: 'Buat atau masuk room', desc: 'Buat room dan bagikan kodenya ke teman, atau masukkan kode dari teman.' },
  { step: '03', title: 'Jawab soal tercepat', desc: 'Siapa yang lebih cepat dan benar akan memenangkan ronde tersebut.' },
  { step: '04', title: 'Raih kemenangan', desc: 'Kumpulkan poin terbanyak atau bertahan hingga akhir untuk menang.' },
]

export default function GameStats() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-2 p-6 rounded-2xl border border-gray-100 bg-white hover:border-indigo-100 hover:shadow-sm transition-all duration-300"
          >
            <span className="text-2xl">{s.icon}</span>
            <span
              className="text-3xl font-black text-gray-900"
              style={{ fontFamily: '"Georgia", serif' }}
            >
              {s.value}
            </span>
            <span className="text-xs text-gray-400 font-medium">{s.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Divider + heading */}
      <div className="flex items-center gap-4 mb-12">
        <span className="h-px flex-1 bg-gray-100" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xs text-indigo-400 font-bold tracking-widest uppercase mb-1">Cara Bermain</p>
          <h2
            className="text-2xl md:text-3xl font-black text-gray-900"
            style={{ fontFamily: '"Georgia", serif' }}
          >
            Semudah 1, 2, 3, 4
          </h2>
        </motion.div>
        <span className="h-px flex-1 bg-gray-100" />
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {howToPlay.map((h, i) => (
          <motion.div
            key={h.step}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100"
          >
            {/* Connector line */}
            {i < howToPlay.length - 1 && (
              <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}

            <span
              className="text-4xl font-black"
              style={{
                fontFamily: '"Georgia", serif',
                color: 'transparent',
                WebkitTextStroke: '1.5px #e5e7eb',
              }}
            >
              {h.step}
            </span>
            <h3 className="font-bold text-gray-900 text-sm">{h.title}</h3>
            <p className="text-gray-400 text-xs leading-relaxed">{h.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}