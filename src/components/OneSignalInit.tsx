'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    OneSignalDeferred?: Array<(OneSignal: unknown) => Promise<void> | void>;
    OneSignal?: unknown;
  }
}

export default function OneSignalInit() {
  useEffect(() => {
    const appId =
      process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID ||
      '4daa721c-dc66-4ea0-b6c7-bcc78256ba20';

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function (OneSignal: any) {
      try {
        await OneSignal.init({
          appId: appId,
          allowLocalhostAsSecureOrigin: true, // Localhost üzerinde de test edebilmek için
          notifyButton: {
            enable: false, // Kendi özel bildirim butonumuzu kullandığımız için varsayılan zili gizle
          },
        });

        // 1. Tarayıcıda bildirim izni zaten verilmişse OneSignal abonesi olarak anında ve sessizce kaydet
        if (typeof window !== 'undefined' && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            if (OneSignal?.User?.PushSubscription) {
              await OneSignal.User.PushSubscription.optIn().catch(() => {});
            }
          } else if (Notification.permission === 'default') {
            // İzin henüz verilmemişse kullanıcıya otomatik izin istemi çıkart
            try {
              if (OneSignal?.Slidedown?.promptPush) {
                await OneSignal.Slidedown.promptPush().catch(() => {});
              }
            } catch {
              // Sessizce devam et
            }
          }

          // İlk kullanıcı dokunuşunda (touch/click) aboneliği tekrar garantiye al
          const syncOnTouch = async () => {
            try {
              if (Notification.permission === 'granted') {
                await OneSignal?.User?.PushSubscription?.optIn().catch(() => {});
              }
            } finally {
              window.removeEventListener('click', syncOnTouch);
              window.removeEventListener('touchstart', syncOnTouch);
            }
          };
          window.addEventListener('click', syncOnTouch, { once: true });
          window.addEventListener('touchstart', syncOnTouch, { once: true });
        }
      } catch (err) {
        console.warn('[OneSignal] Başlatma sırasında hata:', err);
      }
    });
  }, []);

  return (
    <Script
      src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
      strategy="afterInteractive"
    />
  );
}
