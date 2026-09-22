'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin/listeler', label: 'Menü Yönetimi', shortLabel: 'Menüler', icon: '📅' },
  { href: '/admin/yemekler', label: 'Yemekler', shortLabel: 'Yemekler', icon: '🍲' },
  { href: '/admin/notlar', label: 'Notlar', shortLabel: 'Notlar', icon: '📝' },
  { href: '/admin/puanlama', label: 'Puanlama', shortLabel: 'Puanlama', icon: '⭐' },
];

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-stone-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Başlık */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/admin" className="flex items-center gap-2 font-black text-stone-900 text-base sm:text-lg group">
              <img
                src="/ata-lezzet-logo.jpg"
                alt="Ata Lezzet"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-cover border border-amber-200 shadow-2xs group-hover:scale-105 transition-transform"
              />
              <span className="tracking-tight">
                Ata Lezzet{' '}
                <span className="text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 ml-0.5">
                  Admin
                </span>
              </span>
            </Link>

            {/* Masaüstü Sekmeler */}
            <div className="hidden sm:flex sm:space-x-1.5 text-xs sm:text-sm font-bold">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-amber-500 text-white shadow-xs font-black'
                        : 'text-stone-700 hover:text-amber-900 hover:bg-amber-50'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sağ Eylem: Siteye Dön */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xs sm:text-sm font-bold text-stone-600 hover:text-stone-950 px-2.5 sm:px-3 py-1.5 rounded-xl border border-stone-200 hover:border-amber-300 hover:bg-amber-50/60 transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <span className="text-sm">🌐</span>
              <span className="hidden sm:inline">Kullanıcı Ekranı</span>
              <span className="sm:hidden">Site</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobil Sekme Çubuğu */}
      <div className="sm:hidden border-t border-stone-200/80 bg-stone-50/90 px-2 py-1.5 flex justify-around items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 py-1.5 px-1 rounded-xl text-center text-xs font-bold transition-all flex flex-col items-center justify-center min-h-[44px] ${
                isActive
                  ? 'bg-amber-500 text-white shadow-2xs font-black scale-100'
                  : 'text-stone-600 hover:text-stone-900 active:bg-stone-200/50'
              }`}
            >
              <span className="text-sm leading-none">{item.icon}</span>
              <span className="text-[10px] mt-0.5 leading-tight">{item.shortLabel}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
