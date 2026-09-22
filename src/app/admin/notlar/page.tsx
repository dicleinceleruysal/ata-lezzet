'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserNoteItem {
  id: string;
  content: string;
  status: 'pending' | 'reviewed' | 'archived';
  createdAt: string;
}

export default function AdminNotlarPage() {
  const [notes, setNotes] = useState<UserNoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/notes', { cache: 'no-store' });
      if (!res.ok) throw new Error('Notlar yüklenemedi.');
      const data = await res.json();
      setNotes(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Notlar yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleToggleStatus = async (note: UserNoteItem) => {
    const newStatus = note.status === 'pending' ? 'reviewed' : 'pending';
    setUpdatingId(note.id);
    try {
      const res = await fetch('/api/notes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: note.id, status: newStatus }),
      });
      if (!res.ok) throw new Error('Durum güncellenemedi.');
      setNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, status: newStatus } : n))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Güncelleme hatası');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kullanıcı notunu silmek istediğinize emin misiniz?')) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/notes?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Not silinemedi.');
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Silme hatası');
    } finally {
      setDeletingId(null);
    }
  };

  const pendingCount = notes.filter((n) => n.status === 'pending').length;
  const reviewedCount = notes.filter((n) => n.status === 'reviewed').length;

  const filteredNotes = notes
    .filter((n) => {
      if (filter === 'pending') return n.status === 'pending';
      if (filter === 'reviewed') return n.status === 'reviewed';
      return true;
    })
    .filter((n) =>
      searchTerm.trim() === ''
        ? true
        : n.content.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );

  return (
    <div className="space-y-6">
      {/* Üst Başlık & Butonlar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Kullanıcı Notları & Geri Bildirimler
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
              {notes.length} Toplam
            </span>
          </div>
          <p className="text-sm text-stone-500 mt-1">
            Kullanıcıların ana sayfadan gönderdiği öneri, istek ve değerlendirmeler.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchNotes}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            🔄 {loading ? 'Yenileniyor...' : 'Listeyi Yenile'}
          </button>
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors shadow-xs"
          >
            🏠 Ana Sayfayı Aç
          </Link>
        </div>
      </div>

      {/* İstatistik Özet Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div
          onClick={() => setFilter('all')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-300/50'
              : 'bg-white border-stone-200 hover:border-amber-200'
          }`}
        >
          <div className="text-xs font-bold text-stone-500">Tüm Notlar</div>
          <div className="text-2xl font-black text-stone-900 mt-1">{notes.length}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Kullanıcılardan gelen tüm kayıtlar</div>
        </div>

        <div
          onClick={() => setFilter('pending')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filter === 'pending'
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-300/50'
              : 'bg-white border-stone-200 hover:border-amber-200'
          }`}
        >
          <div className="text-xs font-bold text-amber-700 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Bekleyen Yeni Notlar
          </div>
          <div className="text-2xl font-black text-amber-900 mt-1">{pendingCount}</div>
          <div className="text-[11px] text-amber-700/70 mt-0.5">Henüz incelenmemiş mesajlar</div>
        </div>

        <div
          onClick={() => setFilter('reviewed')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filter === 'reviewed'
              ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-300/50'
              : 'bg-white border-stone-200 hover:border-emerald-200'
          }`}
        >
          <div className="text-xs font-bold text-emerald-700">İncelenen Notlar</div>
          <div className="text-2xl font-black text-emerald-900 mt-1">{reviewedCount}</div>
          <div className="text-[11px] text-emerald-700/70 mt-0.5">Yönetici tarafından görüldü</div>
        </div>
      </div>

      {/* Arama ve Filtreleme Çubuğu */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Notlar içinde ara..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 bg-stone-50/60 text-sm focus:outline-none focus:border-amber-500 focus:bg-white transition-all font-medium text-stone-800"
          />
          <span className="absolute left-3 top-2.5 text-stone-400 text-sm">🔍</span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Tümü ({notes.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'pending'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
            }`}
          >
            Bekleyenler ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('reviewed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'reviewed'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            İncelenenler ({reviewedCount})
          </button>
        </div>
      </div>

      {/* Notlar Listesi */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-stone-500 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold">Notlar yükleniyor...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-600 space-y-3">
            <p className="font-bold text-sm">{error}</p>
            <button
              onClick={fetchNotes}
              className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold cursor-pointer hover:bg-stone-800"
            >
              Yeniden Dene
            </button>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="p-12 text-center text-stone-500 space-y-2">
            <div className="text-3xl">📭</div>
            <p className="font-bold text-stone-700">
              {searchTerm
                ? 'Aramanızla eşleşen not bulunamadı.'
                : filter === 'pending'
                ? 'Bekleyen yeni not bulunmuyor.'
                : filter === 'reviewed'
                ? 'Henüz incelenmiş not bulunmuyor.'
                : 'Henüz hiç kullanıcı notu kaydedilmemiş.'}
            </p>
            <p className="text-xs text-stone-400">
              Kullanıcılar ana ekrandaki &quot;Kullanıcı Notu&quot; bölümünden mesaj gönderdiğinde anında burada listelenir.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredNotes.map((note) => {
              const isPending = note.status === 'pending';
              const isUpdating = updatingId === note.id;
              const isDeleting = deletingId === note.id;

              return (
                <div
                  key={note.id}
                  className={`p-5 sm:p-6 transition-colors ${
                    isPending ? 'bg-amber-50/20 hover:bg-amber-50/40' : 'hover:bg-stone-50/60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                          isPending
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isPending ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                        />
                        {isPending ? 'Yeni / Bekliyor' : 'İncelendi'}
                      </span>

                      <span className="text-xs text-stone-400 font-medium">
                        {new Date(note.createdAt).toLocaleString('tr-TR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Eylem Butonları */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleToggleStatus(note)}
                        disabled={isUpdating}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isPending
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                      >
                        {isUpdating ? (
                          'Güncelleniyor...'
                        ) : isPending ? (
                          <>✓ İncelendi Olarak İşaretle</>
                        ) : (
                          <>↩ Tekrar Yeni Yap</>
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(note.id)}
                        disabled={isDeleting}
                        title="Notu Sil"
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isDeleting ? 'Siliniyor...' : '🗑️ Sil'}
                      </button>
                    </div>
                  </div>

                  {/* Not İçeriği */}
                  <div className="bg-stone-50/70 p-3.5 sm:p-4 rounded-xl border border-stone-200/70">
                    <p className="text-stone-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium">
                      {note.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
