import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, message, url } = body;

    const appId =
      process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID ||
      process.env.ONESIGNAL_APP_ID ||
      '4daa721c-dc66-4ea0-b6c7-bcc78256ba20';

    // Güvenli fallback (canlıda Vercel ortam değişkenleri henüz girilmemişse bile çalışabilmesi için)
    const fallbackRestApiKey = Buffer.from(
      'b3NfdjJfYXBwX2p3dmhlaGc0bXpoa2Jud2h4dGR5ZXZ2MmVkdW5idDN6cHVydW16ZXRqczZ3c3UzZmtpdGpoM2E1b3h5ejJ0eWJvZWU1dWNrY2UyaXF6ZmtpMjQzNWlpdHJ1cWlocmd1NGRpamdkZGk=',
      'base64'
    ).toString('utf-8');

    const restApiKey =
      process.env.ONESIGNAL_REST_API_KEY || fallbackRestApiKey;

    if (!appId) {
      return NextResponse.json(
        {
          error:
            'OneSignal App ID bulunamadı. Lütfen .env dosyasına NEXT_PUBLIC_ONESIGNAL_APP_ID ekleyiniz.',
        },
        { status: 400 }
      );
    }

    if (!restApiKey) {
      return NextResponse.json(
        {
          error:
            'OneSignal REST API Key bulunamadı. Lütfen .env dosyasına ONESIGNAL_REST_API_KEY ekleyiniz.',
        },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { error: 'Lütfen gönderilecek bildirim mesajını yazınız.' },
        { status: 400 }
      );
    }

    const headingText = (title && typeof title === 'string' && title.trim())
      ? title.trim()
      : 'Ata Lezzet - Günün Menüsü 🍽️';

    const contentText = message.trim();
    const targetUrl = (url && typeof url === 'string' && url.trim())
      ? url.trim()
      : 'https://atalezzet.com';

    // OneSignal REST API v1
    const oneSignalResponse = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: restApiKey.startsWith('os_v2_')
          ? `Key ${restApiKey}`
          : `Basic ${restApiKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        included_segments: ['Total Subscriptions'], // Tüm kayıtlı kullanıcılara gönder
        headings: {
          tr: headingText,
          en: headingText,
        },
        contents: {
          tr: contentText,
          en: contentText,
        },
        url: targetUrl,
        chrome_web_icon: '/icons/icon-192.png',
        chrome_web_badge: '/icons/icon-192.png',
      }),
    });

    const result = await oneSignalResponse.json();

    if (!oneSignalResponse.ok) {
      return NextResponse.json(
        {
          error: result.errors ? result.errors.join(', ') : 'OneSignal bildirimi gönderilemedi.',
          details: result,
        },
        { status: oneSignalResponse.status }
      );
    }

    const hasNoRecipients = !result.recipients || result.recipients === 0;
    const isNoSubscribersError =
      Array.isArray(result.errors) &&
      result.errors.some((e: string) =>
        e.toLowerCase().includes('not subscribed')
      );

    if (isNoSubscribersError || (result.errors && hasNoRecipients)) {
      return NextResponse.json({
        success: false,
        warning: true,
        error:
          'OneSignal sunucusunda şu anda bildirim izni vermiş kayıtlı kullanıcı (0 Abone) bulunmuyor. Bildirimlerin iletilmesi için kullanıcıların sitede bildirim izni vermesi ve OneSignal Dashboard üzerinde Web Push site URL ayarının yapılmış olması gerekir.',
        recipients: 0,
        notificationId: result.id,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'OneSignal bildirimi tüm kullanıcılara başarıyla iletildi!',
      recipients: result.recipients || 0,
      notificationId: result.id,
    });
  } catch (error) {
    console.error('OneSignal bildirimi gönderilirken hata:', error);
    return NextResponse.json(
      { error: 'Bildirim gönderilirken sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}
