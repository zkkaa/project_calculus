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
        <div>
          <div className='flex items-center gap-2 '>
            <span className='text-lg'>Semua yang kamu butuhkan</span>
            <div className='bg-gray-300 w-28 h-1.5 mt-1'></div>
          </div>
          <div>
            <span className='text-4xl font-extrabold italic'>dalam satu tempat</span>
          </div>
        </div>
        <div className=' w-full h-80 mt-7 flex'>
          <div className=' w-6/12 h-full flex items-center justify-center'>
            <div className=' w-60 h-60 rounded-2xl bg-gray-400'></div>
          </div>
          <div className=' w-6/12 h-full flex flex-col gap-6 justify-center'>
            <span className='text-4xl font-semibold'>Game</span>
            <span className='mr-4'>SIGMA (Smart Interactive Graphing & Math Application) adalah platform pembelajaran matematika berbasis teknologi yang membantu pengguna memahami konsep secara lebih mudah dan interaktif.</span>
            <button className=' w-48 text-start cursor-pointer leading-8'>lihat semuanya -{'>'}</button>
          </div>
        </div>
        <div className='flex flex-col items-end mt-14'>
          <div className='flex items-center gap-5 '>
            <div className='bg-gray-300 w-28 h-1.5 mt-1'></div>
            <span className='text-lg'>materi apa saja yang</span>
          </div>
          <div>
            <span className='text-4xl font-extrabold italic'>bisa dipelajari?</span>
          </div>
          </div>
        <div className=' w-full h-80 mt-7 flex'>
          <div className=' w-full h-full flex items-center justify-center gap-5'>
            <div className=' w-full h-44 rounded-2xl flex flex-col p-5 gap-2 justify-center bg-gray-400'>
              <span className='text-2xl font-semibold'>f'(x) </span>
              <span className='text-xs  font-semibold'>Turunan</span>
              <span className=''>Laju perubahan fungsi terhadap variabelnya.</span>
            </div>
            <div className=' w-full h-44 rounded-2xl flex flex-col p-5 gap-2 justify-center bg-gray-400'>
              <span className='text-2xl font-semibold'>f'(x) </span>
              <span className='text-xs  font-semibold'>Turunan</span>
              <span className=''>Laju perubahan fungsi terhadap variabelnya.</span>
            </div>
            <div className=' w-full h-44 rounded-2xl flex flex-col p-5 gap-2 justify-center bg-gray-400'>
              <span className='text-2xl font-semibold'>f'(x) </span>
              <span className='text-xs  font-semibold'>Turunan</span>
              <span className=''>Laju perubahan fungsi terhadap variabelnya.</span>
            </div>
          </div>
        </div>
        <div className='w-full flex justify-center'>
          <Link
            href="/materi"
            className="bg-gray-900 text-white font-bold px-7 py-3.5 rounded-full text-sm hover:bg-gray-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gray-900/20"
          >
            Jelajahi Materi →
          </Link>
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