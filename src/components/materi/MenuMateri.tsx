import Link from "next/link";

export function MenuMateri() {
  return (
    <section className="py-24 px-6 bg-gray-50/60">
      <div className="max-w-5xl mx-auto">
        <div>
          <div className="flex items-center w-full">
            <span className="text-lg font-semibold w-48">Modul Pendukung</span>
            <div className="bg-gray-300 w-full h-1.5 mt-1"></div>
          </div>
        </div>
        <div className=" w-full h-96 mt-7 flex">
          <div className=" w-full h-full flex items-center justify-center gap-5">
            <div className=" w-full h-72 rounded-2xl flex flex-col p-5 gap-2 justify-center bg-gray-400">
              <div className="flex items-center gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-amber-300">
                  X
                </div>
                <h3
                  className="text-2xl font-black text-white leading-snug"
                  style={{
                    fontFamily: '"Georgia", serif',
                    fontStyle: "italic",
                    letterSpacing: "-0.3px",
                  }}
                ></h3>
              </div>
              <span className=" mt-2.5 font-semibold">Turunan</span>
              <span className="mb-2">
                Akumulasi area dan konsep antiturunan. Dasar dari kalkulus
                integral untuk perhitungan volume kompleks.
              </span>
              <div className="w-full flex justify-start">
                <Link
                  href="/materi"
                  className="bg-gray-900 text-white font-bold px-7 py-3.5 rounded-full text-sm hover:bg-gray-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gray-900/20"
                >
                  Jelajahi Materi →
                </Link>
              </div>
            </div>
            <div className=" w-full h-72 rounded-2xl flex flex-col p-5 gap-2 justify-center bg-gray-400">
              <div className="flex items-center gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-amber-300">
                  X
                </div>
                <h3
                  className="text-2xl font-black text-white leading-snug"
                  style={{
                    fontFamily: '"Georgia", serif',
                    fontStyle: "italic",
                    letterSpacing: "-0.3px",
                  }}
                ></h3>
              </div>
              <span className=" mt-2.5 font-semibold">Turunan</span>
              <span className="mb-2">
                Akumulasi area dan konsep antiturunan. Dasar dari kalkulus
                integral untuk perhitungan volume kompleks.
              </span>
              <div className="w-full flex justify-start">
                <Link
                  href="/materi"
                  className="bg-gray-900 text-white font-bold px-7 py-3.5 rounded-full text-sm hover:bg-gray-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gray-900/20"
                >
                  Jelajahi Materi →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
