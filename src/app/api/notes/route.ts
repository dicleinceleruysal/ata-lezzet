import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    const whereClause: { status?: string } = {};
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
