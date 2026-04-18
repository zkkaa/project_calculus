// src/app/page.tsx
// ─────────────────────────────────────────────
//  Landing Page — SIGMA
//  Merakit semua komponen section
// ─────────────────────────────────────────────
'use client'
import MathParticles from '@/components/ui/MathParticles'
import Navbar from '@/components/landing/Navbar'
import HeroSection from '@/components/materi/HeroSection'
import { useState } from 'react'
import { MenuMateri } from '@/components/materi/MenuMateri'

export default function Home() {
  const [showExpand, setShowExpand] = useState(false)

  function handleShowAll() {
    setShowExpand(true)
  }

  return (
    <main className="relative bg-white min-h-screen overflow-x-hidden">

      {/*
        MathParticles — background partikel simbol matematika
        Reusable: tinggal panggil <MathParticles /> di halaman lain
        Props: count (jumlah), opacity (ketebalan)
      */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <MathParticles count={40} opacity={0.045} />
      </div>

      {/* Semua konten di atas partikel */}
      <div className="relative z-10">
        <Navbar />
        <HeroSection onShowAll={handleShowAll} />
        <MenuMateri />
      </div>
    </main>
  )
}