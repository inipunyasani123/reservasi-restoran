'use client';
import { Users } from 'lucide-react';

// Di layar sempit meja dikecilkan (tetap >= 44 px) supaya tidak saling bertumpuk di denah yang mengecil.
const SIZE = {
  round: 'h-11 w-11 sm:h-14 sm:w-14 rounded-full',
  square: 'h-12 w-12 sm:h-16 sm:w-16 rounded-xl',
  long: 'h-11 w-20 sm:h-14 sm:w-28 rounded-xl',
};

// Denah meja: tiap meja diposisikan absolut (persen). Klik meja tersedia untuk memilih.
export default function FloorMap({ tables, bookedIds, guests, selectedId, onSelect }) {
  return (
    <div className="relative">
      {/* Label pintu duduk di garis tepi denah (seperti legenda), tidak tertutup meja */}
      <span className="absolute -top-2.5 left-4 z-10 rounded-md border border-stone-200 bg-white px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-stone-600">
        Pintu masuk
      </span>
      <div className="relative mx-auto aspect-[16/12] w-full overflow-hidden rounded-2xl border border-stone-200 bg-[repeating-linear-gradient(45deg,#f5efe6,#f5efe6_14px,#f2ebe0_14px,#f2ebe0_28px)] shadow-inner sm:aspect-[16/11]">

        {tables.map((t) => {
          const booked = bookedIds.includes(t.id);
          const tooSmall = t.seats < guests;
          const selected = selectedId === t.id;
          const disabled = booked || tooSmall;

          const cls = selected
            ? 'border-amber-600 bg-amber-600 text-white shadow-lg scale-105'
            : booked
            ? 'border-stone-300 bg-stone-200 text-stone-400 cursor-not-allowed'
            : tooSmall
            ? 'border-stone-200 bg-white/60 text-stone-300 cursor-not-allowed'
            : 'border-emerald-600 bg-white text-emerald-800 hover:bg-emerald-50 hover:scale-105 cursor-pointer';

          return (
            <button
              key={t.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(t.id)}
              style={{ left: `${t.x}%`, top: `${t.y}%`, transform: 'translate(-50%, -50%)' }}
              aria-pressed={selected}
              className={`absolute flex flex-col items-center justify-center border-2 text-center transition-all duration-200 ${SIZE[t.shape]} ${cls}`}
            >
              {/* Nama dari konten: "Meja T1 2 kursi, Teras, tersedia" (teks terlihat ikut dibacakan). */}
              <span className="sr-only">Meja </span>
              <span className="text-xs font-bold leading-none">{t.id}</span>{' '}
              <span className="mt-0.5 flex items-center gap-0.5 text-xs font-medium leading-none">
                <Users size={11} /> {t.seats}<span className="sr-only"> kursi, {t.zona}{booked ? ', sudah dipesan' : tooSmall ? ', kursi kurang' : ', tersedia'}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-stone-700">
        <Legend className="border-emerald-600 bg-white" label="Tersedia" />
        <Legend className="border-amber-600 bg-amber-600" label="Pilihanmu" />
        <Legend className="border-stone-300 bg-stone-200" label="Terisi" />
        <Legend className="border-stone-200 bg-white/60" label="Kursi kurang" />
      </div>
    </div>
  );
}

function Legend({ className, label }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-4 w-4 rounded border-2 ${className}`} aria-hidden="true" /> {label}
    </span>
  );
}
