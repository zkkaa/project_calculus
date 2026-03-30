'use client'

import { motion } from 'framer-motion'
import { MEMBERS } from '@/data/landing'

// ─────────────────────────────────────────────
//  TeamSection — section #tim
//  Pengenalan anggota Kelompok 9
// ─────────────────────────────────────────────

export default function TeamSection() {
  const lead = MEMBERS.find((m) => m.isLead)
  const rest = MEMBERS.filter((m) => !m.isLead)

  return (
    <section id="tim" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-blue-500 text-xs font-bold uppercase tracking-[0.2em]">Tim Pembuat</span>
          <h2 className="text-4xl font-black tracking-tight text-gray-900 mt-2">Kelompok 9</h2>
          <p className="text-gray-400 mt-3 text-sm">
            Mahasiswa yang membangun Sigma dengan semangat dan secangkir kopi ☕
          </p>
        </motion.div>

        {/* Lead card — lebih besar */}
        {lead && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mb-8"
          >
            <div className="max-w-md mx-auto">
              <div
                className="relative rounded-2xl p-px overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)' }}
              >
                <div className="bg-white rounded-[calc(1rem-1px)] p-7 flex items-center gap-6">
                  {/* Avatar */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                    style={{ background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)' }}
                  >
                    {lead.emoji}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                      >
                        Lead
                      </span>
                    </div>
                    <p className="font-black text-gray-900 text-base leading-tight">{lead.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{lead.npm}</p>
                    <p className="text-xs text-blue-500 font-medium mt-1">{lead.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Rest members grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
          {rest.map((m, i) => (
            <motion.div
              key={m.npm}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              whileHover={{ y: -4 }}
              className="flex flex-col items-center text-center p-5 rounded-2xl border border-gray-100 bg-white hover:border-blue-200 hover:shadow-md transition-all"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-50 to-violet-50 flex items-center justify-center text-xl mb-3 border border-gray-100">
                {m.emoji}
              </div>
              <p className="font-black text-gray-900 text-sm leading-tight mb-1">{m.name}</p>
              <p className="text-[11px] text-gray-400 mb-1">{m.npm}</p>
              <p className="text-[11px] text-blue-500 font-medium leading-tight">{m.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}