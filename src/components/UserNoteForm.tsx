'use client';

import React, { useState, useEffect } from 'react';

interface NoteItem {
  id: string;
  content: string;
  status: 'pending' | 'reviewed' | 'archived';
  createdAt: string;
}

export default function UserNoteForm() {
  const [note, setNote] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentNotes, setRecentNotes] = useState<NoteItem[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [showNotesList, setShowNotesList] = useState(true);

  // Son notları sunucudan yükle
  const loadRecentNotes = async () => {
    try {
      setLoadingNotes(true);
      const res = await fetch('/api/notes?limit=8', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setRecentNotes(data);
      }
    } catch {
      // Hata durumunda sessizce devam et
    } finally {
      setLoadingNotes(false);
    }
  };

  useEffect(() => {
    loadRecentNotes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = note.trim();
    if (!trimmed) {
      setStatusMessage({
        type: 'error',
        text: 'Lütfen göndermeden önce bir not yazınız.',
      });
      return;
    }

    if (trimmed.length < 2) {
      setStatusMessage({
        type: 'error',
        text: 'Notunuz çok kısa, lütfen en az 2 karakter yazınız.',
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Not kaydedilemedi.');
      }

      setStatusMessage({
        type: 'success',
        text: '✨ Notunuz başarıyla iletildi ve listeye eklendi. Teşekkür ederiz!',
      });
      setNote('');

      // Yeni notu yerel listeye anında ekle
      if (data.note) {
        setRecentNotes((prev) => [data.note, ...prev]);
        setShowNotesList(true);
      } else {
        loadRecentNotes();
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Bir hata oluştu.';
      setStatusMessage({
        type: 'error',
        text: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-100 shadow-[0_12px_28px_rgba(245,158,11,0.06)] relative overflow-hidden space-y-6">
      {/* Başlık Alanı */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-2xl shadow-xs border border-amber-200">
            📝
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              Kullanıcı Notları & Geri Bildirim
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Canlı
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-medium">
              Yemekler, menü veya önerileriniz hakkındaki görüşlerinizi doğrudan iletin
            </p>
          </div>
        </div>

        {recentNotes.length > 0 && (
          <button
            type="button"
            onClick={() => setShowNotesList((v) => !v)}
            className="self-start sm:self-auto text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl border border-amber-200/70 transition-colors cursor-pointer"
          >
            {showNotesList ? '📋 Notları Gizle' : `📋 Son Notları Göster (${recentNotes.length})`}
          </button>
        )}
      </div>

      {/* Not Gönderme Formu */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label htmlFor="user-note" className="sr-only">
            Kullanıcı Notu
          </label>
          <textarea
            id="user-note"
            rows={3}
            maxLength={500}
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              if (statusMessage) setStatusMessage(null);
            }}
            placeholder="Yemekler veya menü hakkındaki notunuzu, talep veya önerinizi buraya yazabilirsiniz..."
            className="w-full rounded-2xl border-2 border-stone-200 bg-stone-50/60 p-4 pb-7 text-stone-800 placeholder-stone-400 focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-200/50 transition-all text-sm sm:text-base resize-none font-medium"
          />
          <div className="absolute right-3.5 bottom-2.5 text-[11px] font-semibold text-stone-400">
            {note.length} / 500
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm font-bold border flex items-center justify-between gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 animate-in fade-in duration-300'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <span>{statusMessage.text}</span>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="text-stone-400 hover:text-stone-600 font-black text-xs px-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
          <p className="text-[11px] text-stone-400 font-medium">
            💡 Gönderdiğiniz notlar mutfak yönetimi ve idari birim tarafından incelenir.
          </p>
          <button
            type="submit"
            disabled={isSubmitting || !note.trim()}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 active:scale-[0.98] text-white font-extrabold text-sm transition-all cursor-pointer shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                İletiliyor...
              </>
            ) : (
              'Notu Gönder 🚀'
            )}
          </button>
        </div>
      </form>

      {/* Son Paylaşılan Notlar Listesi */}
      {showNotesList && (
        <div className="pt-2 border-t border-stone-100 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
              <span>💬</span> Son İletilen Notlar
            </h3>
            <button
              type="button"
              onClick={loadRecentNotes}
              disabled={loadingNotes}
              className="text-[11px] text-stone-400 hover:text-stone-600 font-semibold cursor-pointer"
            >
              {loadingNotes ? 'Yenileniyor...' : 'Yenile ↻'}
            </button>
          </div>

          {recentNotes.length === 0 ? (
            <div className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200/70 text-center text-xs text-stone-400">
              Henüz bir kullanıcı notu bulunmuyor. İlk notu yukarıdaki alandan siz gönderebilirsiniz!
            </div>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {recentNotes.map((item) => {
                const isPending = item.status === 'pending';
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-stone-50/90 border border-stone-200/70 hover:border-amber-200 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                          isPending
                            ? 'bg-amber-100 text-amber-900 border border-amber-200/60'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-200/60'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isPending ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                        />
                        {isPending ? 'İletildi / İnceleniyor' : 'Yönetici İncelendi'}
                      </span>
                      <span className="text-[11px] text-stone-400 font-medium">
                        {new Date(item.createdAt).toLocaleString('tr-TR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-800 font-medium whitespace-pre-wrap leading-snug">
                      {item.content}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
