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
    badge,
    accentColor = '#4f46e5',
    players = '2 Pemain',
    difficulty = 'Menengah',
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex flex-col rounded-3xl overflow-hidden bg-white border border-gray-100"
            style={{
                boxShadow: hovered
                    ? `0 24px 64px -12px ${accentColor}25, 0 4px 16px rgba(0,0,0,0.06)`
                    : '0 4px 24px rgba(0,0,0,0.06)',
                transition: 'box-shadow 0.4s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Video / Thumbnail area */}
            <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: '16/9' }}>
                {/* Thumbnail */}
                <Image
                    src={thumbnailSrc}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                    style={{ opacity: hovered ? 0 : 1 }}
                    width={640}
                    height={360}
                    unoptimized
                />

                {/* Video */}
                <video
                    ref={videoRef}
                    src={videoSrc}
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                    style={{ opacity: hovered ? 1 : 0 }}
                />

                {/* Overlay gradient */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `linear-gradient(to bottom, transparent 50%, ${accentColor}18 100%)`,
                    }}
                />

                {/* Badge */}
                {badge && (
                    <div
                        className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-bold tracking-wide"
                        style={{ background: accentColor }}
                    >
                        {badge}
                    </div>
                )}

                {/* Play indicator */}
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300"
                    style={{ opacity: hovered ? 0 : 1 }}
                >
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={accentColor}>
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-6 gap-4">
                {/* Meta pills */}
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        {players}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        {difficulty}
                    </span>
                </div>

                {/* Title + icon */}
                <div className="flex items-center gap-3">
                    {icon && (
                        <div
                            className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-white text-lg"
                            style={{ background: accentColor }}
                        >
                            {icon}
                        </div>
                    )}
                    <h3 className="text-xl font-black text-gray-900 leading-tight" style={{ fontFamily: '"Georgia", serif' }}>
                        {title}
                    </h3>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed flex-1">
                    {description}
                </p>

                {/* CTA Button */}
                <Link
                    href={href}
                    className="mt-1 inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-white text-sm font-bold transition-all duration-300 group/btn"
                    style={{
                        background: accentColor,
                        boxShadow: `0 4px 16px ${accentColor}40`,
                    }}
                    onMouseEnter={e => {
                        const el = e.currentTarget
                        el.style.transform = 'scale(1.02)'
                        el.style.boxShadow = `0 8px 24px ${accentColor}60`
                    }}
                    onMouseLeave={e => {
                        const el = e.currentTarget
                        el.style.transform = 'scale(1)'
                        el.style.boxShadow = `0 4px 16px ${accentColor}40`
                    }}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                    Mainkan
                </Link>
            </div>
        </motion.div>
    )
}