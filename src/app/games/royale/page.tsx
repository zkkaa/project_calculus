'use client'

import { useRouter } from 'next/navigation'
import RoyaleLobby from '@/components/royale/RoyaleLobby'

export default function RoyalePage() {
  const router = useRouter()

  function handleRoomReady(roomId: string, playerId: string, isAdmin: boolean) {
    router.push(`/games/royale/${roomId}?pid=${playerId}&admin=${isAdmin}`)
  }

  return <RoyaleLobby onRoomReady={handleRoomReady} />
}