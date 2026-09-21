import React from 'react';
import { PixarHeroIllustration } from './PixarIcons';

export default function Header() {
  return (
    <header className="text-center space-y-4 pt-2 flex flex-col items-center">
      {/* 3D Pixar Ata Lezzet Logosu */}
      <div className="relative group">
        <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white hover:scale-105 transition-all duration-300">
          <img
            src="/ata-lezzet-logo.jpg"
            alt="Ata Lezzet"
            className="w-full h-full object-cover select-none"
          />
        </div>
      </div>

      {/* Modern Hap Rozet */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-amber-200/80 shadow-xs">
        <span className="flex h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse" />
        <span className="text-xs font-bold text-stone-700 tracking-wide">
          ✨ Lezzetli &bull; Dengeli &bull; Günlük Yemek Menüsü
        </span>
      </div>

      {/* Başlık */}
      <div className="space-y-1.5">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900">
          Ata <span className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">Lezzet</span>
        </h1>
        <p className="text-sm sm:text-base text-stone-600 max-w-md mx-auto font-medium leading-relaxed">
          Ata Yayıncılık bugünün ve tüm ayın lezzetli yemek listesi.
        </p>
      </div>
    </header>
  );
}
