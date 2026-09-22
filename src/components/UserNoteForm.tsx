'use client';

import React, { useState } from 'react';

export default function UserNoteForm() {
  const [note, setNote] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        text: '✨ Notunuz yöneticiye başarıyla iletildi. Teşekkür ederiz!',
      });
      setNote('');
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
    <section className="w-full bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-100 shadow-[0_12px_28px_rgba(245,158,11,0.06)] relative overflow-hidden">
      {/* Başlık Alanı */}
      <div className="flex items-center gap-3.5 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center text-2xl shadow-xs border border-amber-200">
          📝
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Kullanıcı Notu
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-medium">
            Öneri, talep veya geri bildirimlerinizi yöneticiye iletin
          </p>
        </div>
      </div>

      {/* Not Gönderme Formu */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label htmlFor="user-note" className="sr-only">
            Kullanıcı Notu
          </label>
          <textarea
            id="user-note"
            rows={4}
            maxLength={500}
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              if (statusMessage) setStatusMessage(null);
            }}
            placeholder="Yemekler veya menü hakkındaki notunuzu buraya yazabilirsiniz..."
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
            💡 Gönderdiğiniz notlar doğrudan mutfak yönetimi ve idari birim tarafından incelenir.
          </p>
          <button
            type="submit"
            disabled={isSubmitting || !note.trim()}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 active:scale-[0.98] text-white font-extrabold text-sm transition-all cursor-pointer shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
    </section>
  );
}
