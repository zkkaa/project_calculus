'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

interface RoyaleLobbyProps {
  onRoomReady: (roomId: string, playerId: string, isAdmin: boolean) => void
}

function generateId(length = 6) {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase()
}

const AVATARS = [
  'red-duel.webp',
  'blue-duel.webp',
]

const calcDecorations = [
  { text: '∫', x: '5%', y: '10%', size: '8rem', rotate: '-15deg' },
  { text: 'dy/dx', x: '80%', y: '8%', size: '3rem', rotate: '10deg' },
  { text: 'lim', x: '88%', y: '40%', size: '4rem', rotate: '-8deg' },
  { text: '∑', x: '3%', y: '55%', size: '6rem', rotate: '20deg' },
  { text: "f'(x)", x: '75%', y: '70%', size: '3.5rem', rotate: '-12deg' },
  { text: '∞', x: '15%', y: '80%', size: '5rem', rotate: '5deg' },
  { text: '∂', x: '45%', y: '5%', size: '5rem', rotate: '-20deg' },
  { text: '∇', x: '30%', y: '90%', size: '4rem', rotate: '15deg' },
  { text: 'Δx→0', x: '60%', y: '88%', size: '2.5rem', rotate: '8deg' },
]

export default function RoyaleLobby({ onRoomReady }: RoyaleLobbyProps) {
  const [step, setStep] = useState<'identity' | 'choose' | 'create' | 'joining' | 'joined'>('identity')
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('red-duel.webp')
  const [joinCode, setJoinCode] = useState('')
  const [roomId, setRoomId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // ── STEP 1: simpan identity lalu pilih mode ──
  function handleIdentitySubmit() {
    if (!name.trim()) { setError('Masukkan nama kamu dulu!'); return }
    setError('')
    setStep('choose')
  }

  // ── STEP 2a: Buat room (admin) ──
  async function handleCreateRoom() {
    setLoading(true)
    setError('')
    const newRoomId = generateId()
    const adminId = generateId(12)

    const { error: roomErr } = await supabase.from('royale_rooms').insert({
      id: newRoomId,
      status: 'waiting',
      admin_id: adminId,
    })

    if (roomErr) { setError('Gagal membuat room.'); setLoading(false); return }

    setRoomId(newRoomId)
    setLoading(false)
    setStep('create')

    // Admin tidak join sebagai player, langsung redirect sebagai admin
    onRoomReady(newRoomId, adminId, true)
  }

  // ── STEP 2b: Join room sebagai player ──
  async function handleJoinRoom() {
    if (!joinCode.trim()) return
    setLoading(true)
    setError('')

    const code = joinCode.trim().toUpperCase()
    const { data, error: findErr } = await supabase
      .from('royale_rooms')
      .select('*')
      .eq('id', code)
      .single()

    if (findErr || !data) { setError('Room tidak ditemukan.'); setLoading(false); return }
    if (data.status !== 'waiting') { setError('Game sudah dimulai atau selesai.'); setLoading(false); return }

    const playerId = generateId(12)
    const { error: playerErr } = await supabase.from('royale_players').insert({
      id: playerId,
      room_id: code,
      name: name.trim(),
      avatar,
      score: 0,
      is_eliminated: false,
    })

    if (playerErr) { setError('Gagal bergabung ke room.'); setLoading(false); return }

    setLoading(false)
    onRoomReady(code, playerId, false)
  }

  function handleCopy() {
    navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Dekorasi background */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {calcDecorations.map((el, i) => (
          <span key={i} style={{
            position: 'absolute', left: el.x, top: el.y,
            fontSize: el.size, transform: `rotate(${el.rotate})`,
            opacity: 0.06, fontWeight: 700, color: '#4338ca', lineHeight: 1,
          }}>{el.text}</span>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── STEP: Identity ── */}
        {step === 'identity' && (
          <motion.div key="identity"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.3 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-xl p-10 w-full max-w-md flex flex-col gap-6"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">👑</div>
              <h1 className="text-3xl font-black text-gray-900">Calculus Royale</h1>
              <p className="text-gray-400 text-sm mt-1">Battle kalkulus seru bareng teman-teman!</p>
            </div>

            {/* Input nama */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1 block">Nama kamu</label>
              <input
                value={name}
                onChange={e => { setName(e.target.value); setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleIdentitySubmit()}
                placeholder="Masukkan namamu..."
                autoFocus
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
            </div>

            {/* Pilih avatar */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">Pilih karakter</label>
              <div className="flex gap-4 justify-center">
                {AVATARS.map(av => (
                  <button key={av}
                    onClick={() => setAvatar(av)}
                    className={`rounded-2xl border-2 p-1 transition-all ${avatar === av ? 'border-indigo-500 scale-110 shadow-lg' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
                  >
                    <Image src={`/gift/${av}`} alt={av} className="w-20 h-20 object-contain rounded-xl" width={80} height={80} />
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              onClick={handleIdentitySubmit}
              disabled={!name.trim()}
              className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-base hover:bg-indigo-700 transition disabled:opacity-40"
            >
              Lanjutkan →
            </button>
          </motion.div>
        )}

        {/* ── STEP: Choose mode ── */}
        {step === 'choose' && (
          <motion.div key="choose"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.3 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-xl p-10 w-full max-w-md flex flex-col gap-5"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-1">
                <Image src={`/gift/${avatar}`} alt={avatar} className="w-10 h-10 rounded-full object-contain" width={40} height={40} />
                <span className="font-bold text-gray-800 text-lg">{name}</span>
              </div>
              <p className="text-gray-400 text-sm">Mau buat room atau masuk room?</p>
            </div>

            <button
              onClick={handleCreateRoom}
              disabled={loading}
              className="w-full py-5 rounded-xl bg-indigo-600 text-white font-bold text-base hover:bg-indigo-700 transition disabled:opacity-40 flex flex-col items-center gap-1"
            >
              <span className="text-xl">🏟️</span>
              <span>{loading ? 'Membuat room...' : 'Buat Room (Admin)'}</span>
              <span className="text-xs font-normal opacity-70">Kamu jadi host, tidak ikut game</span>
            </button>

            <button
              onClick={() => { setStep('joining'); setError('') }}
              className="w-full py-5 rounded-xl border-2 border-indigo-200 text-indigo-700 font-bold text-base hover:bg-indigo-50 transition flex flex-col items-center gap-1"
            >
              <span className="text-xl">🎮</span>
              <span>Masuk Room</span>
              <span className="text-xs font-normal opacity-70">Ikut game dengan kode room</span>
            </button>

            <button onClick={() => setStep('identity')} className="text-xs text-gray-400 hover:text-gray-600 underline text-center">
              ← Ganti nama/karakter
            </button>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </motion.div>
        )}

        {/* ── STEP: Join room ── */}
        {step === 'joining' && (
          <motion.div key="joining"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.3 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-xl p-10 w-full max-w-md flex flex-col gap-5"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Masuk Room</h2>
              <p className="text-gray-400 text-sm mt-1">Masukkan kode dari host</p>
            </div>

            <input
              value={joinCode}
              onChange={e => { setJoinCode(e.target.value.toUpperCase()); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleJoinRoom()}
              placeholder="Contoh: AB12CD"
              autoFocus
              className="w-full border border-gray-200 rounded-xl px-4 py-4 text-center text-2xl font-black tracking-widest text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 uppercase transition"
            />

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              onClick={handleJoinRoom}
              disabled={loading || !joinCode.trim()}
              className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-base hover:bg-indigo-700 transition disabled:opacity-40"
            >
              {loading ? 'Bergabung...' : 'Bergabung →'}
            </button>

            <button onClick={() => setStep('choose')} className="text-xs text-gray-400 hover:text-gray-600 underline text-center">
              ← Kembali
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}