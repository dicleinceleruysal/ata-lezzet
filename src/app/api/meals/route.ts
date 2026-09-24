import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMealCalories } from '@/lib/mealCalories';
import { ensureDatabaseSeeded } from '@/lib/ensureSeed';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await ensureDatabaseSeeded(prisma);
    const meals = await prisma.meal.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
    return NextResponse.json(meals);
  } catch (error) {
    console.error('Yemekleri çekerken hata:', error);
    return NextResponse.json({ error: 'Yemekler alınamadı' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, calories, imageUrl, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Yemek adı zorunludur.' },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    const lowerName = trimmedName.toLowerCase();
    
    // Kural: pilav, makarna veya börek adı geçiyorsa otomatik olarak yan_yemek grubuna işle
    let finalCategory = category || 'ana_yemek';
    if (
      lowerName.includes('pilav') ||
      lowerName.includes('makarna') ||
      lowerName.includes('börek') ||
      lowerName.includes('borek')
    ) {
      finalCategory = 'yan_yemek';
    }

    const finalCalories = calories !== undefined && calories !== null && calories !== ''
      ? Number(calories)
      : getMealCalories(trimmedName, finalCategory);

    const trimmedImageUrl = typeof imageUrl === 'string' ? imageUrl.trim() : null;
    const trimmedDescription = typeof description === 'string' ? description.trim() : null;

    const newMeal = await prisma.meal.create({
      data: {
        name: trimmedName,
        category: finalCategory,
        calories: finalCalories,
        imageUrl: trimmedImageUrl || null,
        description: trimmedDescription || null,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Yemek başarıyla eklendi.',
      meal: newMeal,
    });
  } catch (error) {
    console.error('Yemek eklerken hata:', error);
    return NextResponse.json(
      { error: 'Yemek eklenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, category, calories, imageUrl, description } = body;

    if (!id || !name) {
      return NextResponse.json(
        { error: 'Yemek ID ve adı zorunludur.' },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    const lowerName = trimmedName.toLowerCase();

    // Kural: pilav, makarna veya börek adı geçiyorsa otomatik olarak yan_yemek grubuna işle
    let finalCategory = category || 'ana_yemek';
    if (
      lowerName.includes('pilav') ||
      lowerName.includes('makarna') ||
      lowerName.includes('börek') ||
      lowerName.includes('borek')
    ) {
      finalCategory = 'yan_yemek';
    }

    const finalCalories = calories !== undefined && calories !== null && calories !== ''
      ? Number(calories)
      : getMealCalories(trimmedName, finalCategory);

    const dataToUpdate: Record<string, unknown> = {
      name: trimmedName,
      category: finalCategory,
      calories: finalCalories,
    };

    if (imageUrl !== undefined) {
      dataToUpdate.imageUrl = typeof imageUrl === 'string' && imageUrl.trim() ? imageUrl.trim() : null;
    }

    if (description !== undefined) {
      dataToUpdate.description = typeof description === 'string' && description.trim() ? description.trim() : null;
    }

    const updatedMeal = await prisma.meal.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({
      success: true,
      message: 'Yemek başarıyla güncellendi.',
      meal: updatedMeal,
    });
  } catch (error) {
    console.error('Yemek güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Yemek güncellenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Silinecek yemek ID zorunludur.' },
        { status: 400 }
      );
    }

    await prisma.meal.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Yemek başarıyla silindi.',
    });
  } catch (error) {
    console.error('Yemek silinirken hata:', error);
    return NextResponse.json(
      { error: 'Yemek silinirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
