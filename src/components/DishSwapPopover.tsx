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

interface DishSwapPopoverProps {
  isOpen: boolean;
  anchorRect: DOMRect | null;
  currentDish: string;
  availableMeals: MealOption[];
  onSelect: (newDishName: string) => void;
  onClose: () => void;
}

export default function DishSwapPopover({
  isOpen,
  anchorRect,
  currentDish,
  availableMeals,
  onSelect,
  onClose,
}: DishSwapPopoverProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [coords, setCoords] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 360,
  });

  const popoverRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Mevcut yemeğin kategorisini tespit et ve varsayılan filtre yap
  useEffect(() => {
    if (isOpen && currentDish) {
      setSearch('');
      const norm = normalizeVisualName(currentDish);
      const matchedMeal = availableMeals.find(
        (m) => normalizeVisualName(m.name) === norm
      );

      if (matchedMeal) {
        setSelectedCategory(matchedMeal.category);
      } else if (norm.includes('corba')) {
        setSelectedCategory('corba');
      } else if (norm.includes('pilav') || norm.includes('makarna') || norm.includes('borek')) {
        setSelectedCategory('yan_yemek');
      } else if (norm.includes('tatli') || norm.includes('pasta') || norm.includes('kek') || norm.includes('baklava')) {
        setSelectedCategory('tatli');
      } else if (norm.includes('salata') || norm.includes('cacik')) {
        setSelectedCategory('salata');
      } else {
        setSelectedCategory('all');
      }
    }
  }, [isOpen, currentDish, availableMeals]);

  // Konum hesaplama (Ekran dışına taşmaması için hassas ayar)
  useEffect(() => {
    if (!isOpen || !anchorRect) return;

    const popoverWidth = Math.min(380, window.innerWidth - 24);
    let left = anchorRect.left;

    // Sağa taşmayı engelle
    if (left + popoverWidth > window.innerWidth - 12) {
      left = window.innerWidth - popoverWidth - 12;
    }
    if (left < 12) left = 12;

    let top = anchorRect.bottom + 6;
    const estimatedHeight = 440;

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

  // Filtrelenmiş yemekler listesi
  const filteredMeals = useMemo(() => {
    const normSearch = normalizeVisualName(search);
    return availableMeals.filter((m) => {
      const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
      if (!matchesCat) return false;

      if (!normSearch) return true;
      const normName = normalizeVisualName(m.name);
      return normName.includes(normSearch);
    });
  }, [availableMeals, search, selectedCategory]);

  if (!isOpen || !anchorRect) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Şeffaf Tıklama Engelleyici */}
      <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-2xs pointer-events-auto transition-opacity" />

      {/* Popover Penceresi */}
      <div
        ref={popoverRef}
        style={{
          top: `${coords.top}px`,
          left: `${coords.left}px`,
          width: `${coords.width}px`,
        }}
        className="fixed z-50 pointer-events-auto bg-white rounded-2xl shadow-2xl border border-stone-200 text-stone-800 flex flex-col max-h-[460px] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Başlık ve Değiştirilen Yemek Bilgisi */}
        <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-stone-200 flex items-center justify-between">
          <div className="min-w-0 flex-1 mr-2">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-800">
              <span>🔄</span>
              <span>Yemek Değiştir</span>
            </div>
            <p className="text-xs font-black text-stone-900 truncate mt-0.5" title={currentDish}>
              Mevcut: <span className="text-amber-700 bg-amber-100/70 px-1.5 py-0.5 rounded-md">{currentDish}</span>
            </p>
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

        {/* Arama Kutusu */}
        <div className="p-3 border-b border-stone-100 bg-white">
          <div className="relative flex items-center">
            <span className="absolute left-3 text-stone-400 text-sm pointer-events-none">🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Yemek ara... (örn: Köfte, Çorba, Pilav)"
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

          {/* Kategori Filtre Hapları */}
          <div className="flex gap-1 overflow-x-auto pt-2 pb-0.5 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 flex-shrink-0 ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'bg-stone-100 hover:bg-stone-200/80 text-stone-600'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Yemek Listesi */}
        <div className="overflow-y-auto flex-1 p-2 divide-y divide-stone-100/80">
          {filteredMeals.length === 0 ? (
            <div className="py-8 px-4 text-center space-y-2">
              <span className="text-2xl">🔍</span>
              <p className="text-xs font-bold text-stone-500">
                &quot;{search}&quot; ile eşleşen kayıtlı yemek bulunamadı.
              </p>
              {search.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onSelect(search.trim());
                    onClose();
                  }}
                  className="mt-2 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1"
                >
                  <span>✨</span>
                  <span>Bu isimle değiştir: &quot;{search.trim()}&quot;</span>
                </button>
              )}
            </div>
          ) : (
            filteredMeals.map((meal) => {
              const isCurrent = normalizeVisualName(meal.name) === normalizeVisualName(currentDish);
              const imgUrl = getDishImageUrl(meal.name, meal.category, meal.imageUrl);
              const cal = meal.calories ?? getMealCalories(meal.name, meal.category);
              const tagColor = CATEGORY_TAG_COLORS[meal.category] || 'bg-stone-100 text-stone-800';

              return (
                <button
                  key={meal.id || meal.name}
                  type="button"
                  onClick={() => {
                    onSelect(meal.name);
                    onClose();
                  }}
                  className={`w-full p-2 rounded-xl flex items-center gap-2.5 transition-all text-left group cursor-pointer ${
                    isCurrent
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

                  {/* Seçim Aksiyonu */}
                  <span className="text-stone-300 group-hover:text-amber-600 font-black text-xs transition-colors flex-shrink-0 px-1">
                    ↳
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Alt Bilgi */}
        <div className="px-3 py-2 bg-stone-50 border-t border-stone-200 text-[11px] text-stone-400 flex items-center justify-between font-medium">
          <span>Toplam {filteredMeals.length} yemek listeleniyor</span>
          <span className="text-[10px]">Seçmek için yemeğe tıklayın</span>
        </div>
      </div>
    </div>
  );
}
