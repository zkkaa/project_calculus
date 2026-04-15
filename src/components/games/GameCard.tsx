'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface GameCardProps {
    title: string
    description: string
    href: string
    videoSrc: string
    thumbnailSrc: string
    badge?: string
    accentColor?: string
    players?: string
    difficulty?: string
    icon?: React.ReactNode
}

export default function GameCard({
    title,
    description,
    href,
    videoSrc,
    thumbnailSrc,
    accentColor = '#4f46e5',
    icon,
}: GameCardProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [hovered, setHovered] = useState(false)

    function handleMouseEnter() {
        setHovered(true)
        if (videoRef.current) {
            videoRef.current.currentTime = 0
            videoRef.current.play().catch(() => { })
        }
    }

    function handleMouseLeave() {
        setHovered(false)
        if (videoRef.current) {
            videoRef.current.pause()
            videoRef.current.currentTime = 0
        }
    }

    // Dark bg tone per accent
    const darkBg = accentColor === '#ef4444'
        ? 'linear-gradient(135deg, #1c1c28 0%, #2a1a1a 100%)'
        : 'linear-gradient(135deg, #1c1c28 0%, #1a2218 100%)'

    return (
        <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="group relative overflow-hidden rounded-3xl cursor-pointer"
            style={{
                background: darkBg,
                boxShadow: hovered
                    ? `0 24px 64px -12px ${accentColor}40, 0 4px 16px rgba(0,0,0,0.25)`
                    : '0 4px 24px rgba(0,0,0,0.15)',
                transition: 'box-shadow 0.4s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className='w-full h-52 bg-yellow-300'>
                <video
                    ref={videoRef}
                    src={videoSrc}
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                    style={{ opacity: hovered ? 0.15 : 0 }}
                />
                <Image
                    src={thumbnailSrc}
                    alt={title}
                    fill
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                    style={{ opacity: hovered ? 0 : 0.08 }}
                    // width={480}
                    // height={270}
                    unoptimized
                />
            </div>
            {/* Background video / thumbnail overlay */}
            {/* <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            </div> */}

            {/* Main layout: left text, right icon */}
            <div className="relative z-10 flex items-center gap-4 px-6 pt-4 pb-7">

                {/* LEFT: Title + Desc + Button */}
                <div className="flex flex-col gap-3 flex-1 min-w-0">
                    <div className='flex items-center gap-4'>
                        <div
                            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{
                                background: `${accentColor}18`,
                                border: `1.5px solid ${accentColor}30`,
                                fontSize: '1rem',
                                transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                                transform: hovered ? 'scale(1.1) rotate(-6deg)' : 'scale(1) rotate(0deg)',
                            }}
                        >
                            {icon}
                        </div>
                        <h3
                            className="text-2xl font-black text-white leading-snug"
                            style={{
                                fontFamily: '"Georgia", serif',
                                fontStyle: 'italic',
                                letterSpacing: '-0.3px',
                            }}
                        >
                            {title}
                        </h3>
                    </div>

                    <p className="text-white/50 text-sm leading-relaxed">
                        {description}
                    </p>
                    <div className='w-full'>
                        <Link
                            href={href}
                            className="mt-1 self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-250"
                            style={{
                                background: 'rgba(255,255,255,0.09)',
                                color: 'rgba(255,255,255,0.85)',
                                border: '1px solid rgba(255,255,255,0.15)',
                            }}
                            onMouseEnter={e => {
                                const el = e.currentTarget
                                el.style.background = accentColor
                                el.style.color = '#fff'
                                el.style.border = `1px solid ${accentColor}`
                                el.style.boxShadow = `0 4px 16px ${accentColor}55`
                            }}
                            onMouseLeave={e => {
                                const el = e.currentTarget
                                el.style.background = 'rgba(255,255,255,0.09)'
                                el.style.color = 'rgba(255,255,255,0.85)'
                                el.style.border = '1px solid rgba(255,255,255,0.15)'
                                el.style.boxShadow = 'none'
                            }}
                        >
                            Mainkan
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}