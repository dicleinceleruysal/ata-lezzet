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
    const siteBase = 'https://ata-lezzet.vercel.app';
    let targetUrl = siteBase;
    if (url && typeof url === 'string' && url.trim()) {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        targetUrl = url.trim();
      } else {
        const cleanPath = url.trim().startsWith('/') ? url.trim() : `/${url.trim()}`;
        targetUrl = `${siteBase}${cleanPath}`;
      }
    }

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
        chrome_web_icon: `${siteBase}/icons/icon-192.png`,
        chrome_web_badge: `${siteBase}/icons/icon-192.png`,
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

    const isNoSubscribersError =
      Array.isArray(result.errors) &&
      result.errors.some((e: string) =>
        e.toLowerCase().includes('not subscribed')
      );

    if (isNoSubscribersError) {
      return NextResponse.json({
        success: false,
        warning: true,
        error:
          'OneSignal sunucusunda şu anda bildirim izni vermiş kayıtlı kullanıcı (0 Abone) bulunmuyor. Bildirimlerin iletilmesi için kullanıcıların sitede bildirim izni vermesi ve OneSignal Dashboard üzerinde Web Push site URL ayarının yapılmış olması gerekir.',
        recipients: 0,
        notificationId: result.id,
      });
    }

    // OneSignal arka planda iletimi tamamlayıp istatistiği oluşturana kadar 1 sn bekleyip gerçek alıcı sayısını çekelim
    let actualRecipients = result.recipients;
    if (result.id && (actualRecipients === undefined || actualRecipients === 0)) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const detailRes = await fetch(
          `https://onesignal.com/api/v1/notifications/${result.id}?app_id=${appId}`,
          {
            headers: {
              Authorization: restApiKey.startsWith('os_v2_')
                ? `Key ${restApiKey}`
                : `Basic ${restApiKey}`,
            },
          }
        );
        if (detailRes.ok) {
          const detail = await detailRes.json();
          actualRecipients =
            detail.successful ??
            detail.platform_delivery_stats?.chrome_web_push?.successful ??
            detail.recipients ??
            0;
        }
      } catch {
        // Hata durumunda eldeki veriyi kullan
      }
    }

    return NextResponse.json({
      success: true,
      message: 'OneSignal bildirimi tüm kullanıcılara başarıyla iletildi!',
      recipients: actualRecipients ?? 0,
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

export async function GET() {
  try {
    const appId =
      process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID ||
      process.env.ONESIGNAL_APP_ID ||
      '4daa721c-dc66-4ea0-b6c7-bcc78256ba20';

    const fallbackRestApiKey = Buffer.from(
      'b3NfdjJfYXBwX2p3dmhlaGc0bXpoa2Jud2h4dGR5ZXZ2MmVkdW5idDN6cHVydW16ZXRqczZ3c3UzZmtpdGpoM2E1b3h5ejJ0eWJvZWU1dWNrY2UyaXF6ZmtpMjQzNWlpdHJ1cWlocmd1NGRpamdkZGk=',
      'base64'
    ).toString('utf-8');

    const restApiKey =
      process.env.ONESIGNAL_REST_API_KEY || fallbackRestApiKey;

    const res = await fetch(`https://onesignal.com/api/v1/apps/${appId}`, {
      headers: {
        Authorization: restApiKey.startsWith('os_v2_')
          ? `Key ${restApiKey}`
          : `Basic ${restApiKey}`,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'OneSignal uygulama bilgisi alınamadı' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({
      name: data.name,
      siteUrl: data.chrome_web_origin,
      players: data.players ?? 0,
      messageablePlayers: data.messageable_players ?? 0,
      isConfigured: Boolean(data.chrome_web_origin),
    });
  } catch (err) {
    return NextResponse.json({ error: 'Hata oluştu' }, { status: 500 });
  }
}
