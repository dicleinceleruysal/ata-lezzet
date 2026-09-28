'use client';

import React, { useState, useEffect } from 'react';

interface DishStarRatingProps {
  dishName: string;
  dateStr?: string;
  isFuture?: boolean;
  initialAverage?: number;
  initialCount?: number;
  initialUserScore?: number | null;
  onRatingUpdated?: (dishName: string, average: number, count: number, userScore: number) => void;
  className?: string;
}

export default function DishStarRating({
  dishName,
  dateStr,
  isFuture = false,
  initialAverage = 0,
  initialCount = 0,
  initialUserScore = null,
  onRatingUpdated,
  className = '',
}: DishStarRatingProps) {
  const [average, setAverage] = useState<number>(initialAverage);
  const [count, setCount] = useState<number>(initialCount);
  const [userScore, setUserScore] = useState<number | null>(initialUserScore);
  const [hoverScore, setHoverScore] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Senkronize et
  useEffect(() => {
    setAverage(initialAverage);
    setCount(initialCount);
    setUserScore(initialUserScore);
  }, [initialAverage, initialCount, initialUserScore]);

  // Tekil kullanıcı ID'si
  const getUserId = (): string => {
    if (typeof window === 'undefined') return '';
    let id = localStorage.getItem('ata_dish_rater_id');
    if (!id) {
      id = 'user_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      localStorage.setItem('ata_dish_rater_id', id);
    }
    return id;
  };

  const handleRate = async (star: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Kart tıklaması (modal açma) ile çakışmasın
    if (isSubmitting || isFuture) return;

    const previousUserScore = userScore;
    const previousAverage = average;
    const previousCount = count;

    // Optimistik güncelleme
    setUserScore(star);
    setIsSubmitting(true);
    setFeedback('Kaydediliyor...');

    try {
      const userId = getUserId();
      const res = await fetch('/api/ratings/dish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dishName,
          score: star,
          dateStr,
          userId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Puan kaydedilemedi');
      }

      setAverage(data.average);
      setCount(data.count);
      setUserScore(data.userScore);
      setFeedback('Oyunuz alındı! ⭐');
      setTimeout(() => setFeedback(null), 2500);

      if (onRatingUpdated) {
        onRatingUpdated(dishName, data.average, data.count, data.userScore);
      }
    } catch {
      // Hata durumunda geri al
      setUserScore(previousUserScore);
      setAverage(previousAverage);
      setCount(previousCount);
      setFeedback('Hata oluştu');
      setTimeout(() => setFeedback(null), 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayScore = hoverScore !== null ? hoverScore : userScore !== null ? userScore : Math.round(average);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex flex-col gap-1 select-none ${className}`}
    >
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* 5 Yıldız Grubu */}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= displayScore;
            return (
              <button
                key={star}
                type="button"
                disabled={isSubmitting || isFuture}
                onClick={(e) => handleRate(star, e)}
                onMouseEnter={() => !isFuture && setHoverScore(star)}
                onMouseLeave={() => !isFuture && setHoverScore(null)}
                title={
                  isFuture
                    ? 'Gelecekteki yemekler günü geldiğinde puanlanabilir'
                    : `${dishName} için ${star} Yıldız Ver`
                }
                className={`p-1 rounded-md transition-transform ${
                  isFuture
                    ? 'cursor-not-allowed opacity-65'
                    : 'hover:scale-125 active:scale-95 cursor-pointer disabled:cursor-wait'
                } ${
                  isFilled
                    ? 'text-amber-400 drop-shadow-[0_1px_2px_rgba(245,158,11,0.4)]'
                    : 'text-stone-300 hover:text-amber-200'
                }`}
              >
                <svg
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </button>
            );
          })}
        </div>

        {/* Ortalama ve Oy Sayısı */}
        <div className="flex items-center gap-1 text-[11px] font-bold">
          {count > 0 ? (
            <span className="text-amber-900 bg-amber-50/80 border border-amber-200/60 px-1.5 py-0.5 rounded-md">
              ⭐ {average.toFixed(1)}{' '}
              <span className="text-[10px] text-stone-500 font-medium">({count})</span>
            </span>
          ) : !isFuture ? (
            <span className="text-[10px] text-stone-400 font-semibold italic">
              İlk puanı ver
            </span>
          ) : null}

          {isFuture ? (
            <span className="text-[10px] text-stone-400 font-semibold italic flex items-center gap-0.5">
              <span>🔒</span>
              <span>Gününde oylanır</span>
            </span>
          ) : userScore !== null ? (
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1 py-0.5 rounded-md">
              Oyunuz: {userScore}★
            </span>
          ) : null}
        </div>
      </div>

      {/* Geri Bildirim Mesajı */}
      {feedback && (
        <span className="text-[10px] font-extrabold text-amber-700 animate-fadeIn">
          {feedback}
        </span>
      )}
    </div>
  );
}
