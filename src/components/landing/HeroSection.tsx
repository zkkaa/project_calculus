'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, cubicBezier } from 'framer-motion'
import { SITE_DESC, STATS } from '@/data/landing'

// ─────────────────────────────────────────────
//  HeroSection
// ─────────────────────────────────────────────

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 1600
        const steps = 60
        const increment = to / steps
        let current = 0
        const timer = setInterval(() => {
          current = Math.min(current + increment, to)
          setCount(Math.floor(current))
          if (current >= to) clearInterval(timer)
        }, duration / steps)
      }
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [to])

  return <span ref={ref}>{count}{suffix}</span>
}

const stagger = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  },
  item: {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: cubicBezier(0.22, 1, 0.36, 1) } },
  },
}

export default function HeroSection() {
  return (
    <section
      id="tentang"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 overflow-hidden"
    >
      {/* Gradient lingkaran besar di belakang */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(99,102,241,0.06) 0%, rgba(59,130,246,0.04) 40%, transparent 70%)',
        }}
      />
      {/* Gradien warna halus di pojok */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)' }} />

      <motion.div
        variants={stagger.container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center gap-5 max-w-3xl"
      >
        {/* Badge */}
        <motion.div variants={stagger.item}>
          <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Platform Kalkulus Interaktif · Kelompok 9
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={stagger.item}
          className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05] text-gray-900"
          style={{ fontFamily: '"Georgia", serif' }}
        >
          Belajar{' '}
          <span
            className="relative inline-block"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Kalkulus
          </span>
          <br />
          Lebih Seru
        </motion.h1>

        {/* Sub */}
        <motion.p
          variants={stagger.item}
          className="text-gray-500 text-lg max-w-xl leading-relaxed"
        >
          {SITE_DESC}
        </motion.p>

        {/* CTA buttons */}
        <motion.div variants={stagger.item} className="flex flex-wrap gap-3 justify-center mt-1">
          <Link
            href="/materi"
            className="bg-gray-900 text-white font-bold px-7 py-3.5 rounded-full text-sm hover:bg-gray-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gray-900/20"
          >
            Jelajahi Materi →
          </Link>
          <Link
            href="/games/duel"
            className="border border-gray-200 text-gray-700 font-semibold px-7 py-3.5 rounded-full text-sm hover:border-gray-400 hover:bg-gray-50 transition-all hover:scale-105 active:scale-95"
          >
            ⚔️ Duel Sekarang
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={stagger.item}
          className="flex gap-10 mt-6"
        >
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="text-3xl font-black text-gray-900"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs text-gray-400 mt-0.5 font-medium">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-300 text-xs"
      >
        <span className="tracking-widest uppercase text-[10px]">scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-6 bg-linear-to-b from-gray-300 to-transparent rounded-full"
        />
      </motion.div>
    </section>
  )
}