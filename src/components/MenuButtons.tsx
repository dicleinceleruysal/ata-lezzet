'use client';

import React, { useState, useEffect } from 'react';
import {
  PixarSoup,
  PixarMainDish,
  PixarSideDish,
  PixarSalad,
  PixarDessert,
  PixarDrink,
} from './PixarIcons';
import { getMealCalories } from '@/lib/mealCalories';

interface DailyMenuEntryData {
  id: string;
  date: string;
  dateStr: string;
  dayName: string;
  mealText: string;
  items: string[] | string;
  isHoliday?: boolean;
}

interface MonthlyPlanData {
  id: string;
  year: number;
  month: number;
  monthName: string;
  entries: DailyMenuEntryData[];
}

interface TodayLunchData {
  isSunday: boolean;
  id?: string;
  date?: string;
  dateStr: string;
  dayName: string;
  mealText: string;
  items: string[] | string;
  isHoliday?: boolean;
  message?: string;
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

export type CategoryKey = 'corba' | 'ana_yemek' | 'yan_yemek' | 'salata' | 'tatli' | 'icecek';

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

// Yemek adına göre kategori tespit eder
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

// Her kategori için tamamen farklı, canlı ve şık renk paleti
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
  const [activeModal, setActiveModal] = useState<'daily' | 'monthly' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [todayLunch, setTodayLunch] = useState<TodayLunchData | null>(null);
  const [monthlyPlan, setMonthlyPlan] = useState<MonthlyPlanData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dbMealsMap, setDbMealsMap] = useState<Record<string, CategoryKey>>({});
  const [dbCaloriesMap, setDbCaloriesMap] = useState<Record<string, number>>({});

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

  const getDishCategory = (dishName: string): CategoryKey => {
    const norm = normalizeFoodText(dishName);
    if (dbMealsMap[norm]) {
      return dbMealsMap[norm];
    }
    return detectPixarCategory(dishName);
  };

  const getDishCalories = (dishName: string): number => {
    const norm = normalizeFoodText(dishName);
    if (dbCaloriesMap[norm]) {
      return dbCaloriesMap[norm];
    }
    const cat = getDishCategory(dishName);
    return getMealCalories(dishName, cat);
  };

  const fetchDailyMenu = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/plans/daily');
      if (!res.ok) {
        throw new Error('Günün menüsü yüklenemedi.');
      }
      const data = await res.json();
      if (data.todayLunch) {
        setTodayLunch(data.todayLunch);
      } else {
        throw new Error('Günün yemek listesi bulunamadı.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyPlan = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/plans/monthly');
      if (!res.ok) {
        throw new Error('Aylık yemek listesi yüklenemedi.');
      }
      const data = await res.json();
      setMonthlyPlan(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type: 'daily' | 'monthly') => {
    setActiveModal(type);
    if (type === 'daily') {
      fetchDailyMenu();
    } else {
      fetchMonthlyPlan();
    }
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setError(null);
    setSearchQuery('');
  };

  // Aylık liste filtreleme
  const filteredEntries = (monthlyPlan?.entries || []).filter((entry) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      entry.dateStr.toLowerCase().includes(q) ||
      entry.dayName.toLowerCase().includes(q) ||
      entry.mealText.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <section className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {/* 1. GÜNÜN MENÜSÜ BUTONU (3D Pixar Dokulu) */}
          <button
            type="button"
            onClick={() => handleOpenModal('daily')}
            className="group relative flex flex-col items-center justify-center p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-[0_14px_28px_rgba(234,88,12,0.25)] hover:shadow-[0_18px_36px_rgba(234,88,12,0.35)] transition-all duration-300 hover:-translate-y-1.5 active:translate-y-0 cursor-pointer min-h-[160px] text-center border-2 border-orange-300/40"
          >
            <div className="mb-2 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
              <PixarSoup className="w-14 h-14" />
            </div>

            <span className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-xs">
              Günün Menüsü
            </span>
            <span className="text-xs uppercase tracking-wider font-bold text-amber-100 mt-1 flex items-center gap-1">
              <span>Bugünün Öğle Yemeği</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </span>
          </button>

          {/* 2. AYLIK LİSTE BUTONU (3D Pixar Dokulu) */}
          <button
            type="button"
            onClick={() => handleOpenModal('monthly')}
            className="group relative flex flex-col items-center justify-center p-7 sm:p-8 rounded-3xl bg-white hover:bg-amber-50/50 text-stone-900 shadow-[0_14px_28px_rgba(0,0,0,0.06)] hover:shadow-[0_18px_36px_rgba(245,158,11,0.18)] transition-all duration-300 hover:-translate-y-1.5 active:translate-y-0 cursor-pointer min-h-[160px] text-center border-2 border-amber-200/80 hover:border-amber-400"
          >
            <div className="mb-2 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <PixarMainDish className="w-14 h-14" />
            </div>

            <span className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900">
              Aylık Liste
            </span>
            <span className="text-xs uppercase tracking-wider font-bold text-amber-700 mt-1 flex items-center gap-1">
              <span>Aylık Yemek Takvimi</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </span>
          </button>
        </div>
      </section>

      {/* 3D Pixar Tarzı Modern Menü Modalı */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-stone-200 text-stone-800 my-auto max-h-[92vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-stone-100 bg-amber-50/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-amber-200 shadow-xs flex items-center justify-center flex-shrink-0">
                  {activeModal === 'daily' ? (
                    <PixarSoup className="w-8 h-8" />
                  ) : (
                    <PixarMainDish className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                    {activeModal === 'daily' ? 'Günün Öğle Yemeği Menüsü' : `${monthlyPlan?.monthName || 'Aylık'} Yemek Listesi`}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 font-medium">
                    {activeModal === 'daily'
                      ? (todayLunch?.dateStr || 'Bugünün Özel Menüsü')
                      : 'Tüm ayın öğle yemeği takvimi'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white hover:bg-stone-100 border border-stone-200 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer text-sm font-bold"
                aria-label="Kapat"
              >
                ✕
              </button>
            </div>



            {/* Modal Body */}
            <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-5">
              {loading && (
                <div className="py-20 text-center text-stone-500 space-y-3">
                  <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs uppercase font-bold tracking-widest text-amber-800">
                    Lezzetli Menü Yükleniyor...
                  </p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-rose-50 text-rose-800 rounded-2xl border border-rose-200 text-sm font-semibold">
                  {error}
                </div>
              )}

              {/* 1. GÜNÜN MENÜSÜ GÖRÜNÜMÜ */}
              {!loading && !error && activeModal === 'daily' && todayLunch && (
                <div className="space-y-5">
                  {todayLunch.isSunday ? (
                    <div className="p-12 text-center bg-amber-50/60 rounded-3xl border border-amber-200 space-y-3">
                      <div className="w-16 h-16 mx-auto bg-white rounded-2xl p-2 shadow-xs border border-amber-200">
                        <PixarSalad className="w-full h-full" />
                      </div>
                      <h4 className="text-xl font-black text-amber-950">Bugün Pazar</h4>
                      <p className="text-stone-600 font-semibold text-sm">
                        {todayLunch.message || 'Pazar günleri yemek hizmetimiz bulunmamaktadır.'}
                      </p>
                      <p className="text-xs text-stone-400">Hafta içi ve Cumartesi günleri menümüz servis edilmektedir.</p>
                    </div>
                  ) : (
                    <>
                      {/* Tarih ve Gün Başlığı & Yemek Kartları */}
                      {(() => {
                        const todayDishes = parseDishes(todayLunch.items, todayLunch.mealText);
                        const totalCalories = todayDishes.reduce((sum, dish) => sum + getDishCalories(dish), 0);
                        return (
                          <>
                            <div className="flex flex-wrap items-center justify-between gap-2 p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-black text-amber-900">
                                  📅 {todayLunch.dateStr}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 bg-white px-3 py-1 rounded-xl border border-amber-200 shadow-2xs">
                                  {todayDishes.length} Çeşit Yemek
                                </span>
                                <span className="text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100/90 px-3 py-1 rounded-xl border border-emerald-300 shadow-2xs flex items-center gap-1">
                                  <span>🔥</span>
                                  <span>Toplam: {totalCalories} kcal</span>
                                </span>
                              </div>
                            </div>

                            {/* 3D Pixar Yemek Kartları */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {todayDishes.map((dish, idx) => {
                                const cat = getDishCategory(dish);
                                const meta = CATEGORY_META[cat];
                                const calories = getDishCalories(dish);
                                return (
                                  <div
                                    key={idx}
                                    className={`p-4 rounded-2xl bg-white border border-stone-200 ${meta.cardBorder} hover:shadow-md transition-all flex items-center gap-4`}
                                  >
                                    <div className={`p-2.5 rounded-2xl border flex-shrink-0 ${meta.iconBox}`}>
                                      {getPixarIconByCategory(cat)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-2 mb-1">
                                        <span
                                          className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md border shadow-2xs ${meta.badgeClass}`}
                                        >
                                          {meta.label}
                                        </span>
                                        <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                                          <span>🔥</span>
                                          <span>{calories} kcal</span>
                                        </span>
                                      </div>
                                      <h4 className="font-black text-stone-900 text-sm sm:text-base leading-snug">
                                        {dish}
                                      </h4>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        );
                      })()}

                      {/* Özet Menü Satırı */}
                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 font-medium flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-stone-800">Menü Özeti: </span>
                          {todayLunch.mealText}
                        </div>
                        <div className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 whitespace-nowrap self-start sm:self-auto">
                          Sağlıklı & Dengeli Tabldot Öğünü
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* 2. AYLIK LİSTE GÖRÜNÜMÜ (KULLANICI TABLOSU - PAZAR GÜNLERİ YOK) */}
              {!loading && !error && activeModal === 'monthly' && monthlyPlan && (
                <div className="space-y-4">
                  {/* Arama ve Filtreleme */}
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Menüde veya günde ara... (örn: Çorba, Salı, Tavuk)"
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-amber-500 bg-stone-50/50"
                      />
                      <span className="absolute left-3.5 top-2.5 text-stone-400 text-sm">🔍</span>
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <span className="text-xs font-bold text-stone-500 self-center">
                      Toplam {filteredEntries.length} Gün
                    </span>
                  </div>

                  {/* Kategori Renk Rehberi */}
                  <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-stone-50 rounded-xl border border-stone-200/80 text-[11px] font-extrabold">
                    <span className="text-stone-400 font-bold mr-1 text-[10px] uppercase tracking-wider">Kategoriler:</span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">🥣 Çorba</span>
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-950 border border-rose-300">🍲 Ana Yemek</span>
                    <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-950 border border-orange-300">🍚 Yan Yemek</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-950 border border-emerald-300">🥗 Salata / Meze</span>
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-950 border border-purple-300">🍮 Tatlı / Meyve</span>
                    <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-950 border border-sky-300">🥤 İçecek</span>
                  </div>

                  {/* Aylık Liste Tablosu */}
                  <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto max-h-[55vh]">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <thead className="sticky top-0 z-10 bg-amber-500 text-white font-black uppercase text-[11px] tracking-wider shadow-xs">
                          <tr>
                            <th className="py-3 px-4 border-r border-amber-400/60 w-36 sm:w-48 whitespace-nowrap">
                              TARİH
                            </th>
                            <th className="py-3 px-4">
                              ÖĞLE YEMEĞİ
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 bg-white font-medium text-stone-800">
                          {filteredEntries.map((entry) => {
                            const now = new Date();
                            const entryDate = new Date(entry.date);
                            const isToday =
                              (todayLunch?.id && entry.id === todayLunch.id) ||
                              (!isNaN(entryDate.getTime()) &&
                               entryDate.getDate() === now.getDate() &&
                               entryDate.getMonth() === now.getMonth() &&
                               entryDate.getFullYear() === now.getFullYear());
                            const entryDishes = parseDishes(entry.items, entry.mealText);
                            const dayTotalCalories = entryDishes.reduce((sum, d) => sum + getDishCalories(d), 0);

                            return (
                              <tr
                                key={entry.id}
                                className={`transition-colors hover:bg-amber-50/40 ${
                                  isToday ? 'bg-amber-100/60 font-bold border-l-4 border-l-amber-500' : ''
                                }`}
                              >
                                <td className="py-3 px-4 align-top font-bold text-stone-900 border-r border-stone-100 whitespace-nowrap">
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5">
                                      <span>{entry.dateStr}</span>
                                      {isToday && (
                                        <span className="text-[10px] bg-amber-500 text-white font-black px-1.5 py-0.5 rounded-md uppercase">
                                          Bugün
                                        </span>
                                      )}
                                    </div>
                                    {dayTotalCalories > 0 && (
                                      <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md w-fit flex items-center gap-1">
                                        <span>🔥</span>
                                        <span>{dayTotalCalories} kcal</span>
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-4 align-top">
                                  <div className="space-y-1.5">
                                    <div className="text-stone-900 leading-relaxed font-semibold">
                                      {entry.mealText}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                                      {entryDishes.map((item, i) => {
                                        const cat = getDishCategory(item);
                                        const meta = CATEGORY_META[cat];
                                        const cal = getDishCalories(item);
                                        return (
                                          <span
                                            key={i}
                                            className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border shadow-2xs ${meta.badgeClass}`}
                                          >
                                            <span>{item}</span>
                                            <span className="opacity-80 font-black">({cal} kcal)</span>
                                          </span>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-stone-100 bg-stone-50/70 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
                <span>✨</span>
                <span>Aylık Öğle Yemeği Menüsü</span>
              </span>

              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
