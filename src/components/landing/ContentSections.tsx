'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { HOW_IT_WORKS, QUOTE, TOPICS } from '@/data/landing'

// ─────────────────────────────────────────────
//  HowItWorksSection
// ─────────────────────────────────────────────
export function HowItWorksSection() {
  return (
    <section className="py-24 px-6 bg-gray-50/60">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-blue-500 text-xs font-bold uppercase tracking-[0.2em]">Cara Kerja</span>
          <h2 className="text-4xl font-black tracking-tight text-gray-900 mt-2">
            Mulai belajar dalam 3 langkah
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector */}
          <div className="hidden md:block absolute top-9 left-[calc(33.3%+20px)] right-[calc(33.3%+20px)] h-px"
            style={{ background: 'linear-gradient(to right, #3b82f6, #8b5cf6)' }} />

          {HOW_IT_WORKS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.18, duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <div
                className="w-18 h-18 rounded-2xl flex items-center justify-center mb-5 font-black text-white text-xl shadow-lg"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
              >
                {step.num}
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
//  QuoteSection
// ─────────────────────────────────────────────
export function QuoteSection() {
  return (
    <section className="py-24 px-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto text-center relative"
      >
        {/* Big quote mark */}
        <span
          className="absolute -top-6 left-0 select-none pointer-events-none leading-none"
          style={{
            fontSize: '10rem',
            fontFamily: '"Georgia", serif',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            opacity: 0.12,
          }}
        >
          &quot;
        </span>

        <blockquote
          className="text-2xl md:text-3xl font-light leading-relaxed text-gray-700 relative z-10"
          style={{ fontFamily: '"Georgia", serif', fontStyle: 'italic' }}
        >
          {QUOTE.text}
        </blockquote>
        <p className="mt-5 text-sm font-bold text-gray-400 tracking-widest uppercase">
          — {QUOTE.author}
        </p>
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────
//  TopicsSection — preview materi
// ─────────────────────────────────────────────
export function TopicsSection() {
  return (
    <section className="py-24 px-6 bg-gray-50/60">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-blue-500 text-xs font-bold uppercase tracking-[0.2em]">Topik Tersedia</span>
          <h2 className="text-4xl font-black tracking-tight text-gray-900 mt-2">
            Apa saja yang bisa{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              dipelajari?
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {TOPICS.map((topic, i) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -3, scale: 1.02 }}
              className="group p-5 rounded-xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div
                className="text-2xl font-black mb-2"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {topic.symbol}
              </div>
              <div className="font-black text-sm text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {topic.title}
              </div>
              <div className="text-xs text-gray-400 leading-relaxed">{topic.desc}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <Link
            href="/materi"
            className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-full text-sm hover:border-blue-300 hover:text-blue-600 transition-all hover:scale-105"
          >
            Lihat semua materi
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}