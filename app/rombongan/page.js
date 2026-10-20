import Image from 'next/image';
import FormRombongan from '@/components/FormRombongan';
import { halaman } from '@/lib/seo';

export const metadata = halaman({
  judul: 'Pesan untuk rombongan',
  deskripsi: 'Pesan tempat untuk 10–30 orang di ruang belakang Pawon Lirih: pilih paket, lihat perkiraan biaya termasuk pajak, dan uang muka.',
  path: '/rombongan',
});

export default function RombonganPage() {
  return (
    <main className="relative z-10 mx-auto max-w-6xl px-5 py-12">
      <div className="grid items-center gap-8 md:grid-cols-[1fr_1.15fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">10–30 orang</p>
          <h1 className="mt-1 font-display text-4xl font-bold text-stone-900 md:text-5xl">Makan bersama rombongan</h1>
          <p className="mt-3 max-w-2xl text-stone-700">Ruang belakang kami muat tiga puluh orang di dua meja panjang. Hidangan disajikan bersamaan, jadi pilih paketnya dulu.</p>
        </div>
        <Image src="/images/ruang-belakang.webp" width={1200} height={750} priority fetchPriority="high" sizes="(min-width: 1152px) 580px, (min-width: 768px) 52vw, 100vw"
          alt="Denah ilustrasi ruang belakang: dua meja panjang, masing-masing 15 kursi, dengan hidangan di tengah meja"
          className="h-auto w-full rounded-2xl border border-[#ddc1b3] shadow-sm" />
      </div>
      <div className="mt-10"><FormRombongan /></div>
    </main>
  );
}
