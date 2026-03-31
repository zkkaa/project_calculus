'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
  countdown_started_at: number | null
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

  // Ref untuk mencegah double-trigger show_result oleh timer
  const showResultTriggered = useRef(false)

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

  // ── Subscribe realtime room + players ──
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

        // Reset state jawaban ketika soal baru dimulai
        if (!newRoom.show_result) {
          setSelectedAnswer(undefined)
          showResultTriggered.current = false
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

  // ── FIX #1: Admin memaksa show_result ketika timer habis ──
  // Hanya admin yang set show_result, semua client sudah auto-timeout
  // via QuestionPanel (onAnswer('__timeout__')), tapi show_result tetap
  // dikontrol admin supaya sinkron
  useEffect(() => {
    if (!isAdmin || !room || room.show_result || phase !== 'playing') return
    if (!room.countdown_started_at) return

    const elapsed = (Date.now() - room.countdown_started_at) / 1000
    const remaining = Math.max(0, TIME_LIMIT - elapsed)

    if (remaining <= 0) {
      // Timer sudah habis — langsung trigger
      if (!showResultTriggered.current) {
        showResultTriggered.current = true
        handleShowResult()
      }
      return
    }

    // Set timeout untuk sisa waktu + 0.5s buffer untuk toleransi network
    const timeout = setTimeout(() => {
      if (!showResultTriggered.current) {
        showResultTriggered.current = true
        handleShowResult()
      }
    }, remaining * 1000 + 500)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.countdown_started_at, room?.show_result, phase, isAdmin])

  // ── Auto show result ketika semua player aktif sudah jawab ──
  useEffect(() => {
    if (!room || room.show_result || !isAdmin || phase !== 'playing') return
    const activePlayers = players.filter(p => !p.is_eliminated)
    if (activePlayers.length === 0) return
    const allAnswered = activePlayers.every(p => p.current_answer !== null)
    if (allAnswered && !showResultTriggered.current) {
      showResultTriggered.current = true
      handleShowResult()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, room?.show_result])

  // ── Handle jawaban dari player ──
  async function handleAnswer(answer: string) {
    if (!room || selectedAnswer !== undefined) return
    const isTimeout = answer === '__timeout__'

    const currentQ = questions[room.current_question]
    if (!currentQ) return

    const isCorrect = !isTimeout &&
      answer.toLowerCase().trim() === currentQ.answer.toLowerCase().trim()

    // Set selectedAnswer: string kosong untuk timeout, jawaban sebenarnya untuk jawaban normal
    setSelectedAnswer(isTimeout ? '' : answer)

    const myPlayer = players.find(p => p.id === playerId)

    await supabase.from('royale_players').update({
      current_answer: isTimeout ? '__timeout__' : answer,
      answered_at: Date.now(),
      is_correct: isCorrect,
      score: isCorrect ? (myPlayer?.score ?? 0) + 10 : (myPlayer?.score ?? 0),
      // FIX #1: Timeout JUGA tereleminasi, sama seperti jawaban salah
      is_eliminated: !isCorrect,
    }).eq('id', playerId)
  }

  async function handleShowResult() {
    if (!isAdmin) return
    await supabase.from('royale_rooms').update({
      show_result: true,
    }).eq('id', roomId)
  }

  async function handleNextQuestion() {
    if (!room || !isAdmin) return
    const nextQ = room.current_question + 1

    // FIX #2: Cek apakah semua player aktif sudah tereleminasi
    const activePlayers = players.filter(p => !p.is_eliminated)
    const allEliminated = activePlayers.length === 0
    const isLast = nextQ >= TOTAL_QUESTIONS || allEliminated

    // Reset jawaban semua player untuk soal berikutnya
    await supabase.from('royale_players')
      .update({ current_answer: null, answered_at: null, is_correct: false })
      .eq('room_id', roomId)

    await supabase.from('royale_rooms').update({
      current_question: isLast ? room.current_question : nextQ,
      show_result: false,
      round_winner_ids: null,
      status: isLast ? 'finished' : 'playing',
      // FIX #1: Set countdown_started_at baru untuk sinkronisasi timer soal berikutnya
      countdown_started_at: isLast ? null : Date.now(),
    }).eq('id', roomId)
  }

  async function handleFinish() {
    await supabase.from('royale_rooms').delete().eq('id', roomId)
    router.push('/games/royale')
  }

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

  // FIX #2: Hitung apakah semua player tereleminasi di babak ini
  const allEliminated = room.show_result && activePlayers.length === 0

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
            {/* Tampilkan soal tapi non-interaktif */}
            <div className="mt-4 w-full max-w-2xl opacity-50 pointer-events-none">
              {currentQ && (
                <QuestionPanel
                  questionNumber={room.current_question + 1}
                  totalQuestions={TOTAL_QUESTIONS}
                  questionText={currentQ.question}
                  options={parsedOptions}
                  timeLimit={TIME_LIMIT}
                  startedAt={room.countdown_started_at ?? Date.now()}
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
              startedAt={room.countdown_started_at ?? Date.now()}
              onAnswer={handleAnswer}
              disabled={selectedAnswer !== undefined}
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
          allEliminated={allEliminated}
        />
      )}
    </div>
  )
}