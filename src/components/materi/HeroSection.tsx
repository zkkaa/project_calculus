"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface HeroSectionProps {
  onShowAll: () => void;
}

export default function HeroSection({ onShowAll }: HeroSectionProps) {
  const [expanded, setExpanded] = useState(false);

  function handleToggle() {
    setExpanded((prev) => !prev);
    if (!expanded) onShowAll();
  }

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Math symbol decorations */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {[
          {
            sym: "∫",
            x: "2%",
            y: "8%",
            size: "7rem",
            rot: "-15deg",
            op: 0.045,
          },
          { sym: "∑", x: "90%", y: "5%", size: "5rem", rot: "12deg", op: 0.04 },
          {
            sym: "∂",
            x: "88%",
            y: "60%",
            size: "4.5rem",
            rot: "-10deg",
            op: 0.04,
          },
          { sym: "∞", x: "5%", y: "70%", size: "4rem", rot: "8deg", op: 0.04 },
          {
            sym: "f'(x)",
            x: "45%",
            y: "3%",
            size: "2.5rem",
            rot: "-5deg",
            op: 0.04,
          },
        ].map((d, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: d.x,
              top: d.y,
              fontSize: d.size,
              transform: `rotate(${d.rot})`,
              opacity: d.op,
              fontWeight: 700,
              color: "#4f46e5",
              lineHeight: 1,
            }}
          >
            {d.sym}
          </span>
        ))}
      </div> 
      <div className="relative max-w-3xl px-6 md:px-10 pt-32 text-start flex flex-col gap-6 mt-14">
        <span className=" text-7xl font-bold ">Kalkulus II</span>
        <span className=" text-2xl text-gray-600">Eksplorasi modul pembelajaran matematika dengan pendekatan presisi teknis. Pilih jalur instruksional Anda di bawah ini.</span>
      </div>
      <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-16">
        <div className="flex flex-col-reverse md:flex-row items-center">
          {/* LEFT: Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full md:w-1/2 shrink-0 "
          >
            <div
              className="relative overflow-hidden"
              style={{
                boxShadow: "0 24px 80px rgba(79,70,229,0.12)",
                background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)",
              }}
            >
              <Image
                src="/images/game-hero.png"
                alt="Belajar sambil bermain"
                width={680}
                height={480}
                className="w-full h-auto object-cover"
                priority
                onError={(e) => {
                  // fallback ilustrasi inline jika gambar belum ada
                  const t = e.currentTarget;
                  t.style.display = "none";
                }}
              />
              {/* Fallback placeholder ilustrasi */}
              <div
                className="w-full flex items-center justify-center"
                style={{
                  minHeight: 340,
                  background:
                    "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)",
                }}
              >
                <div className="text-center p-10">
                  <div className="text-8xl mb-4">🎮</div>
                  <p className="text-indigo-300 text-sm font-medium">
                    Ganti dengan ilustrasi game hero
                  </p>
                  <p className="text-indigo-200 text-xs mt-1">
                    src: /images/game-hero.png
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full md:w-1/2 flex flex-col gap-6 bg-gray-100 py-6 px-10 rounded-tr-2xl rounded-br-2xl"
          
          >
            <div>
              <div>
                <span className="text-4xl font-extrabold">
                  Sambil Bermain
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-500 text-base leading-relaxed max-w-md">
              Pelajari konsep laju perubahan sesaat melalui pendekatan visual kinetik. Memahami bagaimana fungsi berubah secara dinamis dalam ruang dan waktu.
            </p>
            
            {/* Stats mini */}
            <div className="flex gap-9 pt-2">
              {[
                { val: "DURASI EST.", label: "120 Menit" },
                { val: "TINGKAT", label: "Ekspert" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span
                    className="text-xs text-gray-400 font-medium"
                    style={{ fontFamily: '"Georgia", serif' }}
                  >
                    {stat.val}
                  </span>
                  <span className="font-black text-gray-900">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
            
            
            {/* CTA */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* CTA buttons */}
        <motion.div className="flex flex-wrap gap-3 justify-center mt-1">
          <Link
            href="/materi"
            className="bg-gray-900 text-white font-bold px-7 py-3.5 rounded-full text-sm hover:bg-gray-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gray-900/20"
          >
            Jelajahi Materi →
          </Link>
          
        </motion.div>

              <span className="text-gray-200 text-sm">|</span>

          
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
