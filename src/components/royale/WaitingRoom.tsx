'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

interface Player {
  id: string
  name: string
  avatar: string
}

interface WaitingRoomProps {
  roomId: string
  playerId: string
  isAdmin: boolean
  onGameStart: () => void
}

export default function WaitingRoom({ roomId, playerId, isAdmin, onGameStart }: WaitingRoomProps) {
  const [players, setPlayers] = useState<Player[]>([])
  const [copied, setCopied] = useState(false)
  const [starting, setStarting] = useState(false)

  // Load pemain awal + subscribe realtime
  useEffect(() => {
    async function loadPlayers() {
      const { data } = await supabase
        .from('royale_players')
        .select('id, name, avatar')
        .eq('room_id', roomId)
      if (data) setPlayers(data)
    }
    loadPlayers()

    // Realtime: ada pemain baru masuk
    const playerChannel = supabase
      .channel(`waiting-players-${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'royale_players',
        filter: `room_id=eq.${roomId}`,
      }, (payload) => {
        const p = payload.new as Player
        setPlayers(prev => {
          if (prev.find(x => x.id === p.id)) return prev
          return [...prev, p]
        })
      })
      .subscribe()

    // Realtime: tunggu status room berubah jadi 'playing'
    const roomChannel = supabase
      .channel(`waiting-room-${roomId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'royale_rooms',
        filter: `id=eq.${roomId}`,
      }, (payload) => {
        if (payload.new.status === 'playing') onGameStart()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(playerChannel)
      supabase.removeChannel(roomChannel)
    }
  }, [roomId, onGameStart])

  async function handleStartGame() {
    if (players.length === 0) return
    setStarting(true)

    // Ambil soal acak
    const { data: allQ } = await supabase.from('questions').select('id')
    if (!allQ) { setStarting(false); return }

    const shuffled = allQ
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)
      .map(q => q.id)

    await supabase.from('royale_rooms').update({
      status: 'playing',
      question_ids: JSON.stringify(shuffled),
      current_question: 0,
      countdown_started_at: Date.now(),
    }).eq('id', roomId)
  }

  function handleCopy() {
    navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-indigo-800 relative overflow-hidden flex flex-col">

      {/* Dekorasi background */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {['∫', '∑', '∂', '∞', 'dy/dx', "f'(x)", 'lim', '∇', 'Δ'].map((sym, i) => (
          <motion.span key={i}
            animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              left: `${8 + i * 10}%`,
              top: `${10 + (i % 3) * 25}%`,
              fontSize: `${3 + (i % 3)}rem`,
              opacity: 0.08, fontWeight: 700, color: 'white',
            }}
          >{sym}</motion.span>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center pt-10 pb-4 px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-black text-white tracking-tight">👑 Calculus Royale</h1>
          <p className="text-indigo-200 mt-1 text-sm">Menunggu pemain bergabung...</p>
        </motion.div>

        {/* Kode room */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-8 py-4 text-center"
        >
          <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">Kode Room</p>
          <div className="text-5xl font-black text-white tracking-widest">{roomId}</div>
          <button
            onClick={handleCopy}
            className="mt-2 text-xs text-indigo-300 hover:text-white transition underline"
          >
            {copied ? '✅ Tersalin!' : 'Salin kode'}
          </button>
        </motion.div>

        {/* Jumlah pemain */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 flex items-center gap-2 text-indigo-200 text-sm"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>{players.length} pemain bergabung</span>
        </motion.div>
      </div>

      {/* Grid pemain */}
      <div className="relative z-10 flex-1 px-6 pb-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {players.map((player, i) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: i * 0.05 }}
                  className={`bg-white/10 backdrop-blur border rounded-2xl p-3 flex flex-col items-center gap-2 ${
                    player.id === playerId ? 'border-yellow-400 bg-yellow-400/10' : 'border-white/20'
                  }`}
                >
                  <Image
                    src={`/gift/${player.avatar}`}
                    alt={player.name}
                    className="w-14 h-14 object-contain rounded-xl"
                    width={56}
                    height={56}
                  />
                  <p className={`text-sm font-bold text-center truncate w-full ${
                    player.id === playerId ? 'text-yellow-300' : 'text-white'
                  }`}>
                    {player.name}
                    {player.id === playerId && <span className="text-xs block font-normal opacity-70">(kamu)</span>}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {players.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-indigo-300"
            >
              <div className="text-5xl mb-4">⏳</div>
              <p className="text-sm">Belum ada yang bergabung...</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Tombol mulai (admin only) */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 p-6 flex flex-col items-center gap-3"
        >
          {players.length === 0 && (
            <p className="text-indigo-300 text-xs">Butuh minimal 1 pemain untuk memulai</p>
          )}
          <button
            onClick={handleStartGame}
            disabled={players.length === 0 || starting}
            className="px-12 py-4 rounded-2xl bg-green-500 hover:bg-green-400 text-white font-black text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-green-500/30 hover:scale-105 active:scale-95"
          >
            {starting ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Memulai...
              </span>
            ) : (
              `🚀 Mulai Game (${players.length} pemain)`
            )}
          </button>
        </motion.div>
      )}

      {/* Pemain nunggu host */}
      {!isAdmin && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 p-6 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-indigo-300 text-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Menunggu host memulai game...
          </div>
        </motion.div>
      )}
    </div>
  )
}