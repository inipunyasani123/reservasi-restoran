'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UtensilsCrossed } from 'lucide-react';
import { resto, nav } from '@/lib/data';

export default function Kepala() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-[#ddc1b3]/50 bg-[#fff8f6]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-2xl font-bold text-amber-800">
          <UtensilsCrossed size={22} aria-hidden="true" /> {resto.name}
        </Link>
        <nav aria-label="Utama" className="-mx-1 flex w-full gap-1 text-sm font-semibold sm:w-auto">
          {nav.map((n) => {
            const aktif = n.href === '/' ? path === '/' : path?.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} aria-current={aktif ? 'page' : undefined}
                className={`flex min-h-10 flex-1 items-center justify-center rounded-full px-2 py-1.5 transition sm:flex-none sm:px-3 ${aktif ? 'bg-amber-700 text-white' : 'text-stone-700 hover:bg-amber-50 hover:text-amber-800'}`}>
                {n.pendek ? <><span className="sm:hidden">{n.pendek}</span><span className="hidden sm:inline">{n.label}</span></> : n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
