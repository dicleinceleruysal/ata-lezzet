import React from 'react';

export default function Header() {
  return (
    <header className="text-center space-y-3 pt-2 flex flex-col items-center">
      {/* Gizli Erişilebilirlik Başlığı (SEO & Ekran Okuyucular İçin) */}
      <h1 className="sr-only">Ata Lezzet - Günlük Yemek Menüsü</h1>

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
    </header>
  );
}
