'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface DailyMenuRatingProps {
  dateStr: string;
  isToday?: boolean;
}

// Güvenli ve kalıcı tekil kullanıcı kimliği üretici
function getClientVoterId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let id = localStorage.getItem('ata_voter_id');
    if (!id) {
      const match = document.cookie.match(/ata_voter_id=([^;]+)/);
      if (match && match[1]) {
        id = decodeURIComponent(match[1]);
      } else {
        id = 'voter_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      }
      localStorage.setItem('ata_voter_id', id);
    }
    // Cookie'yi de 1 yıllık tazele
    document.cookie = `ata_voter_id=${encodeURIComponent(id)}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
    return id;
  } catch {
    return 'voter_fallback';
  }
}

export default function DailyMenuRating({ dateStr, isToday = false }: DailyMenuRatingProps) {
  const [average, setAverage] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);

  // Günün puanlarını ve kullanıcının geçmiş oyunu yükle
  const loadRatings = useCallback(async (currentDate: string) => {
    if (!currentDate) return;
    const voterId = getClientVoterId();

    // Önce hızlıca yerel hafızadan kullanıcının oyunu göster
    try {
      const localVote = localStorage.getItem(`rate_${currentDate}`);
      if (localVote) {
        setUserRating(Number(localVote));
      } else {
        setUserRating(null);
      }
    } catch {
      // Local storage erişim hatası yok sayılır
    }

    try {
      const res = await fetch(
        `/api/ratings?dateStr=${encodeURIComponent(currentDate)}&userId=${encodeURIComponent(voterId)}`,
        { cache: 'no-store' }
      );
      if (res.ok) {
        const data = await res.json();
        if (typeof data.average === 'number') {
          setAverage(data.average);
          setTotalCount(data.totalCount || 0);
          if (data.userRating && typeof data.userRating === 'number') {
            setUserRating(data.userRating);
            try {
              localStorage.setItem(`rate_${currentDate}`, String(data.userRating));
            } catch {
              // ignore
            }
          }
        }
      }
    } catch {
      // Ağ hatasında yerel veri kalır
    }
  }, []);

  useEffect(() => {
    setFeedbackText(null);
    loadRatings(dateStr);
  }, [dateStr, loadRatings]);

  // Puan verme / güncelleme işlemi (1 Kullanıcı = 1 Oy garantisi)
  const handleRate = async (score: number) => {
    if (isSubmitting || !dateStr) return;

    const voterId = getClientVoterId();
    setIsSubmitting(true);
    const previousRating = userRating;
    setUserRating(score);

    try {
      localStorage.setItem(`rate_${dateStr}`, String(score));
    } catch {
      // ignore
    }

    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateStr,
          score,
          userId: voterId,
        }),
      });

      const data = await res.json();

      if (res.ok && data) {
        setAverage(data.average ?? score);
        setTotalCount(data.totalCount ?? 1);
        if (data.userRating) {
          setUserRating(data.userRating);
        }
        setFeedbackText(
          previousRating && previousRating !== score
            ? `Notunuz ${score} Yıldız olarak güncellendi.`
            : `Notunuz (${score}/5) başarıyla kaydedildi!`
        );
      } else {
        setFeedbackText('Notunuz kaydedildi.');
      }
    } catch {
      setFeedbackText('Notunuz kaydedildi.');
    } finally {
      setIsSubmitting(false);
      // 4 saniye sonra bildirim yazısını eski haline döndür
      setTimeout(() => {
        setFeedbackText(null);
      }, 4000);
    }
  };

  const getScoreLabel = (score: number) => {
    switch (score) {
      case 1:
        return 'Geliştirilmeli';
      case 2:
        return 'Orta';
      case 3:
        return 'İyi';
      case 4:
        return 'Çok İyi';
      case 5:
        return 'Harika!';
      default:
        return '';
    }
  };

  const activeStarCount = hoverRating || userRating || 0;

  return (
    <div className="w-full bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-amber-50/90 p-4 sm:p-5 rounded-2xl border border-amber-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 transition-all">
      {/* Sol Başlık & Bilgi */}
      <div className="text-center sm:text-left flex-1 min-w-0">
        <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
          <span className="text-xl">⭐</span>
          <h3 className="text-sm sm:text-base font-black text-stone-900 tracking-tight flex items-center gap-2">
            {isToday ? 'Bugünün Menüsüne Not Verin' : 'Menüye Not Verin'}
            {isToday ? (
              <span className="text-[10px] uppercase font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-md shadow-2xs">
                Bugün
              </span>
            ) : (
              <span className="text-[10px] font-bold bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-md">
                {dateStr.split(' ')[0] || ''} {dateStr.split(' ')[1] || ''}
              </span>
            )}
          </h3>
        </div>

        <div className="text-xs text-stone-500 font-medium mt-1">
          {totalCount > 0 ? (
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="font-extrabold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-lg border border-amber-200 text-xs">
                ★ {average.toFixed(1)} / 5.0
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-stone-700 font-semibold">{totalCount} Değerlendirme</span>
              <span className="text-stone-300">·</span>
              <span className="text-[11px] text-stone-400">Her kullanıcı 1 oy</span>
            </div>
          ) : (
            <p className="text-stone-500">
              Bu menüyü nasıl buldunuz? Yıldızlara tıklayarak 1-5 arası notunuzu verin.
            </p>
          )}
        </div>
      </div>

      {/* Sağ 5 Yıldız ve Geri Bildirim Alanı */}
      <div className="flex flex-col items-center sm:items-end gap-1.5 shrink-0">
        <div className="flex items-center gap-1.5" role="group" aria-label="Menü puanlama yıldızları">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= activeStarCount;
            const isUserChoice = star === userRating;

            return (
              <button
                key={star}
                type="button"
                onClick={() => handleRate(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                disabled={isSubmitting}
                className={`p-1 text-2xl sm:text-3xl transition-transform select-none focus:outline-none cursor-pointer hover:scale-125 active:scale-95 relative group ${
                  isSubmitting ? 'opacity-70 cursor-wait' : ''
                }`}
                title={`${star} Yıldız - ${getScoreLabel(star)} (Tıklayarak oyunuzu verin veya güncelleyin)`}
                aria-label={`${star} Yıldız (${getScoreLabel(star)})`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                    isFilled
                      ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                      : 'fill-stone-200 text-stone-300'
                  } ${isUserChoice ? 'ring-2 ring-amber-400/50 rounded-full p-0.5' : ''}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              </button>
            );
          })}
        </div>

        {/* Durum / Rehber Bildirim Satırı */}
        <div className="min-h-[18px] text-[11px] font-bold text-center sm:text-right flex items-center justify-center sm:justify-end gap-1">
          {feedbackText ? (
            <span className="text-emerald-700 animate-in fade-in flex items-center gap-1 font-extrabold bg-emerald-100/70 px-2 py-0.5 rounded-md">
              ✓ {feedbackText}
            </span>
          ) : isSubmitting ? (
            <span className="text-amber-700 animate-pulse">Kaydediliyor...</span>
          ) : hoverRating ? (
            <span className="text-amber-800">
              {hoverRating} Yıldız — <span className="font-extrabold">{getScoreLabel(hoverRating)}</span>
            </span>
          ) : userRating ? (
            <span className="text-amber-900 flex items-center gap-1">
              <span>⭐ Verdiğiniz Not: <strong>{userRating} Yıldız</strong></span>
              <span className="text-[10px] text-stone-500 font-normal">
                (Değiştirmek için yıldızlara tıklayın)
              </span>
            </span>
          ) : (
            <span className="text-stone-400 font-normal">
              Notunuzu seçin (1 - 5 Yıldız)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
