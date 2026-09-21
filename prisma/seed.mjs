import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const eylul2026List = [
  { day: 1, dateStr: '1 Eylül 2026', dayName: 'Salı', mealText: 'ŞEHRİYE ÇORBASI, YEŞİL FASÜLYE, YOĞURTLU MAKARNA, MEYVE, SALATABAR' },
  { day: 2, dateStr: '2 Eylül 2026', dayName: 'Çarşamba', mealText: 'MERCİMEK ÇORBASI, ARNAVUT CİĞERİ, BULGUR PİLAVI, AYRAN, SALATABAR' },
  { day: 3, dateStr: '3 Eylül 2026', dayName: 'Perşembe', mealText: 'TANDIR ÇORBASI, BİBER DOLMASI, PEYNİRLİ MAKARNA, PROFİTEROL, SALATABAR' },
  { day: 4, dateStr: '4 Eylül 2026', dayName: 'Cuma', mealText: 'YEŞİL MERCİMEK ÇORBASI, IZGARA KÖFTE, PİLAV, SALATABAR' },
  { day: 5, dateStr: '5 Eylül 2026', dayName: 'Cumartesi', mealText: 'TARHANA ÇORBASI, MENEMEN, MAKARNA' },
  // 6 Eylül Pazar yok
  { day: 7, dateStr: '7 Eylül 2026', dayName: 'Pazartesi', mealText: 'YOĞURT ÇORBASI, TAVUK ŞİNİTSEL, SPAGETTİ MAKARNA, FIRIN SÜTLAÇ, SALATABAR' },
  { day: 8, dateStr: '8 Eylül 2026', dayName: 'Salı', mealText: 'EZOGELİN ÇORBA, ISPANAK YEMEĞİ, FIRIN MAKARNA, SALATABAR' },
  { day: 9, dateStr: '9 Eylül 2026', dayName: 'Çarşamba', mealText: 'DOMATES ÇORBASI, PİZZA, PATATES KIZARTMASI, İÇECEK, SALATABAR' },
  { day: 10, dateStr: '10 Eylül 2026', dayName: 'Perşembe', mealText: 'TARHANA ÇORBASI, KABAK DOLMA, ERİŞTE, KARPUZ, SALATABAR' },
  { day: 11, dateStr: '11 Eylül 2026', dayName: 'Cuma', mealText: 'BROKOLİ ÇORBASI, ÇÖKERTME KEBABI, PİLAV, SALATABAR' },
  { day: 12, dateStr: '12 Eylül 2026', dayName: 'Cumartesi', mealText: 'PİDE, AYRAN' },
  // 13 Eylül Pazar yok
  { day: 14, dateStr: '14 Eylül 2026', dayName: 'Pazartesi', mealText: 'MERCİMEK ÇORBASI, TAVUK SOTE, PİRİNÇ PİLAVI, CACIK, SALATABAR' },
  { day: 15, dateStr: '15 Eylül 2026', dayName: 'Salı', mealText: 'YAYLA ÇORBASI, KARNIYARIK, BULGUR PİLAVI, MEYVE, SALATABAR' },
  { day: 16, dateStr: '16 Eylül 2026', dayName: 'Çarşamba', mealText: 'EZOGELİN ÇORBASI, KURU FASULYE, ŞEHRİYELİ PİLAV, TURŞU, SALATABAR' },
  { day: 17, dateStr: '17 Eylül 2026', dayName: 'Perşembe', mealText: 'DOMATES ÇORBASI, İZMİR KÖFTE, MAKARNA, SÜTLAÇ, SALATABAR' },
  { day: 18, dateStr: '18 Eylül 2026', dayName: 'Cuma', mealText: 'DÜĞÜN ÇORBASI, TAS KEBABI, PİLAV, AYRAN, SALATABAR' },
  { day: 19, dateStr: '19 Eylül 2026', dayName: 'Cumartesi', mealText: 'LAHMACUN, AYRAN, SALATABAR' },
  // 20 Eylül Pazar yok
  { day: 21, dateStr: '21 Eylül 2026', dayName: 'Pazartesi', mealText: 'ŞEHRİYE ÇORBASI, TAVUK DÖNER, PİLAV, TATLI, SALATABAR' },
  { day: 22, dateStr: '22 Eylül 2026', dayName: 'Salı', mealText: 'MERCİMEK ÇORBASI, ET KAVURMA, BULGUR PİLAVI, MEYVE, SALATABAR' },
  { day: 23, dateStr: '23 Eylül 2026', dayName: 'Çarşamba', mealText: 'EZOGELİN ÇORBASI, KÖFTE PATATES, MAKARNA, AYRAN, SALATABAR' },
  { day: 24, dateStr: '24 Eylül 2026', dayName: 'Perşembe', mealText: 'YAYLA ÇORBASI, BEZELYE YEMEĞİ, PİRİNÇ PİLAVI, CACIK, SALATABAR' },
  { day: 25, dateStr: '25 Eylül 2026', dayName: 'Cuma', mealText: 'TARHANA ÇORBASI, FIRIN TAVUK, PİLAV, KEMALPAŞA, SALATABAR' },
  { day: 26, dateStr: '26 Eylül 2026', dayName: 'Cumartesi', mealText: 'KIYMALI BÖREK, AYRAN, MEYVE' },
  // 27 Eylül Pazar yok
  { day: 28, dateStr: '28 Eylül 2026', dayName: 'Pazartesi', mealText: 'DOMATES ÇORBASI, GÜVEÇTE KÖFTE, MAKARNA, SÜTLAÇ, SALATABAR' },
  { day: 29, dateStr: '29 Eylül 2026', dayName: 'Salı', mealText: 'MERCİMEK ÇORBASI, KURU FASULYE, PİRİNÇ PİLAVI, TURŞU, SALATABAR' },
  { day: 30, dateStr: '30 Eylül 2026', dayName: 'Çarşamba', mealText: 'TANDIR ÇORBASI, TAVUK KAVURMA, BULGUR PİLAVI, AYRAN, SALATABAR' },
];

async function main() {
  console.log('Eylül 2026 Aylık Planı veritabanına ekleniyor (Pazar günleri hariç)...');

  // Aylık planı bul veya oluştur
  const monthlyPlan = await prisma.monthlyPlan.upsert({
    where: {
      year_month: {
        year: 2026,
        month: 9,
      },
    },
    update: {
      monthName: 'Eylül 2026',
    },
    create: {
      year: 2026,
      month: 9,
      monthName: 'Eylül 2026',
    },
  });

  // Eski kayıtları temizle ve yenilerini ekle
  await prisma.dailyMenuEntry.deleteMany({
    where: { monthlyPlanId: monthlyPlan.id },
  });

  for (const item of eylul2026List) {
    const itemDate = new Date(Date.UTC(2026, 8, item.day, 12, 0, 0));
    const itemsArray = item.mealText.split(',').map((s) => s.trim()).filter(Boolean);

    await prisma.dailyMenuEntry.create({
      data: {
        monthlyPlanId: monthlyPlan.id,
        date: itemDate,
        dateStr: item.dateStr,
        dayName: item.dayName,
        mealText: item.mealText,
        items: JSON.stringify(itemsArray),
        isHoliday: false,
      },
    });
  }

  console.log(`Başarıyla ${eylul2026List.length} adet günün öğle yemeği kaydedildi.`);
}

main()
  .catch((e) => {
    console.error('Hata:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
