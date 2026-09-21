'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  PixarSoup,
  PixarMainDish,
  PixarSideDish,
  PixarSalad,
  PixarDessert,
  PixarDrink,
} from './PixarIcons';
import { getMealCalories } from '@/lib/mealCalories';

export interface DailyMenuEntryData {
  id: string;
  date: string;
  dateStr: string;
  dayName: string;
  mealText: string;
  items: string[] | string;
  isHoliday?: boolean;
}

export interface MonthlyPlanData {
  id: string;
  year: number;
  month: number;
  monthName: string;
  entries: DailyMenuEntryData[];
}

export type CategoryKey = 'corba' | 'ana_yemek' | 'yan_yemek' | 'salata' | 'tatli' | 'icecek';

function parseDishes(items: unknown, mealText?: string): string[] {
  if (Array.isArray(items)) return items.map(String).filter(Boolean);
  if (typeof items === 'string') {
    try {
      if (items.trim().startsWith('[')) {
        const parsed = JSON.parse(items);
        if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
      }
      return items.split(',').map((s) => s.trim()).filter(Boolean);
    } catch {
      // fallback
    }
  }
  if (typeof mealText === 'string') {
    return mealText.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function normalizeFoodText(str: string): string {
  if (!str) return '';
  return str
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim();
}

function detectPixarCategory(dishName: string): CategoryKey {
  const norm = normalizeFoodText(dishName);

  if (
    norm.includes('corba') ||
    norm.includes('mercimek') ||
    norm.includes('ezogelin') ||
    norm.includes('tarhana') ||
    norm.includes('yayla') ||
    norm.includes('sehriye') ||
    norm.includes('domates corbasi') ||
    norm.includes('kelle paca') ||
    norm.includes('iskembe') ||
    norm.includes('dugun corbasi')
  ) {
    return 'corba';
  }

  if (
    norm.includes('pilav') ||
    norm.includes('makarna') ||
    norm.includes('borek') ||
    norm.includes('pure') ||
    norm.includes('eriste') ||
    norm.includes('bulgur') ||
    norm.includes('manti') ||
    norm.includes('patates kizartmasi') ||
    norm.includes('spagetti') ||
    norm.includes('kuskus') ||
    norm.includes('noodle')
  ) {
    return 'yan_yemek';
  }

  if (
    norm.includes('salata') ||
    norm.includes('salatabar') ||
    norm.includes('cacik') ||
    norm.includes('tursu') ||
    norm.includes('piyaz') ||
    norm.includes('yogurt') ||
    norm.includes('meze') ||
    norm.includes('haydari') ||
    norm.includes('humus') ||
    norm.includes('ezme')
  ) {
    return 'salata';
  }

  if (
    norm.includes('ayran') ||
    norm.includes('icecek') ||
    norm.includes('limonata') ||
    norm.includes('salgam') ||
    norm.includes('kola') ||
    norm.includes('fanta') ||
    norm.includes('gazoz') ||
    norm.includes('meyve suyu') ||
    norm.includes('soda')
  ) {
    return 'icecek';
  }

  if (
    norm.includes('tatli') ||
    norm.includes('pasta') ||
    norm.includes('profiterol') ||
    norm.includes('kemalpasa') ||
    norm.includes('sutlac') ||
    norm.includes('puding') ||
    norm.includes('muhallebi') ||
    norm.includes('kazandibi') ||
    norm.includes('keskul') ||
    norm.includes('revani') ||
    norm.includes('sekerpare') ||
    norm.includes('kadayif') ||
    norm.includes('kunefe') ||
    norm.includes('baklava') ||
    norm.includes('sobiyet') ||
    norm.includes('helva') ||
    norm.includes('komposto') ||
    norm.includes('hosaf') ||
    norm.includes('trilece') ||
    norm.includes('gullac') ||
    norm.includes('tulumba') ||
    norm.includes('lokma') ||
    norm.includes('asure') ||
    norm.includes('parfe') ||
    norm.includes('magnolia') ||
    norm.includes('tiramisu') ||
    norm.includes('supangle') ||
    norm.includes('sufle') ||
    norm.includes('kek') ||
    norm.includes('browni') ||
    norm.includes('kurabiye') ||
    norm.includes('dondurma') ||
    norm.includes('ekler') ||
    norm.includes('tart') ||
    norm.includes('turta') ||
    norm.includes('irmik') ||
    norm.includes('lokum') ||
    norm.includes('pismaniye') ||
    norm.includes('cezerye') ||
    norm.includes('kabak tatlisi') ||
    norm.includes('ayva tatlisi') ||
    norm.includes('kalburabasti') ||
    norm.includes('dilber dudagi') ||
    norm.includes('bulbul yuvasi') ||
    norm.includes('vezir parmagi') ||
    norm.includes('sambali') ||
    norm.includes('cheesecake') ||
    norm.includes('tartalet') ||
    norm.includes('waffle') ||
    norm.includes('pankek') ||
    norm.includes('meyve') ||
    norm.includes('karpuz') ||
    norm.includes('kavun') ||
    norm.includes('elma') ||
    norm.includes('armut') ||
    norm.includes('portakal') ||
    norm.includes('mandalina') ||
    norm.includes('muz') ||
    norm.includes('uzum') ||
    norm.includes('cilek') ||
    norm.includes('seftali') ||
    norm.includes('erik') ||
    norm.includes('kiraz') ||
    norm.includes('kayisi') ||
    norm.includes('incir') ||
    norm.includes('hurma') ||
    norm.includes('ananas') ||
    norm.includes('kivi') ||
    norm.includes('nar')
  ) {
    return 'tatli';
  }

  return 'ana_yemek';
}

function getPixarIconByCategory(cat: CategoryKey) {
  switch (cat) {
    case 'corba':
      return <PixarSoup className="w-12 h-12 flex-shrink-0" />;
    case 'ana_yemek':
      return <PixarMainDish className="w-12 h-12 flex-shrink-0" />;
    case 'yan_yemek':
      return <PixarSideDish className="w-12 h-12 flex-shrink-0" />;
    case 'salata':
      return <PixarSalad className="w-12 h-12 flex-shrink-0" />;
    case 'tatli':
      return <PixarDessert className="w-12 h-12 flex-shrink-0" />;
    case 'icecek':
      return <PixarDrink className="w-12 h-12 flex-shrink-0" />;
    default:
      return <PixarMainDish className="w-12 h-12 flex-shrink-0" />;
  }
}

const CATEGORY_META: Record<CategoryKey, { label: string; badgeClass: string; iconBox: string; cardBorder: string }> = {
  corba: {
    label: 'Çorba',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold',
    iconBox: 'bg-amber-50 border-amber-200',
    cardBorder: 'hover:border-amber-400 hover:shadow-amber-100/50',
  },
  ana_yemek: {
    label: 'Ana Yemek',
    badgeClass: 'bg-rose-100 text-rose-950 border-rose-300 font-extrabold',
    iconBox: 'bg-rose-50 border-rose-200',
    cardBorder: 'hover:border-rose-400 hover:shadow-rose-100/50',
  },
  yan_yemek: {
    label: 'Yan Yemek',
    badgeClass: 'bg-orange-100 text-orange-950 border-orange-300 font-extrabold',
    iconBox: 'bg-orange-50 border-orange-200',
    cardBorder: 'hover:border-orange-400 hover:shadow-orange-100/50',
  },
  salata: {
    label: 'Salata / Meze',
    badgeClass: 'bg-emerald-100 text-emerald-950 border-emerald-300 font-extrabold',
    iconBox: 'bg-emerald-50 border-emerald-200',
    cardBorder: 'hover:border-emerald-400 hover:shadow-emerald-100/50',
  },
  tatli: {
    label: 'Tatlı / Meyve',
    badgeClass: 'bg-purple-100 text-purple-950 border-purple-300 font-extrabold',
    iconBox: 'bg-purple-50 border-purple-200',
    cardBorder: 'hover:border-purple-400 hover:shadow-purple-100/50',
  },
  icecek: {
    label: 'İçecek',
    badgeClass: 'bg-sky-100 text-sky-950 border-sky-300 font-extrabold',
    iconBox: 'bg-sky-50 border-sky-200',
    cardBorder: 'hover:border-sky-400 hover:shadow-sky-100/50',
  },
};

export default function MenuButtons() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [monthlyPlan, setMonthlyPlan] = useState<MonthlyPlanData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [todayIndex, setTodayIndex] = useState<number>(0);
  const [isSundayToday, setIsSundayToday] = useState<boolean>(false);

  const [showMonthlyList, setShowMonthlyList] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [dbMealsMap, setDbMealsMap] = useState<Record<string, CategoryKey>>({});
  const [dbCaloriesMap, setDbCaloriesMap] = useState<Record<string, number>>({});

  // Veritabanındaki özel kalori ve kategori haritasını çek
  useEffect(() => {
    fetch('/api/meals')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const map: Record<string, CategoryKey> = {};
          const calMap: Record<string, number> = {};
          data.forEach((m: { name?: string; category?: string; calories?: number | null }) => {
            if (m.name) {
              const norm = normalizeFoodText(m.name);
              if (m.category) {
                map[norm] = m.category as CategoryKey;
              }
              if (typeof m.calories === 'number' && m.calories > 0) {
                calMap[norm] = m.calories;
              }
            }
          });
          setDbMealsMap(map);
          setDbCaloriesMap(calMap);
        }
      })
      .catch(() => {});
  }, []);

  // Aylık planı doğrudan yükle ve bugünün gününe odaklan
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch('/api/plans/monthly')
      .then(async (res) => {
        if (!res.ok) throw new Error('Aylık yemek listesi yüklenemedi.');
        return res.json();
      })
      .then((data: MonthlyPlanData) => {
        if (!isMounted) return;
        setMonthlyPlan(data);

        const now = new Date();
        const isSunday = now.getDay() === 0;
        setIsSundayToday(isSunday);

        const entries = data.entries || [];
        const currentDay = now.getDate();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        // 1. Bugünün tarihine tam eşleşen günü bul
        let foundIdx = entries.findIndex((e) => {
          const d = new Date(e.date);
          return (
            d.getUTCDate() === currentDay &&
            d.getUTCMonth() + 1 === currentMonth &&
            d.getUTCFullYear() === currentYear
          );
        });

        // 2. Eğer birebir yıl/ay uymuyorsa, gün numarası eşleşen günü bul (Demo/Test koruması)
        if (foundIdx === -1) {
          foundIdx = entries.findIndex((e) => {
            const d = new Date(e.date);
            return d.getUTCDate() === currentDay;
          });
        }

        // 3. Bulunamazsa ilk güne veya en yakın güne konumlan
        if (foundIdx === -1) {
          foundIdx = entries.length > 0 ? 0 : 0;
        }

        setTodayIndex(foundIdx);
        setCurrentIndex(foundIdx);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const getDishCategory = useCallback((dishName: string): CategoryKey => {
    const norm = normalizeFoodText(dishName);
    if (dbMealsMap[norm]) {
      return dbMealsMap[norm];
    }
    return detectPixarCategory(dishName);
  }, [dbMealsMap]);

  const getDishCalories = useCallback((dishName: string): number => {
    const norm = normalizeFoodText(dishName);
    if (dbCaloriesMap[norm]) {
      return dbCaloriesMap[norm];
    }
    const cat = getDishCategory(dishName);
    return getMealCalories(dishName, cat);
  }, [dbCaloriesMap, getDishCategory]);

  const entries = monthlyPlan?.entries || [];
  const currentEntry = entries[currentIndex] || null;

  // Klavye ok tuşları ile gün geçişi (Sol: Önceki, Sağ: Sonraki)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Eğer kullanıcı arama kutusuna yazıyorsa klavye kısayolunu tetikleme
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
        }
      } else if (e.key === 'ArrowRight') {
        if (currentIndex < entries.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, entries.length]);

  const handlePrevDay = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNextDay = () => {
    if (currentIndex < entries.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleGoToToday = () => {
    setCurrentIndex(todayIndex);
  };

  const handleSelectDay = (index: number) => {
    setCurrentIndex(index);
    const cardEl = document.getElementById('daily-menu-card');
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Aylık liste filtreleme
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const q = searchQuery.toLowerCase();
    return entries.filter((entry) => {
      return (
        entry.dateStr.toLowerCase().includes(q) ||
        entry.dayName.toLowerCase().includes(q) ||
        entry.mealText.toLowerCase().includes(q)
      );
    });
  }, [entries, searchQuery]);

  return (
    <section className="w-full space-y-6">
      {/* 1. GÜNÜN MENÜSÜ KARTI (ANA EKRANDA DOĞRUDAN AÇIK - POPOVER YOK!) */}
      <div
        id="daily-menu-card"
        className="bg-white rounded-3xl p-5 sm:p-8 border-2 border-amber-200/90 shadow-[0_16px_36px_rgba(245,158,11,0.12)] relative overflow-hidden transition-all duration-300"
      >
        {/* Yükleniyor Durumu */}
        {loading && (
          <div className="py-20 text-center text-stone-500 space-y-3">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs uppercase font-extrabold tracking-widest text-amber-800">
              Günün Menüsü Hazırlanıyor...
            </p>
          </div>
        )}

        {/* Hata Durumu */}
        {!loading && error && (
          <div className="p-5 bg-rose-50 text-rose-800 rounded-2xl border border-rose-200 text-sm font-bold text-center">
            {error}
          </div>
        )}

        {/* Canlı Günün Menüsü İçeriği */}
        {!loading && !error && (
          <div className="space-y-6">
            {/* Üst Navigasyon Çubuğu: [Sol Ok] — [Tarih & Gün Bilgisi] — [Sağ Ok] */}
            <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3.5 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl border border-amber-200 shadow-2xs">
              {/* Önceki Gün Butonu (Sol Ok) */}
              <button
                type="button"
                onClick={handlePrevDay}
                disabled={currentIndex === 0}
                className={`group flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all select-none cursor-pointer ${
                  currentIndex === 0
                    ? 'opacity-35 cursor-not-allowed text-stone-400 bg-stone-100'
                    : 'bg-white hover:bg-amber-500 hover:text-white text-stone-800 border border-amber-200 shadow-xs active:scale-95'
                }`}
                title="Önceki Gün (Klavye: Sol Ok)"
              >
                <span className="text-base sm:text-lg group-hover:-translate-x-0.5 transition-transform">&larr;</span>
                <span className="hidden sm:inline">Önceki</span>
              </button>

              {/* Merkez: Tarih, Gün ve Gün Sayacı */}
              <div className="text-center flex-1 min-w-0 px-2">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-xl font-black text-stone-900 tracking-tight truncate">
                    {currentEntry?.dateStr || 'Günün Menüsü'}
                  </h2>
                  {currentIndex === todayIndex && (
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider bg-emerald-500 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                      Bugün
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 mt-0.5">
                  <span className="text-[11px] font-bold text-amber-900/70">
                    {entries.length > 0 ? `${currentIndex + 1} / ${entries.length} Gün` : ''}
                  </span>
                  {currentIndex !== todayIndex && (
                    <button
                      type="button"
                      onClick={handleGoToToday}
                      className="text-[11px] font-black text-amber-700 hover:text-amber-900 underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      📍 Bugüne Dön
                    </button>
                  )}
                </div>
              </div>

              {/* Sonraki Gün Butonu (Sağ Ok) */}
              <button
                type="button"
                onClick={handleNextDay}
                disabled={currentIndex === entries.length - 1}
                className={`group flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all select-none cursor-pointer ${
                  currentIndex === entries.length - 1
                    ? 'opacity-35 cursor-not-allowed text-stone-400 bg-stone-100'
                    : 'bg-white hover:bg-amber-500 hover:text-white text-stone-800 border border-amber-200 shadow-xs active:scale-95'
                }`}
                title="Sonraki Gün (Klavye: Sağ Ok)"
              >
                <span className="hidden sm:inline">Sonraki</span>
                <span className="text-base sm:text-lg group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </button>
            </div>

            {/* Pazar Günü Uyarısı (Eğer o gün Pazar ise) */}
            {isSundayToday && currentIndex === todayIndex ? (
              <div className="p-10 text-center bg-amber-50/60 rounded-3xl border border-amber-200 space-y-3">
                <div className="w-16 h-16 mx-auto bg-white rounded-2xl p-2 shadow-xs border border-amber-200">
                  <PixarSalad className="w-full h-full" />
                </div>
                <h4 className="text-xl font-black text-amber-950">Bugün Pazar</h4>
                <p className="text-stone-600 font-semibold text-sm">
                  Pazar günleri yemek hizmetimiz bulunmamaktadır.
                </p>
                <p className="text-xs text-stone-400">
                  Sağ ve sol oklara basarak haftanın diğer günlerinin menülerini inceleyebilirsiniz.
                </p>
              </div>
            ) : currentEntry ? (
              <>
                {/* İstatistik Çubuğu (Çeşit Sayısı ve Toplam Kalori) */}
                {(() => {
                  const currentDishes = parseDishes(currentEntry.items, currentEntry.mealText);
                  const totalCalories = currentDishes.reduce(
                    (sum, dish) => sum + getDishCalories(dish),
                    0
                  );

                  return (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-amber-50/50 border border-amber-100">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-white px-3 py-1 rounded-lg border border-amber-200 shadow-2xs">
                          🍴 {currentDishes.length} Çeşit Yemek
                        </span>
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-950 bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300 shadow-2xs flex items-center gap-1.5">
                          <span>🔥</span>
                          <span>Toplam: {totalCalories} kcal</span>
                        </span>
                      </div>

                      {/* 3D Pixar Yemek Kartları Izgarası */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                        {currentDishes.map((dish, idx) => {
                          const cat = getDishCategory(dish);
                          const meta = CATEGORY_META[cat];
                          const calories = getDishCalories(dish);

                          return (
                            <div
                              key={idx}
                              className={`p-4 rounded-2xl bg-white border border-stone-200 ${meta.cardBorder} hover:shadow-md transition-all duration-200 flex items-center gap-3.5 group`}
                            >
                              <div
                                className={`p-2.5 rounded-2xl border flex-shrink-0 transition-transform group-hover:scale-105 ${meta.iconBox}`}
                              >
                                {getPixarIconByCategory(cat)}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span
                                    className={`inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border shadow-2xs ${meta.badgeClass}`}
                                  >
                                    {meta.label}
                                  </span>
                                  <span className="text-xs font-black text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                                    <span>🔥</span>
                                    <span>{calories} kcal</span>
                                  </span>
                                </div>
                                <h3 className="font-black text-stone-900 text-sm sm:text-base leading-snug">
                                  {dish}
                                </h3>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Özet Menü Satırı */}
                      <div className="p-3.5 sm:p-4 bg-stone-50/80 rounded-2xl border border-stone-200 text-xs text-stone-600 font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="truncate">
                          <span className="font-bold text-stone-800">Menü: </span>
                          <span>{currentEntry.mealText}</span>
                        </div>
                        <div className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 whitespace-nowrap self-start sm:self-auto">
                          Sağlıklı & Dengeli Tabldot Öğünü
                        </div>
                      </div>
                    </>
                  );
                })()}
              </>
            ) : (
              <div className="py-12 text-center text-stone-400 font-bold text-sm">
                Seçilen gün için menü bulunamadı.
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. TÜM AYIN YEMEK LİSTESİ (AÇILIR-KAPANIR INLINE GÖRÜNÜM — POPOVER YOK!) */}
      <div className="space-y-4">
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowMonthlyList((prev) => !prev)}
            className="group flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50/70 text-stone-900 font-black text-sm border-2 border-amber-200 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">📅</span>
            <span>
              {showMonthlyList
                ? 'Aylık Menü Takvimini Gizle'
                : `Tüm ${monthlyPlan?.monthName || 'Ay'} Yemek Listesini Gör (${entries.length} Gün)`}
            </span>
            <span className="text-xs font-bold text-amber-600 bg-amber-100/80 px-2 py-0.5 rounded-md">
              {showMonthlyList ? '▲ Gizle' : '▼ Aç'}
            </span>
          </button>
        </div>

        {/* Açılır Aylık Tablo (Inline) */}
        {showMonthlyList && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-amber-200 shadow-[0_12px_32px_rgba(0,0,0,0.06)] space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-stone-900">
                  {monthlyPlan?.monthName || 'Aylık'} Yemek Takvimi
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  Listedeki herhangi bir güne tıklayarak yukarıdaki günün menüsüne geçebilirsiniz.
                </p>
              </div>

              {/* Hızlı Arama */}
              <div className="relative min-w-[240px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Yemek veya gün ara..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-amber-500 bg-stone-50"
                />
                <span className="absolute left-3 top-2 text-stone-400 text-xs">🔍</span>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-700 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Tablo */}
            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-amber-50/80 border-b border-amber-200 text-stone-800 font-extrabold uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-3.5 sm:px-4 w-36">Tarih & Gün</th>
                    <th className="py-3 px-3.5 sm:px-4">Menüdeki Yemekler</th>
                    <th className="py-3 px-3.5 sm:px-4 text-right w-28">Kalori</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredEntries.map((entry) => {
                    const originalIdx = entries.findIndex((e) => e.id === entry.id);
                    const isSelected = originalIdx === currentIndex;
                    const dishes = parseDishes(entry.items, entry.mealText);
                    const totalCal = dishes.reduce((sum, d) => sum + getDishCalories(d), 0);

                    return (
                      <tr
                        key={entry.id}
                        onClick={() => handleSelectDay(originalIdx)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-amber-100/70 hover:bg-amber-100 font-semibold'
                            : 'hover:bg-amber-50/40'
                        }`}
                        title="Bu günün menüsünü yukarıda görüntülemek için tıklayın"
                      >
                        <td className="py-3 px-3.5 sm:px-4 align-top">
                          <div className="font-black text-stone-900 flex items-center gap-1.5">
                            {isSelected && <span className="text-amber-600">👉</span>}
                            <span>{entry.dateStr}</span>
                          </div>
                          <div className="text-[11px] font-bold text-amber-700">
                            {entry.dayName}
                          </div>
                        </td>

                        <td className="py-3 px-3.5 sm:px-4 align-top">
                          <div className="flex flex-wrap gap-1.5">
                            {dishes.map((dish, dIdx) => (
                              <span
                                key={dIdx}
                                className="inline-block bg-white border border-stone-200 px-2 py-0.5 rounded-md text-xs font-semibold text-stone-800 shadow-2xs"
                              >
                                {dish}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-3 px-3.5 sm:px-4 text-right align-top whitespace-nowrap">
                          <span className="inline-block font-black text-xs text-amber-900 bg-amber-100 px-2 py-1 rounded-md border border-amber-200 shadow-2xs">
                            🔥 {totalCal} kcal
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredEntries.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-stone-400 font-bold text-xs">
                        Aramanıza uygun gün bulunamadı.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
