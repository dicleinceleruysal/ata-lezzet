import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dishNamesParam = searchParams.get('dishNames');
    const userId = searchParams.get('userId');
    const dateStr = searchParams.get('dateStr');
    const isSummary = searchParams.get('summary') === 'true';

    // 1. Tüm yemeklerin özet sıralaması (Admin & Akıllı Menü Oluşturucu için)
    if (isSummary) {
      const groups = await prisma.dishRating.groupBy({
        by: ['dishName'],
        _avg: { score: true },
        _count: { score: true },
      });

      const ranking = groups.map((g) => ({
        dishName: g.dishName,
        average: Number((g._avg.score || 0).toFixed(1)),
        count: g._count.score,
      })).sort((a, b) => {
        // Önce ortalama puana, eşitse oy sayısına göre sırala
        if (b.average !== a.average) return b.average - a.average;
        return b.count - a.count;
      });

      return NextResponse.json({
        success: true,
        dishes: ranking,
      });
    }

    // 2. Belirli yemeklerin puan özetleri (Günün menüsündeki yemekler için)
    if (dishNamesParam) {
      const dishNames = dishNamesParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      if (dishNames.length === 0) {
        return NextResponse.json({ success: true, ratings: {} });
      }

      // Her yemek için ortalama ve toplam oy sayısı
      const groups = await prisma.dishRating.groupBy({
        by: ['dishName'],
        where: {
          dishName: { in: dishNames },
        },
        _avg: { score: true },
        _count: { score: true },
      });

      // Kullanıcının daha önce verdiği oylar
      let userVotes: { dishName: string; score: number }[] = [];
      if (userId) {
        userVotes = await prisma.dishRating.findMany({
          where: {
            dishName: { in: dishNames },
            userId,
            ...(dateStr ? { dateStr } : {}),
          },
          select: {
            dishName: true,
            score: true,
          },
        });
      }

      const userVotesMap = new Map<string, number>();
      for (const v of userVotes) {
        userVotesMap.set(v.dishName, v.score);
      }

      const ratings: Record<
        string,
        { average: number; count: number; userScore: number | null }
      > = {};

      for (const name of dishNames) {
        const found = groups.find((g) => g.dishName.toLowerCase() === name.toLowerCase());
        const userScore = userVotesMap.get(name) ?? null;

        ratings[name] = {
          average: found ? Number((found._avg.score || 0).toFixed(1)) : 0,
          count: found ? found._count.score : 0,
          userScore,
        };
      }

      return NextResponse.json({
        success: true,
        ratings,
      });
    }

    return NextResponse.json({ success: true, ratings: {} });
  } catch (error) {
    console.error('Dish ratings GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Puanlar alınamadı.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dishName, score, dateStr, userId } = body;

    if (!dishName || typeof dishName !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Yemek adı belirtilmelidir.' },
        { status: 400 }
      );
    }

    const numericScore = Number(score);
    if (isNaN(numericScore) || numericScore < 1 || numericScore > 5) {
      return NextResponse.json(
        { success: false, error: 'Puan 1 ile 5 arasında olmalıdır.' },
        { status: 400 }
      );
    }

    const trimmedDishName = dishName.trim();

    // Kullanıcı kimliği varsa daha önce oy verip vermediğini kontrol et
    if (userId) {
      const existing = await prisma.dishRating.findFirst({
        where: {
          dishName: trimmedDishName,
          userId,
          ...(dateStr ? { dateStr } : {}),
        },
      });

      if (existing) {
        // Mevcut oyu güncelle
        await prisma.dishRating.update({
          where: { id: existing.id },
          data: {
            score: numericScore,
            updatedAt: new Date(),
          },
        });
      } else {
        // Yeni oy kaydet
        await prisma.dishRating.create({
          data: {
            dishName: trimmedDishName,
            score: numericScore,
            dateStr: dateStr || null,
            userId,
          },
        });
      }
    } else {
      // Anonim oy kaydet
      await prisma.dishRating.create({
        data: {
          dishName: trimmedDishName,
          score: numericScore,
          dateStr: dateStr || null,
        },
      });
    }

    // Güncellenmiş istatistikleri hesapla
    const agg = await prisma.dishRating.aggregate({
      where: { dishName: trimmedDishName },
      _avg: { score: true },
      _count: { score: true },
    });

    return NextResponse.json({
      success: true,
      dishName: trimmedDishName,
      average: Number((agg._avg.score || 0).toFixed(1)),
      count: agg._count.score,
      userScore: numericScore,
    });
  } catch (error) {
    console.error('Dish ratings POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Puan kaydedilirken hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const dishName = searchParams.get('dishName');
    const resetAll = searchParams.get('resetAll') === 'true';

    if (resetAll) {
      await prisma.dishRating.deleteMany({});
      return NextResponse.json({ success: true, message: 'Tüm yemek puanları sıfırlandı.' });
    }

    if (id) {
      await prisma.dishRating.delete({ where: { id } });
      return NextResponse.json({ success: true, message: 'Oy silindi.' });
    }

    if (dishName) {
      await prisma.dishRating.deleteMany({ where: { dishName } });
      return NextResponse.json({ success: true, message: `${dishName} puanları sıfırlandı.` });
    }

    return NextResponse.json(
      { success: false, error: 'Silinecek parametre belirtilmedi.' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Dish ratings DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Silme işlemi sırasında hata oluştu.' },
      { status: 500 }
    );
  }
}
