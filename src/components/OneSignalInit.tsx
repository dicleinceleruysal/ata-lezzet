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

        // Tarayıcıda bildirim izni zaten verilmişse OneSignal abonesi olarak kaydet
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          if (OneSignal?.User?.PushSubscription) {
            await OneSignal.User.PushSubscription.optIn().catch(() => {});
          }
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
