import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const MONTH_NAMES = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('dateStr');
    const isAdmin = searchParams.get('admin') === 'true';

    // Aktif yılı ve ayı belirle (Varsayılan: Şu anki yıl ve ay)
    const now = new Date();
    const activeYear = searchParams.get('year')
      ? parseInt(searchParams.get('year')!, 10)
      : now.getFullYear();
    const activeMonth = searchParams.get('month')
      ? parseInt(searchParams.get('month')!, 10)
      : now.getMonth() + 1; // 1-12

    // Sadece bulunduğumuz ayın başlangıç ve bitiş zaman aralığı (Ay yenilendiğinde otomatik sıfırlanır)
    const startOfMonth = new Date(Date.UTC(activeYear, activeMonth - 1, 1, 0, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(activeYear, activeMonth, 0, 23, 59, 59, 999));

    const monthName = `${MONTH_NAMES[activeMonth - 1]} ${activeYear}`;

    // Yönetici Detaylı Görünümü (Sadece içinde bulunulan ay)
    if (isAdmin) {
      const monthRatings = await prisma.menuRating.findMany({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
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

      monthRatings.forEach((r) => {
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

      const totalVotes = monthRatings.length;
      const overallAverage =
        totalVotes > 0
          ? Number(
              (
                monthRatings.reduce((sum, r) => sum + r.score, 0) / totalVotes
              ).toFixed(1)
            )
          : 0;

      return NextResponse.json(
        {
          currentMonth: {
            year: activeYear,
            month: activeMonth,
            monthName,
          },
          stats: {
            totalVotes,
            overallAverage,
            ratedDaysCount: daysSummary.length,
          },
          days: daysSummary,
          recentVotes: monthRatings.slice(0, 50),
        },
        {
          headers: { 'Cache-Control': 'no-store, max-age=0' },
        }
      );
    }

    if (!dateStr) {
      // Tüm tarihlerin içinde bulunulan aya ait özet puanları
      const monthRatings = await prisma.menuRating.findMany({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      });

      const summaryByDate: Record<string, { totalScore: number; count: number }> = {};
      monthRatings.forEach((r) => {
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

    // Belirli bir günün puanları (Bu ay içerisindeki)
    const ratings = await prisma.menuRating.findMany({
      where: {
        dateStr,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
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

    // Güncel ay aralığında ortalamayı hesapla
    const now = new Date();
    const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999));

    const ratings = await prisma.menuRating.findMany({
      where: {
        dateStr: dateStr.trim(),
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
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
    const resetAll = searchParams.get('resetAll') === 'true';

    // Tüm puanlamaları tamamen sıfırla (ay yenilendiğinde veya talep edildiğinde)
    if (resetAll) {
      await prisma.menuRating.deleteMany({});
      return NextResponse.json({
        success: true,
        message: 'Tüm puanlamalar başarıyla sıfırlandı.',
      });
    }

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
        message: `${dateStr} gününün puanları sıfırlandı.`,
      });
    }

    return NextResponse.json(
      { error: 'Silinecek id, dateStr veya resetAll belirtilmedi.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Puan silinirken hata:', error);
    return NextResponse.json({ error: 'Puan silinemedi' }, { status: 500 });
  }
}
