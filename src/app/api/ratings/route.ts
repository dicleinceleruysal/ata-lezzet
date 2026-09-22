import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('dateStr');

    if (!dateStr) {
      // Tüm tarihlerin özet puanlarını döndür
      const allRatings = await prisma.menuRating.findMany();
      const summaryByDate: Record<string, { totalScore: number; count: number }> = {};

      allRatings.forEach((r) => {
        if (!summaryByDate[r.dateStr]) {
          summaryByDate[r.dateStr] = { totalScore: 0, count: 0 };
        }
        summaryByDate[r.dateStr].totalScore += r.score;
        summaryByDate[r.dateStr].count += 1;
      });

      const result: Record<string, { average: number; count: number }> = {};
      Object.keys(summaryByDate).forEach((d) => {
        const item = summaryByDate[d];
        result[d] = {
          average: Number((item.totalScore / item.count).toFixed(1)),
          count: item.count,
        };
      });

      return NextResponse.json(result, {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      });
    }

    // Belirli bir günün puanları
    const ratings = await prisma.menuRating.findMany({
      where: { dateStr },
    });

    if (ratings.length === 0) {
      return NextResponse.json({
        dateStr,
        average: 0,
        totalCount: 0,
      });
    }

    const totalScore = ratings.reduce((sum, r) => sum + r.score, 0);
    const average = Number((totalScore / ratings.length).toFixed(1));

    return NextResponse.json(
      {
        dateStr,
        average,
        totalCount: ratings.length,
      },
      {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      }
    );
  } catch (error) {
    console.error('Puanlar alınırken hata:', error);
    return NextResponse.json({ error: 'Puanlar alınamadı' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dateStr, score } = body;

    if (!dateStr || typeof dateStr !== 'string') {
      return NextResponse.json({ error: 'Tarih bilgisi eksik.' }, { status: 400 });
    }

    const numericScore = Number(score);
    if (!numericScore || numericScore < 1 || numericScore > 5) {
      return NextResponse.json({ error: 'Puan 1 ile 5 arasında olmalıdır.' }, { status: 400 });
    }

    await prisma.menuRating.create({
      data: {
        dateStr: dateStr.trim(),
        score: Math.round(numericScore),
      },
    });

    // Güncel ortalamayı hesapla
    const ratings = await prisma.menuRating.findMany({
      where: { dateStr: dateStr.trim() },
    });

    const totalScore = ratings.reduce((sum, r) => sum + r.score, 0);
    const average = Number((totalScore / ratings.length).toFixed(1));

    return NextResponse.json({
      success: true,
      message: 'Puanınız başarıyla kaydedildi!',
      average,
      totalCount: ratings.length,
    });
  } catch (error) {
    console.error('Puan kaydedilirken hata:', error);
    return NextResponse.json({ error: 'Puan kaydedilemedi' }, { status: 500 });
  }
}
