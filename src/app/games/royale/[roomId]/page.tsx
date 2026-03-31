'use client'

import { useParams, useSearchParams } from 'next/navigation'
import RoyaleGame from '@/components/royale/RoyaleGame'

export default function RoyaleRoomPage() {
  const params = useParams()
  const searchParams = useSearchParams()

  const roomId = params.roomId as string
  const playerId = searchParams.get('pid') ?? ''
  const isAdmin = searchParams.get('admin') === 'true'

  return <RoyaleGame roomId={roomId} playerId={playerId} isAdmin={isAdmin} />
}