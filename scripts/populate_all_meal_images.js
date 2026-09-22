const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

function normalizeVisualName(str) {
  if (!str) return '';
  return str
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim();
}

async function populateAllMealImages() {
  const content = fs.readFileSync('./src/lib/dishVisuals.ts', 'utf-8');
  const keysMatch = content.match(/CURATED_DISH_IMAGES: Record<string, string> = \{([\s\S]*?)\};/);
  const map = {};
  if (keysMatch) {
    keysMatch[1].split('\n').forEach(l => {
      const m = l.match(/'([^']+)':\s*'([^']+)'/);
      if (m) map[m[1]] = m[2];
    });
  }

  const meals = await prisma.meal.findMany();
  console.log(`Processing ${meals.length} meals in database...`);

  let updatedCount = 0;
  let preservedGeminiCount = 0;

  for (const meal of meals) {
    const norm = normalizeVisualName(meal.name);
    const targetUrl = map[norm] || meal.imageUrl;

    if (!targetUrl) {
      console.warn(`No target image for: ${meal.name}`);
      continue;
    }

    // If already has this image, skip
    if (meal.imageUrl === targetUrl) {
      if (targetUrl.startsWith('/dishes/')) preservedGeminiCount++;
      continue;
    }

    // Update meal imageUrl
    await prisma.meal.update({
      where: { id: meal.id },
      data: { imageUrl: targetUrl }
    });
    updatedCount++;
    if (targetUrl.startsWith('/dishes/')) {
      preservedGeminiCount++;
    }
  }

  console.log(`Database Update Complete!`);
  console.log(`- Updated: ${updatedCount} meals`);
  console.log(`- Preserved/Set Gemini images: ${preservedGeminiCount} meals`);
  
  // Verify 0 meals with empty imageUrl
  const emptyMeals = await prisma.meal.count({
    where: {
      OR: [
        { imageUrl: null },
        { imageUrl: '' }
      ]
    }
  });
  console.log(`- Meals with missing imageUrl: ${emptyMeals}`);
}

populateAllMealImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
