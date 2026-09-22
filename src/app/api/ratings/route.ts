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
    const userId = searchParams.get('userId');
    const isAdmin = searchParams.get('admin') === 'true';

    const now = new Date();
    const activeYear = searchParams.get('year')
      ? parseInt(searchParams.get('year')!, 10)
      : now.getFullYear();
    const activeMonth = searchParams.get('month')
      ? parseInt(searchParams.get('month')!, 10)
      : now.getMonth() + 1; // 1-12

    const monthName = `${MONTH_NAMES[activeMonth - 1]} ${activeYear}`;

    // 1. YÖNETİCİ GÖRÜNÜMÜ
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
          recentVotes: allRatings.slice(0, 50),
        },
        {
          headers: { 'Cache-Control': 'no-store, max-age=0' },
        }
      );
    }

    // 2. BELİRLİ BİR GÜNÜN PUANI
    if (dateStr) {
      const cleanDate = dateStr.trim();
      const ratings = await prisma.menuRating.findMany({
        where: {
          dateStr: cleanDate,
        },
      });

      const totalCount = ratings.length;
      const totalScore = ratings.reduce((sum, r) => sum + r.score, 0);
      const average = totalCount > 0 ? Number((totalScore / totalCount).toFixed(1)) : 0;

      let userRating: number | null = null;
      let hasVoted = false;

      if (userId && typeof userId === 'string' && userId.trim()) {
        const userVote = ratings.find((r) => r.userId === userId.trim());
        if (userVote) {
          userRating = userVote.score;
          hasVoted = true;
        }
      }

      return NextResponse.json(
        {
          dateStr: cleanDate,
          average,
          totalCount,
          userRating,
          hasVoted,
        },
        {
          headers: { 'Cache-Control': 'no-store, max-age=0' },
        }
      );
    }

    // 3. TÜM GÜNLERİN ÖZETİ
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
  } catch (error) {
    console.error('Puanlar alınırken hata:', error);
    return NextResponse.json({ error: 'Puanlar alınamadı' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { dateStr, score, userId } = body;

    if (!dateStr || typeof dateStr !== 'string') {
      return NextResponse.json({ error: 'Tarih bilgisi eksik.' }, { status: 400 });
    }

    const numericScore = Number(score);
    if (!numericScore || numericScore < 1 || numericScore > 5) {
      return NextResponse.json({ error: 'Puan 1 ile 5 arasında olmalıdır.' }, { status: 400 });
    }

    // Cookie veya header'dan userId yedek kontrolü
    if (!userId || typeof userId !== 'string' || !userId.trim()) {
      const cookieHeader = request.headers.get('cookie') || '';
      const match = cookieHeader.match(/ata_voter_id=([^;]+)/);
      if (match) {
        userId = decodeURIComponent(match[1]);
      } else {
        userId = 'voter_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      }
    }

    const cleanUserId = userId.trim();
    const cleanDateStr = dateStr.trim();
    const roundedScore = Math.round(numericScore);

    // 1 KULLANICI = 1 OY KESİN KURALI:
    // Bu kullanıcının bu gün için daha önce oyu var mı kontrol et:
    const existingVote = await prisma.menuRating.findFirst({
      where: {
        dateStr: cleanDateStr,
        userId: cleanUserId,
      },
    });

    if (existingVote) {
      // Kullanıcı zaten oy vermiş - tekrar oy vermesine veya değiştirmesine izin verme
      const currentRatings = await prisma.menuRating.findMany({
        where: { dateStr: cleanDateStr },
      });
      const totalCount = currentRatings.length;
      const totalScore = currentRatings.reduce((sum, r) => sum + r.score, 0);
      const average = totalCount > 0 ? Number((totalScore / totalCount).toFixed(1)) : 0;

      const response = NextResponse.json({
        success: false,
        alreadyVoted: true,
        message: 'Bu menü için daha önce oy kullandınız. Her kullanıcı yalnızca 1 kez oy verebilir.',
        average,
        totalCount,
        userRating: existingVote.score,
        hasVoted: true,
      });

      response.cookies.set('ata_voter_id', cleanUserId, {
        maxAge: 365 * 24 * 60 * 60,
        path: '/',
        sameSite: 'lax',
      });

      return response;
    }

    // İlk kez oy veriyor: Yeni oyu kaydet
    await prisma.menuRating.create({
      data: {
        dateStr: cleanDateStr,
        score: roundedScore,
        userId: cleanUserId,
      },
    });

    // Güncel günün tüm oylarını ve ortalamasını hesapla
    const ratings = await prisma.menuRating.findMany({
      where: {
        dateStr: cleanDateStr,
      },
    });

    const totalCount = ratings.length;
    const totalScore = ratings.reduce((sum, r) => sum + r.score, 0);
    const average = totalCount > 0 ? Number((totalScore / totalCount).toFixed(1)) : 0;

    const response = NextResponse.json({
      success: true,
      message: `Notunuz (${roundedScore}/5) başarıyla kaydedildi!`,
      average,
      totalCount,
      userRating: roundedScore,
      hasVoted: true,
    });

    // Cookie set et (1 yıl geçerli)
    response.cookies.set('ata_voter_id', cleanUserId, {
      maxAge: 365 * 24 * 60 * 60,
      path: '/',
      sameSite: 'lax',
    });

    return response;
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

    // Tüm puanlamaları tamamen sıfırla
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
        where: { dateStr: dateStr.trim() },
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
