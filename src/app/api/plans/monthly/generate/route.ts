import { NextResponse } from 'next/server';
import { generateSmartMonthlyMenu } from '@/services/mealService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { year, month } = body;

    if (!year || !month) {
      return NextResponse.json(
        { error: 'Yıl ve Ay parametreleri zorunludur.' },
        { status: 400 }
      );
    }

    const generated = await generateSmartMonthlyMenu({
      year: parseInt(year, 10),
      month: parseInt(month, 10),
    });

    return NextResponse.json({
      success: true,
      plan: generated,
    });
  } catch (error) {
    console.error('Menü oluşturulurken hata:', error);
    return NextResponse.json(
      { error: 'Otomatik menü oluşturulurken bir hata meydana geldi.' },
      { status: 500 }
    );
  }
}
