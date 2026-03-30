// src/app/page.tsx
// ─────────────────────────────────────────────
//  Landing Page — SIGMA
//  Merakit semua komponen section
// ─────────────────────────────────────────────

import MathParticles from '@/components/ui/MathParticles'
import Navbar from '@/components/landing/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import {
  HowItWorksSection,
  QuoteSection,
  TopicsSection,
} from '@/components/landing/ContentSections'
import TeamSection from '@/components/landing/TeamSection'
import { CTASection, Footer } from '@/components/landing/CTAFooter'

export default function Home() {
  return (
    <main className="relative bg-white min-h-screen overflow-x-hidden">

      {/*
        MathParticles — background partikel simbol matematika
        Reusable: tinggal panggil <MathParticles /> di halaman lain
        Props: count (jumlah), opacity (ketebalan)
      */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <MathParticles count={40} opacity={0.045} />
      </div>

      {/* Semua konten di atas partikel */}
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <QuoteSection />
        <TopicsSection />
        <TeamSection />
        <CTASection />
        <Footer />
      </div>
    </main>
  )
}