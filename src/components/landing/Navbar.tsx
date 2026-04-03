'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
// import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { NAV_LINKS, HAMBURGER_MENU } from '@/data/landing'

// Icon SVG inline ─────────────────────────────
function IconHome() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  )
}
function IconBook() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  )
}
function IconPencil() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}
function IconGamepad() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="12" rx="4" />
      <path d="M8 11v4M6 13h4" />
      <circle cx="16" cy="13" r="1" fill="currentColor" stroke="none" />
      <circle cx="18" cy="11" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

const ICONS: Record<string, React.FC> = {
  home: IconHome,
  book: IconBook,
  pencil: IconPencil,
  gamepad: IconGamepad,
}

// ─────────────────────────────────────────────
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [scrolled, setScrolled] = useState(false)

  // GSAP refs
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLLIElement[]>([])
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const bar1Ref = useRef<HTMLSpanElement>(null)
  const bar2Ref = useRef<HTMLSpanElement>(null)
  const bar3Ref = useRef<HTMLSpanElement>(null)

  // Scroll → active section + shadow navbar
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20)

      const sections = NAV_LINKS.map((l) => l.href.replace('#', ''))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection('#' + sections[i])
          return
        }
      }
      setActiveSection('')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // GSAP timeline setup
  useEffect(() => {
    if (!overlayRef.current || !panelRef.current) return

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut' } })

    // Overlay fade in
    tl.to(overlayRef.current, { autoAlpha: 1, duration: 0.3 })

    // Panel slide in dari kanan
    tl.to(panelRef.current, { x: 0, duration: 0.45 }, '<0.05')

    // Stagger items
    tl.fromTo(
      itemsRef.current,
      { x: 40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.35, stagger: 0.07 },
      '<0.15'
    )

    // Hamburger → X
    tl.to(bar1Ref.current, { y: 7, rotation: 45, duration: 0.3 }, 0)
    tl.to(bar2Ref.current, { scaleX: 0, opacity: 0, duration: 0.2 }, 0)
    tl.to(bar3Ref.current, { y: -7, rotation: -45, duration: 0.3 }, 0)

    tlRef.current = tl
  }, [])

  // Buka / tutup menu
  useEffect(() => {
    if (!tlRef.current) return
    if (open) {
      document.body.style.overflow = 'hidden'
      tlRef.current.play()
    } else {
      document.body.style.overflow = ''
      tlRef.current.reverse()
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  function handleNavClick(href: string) {
    setOpen(false)
    if (href.startsWith('#')) {
      const el = document.getElementById(href.replace('#', ''))
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav
        className={`
          fixed top-4 left-1/2 -translate-x-1/2 z-50
          w-[92%] max-w-7xl
          flex items-center justify-between
          px-5 py-3
          bg-white/80 backdrop-blur-xl
          border border-gray-200/80
          rounded-2xl
          transition-all duration-300
          ${scrolled ? 'shadow-[0_4px_32px_rgba(0,0,0,0.10)]' : 'shadow-[0_2px_16px_rgba(0,0,0,0.06)]'}
        `}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 select-none">
          <span
            className="text-xl font-black tracking-tight text-gray-900"
            style={{ fontFamily: '"Georgia", serif', fontStyle: 'italic' }}
          >
            sigma
          </span>
        </Link>

        {/* Center nav links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href
            return (
              <li key={link.href}>
                <button
                  onClick={() => handleNavClick(link.href)}
                  className={`
                    relative px-4 py-1.5 text-sm font-medium rounded-lg
                    transition-colors duration-400
                    ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}
                  `}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-4 right-4 h-0.5 rounded-full bg-blue-500" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <span ref={bar1Ref} className="block w-5 h-0.5 bg-gray-700 rounded-full origin-center" />
          <span ref={bar2Ref} className="block w-5 h-0.5 bg-gray-700 rounded-full origin-center" />
          <span ref={bar3Ref} className="block w-5 h-0.5 bg-gray-700 rounded-full origin-center" />
        </button>
      </nav>

      {/* ── OVERLAY ── */}
      <div
        ref={overlayRef}
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
        style={{ opacity: 0, visibility: 'hidden' }}
      />

      {/* ── SIDE PANEL ── */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl flex flex-col"
        style={{ transform: 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-6 border-b border-gray-100">
          <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">Menu</span>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            aria-label="Close menu"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu items */}
        <ul className="flex-1 flex flex-col gap-1 px-4 pt-6">
          {HAMBURGER_MENU.map((item, i) => {
            const Icon = ICONS[item.icon]
            return (
              <li
                key={item.href}
                ref={(el) => { if (el) itemsRef.current[i] = el }}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all group"
                >
                  <span className="text-gray-400 group-hover:text-blue-500 transition-colors">
                    <Icon />
                  </span>
                  <span className="font-medium text-base">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Footer panel */}
        <div className="px-7 py-6 border-t border-gray-100">
          <p
            className="text-lg font-black text-gray-900 tracking-tight mb-1"
            style={{ fontFamily: '"Georgia", serif', fontStyle: 'italic' }}
          >
            sigma
          </p>
          <p className="text-xs text-gray-400">Platform Kalkulus Interaktif · Kelompok 9</p>
        </div>
      </div>
    </>
  )
}