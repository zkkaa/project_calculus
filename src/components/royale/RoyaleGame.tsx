'use client'

import { useState } from 'react'
import WaitingRoom from './WaitingRoom'

interface RoyaleGameProps {
  roomId: string
  playerId: string
  isAdmin: boolean
}

export default function RoyaleGame({ roomId, playerId, isAdmin }: RoyaleGameProps) {
  const [phase, setPhase] = useState<'waiting' | 'playing' | 'finished'>('waiting')

  if (phase === 'waiting') {
    return (
      <WaitingRoom
        roomId={roomId}
        playerId={playerId}
        isAdmin={isAdmin}
        onGameStart={() => setPhase('playing')}
      />
    )
  }

  if (phase === 'playing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-900 text-white">
        <p className="text-2xl font-bold animate-pulse">Game dimulai! (segera dibuat)</p>
      </div>
    )
  }

  return null
}