'use client';

import React, { useState } from 'react';

export default function OneSignalBroadcastCard() {
  const [title, setTitle] = useState('Ata Lezzet - Günün Menüsü 🍽️');
  const [message, setMessage] = useState(
    'Günün menüsüne baktınız mı? Bugünün lezzetli öğle yemeğini kaçırmayın!'
  );
  const [targetUrl, setTargetUrl] = useState('/');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    text: string;
    details?: string;
  } | null>(null);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('Lütfen bir mesaj yazınız.');
      return;
    }

    if (!confirm('Bu bildirim OneSignal üzerinden TÜM abone kullanıcılara iletilecektir. Onaylıyor musunuz?')) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/admin/onesignal/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          url: targetUrl.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.error || 'Bildirim gönderilemedi.');
      }

      setResult({
        success: true,
        text: `✓ Bildirim başarıyla gönderildi! (${data.recipients || 0} kişiye iletildi)`,
        details: data.notificationId ? `OneSignal ID: ${data.notificationId}` : undefined,
      });
    } catch (err: unknown) {
      setResult({
        success: false,
        text: err instanceof Error ? err.message : 'Gönderim sırasında hata oluştu.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl border border-red-200">
            🔔
          </div>
          <div>
            <h3 className="text-lg font-black text-stone-900 tracking-tight flex items-center gap-2">
              <span>OneSignal</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                Web Push
              </span>
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Abone olan tüm masaüstü ve mobil kullanıcılara anlık push bildirimi gönderin.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSendNotification} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700">Bildirim Başlığı</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-stone-50 focus:bg-white transition-all"
            placeholder="Örn: Ata Lezzet - Günün Menüsü 🍽️"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700">Bildirim Mesajı</label>
          <textarea
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-stone-50 focus:bg-white transition-all resize-none"
            placeholder="Örn: Günün menüsüne baktınız mı? Bugünün lezzetlerini kaçırmayın!"
          />
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap pt-2">
          <div className="text-[11px] text-stone-400">
            💡 .env dosyasında <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-stone-700">NEXT_PUBLIC_ONESIGNAL_APP_ID</code> ve <code className="bg-stone-100 px-1 py-0.5 rounded font-mono text-stone-700">ONESIGNAL_REST_API_KEY</code> tanımlı olmalıdır.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Gönderiliyor...</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>Tüm Kullanıcılara Gönder</span>
              </>
            )}
          </button>
        </div>

        {result && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-bold border transition-all ${
              result.success
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}
          >
            <div>{result.text}</div>
            {result.details && (
              <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                {result.details}
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
