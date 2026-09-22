'use client';

import React, { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // 1. Service Worker Kaydı
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            // Service worker başarıyla kaydedildi
            reg.update();
          })
          .catch((err) => {
            console.warn('[PWA] Service Worker kaydı başarısız:', err);
          });
      });
    }

    // 2. Standalone (Zaten Yüklü) Kontrolü
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    setIsStandalone(Boolean(isStandaloneMode));

    // 3. iOS Tespiti
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Daha önce kapatıldı mı kontrol et (3 gün boyunca tekrar sorma)
    const dismissedAt = localStorage.getItem('pwa_prompt_dismissed');
    const isDismissedRecently =
      dismissedAt && Date.now() - parseInt(dismissedAt, 10) < 3 * 24 * 60 * 60 * 1000;

    // 4. Android / Chrome / Edge BeforeInstallPrompt Dinleyicisi
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!isStandaloneMode && !isDismissedRecently) {
        // Kullanıcıyı hemen boğmamak için 3 saniye sonra göster
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // iOS için standalone değilse ve yakın zamanda kapatılmadıysa
    if (isIosDevice && !isStandaloneMode && !isDismissedRecently) {
      setTimeout(() => setShowPrompt(true), 4000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android / Chrome / Windows / Mac yerel yükleme
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowPrompt(false);
        setDeferredPrompt(null);
      }
    } else if (isIos) {
      // iOS için rehber aç
      setShowIosGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIosGuide(false);
    localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
  };

  // Zaten kuruluysa veya bildirim kapalıysa render etme
  if (isStandalone || !showPrompt) {
    return null;
  }

  return (
    <>
      {/* Alt Sabit Modern PWA Yükleme Kartı */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="bg-stone-900/95 backdrop-blur-md text-white p-4 rounded-3xl shadow-2xl border border-stone-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white flex-shrink-0 border-2 border-amber-400 p-0.5 shadow-md">
              <img
                src="/icons/icon-192.png"
                alt="Ata Lezzet"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                  Uygulama Olarak Kullan
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-white truncate">
                Ata Lezzet&apos;i Yükle
              </h4>
              <p className="text-[11px] text-stone-300 line-clamp-1">
                Ana ekranınıza ekleyip menülere anında ulaşın.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              Yükle
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="w-8 h-8 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 flex items-center justify-center text-xs transition-colors cursor-pointer"
              title="Kapat"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* iOS Safari İçin Ana Ekrana Ekleme Rehberi Modal */}
      {showIosGuide && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
          onClick={() => setShowIosGuide(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 text-stone-800 space-y-4 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📲</span>
                <h3 className="text-base font-black text-stone-900">
                  Ana Ekrana Ekle
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                className="text-stone-400 hover:text-stone-700 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-600 leading-relaxed font-medium">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <span className="text-base flex-shrink-0">1️⃣</span>
                <span>
                  Safari tarayıcınızın alt veya üst çubuğundaki{' '}
                  <strong className="text-stone-900 font-bold">Paylaş (⬆️)</strong> butonuna dokunun.
                </span>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <span className="text-base flex-shrink-0">2️⃣</span>
                <span>
                  Açılan menüde aşağı kaydırarak{' '}
                  <strong className="text-stone-900 font-bold">&quot;Ana Ekrana Ekle&quot; (+)</strong> seçeneğini seçin.
                </span>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                <span className="text-base flex-shrink-0">3️⃣</span>
                <span>
                  Sağ üstteki <strong className="text-emerald-900 font-bold">&quot;Ekle&quot;</strong> butonuna basarak Ata Lezzet ikonunu ana ekranınıza sabitleyin.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowIosGuide(false);
                setShowPrompt(false);
                localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
              }}
              className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Anladım
            </button>
          </div>
        </div>
      )}
    </>
  );
}
