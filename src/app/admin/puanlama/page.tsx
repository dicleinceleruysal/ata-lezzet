'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface DayRatingSummary {
  dateStr: string;
  average: number;
  count: number;
  distribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
  latestVoteAt: string;
}

interface IndividualVote {
  id: string;
  dateStr: string;
  score: number;
  createdAt: string;
}

interface RatingResponse {
  stats: {
    totalVotes: number;
    overallAverage: number;
    ratedDaysCount: number;
  };
  days: DayRatingSummary[];
  recentVotes: IndividualVote[];
}

export default function AdminPuanlamaPage() {
  const [data, setData] = useState<RatingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'days' | 'votes'>('days');

  const fetchRatings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/ratings?admin=true', { cache: 'no-store' });
      if (!res.ok) throw new Error('Puanlar yüklenemedi.');
      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  const handleDeleteVote = async (id: string) => {
    if (!confirm('Bu tekil puanı silmek istediğinize emin misiniz?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/ratings?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Puan silinemedi.');
      fetchRatings();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Hata oluştu.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleResetDay = async (dateStr: string) => {
    if (!confirm(`${dateStr} gününe ait tüm değerlendirmeleri sıfırlamak istediğinize emin misiniz?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/ratings?dateStr=${encodeURIComponent(dateStr)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Gün puanları silinemedi.');
      fetchRatings();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Hata oluştu.');
    }
  };

  const filteredDays = (data?.days || []).filter((d) =>
    searchTerm.trim() === ''
      ? true
      : d.dateStr.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const filteredVotes = (data?.recentVotes || []).filter((v) =>
    searchTerm.trim() === ''
      ? true
      : v.dateStr.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div className="space-y-6">
      {/* Üst Başlık & Butonlar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <span>⭐</span> Menü Puanlamaları & Notlar
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
              {data?.stats.totalVotes || 0} Değerlendirme
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Kullanıcıların günün menüsüne 5 yıldız üzerinden verdiği puan ve değerlendirmeler.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchRatings}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            🔄 {loading ? 'Yenileniyor...' : 'Yenile'}
          </button>
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-xs"
          >
            🏠 Günün Menüsünü Aç
          </Link>
        </div>
      </div>

      {/* İstatistik Özet Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
            <span>⭐</span> Genel Ortalama Not
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl sm:text-4xl font-black text-stone-900">
              {data?.stats.overallAverage.toFixed(1) || '0.0'}
            </span>
            <span className="text-sm text-stone-400 font-bold">/ 5.0</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Tüm menüler genelinde kullanıcı memnuniyeti
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="text-xs font-bold text-orange-700 uppercase tracking-wider flex items-center gap-1.5">
            <span>🗳️</span> Toplam Verilen Not Sayısı
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl sm:text-4xl font-black text-stone-900">
              {data?.stats.totalVotes || 0}
            </span>
            <span className="text-sm text-stone-400 font-bold">Oy</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Sistemde kayıtlı tekil değerlendirmeler
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
            <span>📅</span> Not Alan Günler
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl sm:text-4xl font-black text-stone-900">
              {data?.stats.ratedDaysCount || 0}
            </span>
            <span className="text-sm text-stone-400 font-bold">Farklı Gün</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            En az bir oy almış günlük menüler
          </div>
        </div>
      </div>

      {/* Arama & Sekme Seçici */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="inline-flex p-1 bg-stone-100 rounded-xl">
          <button
            onClick={() => setActiveTab('days')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'days'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            📅 Gün Gün Özet ({data?.days.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('votes')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'votes'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🗳️ Tüm Oylar ({data?.recentVotes.length || 0})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tarihe göre ara (örn: 22 Eylül)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs focus:outline-none focus:border-amber-500 focus:bg-white transition-all font-medium text-stone-800"
          />
          <span className="absolute left-3 top-2.5 text-stone-400 text-xs">🔍</span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Yükleniyor veya Hata */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-stone-500 flex flex-col items-center justify-center gap-3 border border-stone-200">
          <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold">Puanlama verileri yükleniyor...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-200 text-rose-800 text-sm font-bold text-center">
          {error}
        </div>
      ) : (
        <>
          {/* 1. SEKME: GÜN GÜN ÖZET */}
          {activeTab === 'days' && (
            <div className="space-y-4">
              {filteredDays.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500 space-y-2">
                  <div className="text-4xl">⭐</div>
                  <p className="font-bold text-stone-800">
                    {searchTerm ? 'Aramanıza uygun değerlendirme bulunamadı.' : 'Henüz hiçbir menü puanlanmamış.'}
                  </p>
                  <p className="text-xs text-stone-400 max-w-md mx-auto">
                    Kullanıcılar ana sayfada günün menüsünün altındaki 5 yıldızlı puanlama alanından not verdikçe burada gün gün ortalamalar listelenecektir.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDays.map((day) => (
                    <div
                      key={day.dateStr}
                      className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-amber-300 transition-all space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-black text-stone-900 text-base flex items-center gap-2">
                            <span>📅</span> {day.dateStr}
                          </h3>
                          <span className="text-xs text-stone-400 font-medium">
                            Son oy:{' '}
                            {new Date(day.latestVoteAt).toLocaleTimeString('tr-TR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                            <span className="text-amber-500 font-black text-lg">★</span>
                            <span className="text-amber-950 font-black text-base">
                              {day.average.toFixed(1)}
                            </span>
                            <span className="text-amber-800/60 text-xs font-bold">/ 5</span>
                          </div>
                          <span className="text-[11px] text-stone-500 font-semibold block mt-0.5">
                            {day.count} Değerlendirme
                          </span>
                        </div>
                      </div>

                      {/* Yıldız Dağılım Çubukları (5, 4, 3, 2, 1) */}
                      <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
                        {[5, 4, 3, 2, 1].map((s) => {
                          const starKey = s as 1 | 2 | 3 | 4 | 5;
                          const starCount = day.distribution[starKey] || 0;
                          const percentage = day.count > 0 ? (starCount / day.count) * 100 : 0;

                          return (
                            <div key={s} className="flex items-center gap-2 text-stone-600">
                              <span className="w-12 font-bold text-[11px] flex items-center gap-0.5">
                                {s} <span className="text-amber-500">★</span>
                              </span>
                              <div className="flex-1 h-2 rounded-full bg-stone-100 overflow-hidden">
                                <div
                                  className="h-full bg-amber-400 rounded-full transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="w-8 text-right font-medium text-[11px] text-stone-400">
                                {starCount}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex justify-end">
                        <button
                          onClick={() => handleResetDay(day.dateStr)}
                          className="text-[11px] text-rose-600 hover:text-rose-800 font-bold hover:underline cursor-pointer"
                        >
                          🗑️ Bu Günün Puanlarını Sıfırla
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. SEKME: TÜM OYLARIN LİSTESİ */}
          {activeTab === 'votes' && (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              {filteredVotes.length === 0 ? (
                <div className="p-12 text-center text-stone-500">Kayıtlı oy bulunamadı.</div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {filteredVotes.map((vote) => (
                    <div
                      key={vote.id}
                      className="p-4 sm:p-5 hover:bg-stone-50/60 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900 font-black text-base border border-amber-200">
                          {vote.score}★
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 text-sm">{vote.dateStr} Menüsü</div>
                          <div className="text-xs text-stone-400">
                            {new Date(vote.createdAt).toLocaleString('tr-TR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-amber-500 text-sm hidden sm:block">
                          {'★'.repeat(vote.score)}
                          <span className="text-stone-200">{'★'.repeat(5 - vote.score)}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteVote(vote.id)}
                          disabled={deletingId === vote.id}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 cursor-pointer disabled:opacity-50"
                        >
                          {deletingId === vote.id ? 'Siliniyor...' : 'Sil'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
