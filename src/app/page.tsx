"use client"

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

const idleImage = '/gift/red-duel.webp'

export default function Home() {
  const router = useRouter();
  
  // State untuk posisi tombol (dalam persen agar responsif)
  const [buttonPos, setButtonPos] = useState({ x: 50, y: 70 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fungsi navigasi dipindah ke Gambar (Azka)
  function handleImageClick() {
    router.push("/games/duel");
  }

  // Fungsi untuk memindahkan tombol saat kursor mendekat
  const handleMouseMove = (e: MouseEvent) => {
    if (!buttonRef.current) return;

    const btn = buttonRef.current.getBoundingClientRect();
    const btnCenterX = btn.left + btn.width / 2;
    const btnCenterY = btn.top + btn.height / 2;

    // Hitung jarak kursor ke tengah tombol menggunakan Pythagoras
    const distance = Math.sqrt(
      Math.pow(e.clientX - btnCenterX, 2) + Math.pow(e.clientY - btnCenterY, 2)
    );

    // Jika jarak kursor kurang dari 100 pixel, pindahkan tombol
    if (distance < 100) {
      // Generate angka random untuk posisi baru (rentang 10% - 90% agar tidak keluar layar)
      const newX = Math.random() * 80 + 10;
      const newY = Math.random() * 80 + 10;
      setButtonPos({ x: newX, y: newY });
    }
  };

  // Pasang event listener mousemove ke window
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calcDecorations = [
    { text: '∫', x: '5%', y: '10%', size: '8rem', rotate: '-15deg' },
    { text: 'dy/dx', x: '80%', y: '8%', size: '3rem', rotate: '10deg' },
    { text: 'lim', x: '88%', y: '40%', size: '4rem', rotate: '-8deg' },
    { text: '∑', x: '3%', y: '55%', size: '6rem', rotate: '20deg' },
    { text: "f'(x)", x: '75%', y: '70%', size: '3.5rem', rotate: '-12deg' },
    { text: '∞', x: '15%', y: '80%', size: '5rem', rotate: '5deg' },
    { text: 'Δx→0', x: '60%', y: '88%', size: '2.5rem', rotate: '8deg' },
    { text: '∂', x: '45%', y: '5%', size: '5rem', rotate: '-20deg' },
    { text: '∇', x: '30%', y: '90%', size: '4rem', rotate: '15deg' },
  ]

  return (
    <div className="flex flex-col flex-1 gap-3 items-center justify-center min-h-screen bg-linear-to-br from-purple-50 to-blue-50 relative overflow-hidden">

      {/* Dekorasi background */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {calcDecorations.map((el, i) => (
          <span key={`deco-${i}`} style={{
            position: 'absolute', left: el.x, top: el.y,
            fontSize: el.size, transform: `rotate(${el.rotate})`,
            opacity: 0.06, fontWeight: 700, color: '#312e81', lineHeight: 1,
          }}>
            {el.text}
          </span>
        ))}
      </div>

      {/* Gambar sekarang bisa diklik untuk ke halaman game */}
      <div 
        className=" z-10"
        onClick={handleImageClick}
      >
        <Image
          src={idleImage}
          alt={`Azka`}
          width={200}
          height={200}
          className="object-contain"
          unoptimized
        />
      </div>

      <p className="font-bold z-10">Kenalin Gweh Azka</p>

      {/* Button yang kabur (Troll Button) */}
      <button
        ref={buttonRef}
        className="px-4 py-2 bg-pink-300 rounded-2xl shadow-lg font-bold transition-all duration-500 ease-out absolute pointer-events-auto"
        style={{
          left: `${buttonPos.x}%`,
          top: `${buttonPos.y}%`,
          transform: 'translate(-50%, -50%)', // Agar posisi center di titik koordinat
        }}
        onClick={(e) => e.preventDefault()} // Tidak terjadi apa-apa jika ter-klik
      >
        Game duel
      </button>
    </div>
  );
}