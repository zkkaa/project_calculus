'use client'

import { useRouter } from 'next/navigation'
import LobbyScreen from '@/components/duel/LobbyScreen'

export default function DuelPage() {
  const router = useRouter()

  function handleRoomReady(roomId: string, team: 'red' | 'blue') {
    router.push(`/games/duel/${roomId}?team=${team}`)
  }

  return <LobbyScreen onRoomReady={handleRoomReady} />
}