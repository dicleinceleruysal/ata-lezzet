import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, message, url } = body;

    const appId =
      process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || process.env.ONESIGNAL_APP_ID;
    const restApiKey = process.env.ONESIGNAL_REST_API_KEY;

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
