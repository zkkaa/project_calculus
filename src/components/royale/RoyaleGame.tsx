'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import WaitingRoom from './WaitingRoom'
import QuestionPanel from './QuestionPanel'
import RoundResult from './RoundResult'
import FinalResult from './FinalResult'

interface RoyaleGameProps {
  roomId: string
  playerId: string
  isAdmin: boolean
}

interface Question {
  id: number
  question: string
  answer: string
  options: string
}

interface Player {
  id: string
  name: string
  avatar: string
  score: number
  is_eliminated: boolean
  current_answer: string | null
  answered_at: number | null
  is_correct: boolean
}

interface RoomState {
  status: string
  current_question: number
  question_ids: string | null
  show_result: boolean
  round_winner_ids: string | null
}

const TOTAL_QUESTIONS = 10
const TIME_LIMIT = 20

export default function RoyaleGame({ roomId, playerId, isAdmin }: RoyaleGameProps) {
  const router = useRouter()
  const [phase, setPhase] = useState<'waiting' | 'playing' | 'finished'>('waiting')
  const [room, setRoom] = useState<RoomState | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>()

  const loadQuestions = useCallback(async (ids: number[]) => {
    const { data } = await supabase
      .from('questions')
      .select('id, question, answer, options')
      .in('id', ids)
    if (!data) return
    const ordered = ids.map(id => data.find(q => q.id === id)!).filter(Boolean)
    setQuestions(ordered)
  }, [])

  const loadPlayers = useCallback(async () => {
    const { data } = await supabase
      .from('royale_players')
      .select('*')
      .eq('room_id', roomId)
    if (data) setPlayers(data)
  }, [roomId])

  // Subscribe realtime room + players
  useEffect(() => {
    // Load awal
    supabase.from('royale_rooms').select('*').eq('id', roomId).single()
      .then(({ data }) => {
        if (!data) return
        setRoom(data)
        if (data.status === 'playing') {
          setPhase('playing')
          if (data.question_ids) loadQuestions(JSON.parse(data.question_ids))
        }
        if (data.status === 'finished') setPhase('finished')
      })

    loadPlayers()

    // Realtime room
    const roomCh = supabase
      .channel(`royale-room-${roomId}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public',
        table: 'royale_rooms', filter: `id=eq.${roomId}`
      }, async (payload) => {
        const newRoom = payload.new as RoomState
        setRoom(newRoom)

        if (newRoom.status === 'playing' && newRoom.question_ids) {
          if (questions.length === 0) await loadQuestions(JSON.parse(newRoom.question_ids))
          setPhase('playing')
        }
        if (newRoom.status === 'finished') setPhase('finished')
        if (!newRoom.show_result) {
          setSelectedAnswer(undefined)
        }
      })
      .subscribe()

    // Realtime players
    const playerCh = supabase
      .channel(`royale-players-${roomId}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public',
        table: 'royale_players', filter: `room_id=eq.${roomId}`
      }, (payload) => {
        setPlayers(prev => prev.map(p =>
          p.id === payload.new.id ? { ...p, ...payload.new } : p
        ))
      })
      .subscribe()

    return () => {
      supabase.removeChannel(roomCh)
      supabase.removeChannel(playerCh)
    }
  }, [roomId, loadQuestions, loadPlayers, questions.length])

  async function handleAnswer(answer: string) {
    if (!room || selectedAnswer) return
    if (answer === '__timeout__' && selectedAnswer) return

    const currentQ = questions[room.current_question]
    if (!currentQ) return

    const isCorrect = answer !== '__timeout__' &&
      answer.toLowerCase().trim() === currentQ.answer.toLowerCase().trim()

    setSelectedAnswer(answer === '__timeout__' ? '' : answer)

    await supabase.from('royale_players').update({
      current_answer: answer,
      answered_at: Date.now(),
      is_correct: isCorrect,
      score: isCorrect
        ? players.find(p => p.id === playerId)!.score + 10
        : players.find(p => p.id === playerId)!.score,
    }).eq('id', playerId)

    // Kalau salah dan bukan timeout, tandai eliminated
    if (!isCorrect) {
      await supabase.from('royale_players').update({
        is_eliminated: true,
      }).eq('id', playerId)
    }
  }

  async function handleNextQuestion() {
    if (!room || !isAdmin) return
    const nextQ = room.current_question + 1
    const isLast = nextQ >= TOTAL_QUESTIONS

    // Reset jawaban semua player
    await supabase.from('royale_players')
      .update({ current_answer: null, answered_at: null, is_correct: false })
      .eq('room_id', roomId)

    await supabase.from('royale_rooms').update({
      current_question: nextQ,
      show_result: false,
      round_winner_ids: null,
      status: isLast ? 'finished' : 'playing',
    }).eq('id', roomId)
  }

  async function handleShowResult() {
    if (!isAdmin) return
    await supabase.from('royale_rooms').update({
      show_result: true,
    }).eq('id', roomId)
  }

  async function handleFinish() {
    await supabase.from('royale_rooms').delete().eq('id', roomId)
    router.push('/games/royale')
  }

  // Auto show result setelah semua player aktif menjawab
  useEffect(() => {
    if (!room || room.show_result || !isAdmin || phase !== 'playing') return
    const activePlayers = players.filter(p => !p.is_eliminated)
    if (activePlayers.length === 0) return
    const allAnswered = activePlayers.every(p => p.current_answer !== null)
    if (allAnswered) handleShowResult()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, room?.show_result])

  // ── RENDER ──
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

  if (phase === 'finished') {
    return (
      <FinalResult
        players={players}
        myPlayerId={playerId}
        onFinish={handleFinish}
      />
    )
  }

  if (!room || questions.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
        <p className="text-white animate-pulse text-lg">Memuat soal...</p>
      </div>
    )
  }

  const currentQ = questions[room.current_question]
  const parsedOptions: string[] = currentQ?.options ? JSON.parse(currentQ.options) : []
  const activePlayers = players.filter(p => !p.is_eliminated)
  const myPlayer = players.find(p => p.id === playerId)
  const isEliminated = myPlayer?.is_eliminated ?? false

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-indigo-800 flex flex-col relative overflow-hidden">

      {/* Dekorasi background */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {['∫', '∑', '∂', '∞', "f'(x)", 'lim', '∇'].map((sym, i) => (
          <span key={i} style={{
            position: 'absolute',
            left: `${8 + i * 13}%`, top: `${10 + (i % 3) * 25}%`,
            fontSize: `${3 + (i % 3)}rem`,
            opacity: 0.06, fontWeight: 700, color: 'white',
          }}>{sym}</span>
        ))}
      </div>

      {/* Header skor */}
      <div className="relative z-10 px-6 pt-6 pb-2 flex items-center justify-between">
        <div className="text-white/60 text-sm font-semibold">
          👑 Calculus Royale
        </div>
        <div className="flex items-center gap-3 text-sm text-white/70">
          <span className="bg-white/10 rounded-full px-3 py-1">
            🟢 {activePlayers.length} aktif
          </span>
          <span className="bg-white/10 rounded-full px-3 py-1">
            💀 {players.filter(p => p.is_eliminated).length} eliminated
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-4">
        {isEliminated ? (
          <div className="text-center text-white/60 flex flex-col items-center gap-4">
            <div className="text-6xl">💀</div>
            <p className="text-xl font-bold">Kamu tereliminasi!</p>
            <p className="text-sm">Tonton pertandingan yang tersisa...</p>
            {/* Tampilkan soal tapi disable */}
            <div className="mt-4 w-full max-w-2xl opacity-50 pointer-events-none">
              {currentQ && (
                <QuestionPanel
                  questionNumber={room.current_question + 1}
                  totalQuestions={TOTAL_QUESTIONS}
                  questionText={currentQ.question}
                  options={parsedOptions}
                  timeLimit={TIME_LIMIT}
                  onAnswer={() => {}}
                  disabled={true}
                  showResult={room.show_result}
                  correctAnswer={room.show_result ? currentQ.answer : undefined}
                />
              )}
            </div>
          </div>
        ) : (
          currentQ && (
            <QuestionPanel
              questionNumber={room.current_question + 1}
              totalQuestions={TOTAL_QUESTIONS}
              questionText={currentQ.question}
              options={parsedOptions}
              timeLimit={TIME_LIMIT}
              onAnswer={handleAnswer}
              disabled={!!selectedAnswer}
              selectedAnswer={selectedAnswer}
              showResult={room.show_result}
              correctAnswer={room.show_result ? currentQ.answer : undefined}
            />
          )
        )}
      </div>

      {/* Round result overlay */}
      {room.show_result && currentQ && (
        <RoundResult
          correctAnswer={currentQ.answer}
          winners={players.filter(p => p.is_correct)}
          eliminated={players.filter(p => !p.is_correct && p.current_answer !== null)}
          allPlayers={players}
          questionNumber={room.current_question + 1}
          totalQuestions={TOTAL_QUESTIONS}
          isLastQuestion={room.current_question + 1 >= TOTAL_QUESTIONS}
          onContinue={handleNextQuestion}
          isAdmin={isAdmin}
        />
      )}
    </div>
  )
}