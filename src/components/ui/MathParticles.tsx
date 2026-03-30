'use client'

import { useEffect, useRef } from 'react'

// ─────────────────────────────────────────────
//  MathParticles
//  Background simbol matematika yang bergerak
//  random seperti partikel. Reusable di semua page.
//
//  Usage:
//  <MathParticles />                  — default (soft, banyak simbol)
//  <MathParticles count={30} opacity={0.04} />
// ─────────────────────────────────────────────

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  symbol: string
  opacity: number
  rotation: number
  rotationSpeed: number
  color: string
}

const SYMBOLS = [
  'Σ', '∫', '∂', '∞', '∇', '∆', 'π', 'θ', 'λ', 'α', 'β',
  "f'(x)", 'dy/dx', 'lim', 'dx', 'x²', 'eˣ', 'ln', 'sin', 'cos',
  '±', '≈', '≠', '≤', '≥', '∈', '∀', '∃', '⊂', '∩', '∪',
]

const COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#6366f1', // indigo
]

interface MathParticlesProps {
  count?: number
  opacity?: number
  className?: string
}

export default function MathParticles({
  count = 38,
  opacity = 0.055,
  className = '',
}: MathParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Ukuran canvas = ukuran parent
    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Inisialisasi partikel
    function createParticles() {
      if (!canvas) return
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 28 + 12, // 12px – 40px
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        opacity: Math.random() * opacity + opacity * 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.005,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }))
    }
    createParticles()

    // Loop animasi
    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particlesRef.current) {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.font = `700 ${p.size}px "Georgia", serif`
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fillText(p.symbol, 0, 0)
        ctx.restore()

        // Gerak
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed

        // Wrap around
        if (p.x < -60) p.x = canvas.width + 60
        if (p.x > canvas.width + 60) p.x = -60
        if (p.y < -60) p.y = canvas.height + 60
        if (p.y > canvas.height + 60) p.y = -60
      }

      rafRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [count, opacity])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  )
}