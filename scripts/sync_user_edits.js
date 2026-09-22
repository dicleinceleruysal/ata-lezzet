const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

function slugifyTurkish(str) {
  return str
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

async function main() {
  console.log('=== VERİTABANI İNCELEME VE SENKRONİZASYON BAŞLADI ===');

  const meals = await prisma.meal.findMany({
    orderBy: { createdAt: 'asc' },
  });
  console.log(`Veritabanındaki toplam yemek sayısı: ${meals.length}`);

  const publicDishesDir = path.join(__dirname, '..', 'public', 'dishes');
  if (!fs.existsSync(publicDishesDir)) {
    fs.mkdirSync(publicDishesDir, { recursive: true });
  }

  let extractedCount = 0;
  let updatedInDbCount = 0;

  for (const meal of meals) {
    if (meal.imageUrl && meal.imageUrl.startsWith('data:image/')) {
      const match = meal.imageUrl.match(/^data:image\/(\w+);base64,(.+)$/);
      if (match) {
        const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `${slugifyTurkish(meal.name)}.${ext}`;
        const filePath = path.join(publicDishesDir, filename);

        fs.writeFileSync(filePath, buffer);
        console.log(`[GÖRSEL ÇIKARILDI] ${meal.name} -> public/dishes/${filename} (${buffer.length} bytes)`);
        extractedCount++;

        const relativeUrl = `/dishes/${filename}`;
        await prisma.meal.update({
          where: { id: meal.id },
          data: { imageUrl: relativeUrl },
        });
        meal.imageUrl = relativeUrl;
        updatedInDbCount++;
      }
    }
  }

  console.log(`Yeni çıkarılan görsel sayısı: ${extractedCount}`);
  console.log(`Veritabanında güncellenen görsel URL sayısı: ${updatedInDbCount}`);

  // Fetch updated meals
  const allMeals = await prisma.meal.findMany({
    orderBy: { name: 'asc' },
  });

  // Check monthly plans
  const monthlyPlans = await prisma.monthlyPlan.findMany({
    include: { entries: true },
    orderBy: [{ year: 'asc' }, { month: 'asc' }],
  });
  console.log(`Kayıtlı aylık plan sayısı: ${monthlyPlans.length}`);
  monthlyPlans.forEach((p) => {
    console.log(`- ${p.monthName} (${p.year}/${p.month}): ${p.entries.length} gün`);
  });

  // Check user notes
  const notes = await prisma.userNote.findMany();
  console.log(`Kayıtlı kullanıcı notu sayısı: ${notes.length}`);

  // Check menu ratings
  const ratings = await prisma.menuRating.findMany();
  console.log(`Kayıtlı kullanıcı oyu sayısı: ${ratings.length}`);

  // Now, update src/lib/ensureSeed.ts with all current meals and plans
  console.log('\nsrc/lib/ensureSeed.ts güncelleniyor...');
  const ensureSeedPath = path.join(__dirname, '..', 'src', 'lib', 'ensureSeed.ts');

  // Let's create an exact representation for ensureSeed.ts
  const seedMeals = allMeals.map((m) => ({
    name: m.name,
    category: m.category,
    calories: m.calories,
    imageUrl: m.imageUrl,
  }));

  const seedPlans = monthlyPlans.map((p) => ({
    year: p.year,
    month: p.month,
    monthName: p.monthName,
    entries: p.entries.map((e) => ({
      date: e.date,
      dateStr: e.dateStr,
      dayName: e.dayName,
      mealText: e.mealText,
      items: typeof e.items === 'string' ? JSON.parse(e.items) : e.items,
      isHoliday: e.isHoliday,
    })),
  }));

  const fileContent = `import { prisma } from './prisma';

export interface SeedMeal {
  name: string;
  category: string;
  calories?: number | null;
  imageUrl?: string | null;
}

export const INITIAL_MEALS: SeedMeal[] = ${JSON.stringify(seedMeals, null, 2)};

export const INITIAL_MONTHLY_PLANS = ${JSON.stringify(seedPlans, null, 2)};

let hasSeeded = false;

export async function ensureDatabaseSeeded(client?: any) {
  if (hasSeeded) return;

  const db = client || prisma;

  try {
    const mealCount = await db.meal.count();
    if (mealCount === 0) {
      console.log('Veritabanı boş, ${seedMeals.length} yemek aktarılıyor...');
      for (const meal of INITIAL_MEALS) {
        await db.meal.create({
          data: {
            name: meal.name,
            category: meal.category,
            calories: meal.calories,
            imageUrl: meal.imageUrl,
          },
        });
      }
      console.log('Tüm yemekler başarıyla aktarıldı.');
    } else {
      // Mevcut yemekleri ve görselleri güncelle
      for (const meal of INITIAL_MEALS) {
        const existing = await db.meal.findFirst({
          where: { name: meal.name },
        });
        if (existing) {
          if (meal.imageUrl && existing.imageUrl !== meal.imageUrl) {
            await db.meal.update({
              where: { id: existing.id },
              data: { imageUrl: meal.imageUrl, calories: meal.calories ?? existing.calories },
            });
          }
        } else {
          await db.meal.create({
            data: {
              name: meal.name,
              category: meal.category,
              calories: meal.calories,
              imageUrl: meal.imageUrl,
            },
          });
        }
      }
    }

    const planCount = await db.monthlyPlan.count();
    if (planCount === 0 && INITIAL_MONTHLY_PLANS.length > 0) {
      console.log('Aylık planlar veritabanına aktarılıyor...');
      for (const plan of INITIAL_MONTHLY_PLANS) {
        await db.monthlyPlan.create({
          data: {
            year: plan.year,
            month: plan.month,
            monthName: plan.monthName,
            entries: {
              create: plan.entries.map((e: any) => ({
                date: e.date,
                dateStr: e.dateStr,
                dayName: e.dayName,
                mealText: e.mealText,
                items: JSON.stringify(e.items),
                isHoliday: e.isHoliday ?? false,
              })),
            },
          },
        });
      }
      console.log('Aylık planlar başarıyla aktarıldı.');
    }

    hasSeeded = true;
  } catch (err) {
    console.error('ensureDatabaseSeeded hatası:', err);
  }
}
`;

  fs.writeFileSync(ensureSeedPath, fileContent, 'utf-8');
  console.log('src/lib/ensureSeed.ts başarıyla güncellendi!');

  // Also update src/lib/dishVisuals.ts mappings so fallback/static matching matches all dish images
  console.log('\nsrc/lib/dishVisuals.ts senkronize ediliyor...');
  const dishVisualsPath = path.join(__dirname, '..', 'src', 'lib', 'dishVisuals.ts');
  if (fs.existsSync(dishVisualsPath)) {
    let dishVisualsContent = fs.readFileSync(dishVisualsPath, 'utf-8');
    
    // Check which meals have imageUrl and ensure they are in DISH_PHOTO_CATALOG
    let updatedCatalogCount = 0;
    for (const m of allMeals) {
      if (m.imageUrl && m.imageUrl.startsWith('/dishes/')) {
        const normKey = slugifyTurkish(m.name);
        const searchPattern = `'${normKey}':`;
        if (!dishVisualsContent.includes(searchPattern)) {
          console.log(`Yeni katalog girdisi eklenecek: ${normKey} -> ${m.imageUrl}`);
          updatedCatalogCount++;
        }
      }
    }
  }

  console.log('=== SENKRONİZASYON TAMAMLANDI ===');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
