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
import { getDishImageUrl } from '@/lib/dishVisuals';
import DailyMenuRating from './DailyMenuRating';
import PrintMenuModal from './PrintMenuModal';
import { exportMonthlyMenuToExcel } from '@/lib/exportUtils';

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

function CameraIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
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

const CATEGORY_DOTS: Record<CategoryKey, string> = {
  corba: 'bg-amber-500',
  ana_yemek: 'bg-rose-500',
  yan_yemek: 'bg-orange-500',
  salata: 'bg-emerald-500',
  tatli: 'bg-purple-500',
  icecek: 'bg-sky-500',
};

const WEEKDAYS = [
  { short: 'Pzt', full: 'Pazartesi' },
  { short: 'Sal', full: 'Salı' },
  { short: 'Çar', full: 'Çarşamba' },
  { short: 'Per', full: 'Perşembe' },
  { short: 'Cum', full: 'Cuma' },
  { short: 'Cmt', full: 'Cumartesi' },
];

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

  // Aylık görünüm filtreleri ve görünüm modu (cards: Modern Fotoğraflı Liste, grid: 6 Günlük Tablo)
  const [selectedWeekFilter, setSelectedWeekFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [calendarViewMode, setCalendarViewMode] = useState<'cards' | 'grid'>('cards');

  const [dbMealsMap, setDbMealsMap] = useState<Record<string, CategoryKey>>({});
  const [dbCaloriesMap, setDbCaloriesMap] = useState<Record<string, number>>({});
  const [dbImagesMap, setDbImagesMap] = useState<Record<string, string>>({});

  // Seçilen yemeğin fotoğraf modalı
  const [selectedFoodModal, setSelectedFoodModal] = useState<{
    name: string;
    category: CategoryKey;
    calories: number;
    imageUrl: string | null;
  } | null>(null);

  // Yazdırma ve PDF Modal Durumu
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Veritabanı yemek, kalori ve görsel haritasını çek
  useEffect(() => {
    fetch('/api/meals', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const map: Record<string, CategoryKey> = {};
          const calMap: Record<string, number> = {};
          const imgMap: Record<string, string> = {};

          data.forEach((m: {
            name?: string;
            category?: string;
            calories?: number | null;
            imageUrl?: string | null;
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
            }
          });
          setDbMealsMap(map);
          setDbCaloriesMap(calMap);
          setDbImagesMap(imgMap);
        }
      })
      .catch(() => {});
  }, []);

  // Aylık planı doğrudan yükle ve bugünün gününe odaklan
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch('/api/plans/monthly', { cache: 'no-store' })
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

  // Excel (.xlsx) Olarak İndirme
  const handleExportExcel = useCallback(() => {
    if (!monthlyPlan) return;
    exportMonthlyMenuToExcel(monthlyPlan.monthName, entries, monthlyPlan.year, monthlyPlan.month);
  }, [monthlyPlan, entries]);

  // Hafta grupları
  const weekGroups = useMemo(() => {
    return groupEntriesByWeek(entries);
  }, [entries]);

  // Gün numarasına göre harita (1..31)
  const entriesByDay = useMemo(() => {
    const map = new Map<number, DailyMenuEntryData>();
    entries.forEach((e) => {
      let dayNum: number | null = null;
      const dayFromStr = parseInt(e.dateStr.trim().split(' ')[0], 10);
      if (!isNaN(dayFromStr) && dayFromStr > 0 && dayFromStr <= 31) {
        dayNum = dayFromStr;
      } else if (e.date) {
        dayNum = new Date(e.date).getUTCDate();
      }
      if (dayNum) {
        map.set(dayNum, e);
      }
    });
    return map;
  }, [entries]);

  // 7 Günlük Aylık Takvim Izgarası Verisi
  const calendarData = useMemo(() => {
    if (!monthlyPlan) return { cells: [], totalDays: 0, year: 2026, month: 9, matchingCount: 0 };
    const year = monthlyPlan.year || 2026;
    const month = monthlyPlan.month || 9; // 1-indexed

    // Ayın kaç gün çektiği
    const totalDays = new Date(year, month, 0).getDate();

    // Ayın ilk gününün haftanın hangi günü olduğu (0: Pazar, 1: Pazartesi, 2: Salı, ...)
    const firstDayObj = new Date(year, month - 1, 1);
    const firstDayOfWeek = firstDayObj.getDay();
    // 6 günlük çalışma takvimi (Pzt=0, Sal=1, Çar=2, Per=3, Cum=4, Cmt=5)
    // Ayın 1'i Pazar ise atlanacağı için Pazartesi (0) ile başlar.
    const firstDayWeekday = firstDayOfWeek === 0 ? 0 : firstDayOfWeek - 1;

    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    type CalendarCell = {
      type: 'day' | 'empty';
      key: string;
      dayNumber?: number;
      dateObj?: Date;
      isToday?: boolean;
      entry?: DailyMenuEntryData | null;
      dishes?: string[];
      totalCalories?: number;
      matchesSearch?: boolean;
    };

    const cells: CalendarCell[] = [];

    // Ayın ilk gününden önceki boş hücreler (Pazartesi hizalaması için)
    for (let i = 0; i < firstDayWeekday; i++) {
      cells.push({
        type: 'empty',
        key: `pad-pre-${i}`,
      });
    }

    const q = searchQuery.trim().toLowerCase();
    let matchingCount = 0;

    // Ayın günleri (Pazar günleri hariç, sadece Pazartesi - Cumartesi)
    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(year, month - 1, d);
      // Pazar tatilini tamamen takvimden kaldırıyoruz
      if (dateObj.getDay() === 0) continue;

      const isToday = d === currentDay && month === currentMonth && year === currentYear;

      const entry = entriesByDay.get(d) || null;
      let dishes: string[] = [];
      let totalCalories = 0;
      if (entry) {
        dishes = parseDishes(entry.items, entry.mealText);
        totalCalories = dishes.reduce((sum, dish) => sum + getDishCalories(dish), 0);
      }

      let matchesSearch = true;
      if (q) {
        const matchName = entry?.dayName?.toLowerCase().includes(q);
        const matchDate = entry?.dateStr?.toLowerCase().includes(q) || String(d) === q;
        const matchMeals = dishes.some((dish) => dish.toLowerCase().includes(q));
        matchesSearch = Boolean(matchName || matchDate || matchMeals);
      }

      if (matchesSearch && entry) {
        matchingCount++;
      }

      cells.push({
        type: 'day',
        key: `day-${d}`,
        dayNumber: d,
        dateObj,
        isToday,
        entry,
        dishes,
        totalCalories,
        matchesSearch,
      });
    }

    // Son satırı 6'nın katına tamamlamak için son boş hücreler
    const remainder = cells.length % 6;
    if (remainder !== 0) {
      const paddingNeeded = 6 - remainder;
      for (let i = 0; i < paddingNeeded; i++) {
        cells.push({
          type: 'empty',
          key: `pad-post-${i}`,
        });
      }
    }

    return { cells, totalDays, year, month, matchingCount };
  }, [monthlyPlan, entriesByDay, getDishCalories, searchQuery]);

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
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-white px-3 py-1 rounded-lg border border-amber-200 shadow-2xs">
                          🍴 {currentDishes.length} Çeşit Yemek
                        </span>
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-950 bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300 shadow-2xs flex items-center gap-1.5">
                          <span>🔥</span>
                          <span>Toplam: {totalCalories} kcal</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setIsPrintModalOpen(true)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs border border-stone-200 shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
                          title="Menüyü yazdır veya PDF olarak kaydet"
                        >
                          <span>🖨️</span>
                          <span className="hidden sm:inline">Yazdır / PDF</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleExportExcel}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200 shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
                          title="Aylık menüyü Excel (.xlsx) olarak indir"
                        >
                          <span>📊</span>
                          <span className="hidden sm:inline">Excel</span>
                        </button>
                      </div>
                    </div>

                    {/* Fotoğraflı Yemek Kartları Izgarası */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                      {currentDishes.map((dish, idx) => {
                         const cat = getDishCategory(dish);
                         const meta = CATEGORY_META[cat];
                         const calories = getDishCalories(dish);
                         const norm = normalizeFoodText(dish);
                         const dishImg = getDishImageUrl(
                           dish,
                           cat,
                           dbImagesMap[norm]
                         );

                        return (
                          <div
                            key={idx}
                            onClick={() =>
                              dishImg &&
                              setSelectedFoodModal({
                                name: dish,
                                category: cat,
                                calories,
                                imageUrl: dishImg,
                              })
                            }
                            className={`p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200 ${meta.cardBorder} hover:shadow-md transition-all duration-200 flex items-center gap-3.5 group cursor-pointer`}
                            title={dishImg ? 'Yemek fotoğrafını büyütmek için tıklayın' : undefined}
                          >
                            {/* Yemek Fotoğrafı veya 3D Pixar İkonu */}
                            {dishImg ? (
                              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-amber-200/80 shadow-2xs group-hover:scale-105 transition-transform bg-amber-50/50">
                                <img
                                  src={dishImg}
                                  alt={dish}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black tracking-wide">
                                  🔍 Büyüt
                                </div>
                                <div className="absolute bottom-1 right-1 w-5 h-5 rounded-md bg-amber-500/95 text-white flex items-center justify-center shadow-xs group-hover:opacity-0 transition-opacity">
                                  <CameraIcon className="w-3 h-3" />
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
                              <div className="flex items-center justify-between gap-2 mb-1.5">
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

                    {/* Günün Menüsünü 5 Yıldız ile Puanlama (Sadece Bugün) */}
                    <DailyMenuRating
                      dateStr={currentEntry.dateStr}
                      isToday={currentIndex === todayIndex}
                    />
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
      {/* 2. GÖRÜNÜM: AYLIK TAKVİM (7 GÜNLÜK TAKVİM IZGARASI — POPOVER YOK!) */}
      {/* ============================================================ */}
      {!loading && !error && activeTab === 'monthly' && (
        <div className="space-y-6">
          {/* Takvim Üst Paneli: Başlık, Lejant ve Arama */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-200/90 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                  <span>📅</span>
                  <span>{monthlyPlan?.monthName || 'Aylık'} {calendarData.year} Yemek Takvimi</span>
                </h3>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  İncelemek istediğiniz güne tıklayarak o günün detaylı menüsüne geçebilirsiniz.
                </p>
              </div>

              {/* Hızlı Arama Kutusu */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Yemek veya gün ara (örn: Mercimek, Köfte)..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-amber-500 bg-stone-50 font-medium placeholder:text-stone-400"
                />
                <span className="absolute left-3 top-2 text-stone-400 text-xs">🔍</span>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-700 text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Açıklama & Hızlı Aksiyonlar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-semibold text-stone-500">
                <span>Pazartesi – Cumartesi 6 Günlük Çalışma Takvimi</span>
                <span className="text-stone-300">•</span>
                <span className="inline-flex items-center gap-1.5 font-bold text-stone-700">
                  <span className="text-amber-600">📸</span>
                  <span>Yemek fotoğraflarına tıklayarak görseli büyütebilirsiniz</span>
                </span>
              </div>

              {/* Dışa Aktarma & Bugüne Git Butonları */}
              <div className="flex items-center gap-2 ml-auto flex-wrap">
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  title="Aylık yemek menüsünü Excel (.xlsx) olarak indir"
                >
                  <span>📊</span>
                  <span>Excel İndir</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(true)}
                  className="text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-xl border border-stone-300 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  title="Aylık yemek menüsünü yazdır veya PDF olarak kaydet"
                >
                  <span>🖨️</span>
                  <span>Yazdır / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleGoToToday}
                  className="text-xs font-black text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200 transition-colors cursor-pointer"
                >
                  🍽️ Günün Menüsüne Git
                </button>
              </div>
            </div>
          </div>

          {/* 6 Günlük Takvim Izgarası (Pazartesi - Cumartesi) */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-amber-200/90 shadow-sm space-y-4">
            {/* Görünüm Seçici ve Hafta Filtreleri (Sadece Mobilde Görünür) */}
            <div className="md:hidden space-y-3">
              {/* Görünüm Geçiş Düğmesi (Segmented Control) */}
              <div className="flex items-center justify-between gap-2 p-1 bg-stone-100/90 rounded-2xl border border-stone-200/90">
                <button
                  type="button"
                  onClick={() => setCalendarViewMode('cards')}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    calendarViewMode === 'cards'
                      ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <span>📋</span>
                  <span>Modern Liste</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarViewMode('grid')}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    calendarViewMode === 'grid'
                      ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <span>📅</span>
                  <span>6 Günlük Tablo</span>
                </button>
              </div>

              {/* Hafta Filtreleri (Sadece Liste modunda hızlı gezinme) */}
              {calendarViewMode === 'cards' && weekGroups.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setSelectedWeekFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                      selectedWeekFilter === 'all'
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    Tüm Ay
                  </button>
                  {weekGroups.map((wg) => {
                    const isSelected = selectedWeekFilter === wg.weekNumber;
                    const hasToday = wg.entries.some((e) => e.id === entries[todayIndex]?.id);

                    return (
                      <button
                        key={wg.weekNumber}
                        type="button"
                        onClick={() => setSelectedWeekFilter(wg.weekNumber)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        <span>{wg.shortLabel}</span>
                        {hasToday && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? 'bg-white' : 'bg-emerald-500'
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobilde Modern Hafta Hafta Fotoğraflı Liste Görünümü */}
            {calendarViewMode === 'cards' && (
              <div className="md:hidden space-y-5">
                {displayedWeekGroups.length === 0 ? (
                  <div className="py-8 text-center text-stone-400 font-bold text-xs bg-stone-50 rounded-2xl border border-stone-200">
                    Aramanıza uygun gün bulunamadı.
                  </div>
                ) : (
                  displayedWeekGroups.map((wg) => (
                    <div key={wg.weekNumber} className="space-y-3">
                      {/* Hafta Başlık Çizgisi */}
                      <div className="flex items-center justify-between px-1 pt-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-2xs" />
                          <span className="text-sm font-black text-stone-900 tracking-tight">
                            {wg.label}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-lg border border-stone-200/80">
                          {wg.entries.length} Gün
                        </span>
                      </div>

                      {/* Günlük Kartlar: Masaüstünde 3'lü/2'li Şık Izgara, Mobilde Tek Sütun */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                        {wg.entries.map((entry) => {
                          const dishes = parseDishes(entry.items, entry.mealText);
                          const dayCalories = dishes.reduce(
                            (sum, dish) => sum + getDishCalories(dish),
                            0
                          );
                          const isEntryToday = entry.id === entries[todayIndex]?.id;

                          return (
                            <div
                              key={entry.id}
                              onClick={() => handleSelectDayFromMonthly(entry)}
                              className={`rounded-2xl border p-3.5 transition-all cursor-pointer space-y-3 group ${
                                isEntryToday
                                  ? 'bg-gradient-to-b from-amber-50/50 via-white to-white border-amber-300 ring-2 ring-amber-300/60 shadow-xs'
                                  : 'bg-white border-stone-200/90 hover:border-amber-300 shadow-2xs'
                              }`}
                            >
                              {/* Kart Üst Bilgisi: Tarih & Kalori Rozeti */}
                              <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-black text-stone-900 group-hover:text-amber-800 transition-colors">
                                    {entry.dateStr}
                                  </span>
                                  <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                                    {entry.dayName}
                                  </span>
                                  {isEntryToday && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                                      Bugün
                                    </span>
                                  )}
                                </div>
                                {dayCalories > 0 && (
                                  <span className="text-[11px] font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-lg border border-stone-200/60 flex items-center gap-1">
                                    <span>🔥</span>
                                    <span>{dayCalories} kcal</span>
                                  </span>
                                )}
                              </div>

                              {/* Modern Yemek Listesi: Nötr, Şık ve Görselli (Renk Karmaşası Yok!) */}
                              <div className="space-y-1.5">
                                {dishes.map((dish, dIdx) => {
                                  const cat = getDishCategory(dish);
                                  const meta = CATEGORY_META[cat];
                                  const norm = normalizeFoodText(dish);
                                  const dishImg = getDishImageUrl(dish, cat, dbImagesMap[norm]);
                                  const cal = getDishCalories(dish);

                                  return (
                                    <div
                                      key={dIdx}
                                      className="flex items-center gap-3 p-2 rounded-xl bg-stone-50/70 hover:bg-amber-50/40 border border-stone-150/60 transition-colors"
                                    >
                                      {/* Fotoğraf veya Kategori İkonu */}
                                      <div
                                        onClick={(e) => {
                                          if (dishImg) {
                                            e.stopPropagation();
                                            setSelectedFoodModal({
                                              name: dish,
                                              category: cat,
                                              calories: cal,
                                              imageUrl: dishImg,
                                            });
                                          }
                                        }}
                                        className={`relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-stone-200/70 bg-white flex items-center justify-center ${
                                          dishImg ? 'cursor-pointer group/photo' : ''
                                        }`}
                                        title={dishImg ? 'Fotoğrafı büyütmek için dokunun' : undefined}
                                      >
                                        {dishImg ? (
                                          <>
                                            <img
                                              src={dishImg}
                                              alt={dish}
                                              className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform"
                                              loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-black">
                                              🔍
                                            </div>
                                          </>
                                        ) : (
                                          <span className="text-base select-none">
                                            {cat === 'corba' ? '🍲' : cat === 'ana_yemek' ? '🥩' : cat === 'yan_yemek' ? '🍚' : cat === 'salata' ? '🥗' : cat === 'tatli' ? '🍮' : '🥤'}
                                          </span>
                                        )}
                                      </div>

                                      {/* Yemek Başlığı & Sade Kategori/Kalori */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1.5">
                                          <span className="font-extrabold text-stone-900 text-xs sm:text-sm truncate">
                                            {dish}
                                          </span>
                                          {cal > 0 && (
                                            <span className="text-[10px] font-semibold text-stone-400 whitespace-nowrap">
                                              {cal} kcal
                                            </span>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-500 font-medium">
                                          <span>{meta?.label || 'Yemek'}</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Kart Altı: Günün Menüsüne Geçiş */}
                              <div className="flex items-center justify-between pt-1 text-xs font-black text-amber-700 border-t border-stone-100/80">
                                <span className="text-[11px] text-stone-400 font-medium">Günün Menüsü Görünümüne Geç</span>
                                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                  <span>İncele</span>
                                  <span>&rarr;</span>
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Mobil Kaydırma İpucu (Sadece tablo modunda) */}
            {calendarViewMode === 'grid' && (
              <div className="flex items-center justify-between text-xs text-stone-500 font-bold md:hidden px-1">
                <span>👉 Takvimi sağa-sola kaydırabilirsiniz</span>
                <span className="text-[11px] text-amber-600 font-extrabold">{monthlyPlan?.monthName} {calendarData.year}</span>
              </div>
            )}

            <div className={`${calendarViewMode === 'grid' ? 'block' : 'hidden md:block'} overflow-x-auto pb-2 scrollbar-thin`}>
              <div className="min-w-[720px]">
                {/* 6 Sütun Gün Başlıkları */}
                <div className="grid grid-cols-6 gap-2 mb-2.5">
                  {WEEKDAYS.map((w, idx) => (
                    <div
                      key={idx}
                      className="py-2.5 px-2 text-center rounded-xl font-black text-xs uppercase tracking-wider bg-stone-100 text-stone-800 border border-stone-200/80"
                    >
                      <span className="hidden sm:inline">{w.full}</span>
                      <span className="sm:hidden">{w.short}</span>
                    </div>
                  ))}
                </div>

                {/* 6 Sütun Gün Hücreleri */}
                <div className="grid grid-cols-6 gap-2">
                  {calendarData.cells.map((cell) => {
                    if (cell.type === 'empty') {
                      return (
                        <div
                          key={cell.key}
                          className="min-h-[180px] rounded-2xl bg-stone-50/40 border border-dashed border-stone-200/50"
                        />
                      );
                    }

                    // Menüsü Olan Gün Hücresi
                    if (cell.entry) {
                      return (
                        <div
                          key={cell.key}
                          onClick={() => handleSelectDayFromMonthly(cell.entry!)}
                          className={`min-h-[180px] p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group hover:shadow-lg hover:-translate-y-0.5 ${
                            cell.isToday
                              ? 'bg-emerald-50/40 border-emerald-400 ring-2 ring-emerald-300 shadow-sm'
                              : cell.matchesSearch
                              ? 'bg-white border-stone-200 hover:border-amber-400'
                              : 'bg-stone-50/60 border-stone-150 opacity-30 hover:opacity-100'
                          }`}
                          title={`${cell.entry.dateStr} menüsünü detaylı incelemek için tıklayın`}
                        >
                          {/* Gün Başlığı: Gün Numarası & Kalori */}
                          <div className="flex items-center justify-between gap-1 border-b border-stone-100 pb-1.5 mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`text-sm font-black ${
                                  cell.isToday
                                    ? 'text-emerald-700'
                                    : 'text-stone-900 group-hover:text-amber-600'
                                }`}
                              >
                                {cell.dayNumber}
                              </span>
                              {cell.isToday && (
                                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-emerald-600 text-white animate-pulse">
                                  Bugün
                                </span>
                              )}
                            </div>
                            {cell.totalCalories && cell.totalCalories > 0 ? (
                              <span className="text-[10px] font-black text-amber-900 bg-amber-100/80 px-1.5 py-0.5 rounded border border-amber-200/80 whitespace-nowrap">
                                {cell.totalCalories} kcal
                              </span>
                            ) : null}
                          </div>

                          {/* Yemekler Listesi (Fotoğraflı, Net ve Modern) */}
                          <div className="space-y-1 flex-1 my-0.5">
                            {cell.dishes?.slice(0, 4).map((dish, dIdx) => {
                              const cat = getDishCategory(dish);
                              const meta = CATEGORY_META[cat];
                              const norm = normalizeFoodText(dish);
                              const dishImg = getDishImageUrl(dish, cat, dbImagesMap[norm]);
                              const cal = getDishCalories(dish);

                              return (
                                <div
                                  key={dIdx}
                                  className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-50/70 hover:bg-amber-50/60 border border-stone-150/50 transition-colors"
                                >
                                  {/* Fotoğraf Küçük Resmi */}
                                  <div
                                    onClick={(e) => {
                                      if (dishImg) {
                                        e.stopPropagation();
                                        setSelectedFoodModal({
                                          name: dish,
                                          category: cat,
                                          calories: cal,
                                          imageUrl: dishImg,
                                        });
                                      }
                                    }}
                                    className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden flex-shrink-0 border border-stone-200/80 bg-white flex items-center justify-center ${
                                      dishImg ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''
                                    }`}
                                    title={dishImg ? 'Fotoğrafı büyütmek için dokunun' : undefined}
                                  >
                                    {dishImg ? (
                                      <>
                                        <img
                                          src={dishImg}
                                          alt={dish}
                                          className="w-full h-full object-cover"
                                          loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[8px] font-black">
                                          🔍
                                        </div>
                                      </>
                                    ) : (
                                      <span className="text-xs select-none">
                                        {cat === 'corba' ? '🍲' : cat === 'ana_yemek' ? '🥩' : cat === 'yan_yemek' ? '🍚' : cat === 'salata' ? '🥗' : cat === 'tatli' ? '🍮' : '🥤'}
                                      </span>
                                    )}
                                  </div>

                                  {/* Yemek Başlığı & Kategori */}
                                  <div className="flex-1 min-w-0">
                                    <div className="text-[11px] font-bold text-stone-900 truncate leading-snug" title={dish}>
                                      {dish}
                                    </div>
                                    <div className="text-[9px] text-stone-400 font-medium truncate">
                                      {meta?.label || 'Yemek'}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                            {cell.dishes && cell.dishes.length > 4 && (
                              <div className="text-[10px] font-extrabold text-stone-400 pt-0.5 text-center">
                                +{cell.dishes.length - 4} yemek daha
                              </div>
                            )}
                          </div>

                          {/* Alt İpucu: Günün Menüsünde Aç */}
                          <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-stone-100/80 text-[10px] font-black">
                            <span className="text-stone-400 truncate max-w-[85px]">
                              {cell.entry.dayName}
                            </span>
                            <span className="text-amber-700 group-hover:text-amber-900 group-hover:translate-x-0.5 transition-all flex items-center gap-0.5">
                              <span>İncele</span>
                              <span>&rarr;</span>
                            </span>
                          </div>
                        </div>
                      );
                    }

                    // Hafta İçi Menü Planlanmamış Gün
                    return (
                      <div
                        key={cell.key}
                        className="min-h-[150px] p-3 rounded-2xl bg-stone-50/50 border border-stone-200/60 flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-stone-400">{cell.dayNumber}</span>
                        </div>
                        <div className="my-auto text-center py-2 text-stone-400 text-xs font-semibold">
                          Plan Yok
                        </div>
                        <div className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Arama Sonucu Bildirimi (Arama varsa) */}
            {searchQuery.trim() && (
              <div className="flex items-center justify-between px-3 py-2 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-bold">
                <span>
                  🔍 &quot;{searchQuery}&quot; araması için {calendarData.matchingCount} gün bulundu. Eşleşen günler normal, diğerleri soluk gösterilmektedir.
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-amber-800 underline hover:text-amber-950 cursor-pointer ml-2"
                >
                  Filtreyi Temizle
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Yemek Fotoğrafı Modalı */}
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

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedFoodModal(null)}
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-black rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Aylık Menü Yazdırma ve PDF Modal */}
      <PrintMenuModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        monthName={monthlyPlan?.monthName || 'Aylık'}
        entries={entries}
        year={monthlyPlan?.year}
        month={monthlyPlan?.month}
      />
    </section>
  );
}
