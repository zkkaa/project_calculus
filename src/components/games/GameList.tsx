'use client'

// import { useRef } from 'react'
import { motion } from 'framer-motion'
import GameCard from './GameCard'

const GAMES = [
  {
    title: 'Calculus Duel',
    description:
      'Tantang temanmu dalam duel soal kalkulus satu lawan satu. Siapa yang lebih cepat menjawab dengan benar di tiap ronde, dialah pemenangnya. Buktikan kemampuanmu!',
    href: '/games/duel',
    videoSrc: '/videos/duel-preview.mp4',
    thumbnailSrc: '/images/duel-thumbnail.png',
    badge: '1 vs 1',
    accentColor: '#ef4444',
    players: '2 Pemain',
    difficulty: 'Menengah',
    icon: '⚔️',
  },
  {
    title: 'Calculus Royale',
    description:
      'Battle kalkulus bersama teman-temanmu. Semua bermain serentak — jawab salah maka kamu gugur. Bertahan hingga akhir dan buktikan bahwa kamu yang terhebat!',
    href: '/games/royale',
    videoSrc: '/videos/royale-preview.mp4',
    thumbnailSrc: '/images/royale-thumbnail.png',
    badge: 'Battle Royale',
    accentColor: '#f59e0b',
    players: '3–10 Pemain',
    difficulty: 'Menantang',
    icon: '👑',
  },
]

interface GameListProps {
  sectionRef?: React.RefObject<HTMLElement>
}

export default function GameList({ sectionRef }: GameListProps) {
  return (
    <section
      ref={sectionRef}
      className="max-w-7xl mx-auto px-6 md:px-10 pb-24"
      id="game-list"
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.55 }}
        className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="h-px w-8 bg-indigo-300" />
            <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Pilih Game</span>
          </div>
          <h2
            className="text-3xl md:text-4xl font-black text-gray-900"
            style={{ fontFamily: '"Georgia", serif', letterSpacing: '-0.3px' }}
          >
            Mulai petualanganmu
          </h2>
        </div>
        <p className="text-gray-400 text-sm max-w-xs md:text-right">
          Dua mode game dengan pengalaman yang berbeda. Pilih sesuai suasana hatimu!
        </p>
      </motion.div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {GAMES.map((game, i) => (
          <GameCard key={game.href} {...game} />
        ))}
      </div>

      {/* Bottom note */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="mt-10 text-center"
      >
        <p className="text-xs text-gray-300 font-medium">
          Game lainnya akan hadir segera · SIGMA · Kelompok 9
        </p>
      </motion.div>
    </section>
  )
}