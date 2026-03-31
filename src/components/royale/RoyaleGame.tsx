'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import WaitingRoom from './WaitingRoom'
import QuestionPanel from './QuestionPanel'
import RoundResult from './RoundResult'
import FinalResult from './FinalResult'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

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

// ─────────────────────────────────────────────
// Komponen tampilan admin sebagai observer
// ─────────────────────────────────────────────
function AdminObserver({
  room,
  questions,
  players,
  onNextQuestion,
  onFinish,
}: {
  room: RoomState
  questions: Question[]
  players: Player[]
  onNextQuestion: () => void
  onFinish: () => void
}) {
  const currentQ = questions[room.current_question]
  const activePlayers = players.filter(p => !p.is_eliminated)
  const eliminatedPlayers = players.filter(p => p.is_eliminated)
  const answeredCount = activePlayers.filter(p => p.current_answer !== null).length
  const allEliminated = room.show_result && activePlayers.length === 0
  const isLastQuestion = room.current_question + 1 >= TOTAL_QUESTIONS

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex flex-col relative overflow-hidden">

      {/* Dekorasi background */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {['∫', '∑', '∂', '∞', "f'(x)", 'lim', '∇'].map((sym, i) => (
          <span key={i} style={{
            position: 'absolute',
            left: `${8 + i * 13}%`,
            top: `${10 + (i % 3) * 25}%`,
            fontSize: `${3 + (i % 3)}rem`,
            opacity: 0.05, fontWeight: 700, color: 'white',
          }}>{sym}</span>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 pt-5 pb-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-white font-black text-lg">👑 Calculus Royale</span>
          <span className="bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-bold px-2 py-0.5 rounded-full">
            HOST
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="bg-white/10 rounded-full px-3 py-1 text-white/70">
            Soal {room.current_question + 1}/{TOTAL_QUESTIONS}
          </span>
          <span className="bg-green-500/20 border border-green-400/30 text-green-300 rounded-full px-3 py-1">
            🟢 {activePlayers.length} aktif
          </span>
          <span className="bg-red-500/20 border border-red-400/30 text-red-300 rounded-full px-3 py-1">
            💀 {eliminatedPlayers.length} gugur
          </span>
        </div>
      </div>

      <div className="relative z-10 flex-1 px-6 py-5 flex flex-col gap-5 max-w-3xl mx-auto w-full">

        {/* ── Soal yang sedang dikerjakan / status babak selesai ── */}
        <AnimatePresence mode="wait">
          {!room.show_result ? (
            // Tampilan saat soal sedang berjalan
            <motion.div
              key="question-view"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5 flex flex-col gap-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white/40 text-xs font-bold uppercase tracking-widest">
                  Soal yang sedang dikerjakan
                </span>
              </div>
              <p className="text-white font-bold text-xl leading-relaxed">
                {currentQ?.question ?? '—'}
              </p>

              {/* Progress jawaban pemain */}
              <div className="flex flex-col gap-2 mt-1">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>Pemain menjawab</span>
                  <span className="font-bold text-white/70">
                    {answeredCount} / {activePlayers.length}
                  </span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-green-400 rounded-full"
                    animate={{
                      width: activePlayers.length > 0
                        ? `${(answeredCount / activePlayers.length) * 100}%`
                        : '0%'
                    }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            // Tampilan saat babak selesai
            <motion.div
              key="round-done-view"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`backdrop-blur border rounded-2xl p-5 flex flex-col items-center gap-3 text-center ${
                allEliminated
                  ? 'bg-red-500/10 border-red-400/30'
                  : 'bg-white/10 border-white/20'
              }`}
            >
              {allEliminated ? (
                <>
                  <div className="text-5xl">💥</div>
                  <h3 className="text-2xl font-black text-white">Semua Pemain Gugur!</h3>
                  <p className="text-red-300 text-sm">Game akan berakhir.</p>
                </>
              ) : (
                <>
                  <div className="text-4xl">⏱️</div>
                  <h3 className="text-xl font-black text-white">Waktu Pengerjaan Soal Telah Habis</h3>
                  <p className="text-white/50 text-sm">
                    Jawaban benar: <span className="text-green-300 font-bold">{currentQ?.answer}</span>
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Status pemain aktif ── */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5 flex flex-col gap-3">
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
            Pemain Aktif ({activePlayers.length})
          </p>
          {activePlayers.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-2">Tidak ada pemain aktif</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {activePlayers.map(p => (
                <motion.div
                  key={p.id}
                  layout
                  className={`flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border ${
                    room.show_result && p.is_correct
                      ? 'border-green-400/40 bg-green-500/10'
                      : 'border-white/10'
                  }`}
                >
                  <Image
                    src={`/gift/${p.avatar}`}
                    width={28} height={28}
                    className="w-7 h-7 object-contain"
                    alt={p.name}
                  />
                  <span className="text-white text-xs font-semibold truncate flex-1">{p.name}</span>
                  {/* Indikator sudah jawab */}
                  {!room.show_result && p.current_answer !== null && (
                    <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" title="Sudah menjawab" />
                  )}
                  {room.show_result && (
                    <span className="flex-shrink-0 text-sm">
                      {p.is_correct ? '✅' : '❌'}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* ── Skor sementara ── */}
        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5 flex flex-col gap-3">
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest text-center">
            Skor Sementara
          </p>
          <div className="flex flex-col gap-2">
            {[...players]
              .sort((a, b) => b.score - a.score)
              .map((p, i) => (
                <div
                  key={p.id}
                  className={`flex items-center gap-3 p-2 rounded-xl transition-all ${
                    p.is_eliminated ? 'opacity-40' : ''
                  }`}
                >
                  <span className="text-white/40 text-sm w-6 text-center font-bold">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                  </span>
                  <Image
                    src={`/gift/${p.avatar}`}
                    width={32} height={32}
                    className={`w-8 h-8 object-contain ${p.is_eliminated ? 'grayscale' : ''}`}
                    alt={p.name}
                  />
                  <span className="text-white text-sm font-semibold flex-1 truncate">{p.name}</span>
                  {p.is_eliminated && (
                    <span className="text-red-400/70 text-xs">💀</span>
                  )}
                  <span className="text-indigo-300 text-sm font-bold">{p.score} poin</span>
                </div>
              ))}
          </div>
        </div>

        {/* ── Tombol lanjut (admin) ── */}
        {room.show_result && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={allEliminated || isLastQuestion ? onFinish : onNextQuestion}
            className="w-full py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
          >
            {allEliminated || isLastQuestion
              ? '🏆 Lihat Hasil Akhir'
              : `➡️ Soal Berikutnya (${room.current_question + 2}/${TOTAL_QUESTIONS})`}
          </motion.button>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Komponen utama RoyaleGame
// ─────────────────────────────────────────────
export default function RoyaleGame({ roomId, playerId, isAdmin }: RoyaleGameProps) {
  const router = useRouter()
  const [phase, setPhase] = useState<'waiting' | 'playing' | 'finished'>('waiting')
  const [room, setRoom] = useState<RoomState | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>()

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
          showResultTriggered.current = false
        }
      })
      .subscribe()

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

  // ── FIX #1: Admin force show_result saat timer habis ──
  useEffect(() => {
    if (!isAdmin || !room || room.show_result || phase !== 'playing') return
    if (!room.countdown_started_at) return

    const elapsed = (Date.now() - room.countdown_started_at) / 1000
    const remaining = Math.max(0, TIME_LIMIT - elapsed)

    if (remaining <= 0) {
      if (!showResultTriggered.current) {
        showResultTriggered.current = true
        handleShowResult()
      }
      return
    }

    const timeout = setTimeout(() => {
      if (!showResultTriggered.current) {
        showResultTriggered.current = true
        handleShowResult()
      }
    }, remaining * 1000 + 500)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.countdown_started_at, room?.show_result, phase, isAdmin])

  // ── Auto show result saat semua player aktif sudah jawab ──
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

  async function handleAnswer(answer: string) {
    if (!room || selectedAnswer !== undefined) return
    const isTimeout = answer === '__timeout__'

    const currentQ = questions[room.current_question]
    if (!currentQ) return

    const isCorrect = !isTimeout &&
      answer.toLowerCase().trim() === currentQ.answer.toLowerCase().trim()

    setSelectedAnswer(isTimeout ? '' : answer)

    const myPlayer = players.find(p => p.id === playerId)
    await supabase.from('royale_players').update({
      current_answer: isTimeout ? '__timeout__' : answer,
      answered_at: Date.now(),
      is_correct: isCorrect,
      score: isCorrect ? (myPlayer?.score ?? 0) + 10 : (myPlayer?.score ?? 0),
      is_eliminated: !isCorrect,
    }).eq('id', playerId)
  }

  async function handleShowResult() {
    if (!isAdmin) return
    await supabase.from('royale_rooms').update({ show_result: true }).eq('id', roomId)
  }

  async function handleNextQuestion() {
    if (!room || !isAdmin) return
    const nextQ = room.current_question + 1
    const activePlayers = players.filter(p => !p.is_eliminated)
    const allEliminated = activePlayers.length === 0
    const isLast = nextQ >= TOTAL_QUESTIONS || allEliminated

    await supabase.from('royale_players')
      .update({ current_answer: null, answered_at: null, is_correct: false })
      .eq('room_id', roomId)

    await supabase.from('royale_rooms').update({
      current_question: isLast ? room.current_question : nextQ,
      show_result: false,
      round_winner_ids: null,
      status: isLast ? 'finished' : 'playing',
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
        <p className="text-white animate-pulse text-lg">Memuat soal...</p>
      </div>
    )
  }

  // ── Tampilan ADMIN: observer mode ──
  if (isAdmin) {
    return (
      <AdminObserver
        room={room}
        questions={questions}
        players={players}
        onNextQuestion={handleNextQuestion}
        onFinish={handleFinish}
      />
    )
  }

  // ── Tampilan PLAYER: game biasa ──
  const currentQ = questions[room.current_question]
  const parsedOptions: string[] = currentQ?.options ? JSON.parse(currentQ.options) : []
  const activePlayers = players.filter(p => !p.is_eliminated)
  const myPlayer = players.find(p => p.id === playerId)
  const isEliminated = myPlayer?.is_eliminated ?? false
  const allEliminated = room.show_result && activePlayers.length === 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex flex-col relative overflow-hidden">

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
        <div className="text-white/60 text-sm font-semibold">👑 Calculus Royale</div>
        <div className="flex items-center gap-3 text-sm text-white/70">
          <span className="bg-white/10 rounded-full px-3 py-1">
            🟢 {activePlayers.length} aktif
          </span>
          <span className="bg-white/10 rounded-full px-3 py-1">
            💀 {players.filter(p => p.is_eliminated).length} eliminated
          </span>
        </div>
      </div>

      {/* Main content player */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-4">
        {isEliminated ? (
          <div className="text-center text-white/60 flex flex-col items-center gap-4">
            <div className="text-6xl">💀</div>
            <p className="text-xl font-bold">Kamu tereliminasi!</p>
            <p className="text-sm">Tonton pertandingan yang tersisa...</p>
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

      {/* Round result overlay — hanya untuk player */}
      {room.show_result && currentQ && (
        <RoundResult
          correctAnswer={currentQ.answer}
          allPlayers={players}
          questionNumber={room.current_question + 1}
          totalQuestions={TOTAL_QUESTIONS}
          isLastQuestion={room.current_question + 1 >= TOTAL_QUESTIONS}
          onContinue={handleNextQuestion}
          isAdmin={false}
          allEliminated={allEliminated}
          myPlayerId={playerId}
          mySelectedAnswer={selectedAnswer}
        />
      )}
    </div>
  )
}