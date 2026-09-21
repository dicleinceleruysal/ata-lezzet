import { PrismaClient } from '@prisma/client';
import { getMealCalories } from '../src/lib/mealCalories.ts';

const prisma = new PrismaClient();

async function main() {
  const plan = await prisma.monthlyPlan.findFirst({
    where: { year: 2026, month: 9 },
    include: {
      entries: {
        orderBy: { date: 'asc' }
      }
    }
  });

  if (!plan) {
    console.log('Eylül 2026 planı bulunamadı');
    return;
  }

  const allMeals = await prisma.meal.findMany();
  const mealCalMap = {};
  allMeals.forEach(m => {
    mealCalMap[m.name.trim().toLowerCase()] = m.calories;
  });

  console.log('=== EYLÜL 2026 GÜNLÜK TABLDOT MENÜLERİ VE KALORİ TOPLAMLARI ===');
  for (const entry of plan.entries) {
    const dishes = entry.mealText.split(',').map(s => s.trim());
    let total = 0;
    const details = [];
    for (const d of dishes) {
      const cal = mealCalMap[d.toLowerCase()] ?? getMealCalories(d);
      total += cal;
      details.push(`${d} (${cal} kcal)`);
    }
    console.log(`${entry.dateStr} (${entry.dayName}) [${dishes.length} Kap]: TOPLAM ${total} kcal`);
    console.log(`   -> ${details.join(' + ')}`);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
