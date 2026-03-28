"use client"

import { useRouter } from "next/navigation"; 

export default function Home() {
  const router = useRouter();

  function handleGameDuelClick() {
    router.push("/games/duel");
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <p>Kenalin Gweh Azka</p>
      <button 
        className="px-2 py-1 bg-pink-300 rounded-2xl" 
        onClick={handleGameDuelClick}
      >
        Game duel
      </button>
    </div>
  );
}