'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FEATURES } from '@/data/landing'

// ─────────────────────────────────────────────
//  FeaturesSection — section #fitur
// ─────────────────────────────────────────────

export default function FeaturesSection() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section id="fitur" className="py-28 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <span className="text-blue-500 text-xs font-bold uppercase tracking-[0.2em]">Platform</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mt-2 leading-tight">
            Semua yang kamu butuhkan<br />
            <span className="text-gray-400">dalam satu tempat</span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.slug}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.13, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onHoverStart={() => setActive(i)}
              onHoverEnd={() => setActive(null)}
              whileHover={{ y: -4 }}
              className="relative rounded-2xl border border-gray-100 bg-white overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Top color strip */}
              <div className="h-1 w-full" style={{ backgroundColor: f.color }} />

              {/* Glow bg on hover */}
              <AnimatePresence>
                {active === i && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 20% 30%, ${f.color}10 0%, transparent 65%)` }}
                  />
                )}
              </AnimatePresence>

              <div className="relative z-10 p-7">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                  style={{ backgroundColor: f.colorLight }}
                >
                  {f.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-black text-gray-900 mb-2">{f.title}</h3>

                {/* Desc */}
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{f.desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {f.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ backgroundColor: f.colorLight, color: f.color }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={f.slug}
                  className="inline-flex items-center gap-1.5 text-sm font-bold transition-colors"
                  style={{ color: f.color }}
                >
                  Buka {f.title}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}