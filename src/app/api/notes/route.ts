import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    // Türkiye saati (UTC+3)
    const nowTurkey = new Date(Date.now() + 3 * 3600 * 1000);
    const curYear = nowTurkey.getUTCFullYear();
    const curMonth = nowTurkey.getUTCMonth(); // 0-indexed

    // Ay başı (Önceki ayların başlangıcı)
    const startOfCurrentMonth = new Date(Date.UTC(curYear, curMonth, 1, 0, 0, 0));

    // Otomatik Temizlik: Önceki aylara ait yorumları veritabanından sil
    try {
      await prisma.userNote.deleteMany({
        where: {
          createdAt: {
            lt: startOfCurrentMonth,
          },
        },
      });
    } catch (cleanErr) {
      console.warn('Önceki ay yorumları temizlenirken uyarı:', cleanErr);
    }

    // İstenen yıl ve ay (varsayılan: bu ay)
    const activeYear = searchParams.get('year')
      ? parseInt(searchParams.get('year')!, 10)
      : curYear;
    const activeMonth = searchParams.get('month')
      ? parseInt(searchParams.get('month')!, 10)
      : curMonth + 1; // 1-indexed

    const startOfSelectedMonth = new Date(Date.UTC(activeYear, activeMonth - 1, 1, 0, 0, 0));
    const endOfSelectedMonth = new Date(Date.UTC(activeYear, activeMonth, 1, 0, 0, 0));

    // Sadece seçili aya ait yorumları filtrele
    const whereClause: {
      status?: string;
      createdAt?: {
        gte: Date;
        lt: Date;
      };
    } = {
      createdAt: {
        gte: startOfSelectedMonth,
        lt: endOfSelectedMonth,
      },
    };

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const notes = await prisma.userNote.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit, 10) : undefined,
    });

    return NextResponse.json(notes, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Notları çekerken hata:', error);
    return NextResponse.json({ error: 'Notlar alınamadı' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json(
        { error: 'Lütfen göndermek istediğiniz notu yazınız.' },
        { status: 400 }
      );
    }

    const trimmed = content.trim();
    if (trimmed.length < 2) {
      return NextResponse.json(
        { error: 'Not çok kısa, lütfen en az 2 karakter yazınız.' },
        { status: 400 }
      );
    }

    const newNote = await prisma.userNote.create({
      data: {
        content: trimmed,
        status: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Notunuz yöneticiye başarıyla iletildi. Teşekkür ederiz!',
      note: newNote,
    });
  } catch (error) {
    console.error('Not kaydederken hata:', error);
    return NextResponse.json(
      { error: 'Not veritabanına kaydedilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Geçersiz not ID.' }, { status: 400 });
    }

    if (!status || !['pending', 'reviewed', 'archived'].includes(status)) {
      return NextResponse.json({ error: 'Geçersiz durum değeri.' }, { status: 400 });
    }

    const updatedNote = await prisma.userNote.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: 'Not durumu güncellendi.',
      note: updatedNote,
    });
  } catch (error) {
    console.error('Not güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Not durumu güncellenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Özel İşlem: Önceki aylara ait tüm yorumları manuel silme
    if (searchParams.get('clearPrevious') === 'true') {
      const nowTurkey = new Date(Date.now() + 3 * 3600 * 1000);
      const startOfCurrentMonth = new Date(
        Date.UTC(nowTurkey.getUTCFullYear(), nowTurkey.getUTCMonth(), 1, 0, 0, 0)
      );
      const res = await prisma.userNote.deleteMany({
        where: {
          createdAt: {
            lt: startOfCurrentMonth,
          },
        },
      });
      return NextResponse.json({
        success: true,
        message: `${res.count} adet önceki ay yorumu silindi.`,
        deletedCount: res.count,
      });
    }

    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch {
        // Body boş olabilir, query param kullanılıyor
      }
    }

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Silinecek not ID bulunamadı.' }, { status: 400 });
    }

    await prisma.userNote.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Not başarıyla silindi.',
    });
  } catch (error) {
    console.error('Not silinirken hata:', error);
    return NextResponse.json(
      { error: 'Not silinirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
