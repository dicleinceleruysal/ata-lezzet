import React from 'react';

/**
 * 3D Pixar Tarzı Vektörel Yemek İkonları ve Görselleri
 * Yumuşak hacimsel gradyanlar (claymorphism/octane render hissi),
 * parlak ışık yansımaları (specular highlights) ve derin gölgeler içerir.
 */

// 1. 3D Pixar Çorba Kasesi
export function PixarSoup({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="soupBase" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFA07A" />
          <stop offset="70%" stopColor="#FF4500" />
          <stop offset="100%" stopColor="#B22222" />
        </radialGradient>
        <radialGradient id="bowlGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#FFF3E0" />
          <stop offset="100%" stopColor="#E0C39E" />
        </radialGradient>
        <linearGradient id="steamGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#FFA07A" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
        </linearGradient>
        <filter id="pixarShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#8B4513" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Alt Gölge */}
      <ellipse cx="50" cy="86" rx="36" ry="8" fill="#8B4513" fillOpacity="0.18" />

      {/* Kase Dışı */}
      <g filter="url(#pixarShadow)">
        <path
          d="M16 46C16 72 30 84 50 84C70 84 84 72 84 46C84 44 80 42 50 42C20 42 16 44 16 46Z"
          fill="url(#bowlGrad)"
        />
        {/* Kase Kenar Halkası */}
        <ellipse cx="50" cy="45" rx="34" ry="14" fill="#FFFFFF" />
        <ellipse cx="50" cy="45" rx="31" ry="12" fill="url(#soupBase)" />

        {/* Çorba İçi Garnitürler */}
        <ellipse cx="44" cy="46" rx="6" ry="3" fill="#32CD32" opacity="0.9" />
        <circle cx="58" cy="44" r="2.5" fill="#FFE4B5" />
        <circle cx="52" cy="48" r="2" fill="#FFD700" />
        <circle cx="38" cy="43" r="1.8" fill="#FF6347" />

        {/* Parlak Yansıma (Specular Highlight) */}
        <path
          d="M26 49C26 65 35 74 50 74C52 74 53 74 55 73C42 72 32 63 32 50C32 48 31 47 28 47C26 47 26 48 26 49Z"
          fill="#FFFFFF"
          fillOpacity="0.65"
        />
        <ellipse cx="42" cy="40" rx="14" ry="3" fill="#FFFFFF" fillOpacity="0.75" />
      </g>

      {/* Buhar Efekti */}
      <path
        d="M40 32C37 26 42 20 39 14"
        stroke="url(#steamGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M52 30C55 24 50 18 53 10"
        stroke="url(#steamGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M62 33C60 27 65 21 63 15"
        stroke="url(#steamGrad)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// 2. 3D Pixar Ana Yemek (Fırında Güveç / Kebab Cloche)
export function PixarMainDish({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="clocheDome" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFC107" />
          <stop offset="45%" stopColor="#FF9800" />
          <stop offset="100%" stopColor="#E65100" />
        </radialGradient>
        <linearGradient id="platterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#D7CCC8" />
        </linearGradient>
      </defs>

      {/* Alt Taban Gölgesi */}
      <ellipse cx="50" cy="84" rx="38" ry="7" fill="#5D4037" fillOpacity="0.2" />

      {/* Servis Tabağı */}
      <ellipse cx="50" cy="76" rx="40" ry="10" fill="url(#platterGrad)" />
      <ellipse cx="50" cy="74" rx="36" ry="8" fill="#EFEBE9" />

      {/* 3D Kapak (Cloche) */}
      <path
        d="M18 70C18 42 32 26 50 26C68 26 82 42 82 70Z"
        fill="url(#clocheDome)"
      />

      {/* Üst Kulp Topu */}
      <circle cx="50" cy="22" r="7" fill="#FFE082" />
      <circle cx="48" cy="20" r="2.5" fill="#FFFFFF" opacity="0.8" />

      {/* Kapak Alt Çizgisi / Yüzük */}
      <ellipse cx="50" cy="70" rx="32" ry="6" fill="#BF360C" />

      {/* 3D Parlama (Glossy Highlight) */}
      <path
        d="M32 40C38 32 46 29 52 29C46 31 38 36 34 44C32 48 30 55 30 62C26 60 25 50 32 40Z"
        fill="#FFFFFF"
        fillOpacity="0.5"
      />
      <ellipse cx="44" cy="38" rx="8" ry="14" fill="#FFFFFF" fillOpacity="0.3" transform="rotate(-15 44 38)" />

      {/* Yıldız Işıltısı */}
      <path
        d="M72 34L74 40L80 42L74 44L72 50L70 44L64 42L70 40Z"
        fill="#FFFFFF"
        opacity="0.85"
      />
    </svg>
  );
}

// 3. 3D Pixar Yan Yemek (Tane Pilav / Püre Kasesi)
export function PixarSideDish({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="riceGrad" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#FFF8E1" />
          <stop offset="100%" stopColor="#FFE082" />
        </radialGradient>
        <linearGradient id="butterGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFEE58" />
          <stop offset="100%" stopColor="#F57F17" />
        </linearGradient>
      </defs>

      {/* Taban Gölge */}
      <ellipse cx="50" cy="86" rx="34" ry="7" fill="#3E2723" fillOpacity="0.18" />

      {/* Kase */}
      <path
        d="M18 52C18 76 32 84 50 84C68 84 82 76 82 52Z"
        fill="#8D6E63"
      />
      <ellipse cx="50" cy="52" rx="32" ry="10" fill="#6D4C41" />

      {/* Kubbe Şeklinde Pilav */}
      <ellipse cx="50" cy="50" rx="29" ry="24" fill="url(#riceGrad)" />

      {/* Eritilmiş Tereyağı Küpü */}
      <path
        d="M44 36L56 34L58 43L46 45Z"
        fill="url(#butterGrad)"
        rx="2"
      />
      <ellipse cx="50" cy="46" rx="10" ry="3.5" fill="#FBC02D" opacity="0.6" />

      {/* Nane Yaprağı */}
      <path
        d="M50 32C46 26 53 22 56 25C59 28 55 33 50 32Z"
        fill="#4CAF50"
      />
      <path
        d="M53 30C58 27 63 30 62 34C61 38 55 35 53 30Z"
        fill="#81C784"
      />

      {/* Parlama */}
      <ellipse cx="38" cy="44" rx="8" ry="4" fill="#FFFFFF" fillOpacity="0.6" transform="rotate(-15 38 44)" />
    </svg>
  );
}

// 4. 3D Pixar Salata / Meyve Kasesi
export function PixarSalad({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="saladBowl" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#A7FFEB" />
          <stop offset="60%" stopColor="#64FFDA" />
          <stop offset="100%" stopColor="#00BFA5" />
        </radialGradient>
      </defs>

      {/* Gölge */}
      <ellipse cx="50" cy="85" rx="34" ry="7" fill="#004D40" fillOpacity="0.2" />

      {/* Yeşil Kase */}
      <path
        d="M18 50C18 76 32 83 50 83C68 83 82 76 82 50Z"
        fill="url(#saladBowl)"
      />
      <ellipse cx="50" cy="50" rx="32" ry="10" fill="#00BFA5" />

      {/* Kıvırcık Marullar */}
      <circle cx="38" cy="44" r="13" fill="#66BB6A" />
      <circle cx="62" cy="44" r="13" fill="#4CAF50" />
      <circle cx="50" cy="40" r="14" fill="#81C784" />

      {/* Parlak Çeri Domatesler 🍅 */}
      <circle cx="42" cy="38" r="7" fill="#F44336" />
      <ellipse cx="40" cy="36" rx="2" ry="1" fill="#FFF" opacity="0.8" />

      <circle cx="60" cy="40" r="6" fill="#E53935" />
      <ellipse cx="58" cy="38" rx="1.8" ry="0.9" fill="#FFF" opacity="0.8" />

      {/* Avokado Dilimi 🥑 */}
      <path
        d="M48 46C44 42 46 36 51 36C56 36 58 42 54 47Z"
        fill="#C8E6C9"
        stroke="#43A047"
        strokeWidth="1.5"
      />
      <circle cx="51" cy="42" r="2.5" fill="#795548" />

      {/* Kase Parlaması */}
      <path
        d="M26 54C28 66 36 75 48 76C44 74 34 68 32 56Z"
        fill="#FFFFFF"
        fillOpacity="0.5"
      />
    </svg>
  );
}

// 5. 3D Pixar Tatlı (Fırın Sütlaç / Kremalı Pasta)
export function PixarDessert({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="dessertCream" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="65%" stopColor="#FFF3E0" />
          <stop offset="100%" stopColor="#FFE0B2" />
        </radialGradient>
        <radialGradient id="cherryGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FF5252" />
          <stop offset="100%" stopColor="#B71C1C" />
        </radialGradient>
      </defs>

      {/* Gölge */}
      <ellipse cx="50" cy="86" rx="34" ry="7" fill="#4E342E" fillOpacity="0.2" />

      {/* Toprak Güveç Kasesi */}
      <path
        d="M20 54C20 76 32 84 50 84C68 84 80 76 80 54Z"
        fill="#8D6E63"
      />
      <ellipse cx="50" cy="54" rx="30" ry="9" fill="#5D4037" />

      {/* Kremalı Fırınlanmış Üst Tabaka */}
      <ellipse cx="50" cy="52" rx="27" ry="16" fill="url(#dessertCream)" />

      {/* Nar Gibi Kızarmış Fırın Lekesi */}
      <path
        d="M40 47C35 45 42 41 48 42C54 43 59 40 62 44C65 48 56 54 48 53C42 52 44 49 40 47Z"
        fill="#6D4C41"
        opacity="0.85"
      />
      <circle cx="48" cy="46" r="3" fill="#D7CCC8" opacity="0.5" />

      {/* Parlak Kiraz / Çilek Tepesi */}
      <circle cx="50" cy="34" r="7.5" fill="url(#cherryGrad)" />
      <ellipse cx="48" cy="32" rx="2" ry="1" fill="#FFFFFF" opacity="0.8" />
      <path
        d="M50 27C51 22 55 19 60 18"
        stroke="#4E342E"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Işıltı */}
      <ellipse cx="32" cy="58" rx="8" ry="3" fill="#FFFFFF" fillOpacity="0.5" transform="rotate(-15 32 58)" />
    </svg>
  );
}

// 6. 3D Pixar İçecek / Ayran Bardağı
export function PixarDrink({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="cupGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E0F7FA" />
          <stop offset="50%" stopColor="#80DEEA" />
          <stop offset="100%" stopColor="#00ACC1" />
        </linearGradient>
        <linearGradient id="strawGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF8A80" />
          <stop offset="100%" stopColor="#FF1744" />
        </linearGradient>
      </defs>

      {/* Gölge */}
      <ellipse cx="50" cy="88" rx="26" ry="6" fill="#006064" fillOpacity="0.2" />

      {/* Pipet */}
      <path
        d="M56 12L66 32L54 44"
        stroke="url(#strawGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bardak Gövdesi */}
      <path
        d="M26 36L34 82C34 86 38 88 50 88C62 88 66 86 66 82L74 36Z"
        fill="url(#cupGrad)"
      />

      {/* Bardak Kapağı */}
      <ellipse cx="50" cy="36" rx="25" ry="7" fill="#FFFFFF" />
      <ellipse cx="50" cy="36" rx="22" ry="5" fill="#B2EBF2" />

      {/* Buz Küpleri / Kabarcıklar */}
      <circle cx="44" cy="56" r="4" fill="#FFFFFF" fillOpacity="0.7" />
      <circle cx="56" cy="68" r="3" fill="#FFFFFF" fillOpacity="0.6" />
      <circle cx="48" cy="74" r="2.5" fill="#FFFFFF" fillOpacity="0.5" />

      {/* Specular Highlight Parlama */}
      <path
        d="M32 40L38 78C35 72 34 60 34 40Z"
        fill="#FFFFFF"
        fillOpacity="0.6"
      />
    </svg>
  );
}

// 6. 3D Pixar Hero Banner: Zengin, Sevimli ve İştah Açıcı Büyük Görsel
export function PixarHeroIllustration({ className = "w-full h-auto" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center p-4 select-none ${className}`}>
      {/* 3D Pixar İkonlar Kümesi */}
      <div className="relative w-full max-w-md h-48 sm:h-56 flex items-center justify-center">
        {/* Arka Plan Sıcak Işıltı Çemberi */}
        <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-amber-400/30 via-orange-400/20 to-rose-400/25 blur-2xl animate-pulse" />

        {/* 1. Sol Üst: Pixar Çorba */}
        <div className="absolute left-4 sm:left-8 top-2 transform -rotate-12 hover:rotate-0 transition-transform duration-300">
          <div className="p-3 bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_12px_24px_rgba(255,107,0,0.18)] border-2 border-orange-100">
            <PixarSoup className="w-14 h-14 sm:w-16 sm:h-16" />
          </div>
        </div>

        {/* 2. Merkez: Büyük 3D Pixar Ana Yemek Cloche */}
        <div className="relative z-20 transform hover:scale-105 transition-transform duration-300">
          <div className="p-4 bg-white rounded-3xl shadow-[0_16px_36px_rgba(255,152,0,0.25)] border-2 border-amber-200">
            <PixarMainDish className="w-20 h-20 sm:w-24 sm:h-24" />
          </div>
        </div>

        {/* 3. Sağ Üst: Pixar Salata */}
        <div className="absolute right-4 sm:right-8 top-3 transform rotate-12 hover:rotate-0 transition-transform duration-300">
          <div className="p-3 bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_12px_24px_rgba(0,191,165,0.18)] border-2 border-teal-100">
            <PixarSalad className="w-14 h-14 sm:w-16 sm:h-16" />
          </div>
        </div>

        {/* 4. Sol Alt: Pixar Pilav / Yan Yemek */}
        <div className="absolute left-8 sm:left-14 bottom-1 z-10 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
          <div className="p-2.5 bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_10px_20px_rgba(141,110,99,0.15)] border border-amber-100">
            <PixarSideDish className="w-12 h-12 sm:w-13 sm:h-13" />
          </div>
        </div>

        {/* 5. Sağ Alt: Pixar Tatlı */}
        <div className="absolute right-8 sm:right-14 bottom-1 z-10 transform rotate-6 hover:rotate-0 transition-transform duration-300">
          <div className="p-2.5 bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_10px_20px_rgba(229,57,53,0.15)] border border-rose-100">
            <PixarDessert className="w-12 h-12 sm:w-13 sm:h-13" />
          </div>
        </div>
      </div>
    </div>
  );
}
