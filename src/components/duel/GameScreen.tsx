'use client'

import { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import ScoreBoard from './ScoreBoard'
import CharacterPanel from './CharacterPanel'
import QuestionBox from './QuestionBox'
import CountdownOverlay from './CountdownOverlay'
import RoundResultOverlay from './RoundResultOverlay'
import GameResultOverlay from './GameResultOverlay'

interface GameScreenProps {
  roomId: string
  team: 'red' | 'blue'
}

const TOTAL_QUESTIONS = 5

interface RoomState {
  status: string
  current_question: number
  score_red: number
  score_blue: number
  round_winner: string | null
  show_round_result: boolean
  game_winner: string | null
  question_ids: string | null
  countdown_started_at: number | null
}

interface Question {
  id: number
  question: string
  answer: string
}

export default function GameScreen({ roomId, team }: GameScreenProps) {
  const router = useRouter()
  const [room, setRoom] = useState<RoomState | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [showCountdown, setShowCountdown] = useState(true)
  const [answered, setAnswered] = useState(false)
  const [wrongAnswer, setWrongAnswer] = useState(false)

  // Taruh di atas useEffect supaya bisa dipanggil sebelum dideklarasikan
  const loadQuestionsByIds = useCallback(async (ids: number[]) => {
    const { data } = await supabase
      .from('questions')
      .select('*')
      .in('id', ids)

    if (!data) return

    const ordered = ids.map((id) => data.find((q) => q.id === id)!)
    setQuestions(ordered)
  }, [])

  // Load room pertama kali
  useEffect(() => {
    async function initRoom() {
      const { data: roomData } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single()

      if (!roomData) return

      if (!roomData.question_ids) {
        // Player 1: generate soal + simpan timestamp countdown
        const { data: allQ } = await supabase.from('questions').select('id')
        if (!allQ) return

        const shuffledIds = allQ
          .sort(() => Math.random() - 0.5)
          .slice(0, TOTAL_QUESTIONS)
          .map((q) => q.id)

        const now = Date.now()

        await supabase.from('rooms').update({
          question_ids: JSON.stringify(shuffledIds),
          countdown_started_at: now,
        }).eq('id', roomId)

        await loadQuestionsByIds(shuffledIds)
        setRoom({ ...roomData, question_ids: JSON.stringify(shuffledIds), countdown_started_at: now })
      } else {
        // Player 2: pakai soal yang sudah ada
        const ids = JSON.parse(roomData.question_ids)
        await loadQuestionsByIds(ids)
        setRoom(roomData)
      }
    }

    initRoom()
  }, [roomId, loadQuestionsByIds])

  // Sinkronisasi countdown berdasarkan countdown_started_at dari Supabase
  useEffect(() => {
    if (!room?.countdown_started_at) return

    const elapsed = Date.now() - room.countdown_started_at
    // Total durasi countdown: "Game dimulai!" 1800ms + "3" 900ms + "2" 900ms + "1" 900ms + "MULAI!" 900ms = 5400ms
    const totalDuration = 5400

    const remaining = totalDuration - elapsed
    if (remaining <= 0) {
      const timer = setTimeout(() => setShowCountdown(false), 0)
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => setShowCountdown(false), remaining)
    return () => clearTimeout(timer)
  }, [room?.countdown_started_at])

  // Listen realtime
  useEffect(() => {
    const channel = supabase
      .channel(`game-${roomId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${roomId}`
      }, async (payload) => {
        const newRoom = payload.new as RoomState

        if (newRoom.question_ids && questions.length === 0) {
          const ids = JSON.parse(newRoom.question_ids)
          await loadQuestionsByIds(ids)
        }

        setRoom(newRoom)

        if (!newRoom.show_round_result) {
          setAnswered(false)
          setWrongAnswer(false)
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [roomId, questions.length, loadQuestionsByIds])

  async function handleAnswer(answer: string) {
    if (answered || !room || !questions.length) return

    const currentQ = questions[room.current_question]
    const isCorrect = answer.toLowerCase().trim() === currentQ.answer.toLowerCase().trim()

    if (!isCorrect) {
      setWrongAnswer(true)
      setTimeout(() => setWrongAnswer(false), 1000)
      return
    }

    setAnswered(true)

    const newScoreRed = team === 'red' ? room.score_red + 1 : room.score_red
    const newScoreBlue = team === 'blue' ? room.score_blue + 1 : room.score_blue
    const nextQuestion = room.current_question + 1
    const isLastQuestion = nextQuestion >= TOTAL_QUESTIONS

    await supabase.from('rooms').update({
      score_red: newScoreRed,
      score_blue: newScoreBlue,
      round_winner: team,
      show_round_result: true,
      game_winner: isLastQuestion
        ? (newScoreRed > newScoreBlue ? 'red' : newScoreBlue > newScoreRed ? 'blue' : 'draw')
        : null,
      status: isLastQuestion ? 'finished' : 'playing',
    }).eq('id', roomId)

    if (!isLastQuestion) {
      setTimeout(async () => {
        await supabase.from('rooms').update({
          current_question: nextQuestion,
          show_round_result: false,
          round_winner: null,
        }).eq('id', roomId)
      }, 5000)
    }
  }

  async function handleFinish() {
    await supabase.from('rooms').delete().eq('id', roomId)
    router.push('/games/duel')
  }

  if (!room || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Memuat game...</p>
      </div>
    )
  }

  const currentQuestion = questions[room.current_question]

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-white">

      {/* Dekorasi background */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {[
          { text: '∫', x: '5%', y: '10%', size: '8rem', rotate: '-15deg' },
          { text: 'dy/dx', x: '80%', y: '8%', size: '3rem', rotate: '10deg' },
          { text: '∑', x: '3%', y: '55%', size: '6rem', rotate: '20deg' },
          { text: "f'(x)", x: '75%', y: '70%', size: '3.5rem', rotate: '-12deg' },
          { text: '∞', x: '15%', y: '80%', size: '5rem', rotate: '5deg' },
          { text: '∂', x: '45%', y: '5%', size: '5rem', rotate: '-20deg' },
        ].map((el, i) => (
          <span key={`deco-${i}`} style={{
            position: 'absolute', left: el.x, top: el.y,
            fontSize: el.size, transform: `rotate(${el.rotate})`,
            opacity: 0.05, fontWeight: 700, color: '#312e81', lineHeight: 1,
          }}>
            {el.text}
          </span>
        ))}
      </div>

      <ScoreBoard
        scoreRed={room.score_red}
        scoreBlue={room.score_blue}
        totalQuestions={TOTAL_QUESTIONS}
        currentQuestion={room.current_question + 1}
      />

      {/* Feedback jawaban salah */}
      <AnimatePresence>
        {wrongAnswer && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 z-20 bg-red-100 border border-red-300 text-red-600 text-sm font-semibold px-5 py-2 rounded-full"
          >
            Jawaban salah, coba lagi!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex items-center justify-between px-6 md:px-16 pt-24 pb-8 gap-4">
        <CharacterPanel
          team="red"
          isWinner={room.show_round_result && room.round_winner === 'red'}
        />

        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!room.show_round_result && !room.game_winner && !showCountdown && (
              <QuestionBox
                key={`q-${room.current_question}`}
                questionNumber={room.current_question + 1}
                questionText={currentQuestion?.question ?? ''}
                onSubmit={handleAnswer}
                disabled={answered}
                totalQuestions={TOTAL_QUESTIONS}
              />
            )}
          </AnimatePresence>
        </div>

        <CharacterPanel
          team="blue"
          isWinner={room.show_round_result && room.round_winner === 'blue'}
        />
      </div>

      <AnimatePresence>
        {showCountdown && (
          <CountdownOverlay onComplete={() => setShowCountdown(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {room.show_round_result && room.round_winner && !room.game_winner && (
          <RoundResultOverlay
            questionNumber={room.current_question + 1}
            winnerTeam={room.round_winner as 'red' | 'blue'}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {room.game_winner && (
          <GameResultOverlay
            winnerTeam={room.game_winner as 'red' | 'blue'}
            scoreRed={room.score_red}
            scoreBlue={room.score_blue}
            onFinish={handleFinish}
          />
        )}
      </AnimatePresence>
    </div>
  )
}