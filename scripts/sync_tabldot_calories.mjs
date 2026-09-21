import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Tabldot kalori haritası (src/lib/mealCalories.ts ile 1:1 senkronize)
const MEAL_CALORIES_MAP = {
  // === ÇORBALAR (1 Standart Kepçe ~ 200 ml) ===
  'MERCİMEK ÇORBASI': 125,
  'EZOGELİN ÇORBA': 120,
  'EZOGELİN ÇORBASI': 120,
  'TARHANA ÇORBASI': 115,
  'YAYLA ÇORBASI': 130,
  'YOĞURT ÇORBASI': 125,
  'DOMATES ÇORBASI': 105,
  'ŞEHRİYE ÇORBASI': 110,
  'TEL ŞEHRİYE ÇORBASI': 110,
  'SEBZE ÇORBASI': 90,
  'HAVUÇ ÇORBASI': 95,
  'BROKOLİ ÇORBASI': 85,
  'MANTAR ÇORBASI': 100,
  'KREMALI MANTAR ÇORBASI': 155,
  'TAVUKSUYU ÇORBA': 120,
  'DÜĞÜN ÇORBASI': 145,
  'TOYGA ÇORBASI': 125,
  'KÖYLÜM ÇORBA': 120,
  'TANDIR ÇORBASI': 160,
  'ARABAŞI ÇORBASI': 135,
  'MISIR ÇORBASI': 120,
  'SOĞUK ÇORBA': 110,
  'YEŞİL MERCİMEK ÇORBASI': 125,
  'ÇORBA': 115,

  // === ANA YEMEKLER — ET & KÖFTE & KEBAP (Tabldot Porsiyonu ~180-220g) ===
  'ADANA KEBAP': 310,
  'ANKARA TAVA': 360,
  'ARNAVUT CİĞERİ': 310,
  'BEĞENDİLİ KEBAP': 370,
  'ÇOBAN KAVURMA': 330,
  'ÇÖKERTME KEBABI': 370,
  'ELBASAN TAVA': 340,
  'ET DÖNER': 280,
  'ET KAVURMA': 340,
  'ETLİ PATATES YEMEĞİ': 280,
  'GÜVEÇTE KÖFTE': 320,
  'HAMBURGER': 360,
  'HASANPAŞA KÖFTE': 330,
  'ISLANMIŞ KÖFTE': 290,
  'IZGARA KÖFTE': 270,
  'İSLİM KEBABI': 320,
  'İZMİR KÖFTE': 310,
  'KADINBUDU KÖFTE': 290,
  'KAVURMA': 340,
  'MİSKET KÖFTE': 280,
  'Orman Kebabı': 310,
  'PÜRELİ ANTRİKOT': 360,
  'ROSTO ET': 290,
  'ROSTO KÖFTE': 310,
  'TAS KEBABI': 320,
  'TERBİYELİ ET HAŞLAMA': 290,

  // === ANA YEMEKLER — TAVUK YEMEKLERİ (Tabldot Porsiyonu ~120-140g et) ===
  'FIRIN TAVUK': 270,
  'FIRINDA SEBZELİ TAVUK': 260,
  'FIRINDA SOSLU TAVUK BAGET': 260,
  'FIRINDA TAVUK PİRZOLA': 280,
  'IZGARA KANAT': 290,
  'KREMALI MANTARLI TAVUK': 320,
  'KREMALI TAVUK': 310,
  'KÖRİLİ TAVUK': 270,
  'LAVAŞ ÜSTÜ TAVUK TANTUNİ': 320,
  'SOYA SOSLU TAVUK': 260,
  'TAVUK BEYTİ': 340,
  'TAVUK ÇÖPŞİŞ': 260,
  'TAVUK DÖNER': 260,
  'TAVUK FAJİTA': 280,
  'TAVUK KAVURMA': 270,
  'TAVUK SOTE': 250,
  'TAVUK SULTAN KEBABI': 350,
  'TAVUK ŞİŞ KEBAP': 270,
  'TAVUK ŞNİTZEL': 310,
  'TAVUK ŞİNİTSEL': 310,
  'TAVUKLU BÜRYAN PİLAVI': 360,
  'TAVUKLU ÇÖKERTME KEBABI': 330,
  'TAVUKLU MAKLUBE': 380,
  'TAVUKLU ORMAN KEBABI': 280,
  'TAVUKLU SARAY SARMASI': 310,
  'ÇITIR PİLİÇ': 310,
  'ÇİN USULÜ TAVUK': 260,

  // === ANA YEMEKLER — BAKLİYAT & SEBZE & DOLMA & HAMUR İŞİ ===
  'BARBUNYA YEMEĞİ': 260,
  'BEZELYE YEMEĞİ': 190,
  'BİBER DOLMASI': 220,
  'ETLİ KURU FASÜLYE': 290,
  'ETLİ MEVSİM TÜRLÜ': 240,
  'ETLİ NOHUT': 290,
  'Fırında Karnıyarık': 260,
  'ISPANAK YEMEĞİ': 160,
  'KABAK DOLMA': 210,
  'KABAK SANDAL': 220,
  'KARIŞIK KIZARTMA': 280,
  'KARNABAHAR GRATEN': 230,
  'KARNIYARIK': 260,
  'KIYMALI PIRASA': 190,
  'KREMALI MANTAR KAVURMA': 220,
  'KURU FASULYE': 250,
  'KURU FASÜLYE': 250,
  'LAHMACUN': 240,
  'LAZANYA': 340,
  'MANTAR KAVURMA': 170,
  'MANTI': 340,
  'MENEMEN': 190,
  'MEVSİM TÜRLÜ': 180,
  'PATATES OTURTMA': 280,
  'PATATES YEMEĞİ': 210,
  'PATLICAN MUSAKKA': 270,
  'PİDE': 320,
  'PİZZA': 320,
  'SEMİZ YEMEĞİ': 150,
  'TAZE FASÜLYE': 160,
  'YEŞİL FASÜLYE': 160,
  'YALANCI MANTI': 320,
  'YEŞİL MERCİMEK': 240,

  // === YAN YEMEKLER — PİLAV & MAKARNA & BÖREK & PATATES (1 Servis Kaşığı / 1 Dilim ~140-160g) ===
  'BULGUR PİLAVI': 195,
  'ŞEHRİYELİ BULGUR PİLAVI': 200,
  'SEBZELİ BULGUR PİLAVI': 185,
  'MEYHANE PİLAVI': 200,
  'PİRİNÇ PİLAVI': 230,
  'PİLAV': 230,
  'ŞEHRİYELİ PİRİNÇ PİLAVI': 230,
  'SEBZELİ PİRİNÇ PİLAVI': 215,
  'ŞEHRİYE PİLAVI': 220,
  'MAKARNA': 220,
  'SOSLU MAKARNA': 230,
  'PEYNİRLİ MAKARNA': 240,
  'YOĞURTLU MAKARNA': 230,
  'FIRIN MAKARNA': 270,
  'SPAGETTİ MAKARNA': 225,
  'ERİŞTE': 220,
  'PEYNİRLİ ERİŞTE': 245,
  'PEYNİRLİ BÖREK': 260,
  'ISPANAKLI BÖREK': 240,
  'KIYMALI BÖREK': 280,
  'PAÇANGA BÖREĞİ': 300,
  'AVCI BÖREĞİ': 290,
  'PATATESLİ KOL BÖREĞİ': 260,
  'SEBZELİ TAVUKLU BÖREK': 270,
  'PATATES PÜRESİ': 160,
  'PATATES KIZARTMASI': 250,
  'FIRINDA BAHARATLI PATATES': 180,
  'BİBER KIZARTMASI': 150,

  // === SALATALAR & MEZELER (1 Tabldot Kasesi ~ 100-120g) ===
  'SALATABAR': 55,
  'SALATA': 55,
  'CACIK': 70,
  'TURŞU': 20,
  'ŞAKŞUKA': 120,
  'PATATES SALATASI': 150,

  // === TATLILAR & MEYVELER (1 Porsiyon Kase / Dilim ~ 100-130g) ===
  'SÜTLAÇ': 210,
  'FIRIN SÜTLAÇ': 210,
  'KAZANDİBİ': 190,
  'PUDİNG': 165,
  'SUPANGELE': 200,
  'AŞURE': 240,
  'KEMALPAŞA': 210,
  'HAŞHAŞLI REVANİ': 260,
  'KALBURA BASTI TATLISI': 260,
  'KIBRIS TATLISI': 270,
  'TİRAMİSU': 240,
  'PROFİTEROL': 260,
  'ISLAK KEK': 250,
  'AĞLAYAN PASTA': 250,
  'GELİN TÜLÜ TATLISI': 230,
  'Cevizli Baklava (2 Dilim)': 280,
  'KOMPOSTO': 110,
  'MEYVE': 55,
  'KARPUZ': 45,

  // === İÇECEKLER (1 Kutu / Bardak ~ 170-200 ml) ===
  'AYRAN': 70,
  'İÇECEK': 80,
};

function normalizeText(s) {
  if (!s) return '';
  return s
    .toLowerCase()
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/i̇/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9]/g, '');
}

const NORM_MAP = new Map();
for (const [key, val] of Object.entries(MEAL_CALORIES_MAP)) {
  NORM_MAP.set(normalizeText(key), val);
}

function calculateTabldotCalories(dishName, category) {
  if (!dishName) return 0;
  if (MEAL_CALORIES_MAP[dishName]) return MEAL_CALORIES_MAP[dishName];
  const norm = normalizeText(dishName);
  if (NORM_MAP.has(norm)) return NORM_MAP.get(norm);

  if (norm.includes('corba')) return 115;
  if (norm.includes('borek')) return 260;
  if (norm.includes('pilav')) return 220;
  if (norm.includes('makarna') || norm.includes('eriste')) return 225;
  if (norm.includes('kebap') || norm.includes('kofte') || norm.includes('kavurma')) return 310;
  if (norm.includes('tavuk')) return 270;
  if (norm.includes('salata') || norm.includes('cacik')) return 60;
  if (norm.includes('tatli') || norm.includes('pasta') || norm.includes('sutlac')) return 230;
  if (norm.includes('meyve')) return 55;
  if (norm.includes('ayran')) return 70;

  if (category === 'corba') return 115;
  if (category === 'yan_yemek') return 220;
  if (category === 'salata') return 60;
  if (category === 'tatli') return 220;
  if (category === 'icecek') return 75;
  return 280;
}

async function main() {
  console.log('Tabldot porsiyon kalibrasyonu başlatılıyor...');
  const meals = await prisma.meal.findMany();
  console.log(`Veritabanında toplam ${meals.length} yemek bulundu.`);

  let updatedCount = 0;
  for (const meal of meals) {
    const newCal = calculateTabldotCalories(meal.name, meal.category);
    if (meal.calories !== newCal) {
      await prisma.meal.update({
        where: { id: meal.id },
        data: { calories: newCal }
      });
      updatedCount++;
    }
  }

  console.log(`Başarıyla ${updatedCount} adet yemeğin kalorisi tabldot porsiyon standartlarına güncellendi.`);
  
  // Özet kontrol
  const updatedMeals = await prisma.meal.findMany({ select: { name: true, category: true, calories: true } });
  const categoryAverages = {};
  for (const m of updatedMeals) {
    if (!categoryAverages[m.category]) {
      categoryAverages[m.category] = { count: 0, sum: 0 };
    }
    categoryAverages[m.category].count++;
    categoryAverages[m.category].sum += m.calories || 0;
  }

  console.log('\n=== Kategori Bazlı Tabldot Ortalama Kalorileri ===');
  for (const [cat, data] of Object.entries(categoryAverages)) {
    const avg = Math.round(data.sum / data.count);
    console.log(`- ${cat.toUpperCase()}: ${data.count} yemek, ortalama ${avg} kcal`);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
