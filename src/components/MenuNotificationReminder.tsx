'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';

// Web Audio API ile harici dosya indirmeden hoş bir zil / bildirim sesi çalma
function playNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(0.18, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };

    // Melodik 3 nota akoru (C5, E5, G5)
    playTone(523.25, now, 0.28);
    playTone(659.25, now + 0.12, 0.32);
    playTone(783.99, now + 0.24, 0.45);
  } catch {
    // Ses desteği yoksa sessiz devam et
  }
}

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function MenuNotificationReminder() {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [enabled, setEnabled] = useState(true);
  const [bannerOpen, setBannerOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [autoPromptDismissed, setAutoPromptDismissed] = useState(true);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Bildirimi fiilen tetikleyen fonksiyon
  const triggerReminder = useCallback(async (isTest = false) => {
    // 1. Zili çal
    playNotificationChime();

    // 2. Tarayıcı / İşletim Sistemi Bildirimi (OS Push / Notification)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const title = 'Ata Lezzet - Günün Menüsü 🍽️';
      const body = 'Günün menüsüne baktınız mı? Bugünün lezzetli öğle yemeğini kaçırmayın!';

      try {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'SHOW_NOTIFICATION',
            title,
            body,
            icon: '/icons/icon-192.png',
            data: { url: '/' },
          });
        } else if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then((reg) => {
            reg.showNotification(title, {
              body,
              icon: '/icons/icon-192.png',
              tag: 'daily-menu-reminder',
              data: { url: '/' },
            } as NotificationOptions);
          }).catch(() => {
            new Notification(title, { body, icon: '/icons/icon-192.png' });
          });
        } else {
          new Notification(title, { body, icon: '/icons/icon-192.png' });
        }
      } catch (err) {
        console.warn('Tarayıcı bildirimi gönderilemedi:', err);
      }
    }

    // 3. Sayfa İçi İnteraktif Toast / Banner
    setBannerOpen(true);

    // 4. Test değilse bugünün tarihini kaydet (aynı gün tekrar otomatik rahatsız etmesin)
    if (!isTest) {
      localStorage.setItem('menu_reminder_last_date', getTodayKey());
    }
  }, []);

  // Saat 12:00 Zamanlayıcısını Kurma
  const scheduleNextReminder = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const now = new Date();
    const todayStr = getTodayKey();
    const lastNotified = localStorage.getItem('menu_reminder_last_date');

    // Eğer şu an saat 11:30 ile 13:30 arasındaysa ve bugün henüz bildirim gitmediyse hemen gönder
    const currentH = now.getHours();
    const currentM = now.getMinutes();
    const isPast1130 = currentH > 11 || (currentH === 11 && currentM >= 30);
    const isBefore1330 = currentH < 13 || (currentH === 13 && currentM <= 30);
    if (isPast1130 && isBefore1330 && lastNotified !== todayStr) {
      triggerReminder(false);
      return;
    }

    // Hedef: Bugün 11:30:00 veya Yarın 11:30:00
    let target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 30, 0, 0);
    if (now.getTime() >= target.getTime()) {
      // Bugün 11:30 geçti, yarına kur
      target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 11, 30, 0, 0);
    }

    const delayMs = target.getTime() - now.getTime();
    if (delayMs > 0 && delayMs < 24 * 60 * 60 * 1000) {
      timeoutRef.current = setTimeout(() => {
        triggerReminder(false);
        scheduleNextReminder();
      }, delayMs);
    }
  }, [triggerReminder]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Tarayıcı bildirim desteğini kontrol et
    if (!('Notification' in window)) {
      setPermission('unsupported');
    } else {
      setPermission(Notification.permission);
    }

    // Kullanıcı tercihini oku
    const savedEnabled = localStorage.getItem('menu_reminder_enabled');
    if (savedEnabled !== null) {
      setEnabled(savedEnabled === 'true');
    }

    // Uygulama yüklü moddaysa (PWA) veya izin henüz sorulmadıysa nazikçe izin iste
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    const dismissedPrompt = localStorage.getItem('menu_reminder_prompt_dismissed');

    if (
      'Notification' in window &&
      Notification.permission === 'default' &&
      (isStandalone || !dismissedPrompt)
    ) {
      setAutoPromptDismissed(false);
    }

    // Canlı saat formatlama (Sadece saat ve dakika)
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();

    // Zamanlayıcıyı başlat
    scheduleNextReminder();

    // Periyodik kontrol: Her 20 saniyede bir saati güncelle ve 11:30:00 kontrolü yap
    intervalRef.current = setInterval(() => {
      updateTime();
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const todayStr = getTodayKey();
      const lastNotified = localStorage.getItem('menu_reminder_last_date');

      // Saat 11:30 olduğunda ve bugün henüz gönderilmediyse
      if (h === 11 && m === 30 && lastNotified !== todayStr) {
        triggerReminder(false);
      }
    }, 20000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [scheduleNextReminder, triggerReminder]);

  // Bildirim İzni İsteme
  const requestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      setAutoPromptDismissed(true);
      localStorage.setItem('menu_reminder_prompt_dismissed', 'true');
      if (res === 'granted') {
        localStorage.setItem('menu_reminder_enabled', 'true');
        setEnabled(true);
        scheduleNextReminder();

        // OneSignal Web Push aboneliğini senkronize et
        if (typeof window !== 'undefined' && window.OneSignalDeferred) {
          window.OneSignalDeferred.push(async (OneSignal: any) => {
            try {
              await OneSignal.User.PushSubscription.optIn();
            } catch (e) {
              console.warn('[OneSignal] optIn hatası:', e);
            }
          });
        }
      }
    } catch (err) {
      console.warn('İzin istenirken hata:', err);
    }
  };

  const handleToggleEnabled = (val: boolean) => {
    setEnabled(val);
    localStorage.setItem('menu_reminder_enabled', val ? 'true' : 'false');
    if (val) {
      scheduleNextReminder();
    } else if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // OneSignal Push abonelik durumunu güncelle
    if (typeof window !== 'undefined' && window.OneSignalDeferred) {
      window.OneSignalDeferred.push(async (OneSignal: any) => {
        try {
          if (val) {
            await OneSignal.User.PushSubscription.optIn();
          } else {
            await OneSignal.User.PushSubscription.optOut();
          }
        } catch (e) {
          console.warn('[OneSignal] push subscription güncelleme hatası:', e);
        }
      });
    }
  };

  const handleScrollToMenu = () => {
    setBannerOpen(false);
    const el = document.getElementById('daily-menu-section') || document.querySelector('section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* 1. ÜST AÇILIR BİLDİRİM BANNERI (Saat 12:00'de veya Testte Ekrana Düşer) */}
      {bannerOpen && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-lg animate-in slide-in-from-top-6 duration-300">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-4 sm:p-5 rounded-3xl shadow-2xl border-2 border-white/40 flex items-start gap-3.5 backdrop-blur-md">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shrink-0 shadow-inner">
              🍽️
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider bg-white/25 px-2 py-0.5 rounded-md">
                  Saat 11:30 • Öğle Vakti
                </span>
                <span className="text-[11px] font-semibold text-amber-100">Ata Lezzet</span>
              </div>
              <h4 className="text-sm sm:text-base font-black tracking-tight leading-snug">
                Günün menüsüne baktınız mı?
              </h4>
              <p className="text-xs text-amber-50 leading-relaxed font-medium">
                Bugünün lezzetli ve taze öğle yemeği hazır! Şimdi menüyü inceleyin ve lezzetleri keşfedin.
              </p>
              <div className="pt-2 flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleScrollToMenu}
                  className="px-3.5 py-1.5 rounded-xl bg-white text-stone-950 font-black text-xs shadow-md hover:bg-amber-50 transition-all cursor-pointer"
                >
                  Menüyü İncele 📋
                </button>
                <button
                  type="button"
                  onClick={() => setBannerOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Tamam, Kapat
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBannerOpen(false)}
              className="text-white/80 hover:text-white text-lg font-bold p-1 cursor-pointer transition-colors"
              title="Kapat"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 2. İLK ZİYARET NAZİK BİLDİRİM İZNİ ÇUBUĞU (Default ise gösterilir) */}
      {!autoPromptDismissed && permission === 'default' && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-md animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-stone-900/95 text-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-stone-800 flex items-center justify-between gap-3 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🔔</span>
              <div>
                <p className="text-xs font-bold text-stone-100">
                  Saat 11:30 Menü Hatırlatıcısı
                </p>
                <p className="text-[11px] text-stone-400">
                  Her gün öğle yemeğinde günün menüsünü bildirelim mi?
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={requestPermission}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-colors cursor-pointer"
              >
                İzin Ver
              </button>
              <button
                type="button"
                onClick={() => {
                  setAutoPromptDismissed(true);
                  localStorage.setItem('menu_reminder_prompt_dismissed', 'true');
                }}
                className="px-2 py-1.5 text-stone-400 hover:text-stone-200 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. SABİT ZİL BUTONU (Sol Alt Köşede Şık Hatırlatıcı Paneli) */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          type="button"
          onClick={() => setPanelOpen(!panelOpen)}
          className={`flex items-center gap-2 px-3 py-2 rounded-2xl shadow-lg border backdrop-blur-md transition-all cursor-pointer ${
            enabled
              ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 border-amber-600 shadow-amber-500/20'
              : 'bg-stone-900/90 hover:bg-stone-800 text-stone-300 border-stone-700'
          }`}
          title="Saat 11:30 Günün Menüsü Hatırlatıcısı"
        >
          <span className="text-base animate-bounce-slow">🔔</span>
          <span className="text-xs font-black hidden sm:inline">
            11:30 Hatırlatıcı
          </span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        {/* HATIRLATICI YÖNETİM & TEST PANELİ */}
        {panelOpen && (
          <div className="absolute bottom-12 left-0 w-80 bg-white rounded-3xl p-5 shadow-2xl border-2 border-stone-200 text-stone-900 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">⏰</span>
                <div>
                  <h4 className="text-xs font-black uppercase text-stone-800 tracking-wider">
                    Öğle Menüsü Bildirimi
                  </h4>
                  <p className="text-[11px] text-stone-500 font-medium">
                    Her gün saat 11:30'da
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="text-stone-400 hover:text-stone-700 font-bold text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Durum & Canlı Saat */}
            <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Şu Anki Saat:</span>
                <span className="font-mono font-black text-stone-900 text-sm">{currentTimeStr || '--:--'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500 font-medium">Sıradaki Bildirim:</span>
                <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                  11:30 (Öğle Vakti)
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                <span className="text-stone-500 font-medium">Tarayıcı İzni:</span>
                <span
                  className={`font-bold ${
                    permission === 'granted'
                      ? 'text-emerald-700'
                      : permission === 'denied'
                      ? 'text-red-600'
                      : 'text-amber-600'
                  }`}
                >
                  {permission === 'granted'
                    ? '✓ İzin Verildi'
                    : permission === 'denied'
                    ? '✕ Engellendi'
                    : 'Beklemede'}
                </span>
              </div>
            </div>

            {/* İzin İsteme Butonu (Gerekirse) */}
            {permission !== 'granted' && permission !== 'unsupported' && (
              <button
                type="button"
                onClick={requestPermission}
                className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>🔔</span>
                <span>Tarayıcı Bildirim İznini Aç</span>
              </button>
            )}

            {/* AÇ / KAPAT TOGGLE */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-stone-700">Hatırlatıcı Aktif:</span>
              <button
                type="button"
                onClick={() => handleToggleEnabled(!enabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                  enabled ? 'bg-amber-500 justify-end' : 'bg-stone-300 justify-start'
                }`}
              >
                <span className="bg-white w-4 h-4 rounded-full shadow-md transform transition-transform" />
              </button>
            </div>

            {/* BİLGİ METNİ */}
            <div className="pt-2 border-t border-stone-100">
              <div className="bg-amber-50/70 rounded-xl p-2.5 border border-amber-200/60 text-[11px] text-amber-900 leading-relaxed font-medium">
                💡 Her gün saat <strong>11:30</strong>'da öğle yemeği menüsü otomatik olarak hatırlatılır.
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
