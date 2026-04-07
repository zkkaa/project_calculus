'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import GameHero from '@/components/games/GameHero'
import GameExpand from '@/components/games/GameExpand'
import GameList from '@/components/games/GameList'
import MathParticles from '@/components/ui/MathParticles'

export default function GamesPage() {
  const [showExpand, setShowExpand] = useState(false)
  const gameListRef = useRef<HTMLElement>(null!)

  function handleShowAll() {
    setShowExpand(true)
  }

  function scrollToGames() {
    setTimeout(() => {
      gameListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <main className="min-h-screen bg-white relative overflow-x-hidden">
      {/* Subtle math particles background */}
      <MathParticles />

      {/* Navbar */}
      <Navbar />

      {/* Hero section */}
      <GameHero onShowAll={handleShowAll} />

      {/* Expand section (toggle) */}
      <GameExpand visible={showExpand} />

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-4">
        <div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Game cards */}
      <GameList sectionRef={gameListRef} />
    </main>
  )
}