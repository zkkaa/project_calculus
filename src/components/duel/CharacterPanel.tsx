'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface CharacterPanelProps {
  team: 'red' | 'blue'
  name: string
  isWinner?: boolean
}

export default function CharacterPanel({ team, name, isWinner = false }: CharacterPanelProps) {
  const isRed = team === 'red'
  const idleImage = isRed ? '/gift/red-duel.webp' : '/gift/blue-duel.webp'
  const winImage = isRed ? '/gift/red-duel.webp' : '/gift/blue-duel.webp'

  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: isRed ? '#ef4444' : '#3b82f6' }}
      >
        {name}
      </span>

      <AnimatePresence mode="wait">
        {isWinner ? (
          <motion.div key="win"
            initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Image src={winImage} alt={`${name} winner`} width={100} height={100} className="object-contain" unoptimized />
          </motion.div>
        ) : (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Image src={idleImage} alt={`${name} character`} width={120} height={120} className="object-contain" unoptimized />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}