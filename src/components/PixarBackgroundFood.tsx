'use client';

import React from 'react';

/**
 * 3D Pixar Tarzı Arka Plan Meyve ve Sebze Vektörleri
 */

// 1. 3D Parlak Domates 🍅
function PixarBgTomato({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="bgTomatoGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="60%" stopColor="#EE2727" />
          <stop offset="100%" stopColor="#B30000" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="56" rx="38" ry="34" fill="url(#bgTomatoGrad)" filter="drop-shadow(0 10px 14px rgba(179,0,0,0.25))" />
      {/* Yaprak */}
      <path d="M50 24C44 14 36 20 42 28C48 24 52 24 58 28C64 20 56 14 50 24Z" fill="#2E7D32" />
      <path d="M50 24L50 14" stroke="#1B5E20" strokeWidth="3.5" strokeLinecap="round" />
      {/* Parlama */}
      <ellipse cx="36" cy="44" rx="10" ry="6" fill="#FFFFFF" fillOpacity="0.6" transform="rotate(-25 36 44)" />
    </svg>
  );
}

// 2. 3D Avokado 🥑
function PixarBgAvocado({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="avocadoFlesh" cx="45%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#F1F8E9" />
          <stop offset="60%" stopColor="#DCEDC8" />
          <stop offset="100%" stopColor="#8BC34A" />
        </radialGradient>
        <radialGradient id="avocadoPit" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#A1887F" />
          <stop offset="70%" stopColor="#5D4037" />
          <stop offset="100%" stopColor="#3E2723" />
        </radialGradient>
      </defs>
      {/* Dış Kabuk */}
      <path d="M50 14C36 14 26 30 26 56C26 76 36 88 50 88C64 88 74 76 74 56C74 30 64 14 50 14Z" fill="#33691E" filter="drop-shadow(0 10px 14px rgba(51,105,30,0.25))" />
      {/* İç Etli Kısım */}
      <path d="M50 18C39 18 31 32 31 56C31 74 39 84 50 84C61 84 69 74 69 56C69 32 61 18 50 18Z" fill="url(#avocadoFlesh)" />
      {/* Çekirdek */}
      <circle cx="50" cy="60" r="14" fill="url(#avocadoPit)" />
      <ellipse cx="46" cy="56" rx="4" ry="2" fill="#FFFFFF" fillOpacity="0.5" transform="rotate(-20 46 56)" />
    </svg>
  );
}

// 3. 3D Havuç 🥕
function PixarBgCarrot({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="carrotGrad" cx="35%" cy="25%" r="75%">
          <stop offset="0%" stopColor="#FFA726" />
          <stop offset="60%" stopColor="#FB8C00" />
          <stop offset="100%" stopColor="#E65100" />
        </radialGradient>
      </defs>
      {/* Yeşil Yapraklar */}
      <path d="M30 24C20 12 28 8 36 18" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 20C32 8 40 4 44 14" stroke="#66BB6A" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M42 22C46 10 56 12 50 20" stroke="#388E3C" strokeWidth="3" strokeLinecap="round" />
      {/* Havuç Gövdesi */}
      <path d="M26 28C32 24 48 24 54 30C52 46 72 74 76 86C64 82 36 62 26 28Z" fill="url(#carrotGrad)" filter="drop-shadow(0 10px 14px rgba(230,81,0,0.25))" />
      {/* Çizgiler */}
      <path d="M34 40C38 41 44 42 48 42" stroke="#BF360C" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M44 54C48 55 54 56 58 56" stroke="#BF360C" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      {/* Parlama */}
      <path d="M32 32C36 40 46 54 52 64" stroke="#FFE082" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

// 4. 3D Brokoli 🥦
function PixarBgBroccoli({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="brocTop" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#81C784" />
          <stop offset="60%" stopColor="#43A047" />
          <stop offset="100%" stopColor="#1B5E20" />
        </radialGradient>
      </defs>
      {/* Sap */}
      <path d="M42 56L40 84C40 86 60 86 60 84L58 56Z" fill="#A5D6A7" />
      {/* Çiçekler */}
      <circle cx="36" cy="46" r="16" fill="url(#brocTop)" filter="drop-shadow(0 8px 12px rgba(27,94,32,0.25))" />
      <circle cx="64" cy="46" r="16" fill="url(#brocTop)" />
      <circle cx="50" cy="34" r="18" fill="url(#brocTop)" />
      <circle cx="50" cy="48" r="14" fill="#66BB6A" />
      {/* Işık */}
      <circle cx="46" cy="30" r="4" fill="#C8E6C9" opacity="0.7" />
    </svg>
  );
}

// 5. 3D Limon 🍋
function PixarBgLemon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="lemonGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFF59D" />
          <stop offset="60%" stopColor="#FDD835" />
          <stop offset="100%" stopColor="#F57F17" />
        </radialGradient>
      </defs>
      {/* Limon Gövdesi */}
      <path d="M18 50C18 32 32 22 50 22C68 22 82 32 82 50C82 68 68 78 50 78C32 78 18 68 18 50Z" fill="url(#lemonGrad)" filter="drop-shadow(0 10px 14px rgba(245,127,23,0.25))" />
      {/* Sivri Uçlar */}
      <circle cx="16" cy="50" r="4" fill="#FBC02D" />
      <circle cx="84" cy="50" r="4" fill="#FBC02D" />
      {/* Yeşil Yaprak */}
      <path d="M50 22C54 12 66 12 68 20C60 22 56 22 50 22Z" fill="#43A047" />
      {/* Parlama */}
      <ellipse cx="38" cy="38" rx="10" ry="4" fill="#FFFFFF" fillOpacity="0.6" transform="rotate(-15 38 38)" />
    </svg>
  );
}

// 6. 3D Çilek 🍓
function PixarBgStrawberry({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="strawGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FF5252" />
          <stop offset="60%" stopColor="#E53935" />
          <stop offset="100%" stopColor="#8E0000" />
        </radialGradient>
      </defs>
      {/* Çilek Gövdesi */}
      <path d="M26 36C26 26 40 26 50 30C60 26 74 26 74 36C74 54 62 76 50 86C38 76 26 54 26 36Z" fill="url(#strawGrad)" filter="drop-shadow(0 10px 14px rgba(142,0,0,0.25))" />
      {/* Yeşil Taç */}
      <path d="M50 26L44 14L48 24L38 18L44 26L32 26L42 30L50 26L58 30L68 26L56 26L62 18L52 24L56 14Z" fill="#4CAF50" />
      {/* Sarı Benekler (Tohumlar) */}
      <circle cx="40" cy="42" r="1.5" fill="#FFEE58" />
      <circle cx="50" cy="44" r="1.5" fill="#FFEE58" />
      <circle cx="60" cy="42" r="1.5" fill="#FFEE58" />
      <circle cx="36" cy="54" r="1.5" fill="#FFEE58" />
      <circle cx="46" cy="56" r="1.5" fill="#FFEE58" />
      <circle cx="56" cy="54" r="1.5" fill="#FFEE58" />
      <circle cx="50" cy="68" r="1.5" fill="#FFEE58" />
      <circle cx="44" cy="66" r="1.5" fill="#FFEE58" />
      {/* Parlama */}
      <ellipse cx="36" cy="38" rx="6" ry="3" fill="#FFFFFF" fillOpacity="0.6" transform="rotate(-20 36 38)" />
    </svg>
  );
}

// 7. 3D Parlak Patlıcan 🍆
function PixarBgEggplant({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="eggplantGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#9C27B0" />
          <stop offset="60%" stopColor="#6A1B9A" />
          <stop offset="100%" stopColor="#38006B" />
        </radialGradient>
      </defs>
      {/* Gövde */}
      <path d="M36 28C42 22 50 26 52 34C58 56 76 68 72 82C68 94 44 92 34 82C22 70 28 44 36 28Z" fill="url(#eggplantGrad)" filter="drop-shadow(0 10px 14px rgba(56,0,107,0.25))" />
      {/* Yeşil Sap & Başlık */}
      <path d="M38 28C32 22 36 14 38 12C42 16 46 22 46 26" stroke="#43A047" strokeWidth="3" strokeLinecap="round" />
      <path d="M34 26C38 30 46 30 50 28L46 34L40 34Z" fill="#2E7D32" />
      {/* Parlama */}
      <path d="M38 40C44 56 56 68 62 74" stroke="#E1BEE7" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

// 8. 3D Mantar 🍄
function PixarBgMushroom({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="mushCap" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FF7043" />
          <stop offset="60%" stopColor="#F4511E" />
          <stop offset="100%" stopColor="#BF360C" />
        </radialGradient>
      </defs>
      {/* Sap */}
      <path d="M42 54L38 84C38 86 62 86 62 84L58 54Z" fill="#FFF3E0" filter="drop-shadow(0 6px 10px rgba(0,0,0,0.1))" />
      {/* Şapka */}
      <path d="M16 56C16 32 30 20 50 20C70 20 84 32 84 56C84 58 80 60 50 60C20 60 16 58 16 56Z" fill="url(#mushCap)" filter="drop-shadow(0 10px 14px rgba(191,54,12,0.25))" />
      {/* Beyaz Benekler */}
      <circle cx="36" cy="38" r="5" fill="#FFFFFF" opacity="0.9" />
      <circle cx="62" cy="40" r="4.5" fill="#FFFFFF" opacity="0.9" />
      <circle cx="50" cy="30" r="3.5" fill="#FFFFFF" opacity="0.9" />
      <circle cx="48" cy="48" r="4" fill="#FFFFFF" opacity="0.9" />
      {/* Parlama */}
      <ellipse cx="32" cy="32" rx="6" ry="3" fill="#FFFFFF" fillOpacity="0.5" transform="rotate(-20 32 32)" />
    </svg>
  );
}

export default function PixarBackgroundFood() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. Sol Üst: 3D Domates (Yavaş Süzülme) */}
      <div className="absolute top-8 left-3 sm:left-12 lg:left-24 opacity-85 hover:opacity-100 transition-opacity animate-bounce duration-1000" style={{ animationDuration: '6s' }}>
        <div className="transform -rotate-12 hover:scale-110 transition-transform">
          <PixarBgTomato className="w-16 h-16 sm:w-20 sm:h-20" />
        </div>
      </div>

      {/* 2. Sağ Üst: 3D Avokado */}
      <div className="absolute top-10 right-4 sm:right-12 lg:right-28 opacity-85 hover:opacity-100 transition-opacity animate-bounce" style={{ animationDuration: '7s' }}>
        <div className="transform rotate-12 hover:scale-110 transition-transform">
          <PixarBgAvocado className="w-16 h-16 sm:w-20 sm:h-20" />
        </div>
      </div>

      {/* 3. Sol Orta: 3D Çıtır Havuç */}
      <div className="absolute top-1/3 -left-2 sm:left-6 lg:left-16 opacity-80 hover:opacity-100 transition-opacity animate-bounce" style={{ animationDuration: '8s' }}>
        <div className="transform rotate-45 hover:scale-110 transition-transform">
          <PixarBgCarrot className="w-16 h-16 sm:w-20 sm:h-20" />
        </div>
      </div>

      {/* 4. Sağ Orta: 3D Taze Brokoli */}
      <div className="absolute top-1/3 -right-2 sm:right-8 lg:right-20 opacity-80 hover:opacity-100 transition-opacity animate-bounce" style={{ animationDuration: '7.5s' }}>
        <div className="transform -rotate-15 hover:scale-110 transition-transform">
          <PixarBgBroccoli className="w-15 h-15 sm:w-18 sm:h-18" />
        </div>
      </div>

      {/* 5. Sol Alt: 3D Ferah Limon */}
      <div className="absolute bottom-28 left-4 sm:left-14 lg:left-28 opacity-85 hover:opacity-100 transition-opacity animate-bounce" style={{ animationDuration: '6.5s' }}>
        <div className="transform -rotate-10 hover:scale-110 transition-transform">
          <PixarBgLemon className="w-15 h-15 sm:w-18 sm:h-18" />
        </div>
      </div>

      {/* 6. Sağ Alt: 3D Tatlı Çilek */}
      <div className="absolute bottom-24 right-5 sm:right-16 lg:right-32 opacity-85 hover:opacity-100 transition-opacity animate-bounce" style={{ animationDuration: '8.5s' }}>
        <div className="transform rotate-12 hover:scale-110 transition-transform">
          <PixarBgStrawberry className="w-15 h-15 sm:w-18 sm:h-18" />
        </div>
      </div>

      {/* 7. Sol Alt-Orta: 3D Parlak Patlıcan */}
      <div className="hidden md:block absolute top-2/3 left-10 lg:left-20 opacity-75 hover:opacity-100 transition-opacity animate-bounce" style={{ animationDuration: '9s' }}>
        <div className="transform rotate-15 hover:scale-110 transition-transform">
          <PixarBgEggplant className="w-14 h-14 lg:w-16 lg:h-16" />
        </div>
      </div>

      {/* 8. Sağ Alt-Orta: 3D Sevimli Mantar */}
      <div className="hidden md:block absolute top-2/3 right-10 lg:right-20 opacity-75 hover:opacity-100 transition-opacity animate-bounce" style={{ animationDuration: '7.8s' }}>
        <div className="transform -rotate-12 hover:scale-110 transition-transform">
          <PixarBgMushroom className="w-14 h-14 lg:w-16 lg:h-16" />
        </div>
      </div>

      {/* Arka Plan Yumuşak Ambiyans Işıltıları */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-orange-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-emerald-300/15 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
