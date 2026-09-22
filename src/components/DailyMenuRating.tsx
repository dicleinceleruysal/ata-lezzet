'use client';

import React, { useState, useEffect } from 'react';

interface DailyMenuRatingProps {
  dateStr: string;
  isToday: boolean;
}

export default function DailyMenuRating({ dateStr, isToday }: DailyMenuRatingProps) {
  const [average, setAverage] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasVotedInSession, setHasVotedInSession] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);

  // Günün puanını ve kullanıcının geçmiş oyunu yükle
  useEffect(() => {
    if (!dateStr) return;

    // Sayfa yenilenene kadar tekrar oy verilmesini engellemek için oturum kontrolü
    const savedVote = localStorage.getItem(`rate_${dateStr}`);
    if (savedVote) {
      setUserRating(Number(savedVote));
      setHasVotedInSession(true);
    } else {
      setUserRating(null);
      setHasVotedInSession(false);
    }
    setFeedbackText(null);

    // Sunucudan ortalama puanı çek
    fetch(`/api/ratings?dateStr=${encodeURIComponent(dateStr)}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.average === 'number') {
          setAverage(data.average);
          setTotalCount(data.totalCount || 0);
        }
      })
      .catch(() => {});
  }, [dateStr]);

  const handleRate = async (score: number) => {
    // Sadece bugün puanlanabilir, işlem devam ederken veya sayfa yenilenmeden tekrar oy verilemez
    if (!isToday || isSubmitting || hasVotedInSession) return;

    setIsSubmitting(true);
    setUserRating(score);
    setHasVotedInSession(true); // Sayfa yenilenmeden tekrar oy verilemez kilidi
    localStorage.setItem(`rate_${dateStr}`, String(score));

    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateStr, score }),
      });

      const data = await res.json();
      if (res.ok && data) {
        setAverage(data.average);
        setTotalCount(data.totalCount);
        setFeedbackText(`Notunuz (${score}/5) başarıyla kaydedildi.`);
      } else {
        setFeedbackText('Notunuz kaydedildi.');
      }
    } catch {
      setFeedbackText('Notunuz kaydedildi.');
    } finally {
      setIsSubmitting(false);
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

  const activeStarCount = (hasVotedInSession ? userRating : (hoverRating || userRating)) || 0;

  // SADECE BUGÜN PUANLANABİLİR KURALI:
  // Eğer incelenen gün bugün değilse:
  if (!isToday) {
    if (totalCount === 0) {
      return null;
    }

    return (
      <div className="w-full bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs text-stone-600 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-amber-500 font-extrabold text-sm">★ {average.toFixed(1)} / 5</span>
          <span className="text-stone-400">·</span>
          <span className="font-semibold text-stone-700">{totalCount} Değerlendirme</span>
        </div>
        <span className="text-[11px] text-stone-400 font-medium">
          🔒 Değerlendirme yalnızca menünün sunulduğu gün yapılabilir
        </span>
      </div>
    );
  }

  // BUGÜN İSE: Puanlama kartı (Sayfa yenilenmeden tekrar oy verilemez)
  return (
    <div className="w-full bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-amber-50/90 p-4 sm:p-5 rounded-2xl border border-amber-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 transition-all">
      {/* Sol Başlık & Bilgi */}
      <div className="text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <span className="text-xl">⭐</span>
          <h3 className="text-sm sm:text-base font-black text-stone-900 tracking-tight flex items-center gap-2">
            Bugünün Menüsüne Not Verin
            <span className="text-[10px] uppercase font-extrabold bg-emerald-500 text-white px-2 py-0.5 rounded-md shadow-2xs">
              Bugün
            </span>
          </h3>
        </div>
        <p className="text-xs text-stone-500 font-medium mt-0.5">
          {totalCount > 0 ? (
            <span className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
              <span className="font-bold text-amber-700">★ {average.toFixed(1)} / 5</span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-600 font-semibold">{totalCount} Değerlendirme</span>
            </span>
          ) : (
            'Bugünkü yemekleri nasıl buldunuz? Yıldızlara tıklayarak notunuzu verin.'
          )}
        </p>
      </div>

      {/* Sağ 5 Yıldız Alanı */}
      <div className="flex flex-col items-center sm:items-end gap-1">
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= activeStarCount;
            const isDisabled = isSubmitting || hasVotedInSession;

            return (
              <button
                key={star}
                type="button"
                onClick={() => handleRate(star)}
                onMouseEnter={() => !hasVotedInSession && setHoverRating(star)}
                onMouseLeave={() => !hasVotedInSession && setHoverRating(null)}
                disabled={isDisabled}
                className={`p-1 text-2xl sm:text-3xl transition-transform select-none focus:outline-none ${
                  isDisabled
                    ? 'cursor-default opacity-95'
                    : 'hover:scale-125 active:scale-90 cursor-pointer'
                }`}
                title={
                  hasVotedInSession
                    ? `Bugünkü notunuz: ${userRating} Yıldız`
                    : `${star} Yıldız - ${getScoreLabel(star)}`
                }
                aria-label={`${star} Yıldız`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                    isFilled
                      ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                      : 'fill-stone-200 text-stone-300'
                  }`}
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

        {/* Durum Bildirimi */}
        <div className="h-4 text-[11px] font-bold text-center sm:text-right">
          {feedbackText ? (
            <span className="text-emerald-700 animate-in fade-in">
              ✨ {feedbackText}
            </span>
          ) : hasVotedInSession ? (
            <span className="text-amber-800 font-bold flex items-center gap-1">
              <span>⭐ Verdiğiniz Not: {userRating} Yıldız</span>
              <span className="text-[10px] text-stone-500 font-medium">(Kaydedildi)</span>
            </span>
          ) : hoverRating ? (
            <span className="text-amber-700">
              {hoverRating} Yıldız - {getScoreLabel(hoverRating)}
            </span>
          ) : (
            <span className="text-stone-400">Notunuzu seçin (1 - 5 Yıldız)</span>
          )}
        </div>
      </div>
    </div>
  );
}
