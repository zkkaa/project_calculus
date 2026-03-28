'use client'

import { useParams, useSearchParams } from 'next/navigation'
import GameScreen from '@/components/duel/GameScreen'

export default function RoomPage() {
  const params = useParams()
  const searchParams = useSearchParams()

  const roomId = params.roomId as string
  const team = (searchParams.get('team') ?? 'red') as 'red' | 'blue'

  return <GameScreen roomId={roomId} team={team} />
}