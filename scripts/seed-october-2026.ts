import { prisma } from '../src/lib/prisma';

interface DayMenu {
  day: number;
  dayName: string;
  items: string[];
}

const OCTOBER_DAYS: DayMenu[] = [
  {
    day: 1,
    dayName: 'Perşembe',
    items: ['ŞEHRİYE ÇORBASI', 'HAMBURGER', 'PATATES KIZARTMASI', 'SALATABAR']
  },
  {
    day: 2,
    dayName: 'Cuma',
    items: ['YAYLA ÇORBASI', 'BİBER DOLMASI', 'AVCI BÖREĞİ', 'SALATABAR']
  },
  {
    day: 3,
    dayName: 'Cumartesi',
    items: ['ÇOBAN KAVURMA', 'PİLAV']
  },
  // 4 Ekim Pazar - Tatil
  {
    day: 5,
    dayName: 'Pazartesi',
    items: ['KREMALI MANTAR ÇORBASI', 'ETLİ NOHUT', 'PİLAV', 'SALATABAR', 'PUDİNG']
  },
  {
    day: 6,
    dayName: 'Salı',
    items: ['DOMATES ÇORBASI', 'ÇİN USULÜ TAVUK', 'SPAGETTİ', 'SALATABAR']
  },
  {
    day: 7,
    dayName: 'Çarşamba',
    items: ['MISIR ÇORBASI', 'GÜVEÇTE ET', 'BULGUR PİLAVI', 'SALATABAR']
  },
  {
    day: 8,
    dayName: 'Perşembe',
    items: ['YOĞURT ÇORBASI', 'YEŞİL FASULYE', 'PİLAV', 'SALATABAR', 'MEYVE']
  },
  {
    day: 9,
    dayName: 'Cuma',
    items: ['EZOGELİN ÇORBASI', 'PATATES OTURTMA', 'CEVİZLİ ERİŞTE', 'SALATABAR']
  },
  {
    day: 10,
    dayName: 'Cumartesi',
    items: ['KÖFTE', 'AYRAN']
  },
  // 11 Ekim Pazar - Tatil
  {
    day: 12,
    dayName: 'Pazartesi',
    items: ['MERCİMEK ÇORBASI', 'ET DÖNER', 'PİLAV', 'SALATABAR']
  },
  {
    day: 13,
    dayName: 'Salı',
    items: ['TARHANA ÇORBASI', 'KABAK DOLMA', 'MAKARNA', 'KIBRIS TATLISI', 'SALATABAR']
  },
  {
    day: 14,
    dayName: 'Çarşamba',
    items: ['SEBZE ÇORBASI', 'IZGARA KANAT', 'BULGUR PİLAVI', 'SALATABAR']
  },
  {
    day: 15,
    dayName: 'Perşembe',
    items: ['DÜĞÜN ÇORBASI', 'KURU FASULYE', 'PİLAV', 'SALATABAR', 'MEYVE']
  },
  {
    day: 16,
    dayName: 'Cuma',
    items: ['ŞEHRİYE ÇORBASI', 'KÖFTE', 'PATATES BİBER KIZARTMA', 'SALATABAR']
  },
  {
    day: 17,
    dayName: 'Cumartesi',
    items: ['CİĞER']
  },
  // 18 Ekim Pazar - Tatil
  {
    day: 19,
    dayName: 'Pazartesi',
    items: ['HAVUÇ ÇORBASI', 'ANKARA TAVA', 'SALATABAR', 'MEYVE']
  },
  {
    day: 20,
    dayName: 'Salı',
    items: ['YAYLA ÇORBASI', 'BEZELYE YEMEĞİ', 'PİLAV', 'SALATABAR']
  },
  {
    day: 21,
    dayName: 'Çarşamba',
    items: ['EZOGELİN ÇORBASI', 'TAVUK ÇÖPŞİŞ', 'ERİŞTE', 'SALATABAR']
  },
  {
    day: 22,
    dayName: 'Perşembe',
    items: ['TANDIR ÇORBASI', 'KARNIYARIK', 'PİLAV', 'SALATABAR', 'KAZANDİBİ']
  },
  {
    day: 23,
    dayName: 'Cuma',
    items: ['DOMATES ÇORBASI', 'ISPANAK YEMEĞİ', 'PEYNİRLİ MAKARNA', 'SALATABAR']
  },
  {
    day: 24,
    dayName: 'Cumartesi',
    items: ['PİDE', 'AYRAN']
  },
  // 25 Ekim Pazar - Tatil
  {
    day: 26,
    dayName: 'Pazartesi',
    items: ['TARHANA ÇORBASI', 'ÇÖKERTME KEBABI', 'SPAGETTİ', 'SALATABAR']
  },
  {
    day: 27,
    dayName: 'Salı',
    items: ['DÜĞÜN ÇORBASI', 'BARBUNYA YEMEĞİ', 'PATATESLİ KOL BÖREĞİ', 'SALATABAR']
  },
  {
    day: 28,
    dayName: 'Çarşamba',
    items: ['MERCİMEK ÇORBASI', 'MANTAR SOTE', 'BULGUR PİLAVI', 'SALATABAR', 'TİRAMİSU']
  },
  {
    day: 29,
    dayName: 'Perşembe',
    items: ['MISIR ÇORBASI', 'ARNAVUT CİĞERİ', 'PİLAV', 'SALATABAR']
  },
  {
    day: 30,
    dayName: 'Cuma',
    items: ['YEŞİL MERCİMEK ÇORBASI', 'MEVSİM TÜRLÜ', 'YOĞURTLU MAKARNA', 'SALATABAR', 'MEYVE']
  },
  {
    day: 31,
    dayName: 'Cumartesi',
    items: ['FIRIN TAVUK', 'PİLAV']
  }
];

const MEALS_TO_ENSURE = [
  { name: 'KÖFTE', category: 'ana_yemek', calories: 270, imageUrl: '/dishes/izgara_kofte.jpg' },
  { name: 'CİĞER', category: 'ana_yemek', calories: 310, imageUrl: '/dishes/arnavut_cigeri.jpg' },
  { name: 'SPAGETTİ', category: 'yan_yemek', calories: 225, imageUrl: '/dishes/spagetti_makarna.jpg' },
  { name: 'KREMALI MANTAR ÇORBASI', category: 'corba', calories: 155, imageUrl: '/dishes/mantar_corbasi.jpg' },
  { name: 'GÜVEÇTE ET', category: 'ana_yemek', calories: 330, imageUrl: '/dishes/et_kavurma.jpg' },
  { name: 'CEVİZLİ ERİŞTE', category: 'yan_yemek', calories: 245, imageUrl: '/dishes/eriste.jpg' },
  { name: 'PATATES BİBER KIZARTMA', category: 'yan_yemek', calories: 220, imageUrl: '/dishes/karisik_kizartma.jpg' },
  { name: 'MANTAR SOTE', category: 'ana_yemek', calories: 200, imageUrl: '/dishes/mantar_kavurma.jpg' },
  { name: 'YEŞİL FASULYE', category: 'ana_yemek', calories: 160, imageUrl: '/dishes/taze_fasulye.jpg' }
];

async function main() {
  console.log('1. Veritabanındaki yemekler kontrol ediliyor ve eksikler tamamlanıyor...');
  for (const m of MEALS_TO_ENSURE) {
    const existing = await prisma.meal.findFirst({
      where: { name: { equals: m.name, mode: 'insensitive' } }
    });
    if (!existing) {
      await prisma.meal.create({
        data: {
          name: m.name,
          category: m.category,
          calories: m.calories,
          imageUrl: m.imageUrl,
          isActive: true
        }
      });
      console.log(`  + Yeni yemek eklendi: ${m.name} (${m.category})`);
    } else {
      console.log(`  ✓ Zaten mevcut: ${existing.name}`);
    }
  }

  console.log('\n2. Ekim 2026 aylık planı hazırlanıyor...');
  const monthlyPlan = await prisma.monthlyPlan.upsert({
    where: {
      year_month: {
        year: 2026,
        month: 10
      }
    },
    update: {
      monthName: 'Ekim 2026'
    },
    create: {
      year: 2026,
      month: 10,
      monthName: 'Ekim 2026'
    }
  });

  console.log(`  Aylık Plan ID: ${monthlyPlan.id}`);

  // Mevcut Ekim kayıtlarını temizle
  const deleteResult = await prisma.dailyMenuEntry.deleteMany({
    where: {
      monthlyPlanId: monthlyPlan.id
    }
  });
  console.log(`  Eski silinen kayıt sayısı: ${deleteResult.count}`);

  console.log('\n3. Yeni 27 günlük Ekim listesi oluşturuluyor...');
  for (const item of OCTOBER_DAYS) {
    const dateObj = new Date(Date.UTC(2026, 9, item.day, 0, 0, 0, 0)); // Month 9 is October (0-indexed)
    const dateStr = `${item.day} Ekim 2026 ${item.dayName}`;
    const mealText = item.items.join(', ');

    await prisma.dailyMenuEntry.create({
      data: {
        monthlyPlanId: monthlyPlan.id,
        date: dateObj,
        dateStr,
        dayName: item.dayName,
        mealText,
        items: JSON.stringify(item.items),
        isHoliday: false
      }
    });

    console.log(`  ✓ [${dateStr}] -> ${mealText}`);
  }

  console.log('\n✅ EKİM 2026 YEMEK LİSTESİ BAŞARIYLA OLUŞTURULDU!');
  await prisma.$disconnect();
}

main().catch(err => {
  console.error('Hata:', err);
  process.exit(1);
});
