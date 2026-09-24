import { NextResponse } from 'next/server';
import { getOrCreateWeeklyPlan } from '@/services/mealService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const plan = await getOrCreateWeeklyPlan();
    if (!plan) {
      return NextResponse.json(
        { error: 'Haftalık plan bulunamadı.' },
        { status: 404 }
      );
    }
    return NextResponse.json(plan);
  } catch (error) {
    console.error('Haftalık plan alınırken hata:', error);
    return NextResponse.json(
      { error: 'Haftalık plan yüklenemedi.' },
      { status: 500 }
    );
  }
}
