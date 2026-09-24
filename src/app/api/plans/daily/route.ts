import { NextResponse } from 'next/server';
import { getOrCreateDailyPlan, updateDailyPlanMeals, getTodayLunchMenu } from '@/services/mealService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const todayLunch = await getTodayLunchMenu();
    const dailyPlan = await getOrCreateDailyPlan();

    return NextResponse.json({
      todayLunch,
      dailyPlan,
    });
  } catch (error) {
    console.error('Günlük plan alınırken hata:', error);
    return NextResponse.json(
      { error: 'Günlük plan alınırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { dailyPlanId, mealIds } = body;

    if (!dailyPlanId || !Array.isArray(mealIds)) {
      return NextResponse.json(
        { error: 'Geçersiz parametreler. dailyPlanId ve mealIds zorunludur.' },
        { status: 400 }
      );
    }

    const updatedDailyPlan = await updateDailyPlanMeals(dailyPlanId, mealIds);
    return NextResponse.json({
      success: true,
      message: 'Günün yemekleri başarıyla güncellendi.',
      dailyPlan: updatedDailyPlan,
    });
  } catch (error) {
    console.error('Günlük plan güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Günlük plan güncellenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
