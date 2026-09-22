import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('dateStr');
    const isAdmin = searchParams.get('admin') === 'true';

    // Yönetici Detaylı Görünümü
    if (isAdmin) {
      const allRatings = await prisma.menuRating.findMany({
        orderBy: { createdAt: 'desc' },
      });

      // Gün bazlı gruplama
      const byDate: Record<
        string,
        {
          dateStr: string;
          totalScore: number;
          count: number;
          distribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
          latestVoteAt: string;
        }
      > = {};

      allRatings.forEach((r) => {
        if (!byDate[r.dateStr]) {
          byDate[r.dateStr] = {
            dateStr: r.dateStr,
            totalScore: 0,
            count: 0,
            distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            latestVoteAt: r.createdAt.toISOString(),
          };
        }
        byDate[r.dateStr].totalScore += r.score;
        byDate[r.dateStr].count += 1;
        const s = Math.min(Math.max(r.score, 1), 5) as 1 | 2 | 3 | 4 | 5;
        byDate[r.dateStr].distribution[s] += 1;
      });

      const daysSummary = Object.values(byDate).map((item) => ({
        dateStr: item.dateStr,
        average: Number((item.totalScore / item.count).toFixed(1)),
        count: item.count,
        distribution: item.distribution,
        latestVoteAt: item.latestVoteAt,
      }));

      // Genel toplamlar
      const totalVotes = allRatings.length;
      const overallAverage =
        totalVotes > 0
          ? Number(
              (
                allRatings.reduce((sum, r) => sum + r.score, 0) / totalVotes
              ).toFixed(1)
            )
          : 0;

      return NextResponse.json(
        {
          stats: {
            totalVotes,
            overallAverage,
            ratedDaysCount: daysSummary.length,
          },
          days: daysSummary,
          recentVotes: allRatings.slice(0, 50),
        },
        {
          headers: { 'Cache-Control': 'no-store, max-age=0' },
        }
      );
    }

    if (!dateStr) {
      // Tüm tarihlerin basit özet puanlarını döndür
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const dateStr = searchParams.get('dateStr');

    if (id) {
      await prisma.menuRating.delete({
        where: { id },
      });
      return NextResponse.json({ success: true, message: 'Değerlendirme silindi.' });
    }

    if (dateStr) {
      await prisma.menuRating.deleteMany({
        where: { dateStr },
      });
      return NextResponse.json({
        success: true,
        message: `${dateStr} gününün tüm puanları sıfırlandı.`,
      });
    }

    return NextResponse.json(
      { error: 'Silinecek id veya dateStr belirtilmedi.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Puan silinirken hata:', error);
    return NextResponse.json({ error: 'Puan silinemedi' }, { status: 500 });
  }
}
