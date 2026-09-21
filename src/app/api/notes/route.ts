import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const notes = await prisma.userNote.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(notes);
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
        { error: 'Not içeriği boş bırakılamaz.' },
        { status: 400 }
      );
    }

    const newNote = await prisma.userNote.create({
      data: {
        content: content.trim(),
        status: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Notunuz başarıyla kaydedildi.',
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
