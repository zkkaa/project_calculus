'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FOOTER, HAMBURGER_MENU, SITE_NAME } from '@/data/landing'

// ─────────────────────────────────────────────
//  CTASection — ajakan mulai belajar
// ─────────────────────────────────────────────
export function CTASection() {
  return (
    <section className="py-28 px-6 overflow-hidden relative">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 60%, rgba(99,102,241,0.07) 0%, rgba(59,130,246,0.05) 40%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-2xl mx-auto text-center"
      >
        <h2
          className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 mb-4 leading-tight"
          style={{ fontFamily: '"Georgia", serif' }}
        >
          Siap kuasai{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            kalkulus?
          </span>
        </h2>
        <p className="text-gray-500 mb-10 text-lg">
          Bergabung sekarang dan rasakan cara belajar yang berbeda.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/materi"
            className="inline-flex items-center gap-2 font-black text-base px-9 py-4 rounded-full text-white shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
          >
            Mulai Sekarang — Gratis
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/games/duel"
            className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 font-semibold px-7 py-4 rounded-full text-base hover:border-gray-400 transition-all hover:scale-105"
          >
            ⚔️ Coba Duel
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────
//  Footer
// ─────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50/50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">

          {/* Brand */}
          <div className="max-w-xs">
            <p
              className="text-2xl font-black text-gray-900 tracking-tight mb-2"
              style={{ fontFamily: '"Georgia", serif', fontStyle: 'italic' }}
            >
              sigma
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">{FOOTER.desc}</p>
          </div>

          {/* Nav links */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Navigasi</p>
            <ul className="flex flex-col gap-2">
              {HAMBURGER_MENU.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Info</p>
            <ul className="flex flex-col gap-2 text-sm text-gray-500">
              <li>Kelompok 9</li>
              <li>Mata Kuliah Kalkulus</li>
              <li>Universitas Siliwangi</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 flex items-center justify-center">
          <p className="text-xs text-gray-400">
            © {FOOTER.year} {SITE_NAME}. all rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}