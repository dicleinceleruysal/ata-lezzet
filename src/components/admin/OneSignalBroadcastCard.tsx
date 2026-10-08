'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface OneSignalAppInfo {
  name: string;
  siteUrl: string | null;
  players: number;
  messageablePlayers: number;
  isConfigured: boolean;
}

export default function OneSignalBroadcastCard() {
  const [title, setTitle] = useState('Ata Lezzet - Günün Menüsü 🍽️');
  const [message, setMessage] = useState(
    'Günün menüsüne baktınız mı? Bugünün lezzetli öğle yemeğini kaçırmayın!'
  );
  const [targetUrl, setTargetUrl] = useState('/');
  const [loading, setLoading] = useState(false);
  const [appInfo, setAppInfo] = useState<OneSignalAppInfo | null>(null);
  const [infoLoading, setInfoLoading] = useState(true);
  const [result, setResult] = useState<{
    success?: boolean;
    text: string;
    details?: string;
  } | null>(null);

  const fetchAppInfo = useCallback(async () => {
    try {
      setInfoLoading(true);
      const res = await fetch('/api/admin/onesignal/send');
      if (res.ok) {
        const data = await res.json();
        setAppInfo(data);
      }
    } catch {
      // Hata durumunda sessiz devam et
    } finally {
      setInfoLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppInfo();
  }, [fetchAppInfo]);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('Lütfen bir mesaj yazınız.');
      return;
    }

    if (
      !confirm(
        'Bu bildirim OneSignal üzerinden TÜM abone kullanıcılara iletilecektir. Onaylıyor musunuz?'
      )
    ) {
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

      fetchAppInfo();
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
      <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-4 flex-wrap">
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

        {/* Canlı Abone Sayacı */}
        <div className="flex items-center gap-2 bg-stone-50 px-3.5 py-1.5 rounded-2xl border border-stone-200">
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Kayıtlı Abone
            </div>
            <div className="text-xs font-black text-stone-900 flex items-center justify-end gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  (appInfo?.players ?? 0) > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span>
                {infoLoading ? '...' : `${appInfo?.players ?? 0} Abone`}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchAppInfo}
            className="text-stone-400 hover:text-stone-700 text-xs p-1 cursor-pointer transition-colors"
            title="Yenile"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Abone Yok Uyarısı ve Rehber Kutu */}
      {appInfo && appInfo.players === 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs space-y-2 text-amber-950">
          <div className="font-bold flex items-center gap-1.5 text-amber-900">
            <span>⚠️</span>
            <span>Henüz bildirim izni vermiş kayıtlı kullanıcı (0 Abone) bulunmuyor</span>
          </div>
          <p className="text-amber-800 leading-relaxed font-medium">
            Bildirimlerin cihazlara ulaşabilmesi için:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-amber-900/90 font-medium pl-1">
            <li>
              <a
                href="https://dashboard.onesignal.com/apps/4daa721c-dc66-4ea0-b6c7-bcc78256ba20/settings/web"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-amber-950 underline hover:text-red-700"
              >
                OneSignal Panelinde (Settings &gt; Web Push)
              </a>{' '}
              canlı sitenizin URL adresini (Örn: <code>https://...</code>) tanımlayın ve kaydedin.
            </li>
            <li>
              Canlı siteye tarayıcınızdan veya telefonunuzdan girip açılan bildirim isteğinde veya zil simgesinden{' '}
              <strong>&ldquo;İzin Ver&rdquo;</strong> butonuna tıklayın.
            </li>
          </ol>
        </div>
      )}

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

        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700">
            Tıklanınca Açılacak Sayfa (Hedef URL)
          </label>
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:outline-none focus:border-amber-500 bg-stone-50 focus:bg-white transition-all"
            placeholder="Örn: / veya https://..."
          />
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap pt-2">
          <div className="text-[11px] text-stone-400">
            ⚡ OneSignal Web Push altyapısı aktiftir.
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
