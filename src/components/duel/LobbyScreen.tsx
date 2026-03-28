'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface LobbyScreenProps {
  onRoomReady: (roomId: string, team: 'red' | 'blue') => void
}

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export default function LobbyScreen({ onRoomReady }: LobbyScreenProps) {
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose')
  const [roomId, setRoomId] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCreateRoom() {
    setLoading(true)
    setError('')
    const newId = generateRoomId()

    const { error: err } = await supabase.from('rooms').insert({
      id: newId,
      status: 'waiting',
      player_red: 'ready',
    })

    if (err) {
      setError('Gagal membuat room. Coba lagi.')
      setLoading(false)
      return
    }

    setRoomId(newId)
    setMode('create')
    setLoading(false)
  }

  async function handleJoinRoom() {
    if (joinCode.trim().length === 0) return
    setLoading(true)
    setError('')

    const code = joinCode.trim().toUpperCase()

    const { data, error: err } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', code)
      .single()

    if (err || !data) {
      setError('Room tidak ditemukan. Cek kode lagi ya.')
      setLoading(false)
      return
    }

    if (data.status !== 'waiting') {
      setError('Room sudah tidak tersedia.')
      setLoading(false)
      return
    }

    if (data.player_blue) {
      setError('Room sudah penuh.')
      setLoading(false)
      return
    }

    const { error: updateErr } = await supabase
      .from('rooms')
      .update({ player_blue: 'ready', status: 'ready' })
      .eq('id', code)

    if (updateErr) {
      setError('Gagal join room. Coba lagi.')
      setLoading(false)
      return
    }

    onRoomReady(code, 'blue')
    setLoading(false)
  }

  function handleCopy() {
    navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">

      {/* Dekorasi background kalkulus */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {[
          { text: '∫', x: '5%', y: '10%', size: '8rem', rotate: '-15deg' },
          { text: 'dy/dx', x: '80%', y: '8%', size: '3rem', rotate: '10deg' },
          { text: 'lim', x: '88%', y: '40%', size: '4rem', rotate: '-8deg' },
          { text: '∑', x: '3%', y: '55%', size: '6rem', rotate: '20deg' },
          { text: 'f\'(x)', x: '75%', y: '70%', size: '3.5rem', rotate: '-12deg' },
          { text: '∞', x: '15%', y: '80%', size: '5rem', rotate: '5deg' },
          { text: 'Δx→0', x: '60%', y: '88%', size: '2.5rem', rotate: '8deg' },
          { text: '∂', x: '45%', y: '5%', size: '5rem', rotate: '-20deg' },
          { text: '∇', x: '30%', y: '90%', size: '4rem', rotate: '15deg' },
        ].map((el, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: el.x,
              top: el.y,
              fontSize: el.size,
              transform: `rotate(${el.rotate})`,
              opacity: 0.06,
              fontWeight: 700,
              color: '#312e81',
              lineHeight: 1,
            }}
          >
            {el.text}
          </span>
        ))}
      </div>

      {/* Card utama */}
      <AnimatePresence mode="wait">

        {/* Mode: pilih buat atau join */}
        {mode === 'choose' && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-lg p-10 w-full max-w-md flex flex-col items-center gap-6"
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Kalkulus Duel</h1>
              <p className="text-gray-500 text-sm">Tantang temanmu dalam duel soal kalkulus!</p>
            </div>

            <div className="w-full flex flex-col gap-3">
              <Button onClick={handleCreateRoom} disabled={loading} className="w-full py-4 text-base">
                {loading ? 'Membuat room...' : 'Buat Room'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => { setMode('join'); setError('') }}
                disabled={loading}
                className="w-full py-4 text-base"
              >
                Masuk Room
              </Button>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </motion.div>
        )}

        {/* Mode: setelah buat room, tampilkan kode */}
        {mode === 'create' && (
          <motion.div
            key="create"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-lg p-10 w-full max-w-md flex flex-col items-center gap-6"
          >
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-1">Kode Room kamu</p>
              <div className="text-5xl font-black tracking-widest text-indigo-600 my-2">
                {roomId}
              </div>
              <p className="text-gray-400 text-xs">Bagikan kode ini ke temanmu</p>
            </div>

            <Button variant="secondary" onClick={handleCopy} className="w-full">
              {copied ? 'Tersalin!' : 'Salin Kode'}
            </Button>

            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Menunggu teman masuk room...
            </div>

            <WaitingForPlayer roomId={roomId} onRoomReady={onRoomReady} />

            <button
              onClick={() => { setMode('choose'); setRoomId('') }}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Batal & kembali
            </button>
          </motion.div>
        )}

        {/* Mode: join room */}
        {mode === 'join' && (
          <motion.div
            key="join"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-lg p-10 w-full max-w-md flex flex-col items-center gap-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Masuk Room</h2>
              <p className="text-gray-500 text-sm">Masukkan kode dari temanmu</p>
            </div>

            <Input
              value={joinCode}
              onChange={(val) => { setJoinCode(val.toUpperCase()); setError('') }}
              placeholder="Contoh: AB12CD"
              autoFocus
              className="text-center text-2xl font-bold tracking-widest uppercase"
            />

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div className="w-full flex flex-col gap-3">
              <Button
                onClick={handleJoinRoom}
                disabled={loading || joinCode.trim().length === 0}
                className="w-full py-4 text-base"
              >
                {loading ? 'Bergabung...' : 'Bergabung'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => { setMode('choose'); setError(''); setJoinCode('') }}
                className="w-full"
              >
                Kembali
              </Button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}

// Komponen terpisah: listen realtime sampai teman join
function WaitingForPlayer({
  roomId,
  onRoomReady
}: {
  roomId: string
  onRoomReady: (roomId: string, team: 'red' | 'blue') => void
}) {
  const [mounted, setMounted] = useState(false)

  // Listen realtime perubahan status room
  if (!mounted) {
    const channel = supabase
      .channel(`room-${roomId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${roomId}`
      }, (payload) => {
        if (payload.new.status === 'ready') {
          onRoomReady(roomId, 'red')
        }
      })
      .subscribe()
  }

  return null
}