"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface GameHeroProps {
  onShowAll: () => void;
}

export default function GameHero({ onShowAll }: GameHeroProps) {
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

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-16">
        <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
          {/* LEFT: Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full md:w-1/2 shrink-0"
          >
            <div
              className="relative rounded-3xl overflow-hidden"
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
            className="w-full md:w-1/2 flex flex-col gap-6"
          >
            <div>
              <div className="flex items-center gap-2 ">
                <span className="text-lg">Belajar</span>
                <div className="bg-gray-300 w-28 h-1.5 mt-1"></div>
              </div>
              <div>
                <span className="text-4xl font-extrabold italic">
                  Sambil Bermain
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-500 text-base leading-relaxed max-w-md">
              SIGMA menghadirkan pengalaman belajar kalkulus yang interaktif
              melalui berbagai game yang dirancang untuk melatih kecepatan,
              ketepatan, dan pemahaman konsep secara menyenangkan.
            </p>

            {/* CTA */}
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={handleToggle}
                className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors group"
              >
                <span>{expanded ? "Sembunyikan" : "Tampilkan semua"}</span>
                <motion.span
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </motion.span>
              </button>

              <span className="text-gray-200 text-sm">|</span>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span>2 game tersedia</span>
              </div>
            </div>

            {/* Stats mini */}
            <div className="flex gap-6 pt-2">
              {[
                { val: "2", label: "Mode Game" },
                { val: "10+", label: "Soal per Sesi" },
                { val: "∞", label: "Lawan Tanding" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span
                    className="text-2xl font-black text-gray-900"
                    style={{ fontFamily: '"Georgia", serif' }}
                  >
                    {stat.val}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
