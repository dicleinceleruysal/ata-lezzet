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
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    if (!appId) {
      // Henüz App ID girilmediyse konsolda bilgilendir
      console.info(
        '[OneSignal] NEXT_PUBLIC_ONESIGNAL_APP_ID tanımlanmadığı için OneSignal başlatılmadı. .env dosyasına ekleyebilirsiniz.'
      );
      return;
    }

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
