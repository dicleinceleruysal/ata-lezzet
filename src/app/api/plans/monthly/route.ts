import { NextResponse } from 'next/server';
import { getMonthlyPlan, saveMonthlyPlan, getAllMonthlyPlansSummary } from '@/services/mealService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isSummary = searchParams.get('summary') === 'true';

    if (isSummary) {
      const summaryList = await getAllMonthlyPlansSummary();
      return NextResponse.json(summaryList);
    }

    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!, 10) : undefined;
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!, 10) : undefined;

    const plan = await getMonthlyPlan(year, month);
    if (!plan) {
      return NextResponse.json(
        { error: 'Aylık yemek planı bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Aylık plan alınırken hata:', error);
    return NextResponse.json(
      { error: 'Aylık plan alınırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { year, month, monthName, entries } = body;

    if (!year || !month || !Array.isArray(entries)) {
      return NextResponse.json(
        { error: 'Geçersiz parametreler. year, month ve entries zorunludur.' },
        { status: 400 }
      );
    }

    const updatedPlan = await saveMonthlyPlan({
      year: parseInt(year, 10),
      month: parseInt(month, 10),
      monthName,
      entries,
    });

    return NextResponse.json({
      success: true,
      message: 'Aylık liste başarıyla kaydedildi (Pazar günleri hariç tutuldu).',
      plan: updatedPlan,
    });
  } catch (error) {
    console.error('Aylık plan kaydedilirken hata:', error);
    return NextResponse.json(
      { error: 'Aylık plan kaydedilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
