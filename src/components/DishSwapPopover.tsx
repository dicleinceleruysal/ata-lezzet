'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getDishImageUrl, normalizeVisualName } from '@/lib/dishVisuals';
import { getMealCalories } from '@/lib/mealCalories';

export interface MealOption {
  id?: string;
  name: string;
  category: string;
  calories?: number | null;
  imageUrl?: string | null;
}

const CATEGORIES = [
  { key: 'all', label: 'Tümü', icon: '🍽️' },
  { key: 'corba', label: 'Çorba', icon: '🍲' },
  { key: 'ana_yemek', label: 'Ana Yemek', icon: '🥩' },
  { key: 'yan_yemek', label: 'Yan Yemek', icon: '🍚' },
  { key: 'salata', label: 'Salata', icon: '🥗' },
  { key: 'tatli', label: 'Tatlı', icon: '🍮' },
  { key: 'icecek', label: 'İçecek', icon: '🥤' },
];

const CATEGORY_TAG_COLORS: Record<string, string> = {
  corba: 'bg-amber-100 text-amber-900 border-amber-200',
  ana_yemek: 'bg-rose-100 text-rose-900 border-rose-200',
  yan_yemek: 'bg-orange-100 text-orange-900 border-orange-200',
  salata: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  tatli: 'bg-purple-100 text-purple-900 border-purple-200',
  icecek: 'bg-sky-100 text-sky-900 border-sky-200',
};

const CATEGORY_NAMES: Record<string, string> = {
  corba: 'Çorba',
  ana_yemek: 'Ana Yemek',
  yan_yemek: 'Yan Yemek (Pilav/Makarna/Börek)',
  salata: 'Salata / Meze',
  tatli: 'Tatlı',
  icecek: 'İçecek',
};

function autoDetectCategory(dishName: string): string {
  if (!dishName) return 'ana_yemek';
  const norm = normalizeVisualName(dishName);

  if (
    norm.includes('corba') ||
    norm.includes('mercimek') ||
    norm.includes('ezogelin') ||
    norm.includes('tarhana') ||
    norm.includes('yayla') ||
    norm.includes('sehriye') ||
    norm.includes('kelle paca') ||
    norm.includes('iskembe') ||
    norm.includes('dugun')
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
    norm.includes('ekler')
  ) {
    return 'tatli';
  }

  return 'ana_yemek';
}

interface DishSwapPopoverProps {
  isOpen: boolean;
  anchorRect: DOMRect | null;
  mode?: 'swap' | 'add';
  title?: string;
  currentDish?: string;
  currentDishes?: string[];
  availableMeals: MealOption[];
  onSelect: (dishName: string) => void;
  onClose: () => void;
  onMealCreated?: (newMeal: MealOption) => void;
}

export default function DishSwapPopover({
  isOpen,
  anchorRect,
  mode = 'swap',
  title,
  currentDish = '',
  currentDishes = [],
  availableMeals,
  onSelect,
  onClose,
  onMealCreated,
}: DishSwapPopoverProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [quickCategory, setQuickCategory] = useState<string>('ana_yemek');
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [quickAddFeedback, setQuickAddFeedback] = useState<string | null>(null);

  const [coords, setCoords] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 380,
  });

  const popoverRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const prevIsOpenRef = useRef<boolean>(false);

  // Popover açıldığında kategori ve aramayı sıfırlama (availableMeals güncellendiğinde sıfırlanmaz!)
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setSearch('');
      setQuickAddFeedback(null);

      if (mode === 'swap' && currentDish) {
        const norm = normalizeVisualName(currentDish);
        const matchedMeal = availableMeals.find(
          (m) => normalizeVisualName(m.name) === norm
        );

        if (matchedMeal) {
          setSelectedCategory(matchedMeal.category);
          setQuickCategory(matchedMeal.category);
        } else {
          const detected = autoDetectCategory(currentDish);
          setSelectedCategory(detected);
          setQuickCategory(detected);
        }
      } else {
        setSelectedCategory('all');
        setQuickCategory('ana_yemek');
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, mode, currentDish, availableMeals]);

  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Mobil ekran tespiti
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Konum hesaplama (Ekran dışına taşmaması için hassas ayar)
  useEffect(() => {
    if (!isOpen || !anchorRect) return;

    if (window.innerWidth < 640) {
      setIsMobile(true);
      return;
    }
    setIsMobile(false);

    const popoverWidth = Math.min(410, window.innerWidth - 24);
    let left = anchorRect.left;

    // Sağa taşmayı engelle
    if (left + popoverWidth > window.innerWidth - 12) {
      left = window.innerWidth - popoverWidth - 12;
    }
    if (left < 12) left = 12;

    let top = anchorRect.bottom + 6;
    const estimatedHeight = 510;

    // Aşağıya taşmayı engelle, gerekirse butonun üstüne aç
    if (top + estimatedHeight > window.innerHeight && anchorRect.top > estimatedHeight + 10) {
      top = anchorRect.top - estimatedHeight - 6;
    }

    setCoords({ top, left, width: popoverWidth });

    // Otomatik odaklama
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen, anchorRect]);

  // Dışarı tıklama veya Escape ile kapatma
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isOpen, onClose]);

  // Arama metni değiştiğinde otomatik kategori önerisi
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setQuickAddFeedback(null);
    if (val.trim()) {
      setQuickCategory(autoDetectCategory(val));
    }
  };

  // Filtreleme mantığı
  const normSearch = useMemo(() => normalizeVisualName(search), [search]);

  // Tüm veritabanında arama ile eşleşenler
  const allMatchingMeals = useMemo(() => {
    if (!normSearch) return availableMeals;
    return availableMeals.filter((m) => normalizeVisualName(m.name).includes(normSearch));
  }, [availableMeals, normSearch]);

  // Tam eşleşen yemek var mı?
  const exactMatch = useMemo(() => {
    if (!normSearch) return null;
    return availableMeals.find((m) => normalizeVisualName(m.name) === normSearch);
  }, [availableMeals, normSearch]);

  // Seçili kategoriye göre filtrelenmiş yemekler
  const filteredMeals = useMemo(() => {
    if (selectedCategory === 'all') return allMatchingMeals;
    return allMatchingMeals.filter((m) => m.category === selectedCategory);
  }, [allMatchingMeals, selectedCategory]);

  // Diğer kategorilerdeki eşleşme sayısı
  const otherCategoryMatchesCount = useMemo(() => {
    if (selectedCategory === 'all' || !normSearch) return 0;
    return allMatchingMeals.length - filteredMeals.length;
  }, [selectedCategory, normSearch, allMatchingMeals.length, filteredMeals.length]);

  // O anda veritabanına yeni yemek ekleme ve menüye dahil etme
  const handleQuickAddAndSelect = async () => {
    const trimmed = search.trim();
    if (!trimmed) return;

    setIsAddingMeal(true);
    setQuickAddFeedback(null);

    try {
      const formattedName = trimmed.toLocaleUpperCase('tr-TR');
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formattedName,
          category: quickCategory,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Yemek veritabanına eklenemedi.');
      }

      const data = await res.json();
      const newMeal: MealOption = data.meal;

      if (onMealCreated) {
        onMealCreated(newMeal);
      }

      onSelect(newMeal.name);

      if (mode === 'swap') {
        onClose();
      } else {
        setSearch('');
      }
    } catch (err: unknown) {
      setQuickAddFeedback(err instanceof Error ? err.message : 'Yemek eklenirken bir hata oluştu.');
    } finally {
      setIsAddingMeal(false);
    }
  };

  if (!isOpen || !anchorRect) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Şeffaf Tıklama Engelleyici Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/40 backdrop-blur-2xs pointer-events-auto transition-opacity" 
      />

      {/* Popover Penceresi (Mobilde Alttan Açılan Sheet, Masaüstünde Konumlu Popover) */}
      <div
        ref={popoverRef}
        style={
          isMobile
            ? undefined
            : {
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                width: `${coords.width}px`,
              }
        }
        className={`fixed z-50 pointer-events-auto bg-white text-stone-800 flex flex-col overflow-hidden shadow-2xl border border-stone-200 transition-all ${
          isMobile
            ? 'inset-x-0 bottom-0 max-h-[88vh] rounded-t-3xl rounded-b-none border-t border-stone-300 animate-in slide-in-from-bottom duration-200 pb-safe'
            : 'rounded-2xl max-h-[520px] animate-in fade-in zoom-in-95 duration-150'
        }`}
      >
        {/* Mobilde Tutma Çubuğu (Drag Handle) */}
        {isMobile && (
          <div className="pt-2.5 pb-1 flex justify-center bg-stone-50 border-b border-stone-100">
            <div className="w-12 h-1.5 bg-stone-300 rounded-full" />
          </div>
        )}

        {/* Başlık Bölümü */}
        <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-stone-200 flex items-center justify-between">
          <div className="min-w-0 flex-1 mr-2">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-800">
              <span>{mode === 'add' ? '➕' : '🔄'}</span>
              <span>{mode === 'add' ? 'Güne Yemek Ekle' : 'Yemek Değiştir'}</span>
            </div>

            {mode === 'swap' && currentDish && (
              <p className="text-xs font-black text-stone-900 truncate mt-0.5" title={currentDish}>
                Mevcut: <span className="text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded-md">{currentDish}</span>
              </p>
            )}

            {mode === 'add' && title && (
              <p className="text-xs font-black text-stone-900 truncate mt-0.5" title={title}>
                {title}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/80 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center font-bold text-xs transition-colors cursor-pointer border border-stone-200 shadow-2xs"
            title="Kapat (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Arama Kutusu ve Kategori Filtreleri */}
        <div className="p-3 border-b border-stone-100 bg-white space-y-2">
          <div className="relative flex items-center">
            <span className="absolute left-3 text-stone-400 text-sm pointer-events-none">🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Yemek ara veya yeni yemek yaz... (örn: Köfte, Çorba, Pilav)"
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 text-stone-400 hover:text-stone-700 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full hover:bg-stone-200/60 transition-colors cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Kategori Filtre Hapları (Arama Yapıldığında Dinamik Sonuç Sayılarıyla) */}
          <div className="flex gap-1 overflow-x-auto pt-0.5 pb-0.5 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.key;
              const count = normSearch
                ? cat.key === 'all'
                  ? allMatchingMeals.length
                  : allMatchingMeals.filter((m) => m.category === cat.key).length
                : cat.key === 'all'
                ? availableMeals.length
                : availableMeals.filter((m) => m.category === cat.key).length;

              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 flex-shrink-0 ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'bg-stone-100 hover:bg-stone-200/80 text-stone-600'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Diğer Kategorilerde Eşleşme Bildirimi */}
        {selectedCategory !== 'all' && otherCategoryMatchesCount > 0 && (
          <div className="px-3 py-1.5 bg-amber-50/90 border-b border-amber-200 flex items-center justify-between text-xs text-amber-900">
            <span className="truncate">
              💡 Diğer kategorilerde <strong>{otherCategoryMatchesCount}</strong> yemek bulundu.
            </span>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="text-[11px] font-black text-amber-700 hover:text-amber-900 underline whitespace-nowrap ml-2 cursor-pointer"
            >
              Tümünü Göster ({allMatchingMeals.length})
            </button>
          </div>
        )}

        {/* Tam Eşleşen Yemek Başka Bir Kategorideyse Doğrudan Ekle Kartı */}
        {exactMatch && selectedCategory !== 'all' && exactMatch.category !== selectedCategory && (
          <div className="m-2 p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between gap-2 shadow-2xs">
            <div className="min-w-0 flex-1">
              <span className="text-xs font-black text-emerald-950 block truncate">
                ✓ &quot;{exactMatch.name}&quot; veritabanında mevcut!
              </span>
              <span className="text-[10px] text-emerald-700 font-bold">
                Kategori: {CATEGORY_NAMES[exactMatch.category] || exactMatch.category}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onSelect(exactMatch.name);
                if (mode === 'swap') onClose();
              }}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
            >
              {mode === 'add' ? '+ Menüye Ekle' : '↳ Bununla Değiştir'}
            </button>
          </div>
        )}

        {/* ANINDA VERİTABANINA YENİ YEMEK EKLEME KARTI (Arama yapıldığında tam eşleşme yoksa görünür) */}
        {search.trim().length > 0 && !exactMatch && (
          <div className="m-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl space-y-2 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-black text-amber-950 truncate">
                  &quot;{search.trim().toLocaleUpperCase('tr-TR')}&quot; Veritabanında Yok!
                </h4>
                <p className="text-[11px] text-amber-800">
                  Veritabanına kaydedip bu güne ekleyebilirsiniz:
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <select
                value={quickCategory}
                onChange={(e) => setQuickCategory(e.target.value)}
                className="px-2 py-1 rounded-lg border border-amber-400 text-xs font-bold bg-white text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="corba">🍲 Kategori: Çorba</option>
                <option value="ana_yemek">🥩 Kategori: Ana Yemek</option>
                <option value="yan_yemek">🍚 Kategori: Yan Yemek</option>
                <option value="salata">🥗 Kategori: Salata / Meze</option>
                <option value="tatli">🍮 Kategori: Tatlı</option>
                <option value="icecek">🥤 Kategori: İçecek</option>
              </select>

              <button
                type="button"
                onClick={handleQuickAddAndSelect}
                disabled={isAddingMeal}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50 inline-flex items-center gap-1 whitespace-nowrap"
              >
                <span>{isAddingMeal ? '⏳ Ekleniyor...' : '➕ Veritabanına Ekle ve Seç'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelect(search.trim().toLocaleUpperCase('tr-TR'));
                  if (mode === 'swap') onClose();
                }}
                className="px-2 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                title="Sadece bu günün metnine ekler, veritabanına kaydetmez"
              >
                Sadece Metin Olarak Ekle
              </button>
            </div>

            {quickAddFeedback && (
              <p className="text-[11px] font-bold text-rose-600">{quickAddFeedback}</p>
            )}
          </div>
        )}

        {/* Yemek Listesi */}
        <div className="overflow-y-auto flex-1 p-2 divide-y divide-stone-100/80">
          {filteredMeals.length === 0 ? (
            <div className="py-8 px-4 text-center space-y-2">
              <span className="text-2xl">🍽️</span>
              <p className="text-xs font-bold text-stone-500">
                {search.trim()
                  ? `"${search}" ile eşleşen yemek bulunamadı.`
                  : 'Bu kategoride henüz yemek bulunmuyor.'}
              </p>
              {otherCategoryMatchesCount > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="mt-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1"
                >
                  <span>🔍</span>
                  <span>Diğer Kategorilerdeki {otherCategoryMatchesCount} Sonucu Göster</span>
                </button>
              )}
            </div>
          ) : (
            filteredMeals.map((meal) => {
              const isCurrent =
                mode === 'swap' &&
                normalizeVisualName(meal.name) === normalizeVisualName(currentDish);

              const isAlreadyInMenu =
                mode === 'add' &&
                currentDishes.some(
                  (d) => normalizeVisualName(d) === normalizeVisualName(meal.name)
                );

              const imgUrl = getDishImageUrl(meal.name, meal.category, meal.imageUrl);
              const cal = meal.calories ?? getMealCalories(meal.name, meal.category);
              const tagColor = CATEGORY_TAG_COLORS[meal.category] || 'bg-stone-100 text-stone-800';

              return (
                <button
                  key={meal.id || meal.name}
                  type="button"
                  onClick={() => {
                    onSelect(meal.name);
                    if (mode === 'swap') {
                      onClose();
                    }
                  }}
                  className={`w-full p-2 rounded-xl flex items-center gap-2.5 transition-all text-left group cursor-pointer ${
                    isCurrent || isAlreadyInMenu
                      ? 'bg-amber-50/70 border border-amber-200'
                      : 'hover:bg-stone-50 border border-transparent hover:border-stone-200'
                  }`}
                >
                  {/* Görsel Thumbnail */}
                  <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-stone-100 border border-stone-200 shadow-2xs relative">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={meal.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-base text-stone-400">
                        🍲
                      </div>
                    )}
                  </div>

                  {/* Yemek Bilgisi */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-extrabold text-stone-900 group-hover:text-amber-800 truncate">
                        {meal.name}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-sm flex-shrink-0">
                          Şu anki
                        </span>
                      )}
                      {isAlreadyInMenu && (
                        <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-sm flex-shrink-0">
                          ✓ Menüde Ekli
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                      <span className={`px-1.5 py-0.2 rounded-md font-bold border ${tagColor}`}>
                        {CATEGORIES.find((c) => c.key === meal.category)?.label || meal.category}
                      </span>
                      {cal > 0 && (
                        <span className="text-stone-400 font-semibold flex items-center gap-0.5">
                          <span>🔥</span>
                          <span>{cal} kcal</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Seçim Aksiyon Butonu */}
                  <span
                    className={`font-black text-xs transition-colors flex-shrink-0 px-2 py-1 rounded-lg ${
                      mode === 'add'
                        ? isAlreadyInMenu
                          ? 'text-emerald-700 bg-emerald-50 text-[11px]'
                          : 'text-amber-700 bg-amber-100/70 group-hover:bg-amber-200 text-[11px]'
                        : 'text-stone-300 group-hover:text-amber-600'
                    }`}
                  >
                    {mode === 'add' ? (isAlreadyInMenu ? '+ Tekrar Ekle' : '+ Ekle') : '↳ Değiştir'}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Alt Bilgi & Tamamla Butonu */}
        <div className="px-3 py-2 bg-stone-50 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between font-medium">
          <span>{filteredMeals.length} yemek listeleniyor</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
          >
            {mode === 'add' ? '✓ Tamamla' : 'Kapat'}
          </button>
        </div>
      </div>
    </div>
  );
}
