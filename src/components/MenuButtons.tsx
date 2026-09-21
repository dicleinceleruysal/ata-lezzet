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
import { getDishVisualInfo } from '@/lib/dishVisuals';

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

interface WeekGroup {
  weekNumber: number;
  label: string;
  shortLabel: string;
  entries: DailyMenuEntryData[];
}

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

function groupEntriesByWeek(entries: DailyMenuEntryData[]): WeekGroup[] {
  const weeks: WeekGroup[] = [];
  let currentWeek: DailyMenuEntryData[] = [];
  let weekIdx = 1;

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const isMonday = entry.dayName?.toLowerCase().includes('pazartesi');

    if (isMonday && currentWeek.length > 0) {
      const firstDay = currentWeek[0];
      const lastDay = currentWeek[currentWeek.length - 1];
      weeks.push({
        weekNumber: weekIdx,
        label: `${weekIdx}. Hafta (${firstDay.dateStr.split(' ')[0]} - ${lastDay.dateStr.split(' ')[0]} ${lastDay.dateStr.split(' ')[1]})`,
        shortLabel: `${weekIdx}. Hafta`,
        entries: currentWeek,
      });
      weekIdx++;
      currentWeek = [];
    }
    currentWeek.push(entry);
  }

  if (currentWeek.length > 0) {
    const firstDay = currentWeek[0];
    const lastDay = currentWeek[currentWeek.length - 1];
    weeks.push({
      weekNumber: weekIdx,
      label: `${weekIdx}. Hafta (${firstDay.dateStr.split(' ')[0]} - ${lastDay.dateStr.split(' ')[0]} ${lastDay.dateStr.split(' ')[1]})`,
      shortLabel: `${weekIdx}. Hafta`,
      entries: currentWeek,
    });
  }

  return weeks;
}

export default function MenuButtons() {
  const [activeTab, setActiveTab] = useState<'daily' | 'monthly'>('daily');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [monthlyPlan, setMonthlyPlan] = useState<MonthlyPlanData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [todayIndex, setTodayIndex] = useState<number>(0);
  const [isSundayToday, setIsSundayToday] = useState<boolean>(false);

  // Aylık görünüm filtreleri
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [dbMealsMap, setDbMealsMap] = useState<Record<string, CategoryKey>>({});
  const [dbCaloriesMap, setDbCaloriesMap] = useState<Record<string, number>>({});
  const [dbImagesMap, setDbImagesMap] = useState<Record<string, string>>({});
  const [dbDescriptionsMap, setDbDescriptionsMap] = useState<Record<string, string>>({});

  // Seçilen yemeğin detay ve fotoğraf modalı (İsminden ne olduğunu bilmeyenler için)
  const [selectedFoodModal, setSelectedFoodModal] = useState<{
    name: string;
    category: CategoryKey;
    calories: number;
    imageUrl: string | null;
    description: string;
  } | null>(null);

  // Veritabanı yemek, kalori, görsel ve açıklama haritasını çek
  useEffect(() => {
    fetch('/api/meals')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const map: Record<string, CategoryKey> = {};
          const calMap: Record<string, number> = {};
          const imgMap: Record<string, string> = {};
          const descMap: Record<string, string> = {};

          data.forEach((m: {
            name?: string;
            category?: string;
            calories?: number | null;
            imageUrl?: string | null;
            description?: string | null;
          }) => {
            if (m.name) {
              const norm = normalizeFoodText(m.name);
              if (m.category) {
                map[norm] = m.category as CategoryKey;
              }
              if (typeof m.calories === 'number' && m.calories > 0) {
                calMap[norm] = m.calories;
              }
              if (m.imageUrl) {
                imgMap[norm] = m.imageUrl;
              }
              if (m.description) {
                descMap[norm] = m.description;
              }
            }
          });
          setDbMealsMap(map);
          setDbCaloriesMap(calMap);
          setDbImagesMap(imgMap);
          setDbDescriptionsMap(descMap);
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

        let foundIdx = entries.findIndex((e) => {
          const d = new Date(e.date);
          return (
            d.getUTCDate() === currentDay &&
            d.getUTCMonth() + 1 === currentMonth &&
            d.getUTCFullYear() === currentYear
          );
        });

        if (foundIdx === -1) {
          foundIdx = entries.findIndex((e) => {
            const d = new Date(e.date);
            return d.getUTCDate() === currentDay;
          });
        }

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

  // Hafta grupları
  const weekGroups = useMemo(() => {
    return groupEntriesByWeek(entries);
  }, [entries]);

  // Klavye ok tuşları ile gün geçişi (Sol: Önceki, Sağ: Sonraki)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (activeTab === 'daily') {
        if (e.key === 'ArrowLeft') {
          if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
          }
        } else if (e.key === 'ArrowRight') {
          if (currentIndex < entries.length - 1) {
            setCurrentIndex((prev) => prev + 1);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, currentIndex, entries.length]);

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
    setActiveTab('daily');
  };

  const handleSelectDayFromMonthly = (entry: DailyMenuEntryData) => {
    const idx = entries.findIndex((e) => e.id === entry.id);
    if (idx !== -1) {
      setCurrentIndex(idx);
      setActiveTab('daily');
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  // Mevcut haftanın günleri (Günün menüsü üzerindeki mini gün seçici şerit için)
  const currentWeekDays = useMemo(() => {
    if (!currentEntry || weekGroups.length === 0) return [];
    for (const wg of weekGroups) {
      if (wg.entries.some((e) => e.id === currentEntry.id)) {
        return wg.entries;
      }
    }
    return [];
  }, [currentEntry, weekGroups]);

  // Filtrelenmiş aylık liste
  const displayedWeekGroups = useMemo(() => {
    let result = weekGroups;
    if (selectedWeekFilter !== 'all') {
      result = result.filter((w) => w.weekNumber === selectedWeekFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result
        .map((w) => ({
          ...w,
          entries: w.entries.filter(
            (e) =>
              e.dateStr.toLowerCase().includes(q) ||
              e.dayName.toLowerCase().includes(q) ||
              e.mealText.toLowerCase().includes(q)
          ),
        }))
        .filter((w) => w.entries.length > 0);
    }
    return result;
  }, [weekGroups, selectedWeekFilter, searchQuery]);

  return (
    <section className="w-full space-y-6">
      {/* ÜST GEÇİŞ SEKMESİ: [ 🍽️ Günün Menüsü ] vs [ 📅 Aylık Takvim ] (POPOVER YOK!) */}
      <div className="flex items-center justify-center">
        <div className="inline-flex p-1.5 bg-stone-200/60 backdrop-blur-xs rounded-2xl border border-stone-300/50 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('daily')}
            className={`flex items-center gap-2 py-2.5 px-5 sm:px-6 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'daily'
                ? 'bg-white text-stone-950 shadow-sm border border-stone-200 scale-100'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span className="text-base">🍽️</span>
            <span>Günün Menüsü</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('monthly')}
            className={`flex items-center gap-2 py-2.5 px-5 sm:px-6 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'monthly'
                ? 'bg-white text-stone-950 shadow-sm border border-stone-200 scale-100'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span className="text-base">📅</span>
            <span>Aylık Takvim</span>
            {entries.length > 0 && (
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900">
                {entries.length} Gün
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Yükleniyor Durumu */}
      {loading && (
        <div className="bg-white rounded-3xl p-12 border-2 border-amber-200/80 shadow-sm text-center text-stone-500 space-y-3">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase font-extrabold tracking-widest text-amber-900">
            Menü Hazırlanıyor...
          </p>
        </div>
      )}

      {/* Hata Durumu */}
      {!loading && error && (
        <div className="p-5 bg-rose-50 text-rose-800 rounded-2xl border border-rose-200 text-sm font-bold text-center">
          {error}
        </div>
      )}

      {/* ============================================================ */}
      {/* 1. GÖRÜNÜM: GÜNÜN MENÜSÜ & OK NAVİGASYONU                    */}
      {/* ============================================================ */}
      {!loading && !error && activeTab === 'daily' && (
        <div className="bg-white rounded-3xl p-5 sm:p-8 border-2 border-amber-200/90 shadow-[0_16px_36px_rgba(245,158,11,0.12)] space-y-6">
          {/* Üst Navigasyon Çubuğu: [Sol Ok] — [Tarih & Gün Bilgisi] — [Sağ Ok] */}
          <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3.5 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl border border-amber-200 shadow-2xs">
            {/* Sol Ok Butonu */}
            <button
              type="button"
              onClick={handlePrevDay}
              disabled={currentIndex === 0}
              className={`group flex items-center gap-1 px-3 sm:px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all select-none cursor-pointer ${
                currentIndex === 0
                  ? 'opacity-35 cursor-not-allowed text-stone-400 bg-stone-100'
                  : 'bg-white hover:bg-amber-500 hover:text-white text-stone-800 border border-amber-200 shadow-xs active:scale-95'
              }`}
              title="Önceki Gün (Klavye: Sol Ok)"
            >
              <span className="text-base sm:text-lg group-hover:-translate-x-0.5 transition-transform">&larr;</span>
              <span className="hidden sm:inline">Önceki</span>
            </button>

            {/* Merkez Tarih & Gün Bilgisi */}
            <div className="text-center flex-1 min-w-0 px-2">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-xl font-black text-stone-900 tracking-tight">
                  {currentEntry?.dateStr || 'Günün Menüsü'}
                </h2>
                {currentIndex === todayIndex && (
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider bg-emerald-500 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                    Bugün
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 mt-1">
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

            {/* Sağ Ok Butonu */}
            <button
              type="button"
              onClick={handleNextDay}
              disabled={currentIndex === entries.length - 1}
              className={`group flex items-center gap-1 px-3 sm:px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all select-none cursor-pointer ${
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

          {/* Haftalık Mini Gün Seçici Şerit (Pazartesi - Cumartesi Hızlı Tıklama) */}
          {currentWeekDays.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap pb-1">
              {currentWeekDays.map((wDay) => {
                const wIdx = entries.findIndex((e) => e.id === wDay.id);
                const isSelected = wIdx === currentIndex;
                const isToday = wIdx === todayIndex;
                const dayShort = wDay.dayName.substring(0, 3);
                const dayNum = wDay.dateStr.split(' ')[0];

                return (
                  <button
                    key={wDay.id}
                    type="button"
                    onClick={() => setCurrentIndex(wIdx)}
                    className={`flex flex-col items-center justify-center py-1.5 px-2.5 sm:px-3 rounded-xl border text-xs transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs scale-105 font-black'
                        : 'bg-stone-50 hover:bg-amber-50 text-stone-700 border-stone-200 font-semibold'
                    }`}
                  >
                    <span className="text-[10px] uppercase opacity-80">{dayShort}</span>
                    <span className="text-xs sm:text-sm font-black flex items-center gap-0.5">
                      {dayNum}
                      {isToday && !isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Pazar Günü Kartı */}
          {isSundayToday && currentIndex === todayIndex ? (
            <div className="p-10 text-center bg-amber-50/60 rounded-3xl border border-amber-200 space-y-3">
              <div className="w-16 h-16 mx-auto bg-white rounded-2xl p-2 shadow-xs border border-amber-200">
                <PixarSalad className="w-full h-full" />
              </div>
              <h3 className="text-xl font-black text-amber-950">Bugün Pazar</h3>
              <p className="text-stone-600 font-semibold text-sm">
                Pazar günleri yemek hizmetimiz bulunmamaktadır.
              </p>
              <p className="text-xs text-stone-400">
                Yukarıdaki oklara veya gün butonlarına basarak haftanın diğer günlerinin menülerini inceleyebilirsiniz.
              </p>
            </div>
          ) : currentEntry ? (
            <>
              {/* Günün İstatistikleri (Çeşit Sayısı ve Toplam Kalori) */}
              {(() => {
                const currentDishes = parseDishes(currentEntry.items, currentEntry.mealText);
                const totalCalories = currentDishes.reduce(
                  (sum, dish) => sum + getDishCalories(dish),
                  0
                );

                return (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-white px-3 py-1 rounded-lg border border-amber-200 shadow-2xs">
                        🍴 {currentDishes.length} Çeşit Yemek
                      </span>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-950 bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300 shadow-2xs flex items-center gap-1.5">
                        <span>🔥</span>
                        <span>Toplam: {totalCalories} kcal</span>
                      </span>
                    </div>

                    {/* Fotoğraflı Yemek Kartları Izgarası */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                      {currentDishes.map((dish, idx) => {
                        const cat = getDishCategory(dish);
                        const meta = CATEGORY_META[cat];
                        const calories = getDishCalories(dish);
                        const norm = normalizeFoodText(dish);
                        const visual = getDishVisualInfo(
                          dish,
                          cat,
                          dbImagesMap[norm],
                          dbDescriptionsMap[norm]
                        );

                        return (
                          <div
                            key={idx}
                            onClick={() =>
                              setSelectedFoodModal({
                                name: dish,
                                category: cat,
                                calories,
                                imageUrl: visual.imageUrl,
                                description: visual.description,
                              })
                            }
                            className={`p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200 ${meta.cardBorder} hover:shadow-md transition-all duration-200 flex items-center gap-3.5 group cursor-pointer`}
                            title="Yemek fotoğrafını ve detaylı açıklamasını görmek için tıklayın"
                          >
                            {/* Yemek Fotoğrafı veya 3D Pixar İkonu */}
                            {visual.imageUrl ? (
                              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-amber-200/80 shadow-2xs group-hover:scale-105 transition-transform bg-amber-50/50">
                                <img
                                  src={visual.imageUrl}
                                  alt={dish}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black tracking-wide">
                                  🔍 İncele
                                </div>
                              </div>
                            ) : (
                              <div
                                className={`p-2.5 rounded-2xl border flex-shrink-0 transition-transform group-hover:scale-105 ${meta.iconBox}`}
                              >
                                {getPixarIconByCategory(cat)}
                              </div>
                            )}

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
                              <h4 className="font-black text-stone-900 text-sm sm:text-base leading-snug group-hover:text-amber-800 transition-colors">
                                {dish}
                              </h4>
                              {visual.description && (
                                <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                                  {visual.description}
                                </p>
                              )}
                              <div className="text-[10px] font-bold text-amber-700/80 group-hover:text-amber-900 mt-1 flex items-center gap-1">
                                <span>Fotoğraf & Detay</span>
                                <span>&rarr;</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Özet Menü Satırı */}
                    <div className="p-3.5 sm:p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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

      {/* ============================================================ */}
      {/* 2. GÖRÜNÜM: AYLIK TAKVİM (HAFTALIK DÜZENLİ KARTLAR — POPOVER YOK!) */}
      {/* ============================================================ */}
      {!loading && !error && activeTab === 'monthly' && (
        <div className="space-y-6">
          {/* Filtre ve Arama Alanı */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200/90 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
                  {monthlyPlan?.monthName || 'Aylık'} Yemek Takvimi
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  Haftalık düzenlenmiş menü kartları. İncelemek istediğiniz güne tıklayarak günün menüsüne geçebilirsiniz.
                </p>
              </div>

              {/* Hızlı Arama Kutusu */}
              <div className="relative min-w-[240px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Yemek veya gün ara..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-amber-500 bg-stone-50 font-medium"
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

            {/* Hafta Filtre Hapları */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedWeekFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  selectedWeekFilter === 'all'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                Tüm Ay ({entries.length} Gün)
              </button>

              {weekGroups.map((wg) => (
                <button
                  key={wg.weekNumber}
                  type="button"
                  onClick={() => setSelectedWeekFilter(wg.weekNumber)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    selectedWeekFilter === wg.weekNumber
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {wg.shortLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Haftalık Gruplanmış Kartlar */}
          <div className="space-y-6">
            {displayedWeekGroups.map((group) => (
              <div key={group.weekNumber} className="space-y-3">
                {/* Hafta Başlığı */}
                <div className="flex items-center gap-3 px-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <h4 className="text-sm sm:text-base font-black text-stone-900 tracking-tight">
                    {group.label}
                  </h4>
                  <span className="text-[11px] font-bold text-stone-500">
                    ({group.entries.length} Gün)
                  </span>
                </div>

                {/* Gün Kartları Izgarası */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {group.entries.map((entry) => {
                    const originalIdx = entries.findIndex((e) => e.id === entry.id);
                    const isToday = originalIdx === todayIndex;
                    const dishes = parseDishes(entry.items, entry.mealText);
                    const totalCal = dishes.reduce((sum, d) => sum + getDishCalories(d), 0);

                    return (
                      <div
                        key={entry.id}
                        onClick={() => handleSelectDayFromMonthly(entry)}
                        className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all cursor-pointer hover:shadow-md flex flex-col justify-between gap-3 group ${
                          isToday
                            ? 'border-emerald-400 ring-2 ring-emerald-200 bg-emerald-50/20'
                            : 'border-stone-200 hover:border-amber-300'
                        }`}
                        title="Bu günün menüsünü detaylı incelemek için tıklayın"
                      >
                        {/* Kart Başlığı: Tarih & Kalori Rozeti */}
                        <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-stone-900">
                              {entry.dateStr}
                            </span>
                            {isToday && (
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                                Bugün
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-black text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-200 shadow-2xs whitespace-nowrap">
                            🔥 {totalCal} kcal
                          </span>
                        </div>

                        {/* Yemekler Listesi (Fotoğraf İnceleme Özellikli Rozetler) */}
                        <div className="flex flex-wrap gap-1.5 flex-1">
                          {dishes.map((dish, dIdx) => {
                            const cat = getDishCategory(dish);
                            const meta = CATEGORY_META[cat];
                            const cal = getDishCalories(dish);
                            const norm = normalizeFoodText(dish);
                            const visual = getDishVisualInfo(
                              dish,
                              cat,
                              dbImagesMap[norm],
                              dbDescriptionsMap[norm]
                            );

                            return (
                              <button
                                key={dIdx}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedFoodModal({
                                    name: dish,
                                    category: cat,
                                    calories: cal,
                                    imageUrl: visual.imageUrl,
                                    description: visual.description,
                                  });
                                }}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border shadow-2xs hover:scale-105 transition-transform cursor-pointer ${meta.badgeClass}`}
                                title="Fotoğrafını ve içeriğini görmek için tıklayın"
                              >
                                {visual.imageUrl && <span className="text-[10px]">📷</span>}
                                <span>{dish}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Alt Buton: Günün Menüsüne Git */}
                        <div className="flex items-center justify-end pt-1">
                          <span className="text-[11px] font-black text-amber-700 group-hover:text-amber-900 group-hover:translate-x-0.5 transition-all flex items-center gap-1">
                            <span>Günün Menüsünde Aç</span>
                            <span>&rarr;</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {displayedWeekGroups.length === 0 && (
              <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 text-stone-400 font-bold text-sm">
                Aramanıza uygun yemek veya gün bulunamadı.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Yemek Detayı & Fotoğraf Modalı (İsminden ne olduğunu bilmeyenler için) */}
      {selectedFoodModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedFoodModal(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-md w-full shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fotoğraf Alanı */}
            {selectedFoodModal.imageUrl ? (
              <div className="relative aspect-video w-full bg-stone-100">
                <img
                  src={selectedFoodModal.imageUrl}
                  alt={selectedFoodModal.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setSelectedFoodModal(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center text-sm font-black transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-100 flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl bg-white p-2 border border-amber-200 shadow-xs flex items-center justify-center">
                  {getPixarIconByCategory(selectedFoodModal.category)}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFoodModal(null)}
                  className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 hover:bg-stone-300 flex items-center justify-center text-sm font-black transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* İçerik & Bilgi */}
            <div className="p-6 space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-block text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md border shadow-2xs ${
                    CATEGORY_META[selectedFoodModal.category]?.badgeClass || ''
                  }`}
                >
                  {CATEGORY_META[selectedFoodModal.category]?.label || selectedFoodModal.category}
                </span>
                <span className="text-xs font-black text-amber-900 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <span>🔥</span>
                  <span>{selectedFoodModal.calories} kcal</span>
                </span>
              </div>

              <h3 className="text-xl font-black text-stone-900 tracking-tight">
                {selectedFoodModal.name}
              </h3>

              {selectedFoodModal.description && (
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs sm:text-sm text-stone-700 leading-relaxed space-y-1">
                  <p className="font-extrabold text-amber-900 text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <span>ℹ️</span>
                    <span>Yemek Hakkında / İçerik</span>
                  </p>
                  <p>{selectedFoodModal.description}</p>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedFoodModal(null)}
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-black rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Tamam, Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
