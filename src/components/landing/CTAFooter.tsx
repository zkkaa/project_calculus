'use client'

import Link from 'next/link'
import { FOOTER, HAMBURGER_MENU, SITE_NAME } from '@/data/landing'

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