'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'

// ── Icons ──────────────────────────────────────────────
function IconHome() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}
function IconBook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  )
}
function IconPencil() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  )
}
function IconGamepad() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="12" rx="4" />
      <path d="M8 11v4M6 13h4" />
      <circle cx="16" cy="13" r="1" fill="currentColor" stroke="none" />
      <circle cx="18" cy="11" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

// ── Nav items ──────────────────────────────────────────
const NAV_ITEMS = [
  { href: '/',        label: 'Beranda',    icon: IconHome    },
  { href: '/materi',  label: 'Materi',  icon: IconBook    },
  { href: '/latihan', label: 'Latihan', icon: IconPencil  },
  { href: '/games',   label: 'Game',    icon: IconGamepad },
]

// ── Component ──────────────────────────────────────────
export default function Navbar() {
  const pathname   = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [hovered,  setHovered]  = useState<number | null>(null)

  const navRef     = useRef<HTMLElement>(null)
  const labelsRef  = useRef<(HTMLSpanElement | null)[]>([])
  const tlRef      = useRef<gsap.core.Timeline | null>(null)

  // ── scroll detect ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── GSAP: collapse labels ──
  useEffect(() => {
    const labels = labelsRef.current.filter(Boolean) as HTMLSpanElement[]
    if (!labels.length) return

    if (scrolled) {
      // Collapse: label fade + width = 0
      gsap.to(labels, {
        opacity:   0,
        maxWidth:  0,
        marginLeft: 0,
        duration:  0.32,
        ease:      'power2.inOut',
        stagger:   0.03,
      })
      // Navbar shrink
      if (navRef.current) {
        gsap.to(navRef.current, {
          borderRadius: '50px',
          duration: 0.4,
          ease: 'power2.inOut',
        })
      }
    } else {
      // Expand: label fade in
      gsap.to(labels, {
        opacity:    1,
        maxWidth:   80,
        marginLeft: 6,
        duration:   0.38,
        ease:       'power2.out',
        stagger:    0.04,
      })
      if (navRef.current) {
        gsap.to(navRef.current, {
          duration: 0.4,
          ease: 'power2.inOut',
        })
      }
    }
  }, [scrolled])

  // ── Hover label reveal saat collapsed ──
  useEffect(() => {
    if (!scrolled) return
    labelsRef.current.forEach((label, i) => {
      if (!label) return
      if (hovered === i) {
        gsap.to(label, { opacity: 1, maxWidth: 80, marginLeft: 6, duration: 0.22, ease: 'power2.out' })
      } else {
        gsap.to(label, { opacity: 0, maxWidth: 0, marginLeft: 0, duration: 0.18, ease: 'power2.in' })
      }
    })
  }, [hovered, scrolled])

  return (
    <nav
      ref={navRef}
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-50
        w-[92%] max-w-3xl
        flex items-center justify-between
        px-7 py-2.5
        bg-white/80 backdrop-blur-xl
        border rounded-2xl
        transition-shadow duration-300
        ${scrolled
          ? 'shadow-[0_4px_32px_rgba(80,80,180,0.12),0_1px_4px_rgba(0,0,0,0.05)]'
          : 'shadow-[0_2px_16px_rgba(80,80,180,0.06)]'}
      `}
      style={{ borderColor: 'rgba(200,205,230,0.7)' }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="text-xl font-black tracking-tight text-gray-900 select-none shrink-0"
        style={{ fontFamily: '"Georgia", serif', fontStyle: 'italic' }}
      >
        sigma
      </Link>

      {/* Nav items */}
      <div className="flex items-center gap-1">
        {NAV_ITEMS.map((item, i) => {
          const Icon     = item.icon
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`
                relative
                flex items-center
                px-3.5 py-1.75
                rounded-xl
                text-[13.5px] font-medium
                transition-colors duration-200
                whitespace-nowrap select-none overflow-hidden
                ${isActive
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'}
              `}
            >

              <Icon />

              {/* Label — dikontrol GSAP */}
              <span
                ref={(el) => { labelsRef.current[i] = el }}
                className="overflow-hidden whitespace-nowrap"
                style={{
                  maxWidth:   80,
                  marginLeft: 6,
                  opacity:    1,
                  display:    'inline-block',
                }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}