import { NextResponse } from 'next/server';
import { getTodayLunchMenu } from '@/services/mealService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // 1. Bugünün menüsünü çek
    const todayLunch = await getTodayLunchMenu();

    if (!todayLunch) {
      return NextResponse.json({
        success: false,
        message: 'Bugün için planlanmış bir menü bulunamadı.',
      });
    }

    if (todayLunch.isSunday) {
      return NextResponse.json({
        success: false,
        message: 'Pazar günleri yemek hizmeti bulunmadığı için bildirim gönderilmedi.',
      });
    }

    const items = todayLunch.items && todayLunch.items.length > 0
      ? todayLunch.items
      : [];

    let menuDescription = '';
    if (items.length > 0) {
      menuDescription = items.join(', ');
    } else if (todayLunch.mealText) {
      menuDescription = todayLunch.mealText;
    }

    if (!menuDescription.trim()) {
      menuDescription = 'Günün lezzetli öğle yemeği hazır! Şimdi menüyü inceleyin.';
    }

    const headingText = 'Ata Lezzet - Günün Menüsü 🍽️';
    const contentText = `Bugünün menüsü: ${menuDescription}. Afiyet olsun!`;
    const siteBase = 'https://ata-lezzet.vercel.app';

    // 2. OneSignal Bilgilerini Çek
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

    // 3. OneSignal REST API ile Tüm Abonelere Gönder
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
        url: siteBase,
        chrome_web_icon: `${siteBase}/icons/icon-192.png`,
        firefox_icon: `${siteBase}/icons/icon-192.png`,
        priority: 10,
        ttl: 86400,
      }),
    });

    const result = await oneSignalResponse.json();

    return NextResponse.json({
      success: true,
      message: '11:30 Günün menüsü bildirimi OneSignal üzerinden tüm kullanıcılara gönderildi!',
      menu: menuDescription,
      oneSignalResult: result,
    });
  } catch (error) {
    console.error('11:30 Otomatik menü bildirimi gönderilirken hata:', error);
    return NextResponse.json(
      { error: 'Bildirim gönderilirken sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}
