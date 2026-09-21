/**
 * Yemek Listem - Servis Katmanı
 * 
 * İş Mantığı Kuralları:
 * 1. Haftalık plan kullanıcı tarafından belirlenir (random otomatik atama yapılmaz).
 * 2. Günlük liste, haftalık planda kullanıcının o gün için belirlediği yemekleri gösterir.
 * 3. Kullanıcı istediği günün menüsünü (Çorba, Ana Yemek, Yan Yemek, Salata/Tatlı) veritabanındaki yemeklerden seçerek kaydeder.
 */

import { prisma } from '@/lib/prisma';
import {
  classifyMainDish,
  classifySideDish,
  getValidSidesForMain,
  pickSideForWeek,
  SideSubType,
  isBakliyat,
  normalizeDishName,
} from '@/lib/mealRules';
import { getMealCalories } from '@/lib/mealCalories';
import { ensureDatabaseSeeded } from '@/lib/ensureSeed';

export const TURKISH_DAYS = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
];

/**
 * ISO Hafta Numarasını ve Yılını hesaplar.
 */
export function getWeekNumber(d: Date = new Date()): { year: number; weekNumber: number } {
  const target = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNr = (target.getUTCDay() + 6) % 7; // 0: Pazartesi ... 6: Pazar
  target.setUTCDate(target.getUTCDate() - dayNr + 3);
  const firstThursday = target.getTime();
  target.setUTCMonth(0, 1);
  if (target.getUTCDay() !== 4) {
    target.setUTCMonth(0, 1 + ((4 - target.getUTCDay() + 7) % 7));
  }
  const weekNumber = 1 + Math.ceil((firstThursday - target.getTime()) / 604800000);
  return { year: target.getUTCFullYear(), weekNumber };
}

/**
 * Verilen tarihin haftasının Pazartesi gününü döndürür (00:00:00).
 */
export function getWeekMonday(d: Date = new Date()): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - (day === 0 ? 6 : day - 1);
  const monday = new Date(date.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * Veritabanındaki tüm aktif yemekleri getirir.
 */
export async function getAllMeals() {
  return await prisma.meal.findMany({
    where: { isActive: true },
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });
}

/**
 * Mevcut haftanın haftalık planını getirir.
 * Eğer henüz oluşturulmamışsa, 7 günün iskeletini (Pazartesi...Pazar) oluşturur.
 * Yemekler rastgele atanmaz; kullanıcının seçimine bırakılır.
 */
export async function getOrCreateWeeklyPlan(targetDate: Date = new Date()) {
  const { year, weekNumber } = getWeekNumber(targetDate);

  // 1. Mevcut haftanın planı var mı kontrol et
  const existingPlan = await prisma.weeklyPlan.findUnique({
    where: {
      year_weekNumber: {
        year,
        weekNumber,
      },
    },
    include: {
      dailyPlans: {
        orderBy: { date: 'asc' },
        include: {
          meals: {
            include: {
              meal: true,
            },
          },
        },
      },
    },
  });

  if (existingPlan) {
    return existingPlan;
  }

  // 2. Plan yoksa: 7 günlük haftalık şablonu oluştur (Rastgele yemek atamadan)
  const monday = getWeekMonday(targetDate);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const createdWeeklyPlan = await prisma.weeklyPlan.create({
    data: {
      year,
      weekNumber,
      startDate: monday,
      endDate: sunday,
    },
  });

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    const dayName = TURKISH_DAYS[i];

    await prisma.dailyPlan.create({
      data: {
        weeklyPlanId: createdWeeklyPlan.id,
        date: dayDate,
        dayName,
      },
    });
  }

  // Oluşturulan haftalık planı döndür
  return await prisma.weeklyPlan.findUnique({
    where: { id: createdWeeklyPlan.id },
    include: {
      dailyPlans: {
        orderBy: { date: 'asc' },
        include: {
          meals: {
            include: {
              meal: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Belirli bir günün yemeklerini kullanıcının belirlediği yemeklerle günceller.
 */
export async function updateDailyPlanMeals(dailyPlanId: string, mealIds: string[]) {
  // Önce o güne ait mevcut yemekleri temizle
  await prisma.dailyPlanMeal.deleteMany({
    where: { dailyPlanId },
  });

  // Seçilen yeni yemekleri ekle
  for (const mealId of mealIds) {
    if (!mealId) continue;
    const meal = await prisma.meal.findUnique({ where: { id: mealId } });
    if (meal) {
      await prisma.dailyPlanMeal.create({
        data: {
          dailyPlanId,
          mealId: meal.id,
          category: meal.category,
        },
      });
    }
  }

  // Güncellenmiş günü döndür
  return await prisma.dailyPlan.findUnique({
    where: { id: dailyPlanId },
    include: {
      meals: {
        include: {
          meal: true,
        },
      },
    },
  });
}

/**
 * Bugünün yemek planını getirir.
 * Kural: Günlük plan haftalık plandaki ilgili günden çekilir.
 */
export async function getOrCreateDailyPlan(targetDate: Date = new Date()) {
  const weeklyPlan = await getOrCreateWeeklyPlan(targetDate);
  if (!weeklyPlan) return null;

  const targetDayOfWeek = (targetDate.getDay() + 6) % 7; // 0: Pazartesi ... 6: Pazar
  const targetDayName = TURKISH_DAYS[targetDayOfWeek];

  const todayPlan = weeklyPlan.dailyPlans.find(
    (dp) =>
      dp.dayName.toLowerCase() === targetDayName.toLowerCase() ||
      new Date(dp.date).toDateString() === targetDate.toDateString()
  );

  return todayPlan || weeklyPlan.dailyPlans[0] || null;
}

/**
 * Kullanıcı notunu doğrudan veritabanına kaydeder.
 */
export async function submitUserNote(content: string): Promise<{ success: boolean; message: string }> {
  const trimmed = content.trim();
  if (!trimmed) {
    return { success: false, message: 'Lütfen bir not yazınız.' };
  }

  try {
    await prisma.userNote.create({
      data: {
        content: trimmed,
        status: 'pending',
      },
    });

    return {
      success: true,
      message: 'Notunuz başarıyla iletildi. Teşekkür ederiz!',
    };
  } catch (error) {
    console.error('submitUserNote error:', error);
    return {
      success: false,
      message: 'Not kaydedilirken bir hata oluştu.',
    };
  }
}

const MONTH_NAMES_TR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

/**
 * Belirtilen ayın (veya en güncel ayın) aylık yemek planını getirir.
 * Pazar günleri kesinlikle hariç tutulur.
 */
export async function getMonthlyPlan(year?: number, month?: number) {
  await ensureDatabaseSeeded(prisma);

  let plan = null;
  if (year && month) {
    plan = await prisma.monthlyPlan.findUnique({
      where: { year_month: { year, month } },
      include: {
        entries: {
          orderBy: { date: 'asc' },
        },
      },
    });
  }

  if (!plan) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    // Önce mevcut aya ait plan var mı kontrol et
    plan = await prisma.monthlyPlan.findUnique({
      where: { year_month: { year: currentYear, month: currentMonth } },
      include: {
        entries: {
          orderBy: { date: 'asc' },
        },
      },
    });

    // Eğer mevcut ayın planı yoksa, en son eklenen veya en güncel planı bul
    if (!plan) {
      plan = await prisma.monthlyPlan.findFirst({
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
        include: {
          entries: {
            orderBy: { date: 'asc' },
          },
        },
      });
    }
  }

  if (!plan) return null;

  // Pazar günlerini çift emniyet olarak filtrele
  const filteredEntries = plan.entries.filter(
    (entry) => entry.dayName?.trim().toLowerCase() !== 'pazar'
  );

  return {
    ...plan,
    entries: filteredEntries.map((e) => {
      let parsed: string[] = [];
      try {
        if (Array.isArray(e.items)) {
          parsed = e.items;
        } else if (typeof e.items === 'string') {
          parsed = e.items.trim().startsWith('[') ? JSON.parse(e.items) : e.items.split(',').map((s: string) => s.trim());
        }
      } catch {
        parsed = (e.mealText || '').split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      if (!parsed || parsed.length === 0) {
        parsed = (e.mealText || '').split(',').map((s: string) => s.trim()).filter(Boolean);
      }

      return {
        ...e,
        items: parsed,
        itemsList: parsed,
      };
    }),
  };
}

function autoDetectMealCategory(dishName: string): string {
  const norm = dishName
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim();

  if (
    norm.includes('corba') ||
    norm.includes('mercimek') ||
    norm.includes('ezogelin') ||
    norm.includes('tarhana') ||
    norm.includes('yayla') ||
    norm.includes('sehriye') ||
    norm.includes('domates corbasi') ||
    norm.includes('kelle paca') ||
    norm.includes('iskembe') ||
    norm.includes('dugun corbasi') ||
    norm.includes('koylum corba') ||
    norm.includes('soguk corba') ||
    norm.includes('sebze corbasi') ||
    norm.includes('havuc corbasi') ||
    norm.includes('mantar corbasi')
  ) {
    return 'corba';
  }

  if (
    norm.includes('pilav') ||
    norm.includes('makarna') ||
    norm.includes('borek') ||
    norm.includes('pure') ||
    norm.includes('eriste') ||
    norm.includes('bulgur') ||
    norm.includes('manti') ||
    norm.includes('patates kizartmasi') ||
    norm.includes('spagetti') ||
    norm.includes('kuskus') ||
    norm.includes('noodle')
  ) {
    return 'yan_yemek';
  }

  if (
    norm.includes('salata') ||
    norm.includes('salatabar') ||
    norm.includes('cacik') ||
    norm.includes('tursu') ||
    norm.includes('piyaz') ||
    norm.includes('yogurt') ||
    norm.includes('meze') ||
    norm.includes('haydari') ||
    norm.includes('humus') ||
    norm.includes('ezme')
  ) {
    return 'salata';
  }

  if (
    norm.includes('ayran') ||
    norm.includes('icecek') ||
    norm.includes('limonata') ||
    norm.includes('salgam') ||
    norm.includes('kola') ||
    norm.includes('fanta') ||
    norm.includes('gazoz') ||
    norm.includes('meyve suyu') ||
    norm.includes('soda')
  ) {
    return 'icecek';
  }

  if (
    norm.includes('tatli') ||
    norm.includes('pasta') ||
    norm.includes('profiterol') ||
    norm.includes('kemalpasa') ||
    norm.includes('sutlac') ||
    norm.includes('puding') ||
    norm.includes('muhallebi') ||
    norm.includes('kazandibi') ||
    norm.includes('keskul') ||
    norm.includes('revani') ||
    norm.includes('sekerpare') ||
    norm.includes('kadayif') ||
    norm.includes('kunefe') ||
    norm.includes('baklava') ||
    norm.includes('sobiyet') ||
    norm.includes('helva') ||
    norm.includes('komposto') ||
    norm.includes('hosaf') ||
    norm.includes('trilece') ||
    norm.includes('gullac') ||
    norm.includes('tulumba') ||
    norm.includes('lokma') ||
    norm.includes('asure') ||
    norm.includes('parfe') ||
    norm.includes('magnolia') ||
    norm.includes('tiramisu') ||
    norm.includes('supangle') ||
    norm.includes('sufle') ||
    norm.includes('kek') ||
    norm.includes('browni') ||
    norm.includes('kurabiye') ||
    norm.includes('dondurma') ||
    norm.includes('ekler') ||
    norm.includes('tart') ||
    norm.includes('turta') ||
    norm.includes('irmik') ||
    norm.includes('lokum') ||
    norm.includes('kalbura basti') ||
    norm.includes('kalburabasti') ||
    norm.includes('meyve') ||
    norm.includes('karpuz') ||
    norm.includes('kavun') ||
    norm.includes('elma') ||
    norm.includes('armut') ||
    norm.includes('portakal') ||
    norm.includes('mandalina') ||
    norm.includes('muz') ||
    norm.includes('uzum') ||
    norm.includes('cilek') ||
    norm.includes('seftali') ||
    norm.includes('erik') ||
    norm.includes('kiraz') ||
    norm.includes('kayisi') ||
    norm.includes('incir') ||
    norm.includes('hurma')
  ) {
    return 'tatli';
  }

  return 'ana_yemek';
}

/**
 * Aylık yemek listesini toplu kaydeder veya günceller.
 * Kural: Pazar günleri ASLA eklenmez.
 */
export async function saveMonthlyPlan(data: {
  year: number;
  month: number;
  monthName?: string;
  entries: Array<{
    dayNumber?: number;
    dateStr?: string;
    dayName: string;
    mealText: string;
    isHoliday?: boolean;
  }>;
}) {
  const { year, month } = data;
  const monthName = data.monthName || `${MONTH_NAMES_TR[month - 1]} ${year}`;

  // 1. Pazar günlerini kesinlikle filtrele
  const validEntries = data.entries.filter((entry) => {
    const dayLower = (entry.dayName || '').toLowerCase().trim();
    return dayLower !== 'pazar';
  });

  // 2. Aylık plan kaydını oluştur veya güncelle
  const monthlyPlan = await prisma.monthlyPlan.upsert({
    where: { year_month: { year, month } },
    update: { monthName, updatedAt: new Date() },
    create: { year, month, monthName },
  });

  // 3. Bu aya ait eski kayıtları temizle
  await prisma.dailyMenuEntry.deleteMany({
    where: { monthlyPlanId: monthlyPlan.id },
  });

  // 4. Yeni günleri ekle
  for (const entry of validEntries) {
    const dayLower = (entry.dayName || '').toLowerCase().trim();
    if (dayLower === 'pazar') continue; // Ek koruma

    // Gün numarasını bul (varsa entry.dayNumber, yoksa dateStr'den çek)
    let dayNum = entry.dayNumber;
    if (!dayNum && entry.dateStr) {
      const match = entry.dateStr.match(/\d+/);
      if (match) dayNum = parseInt(match[0], 10);
    }
    if (!dayNum) dayNum = 1;

    const entryDate = new Date(Date.UTC(year, month - 1, dayNum, 12, 0, 0));
    const dateStr = entry.dateStr || `${dayNum} ${MONTH_NAMES_TR[month - 1]} ${year} ${entry.dayName}`;

    // Yemek listesini normalize et
    const itemsArray = entry.mealText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    // Her yemeğin Meal tablosunda da var olduğundan emin ol
    for (const itemName of itemsArray) {
      const trimmed = itemName.trim();
      if (!trimmed) continue;
      const category = autoDetectMealCategory(trimmed);

      const exists = await prisma.meal.findFirst({
        where: { name: trimmed }
      });
      if (!exists) {
        await prisma.meal.create({
          data: {
            name: trimmed,
            category,
            calories: getMealCalories(trimmed, category),
            isActive: true,
          }
        });
      }
    }

    await prisma.dailyMenuEntry.create({
      data: {
        monthlyPlanId: monthlyPlan.id,
        date: entryDate,
        dateStr,
        dayName: entry.dayName,
        mealText: entry.mealText.trim(),
        items: JSON.stringify(itemsArray),
        isHoliday: !!entry.isHoliday,
      },
    });
  }

  return await getMonthlyPlan(year, month);
}

/**
 * Bugünün öğle yemeğini getirir (Aylık Liste odaklı).
 * Pazar günüyse hizmet olmadığını belirtir.
 */
export async function getTodayLunchMenu(targetDate: Date = new Date()) {
  const dayOfWeek = targetDate.getDay(); // 0: Pazar
  if (dayOfWeek === 0) {
    return {
      isSunday: true,
      dayName: 'Pazar',
      dateStr: targetDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      message: 'Pazar günleri yemek hizmetimiz bulunmamaktadır.',
      items: [],
      mealText: '',
    };
  }

  // 1. Aktif aylık planı çek
  const activePlan = await getMonthlyPlan();
  if (!activePlan || !activePlan.entries || activePlan.entries.length === 0) {
    return null;
  }

  const targetDay = targetDate.getDate();
  const targetMonth = targetDate.getMonth() + 1;
  const targetYear = targetDate.getFullYear();

  // 2. Bugünün tarihine tam eşleşen veya gün numarası eşleşen kaydı bul
  let matchedEntry = activePlan.entries.find((entry) => {
    const eDate = new Date(entry.date);
    return (
      eDate.getUTCDate() === targetDay &&
      eDate.getUTCMonth() + 1 === targetMonth &&
      eDate.getUTCFullYear() === targetYear
    );
  });

  // Eğer birebir yıl/ay uymuyorsa (örneğin demo veya test ortamında), gün numarasına veya bugünün gününe en yakın aktif güne bak
  if (!matchedEntry) {
    matchedEntry = activePlan.entries.find((entry) => {
      const eDate = new Date(entry.date);
      return eDate.getUTCDate() === targetDay;
    });
  }

  // Eğer hâlâ bulunamadıysa (örneğin ay 30 çekti veya bugünkü gün ayda yoksa), 16'sı (varsayılan demo günü) veya ilk günü al
  if (!matchedEntry) {
    matchedEntry = activePlan.entries.find((e) => new Date(e.date).getUTCDate() === 16) || activePlan.entries[0];
  }

  if (!matchedEntry) return null;

  return {
    isSunday: false,
    id: matchedEntry.id,
    date: matchedEntry.date,
    dateStr: matchedEntry.dateStr,
    dayName: matchedEntry.dayName,
    mealText: matchedEntry.mealText,
    items: matchedEntry.itemsList || [],
    isHoliday: matchedEntry.isHoliday,
  };
}

/**
 * Onaylanmış tüm aylık planların özet listesini getirir.
 */
export async function getAllMonthlyPlansSummary() {
  await ensureDatabaseSeeded(prisma);

  const plans = await prisma.monthlyPlan.findMany({
    orderBy: [{ year: 'desc' }, { month: 'desc' }],
    include: {
      _count: {
        select: { entries: true },
      },
    },
  });

  return plans.map((p) => ({
    id: p.id,
    year: p.year,
    month: p.month,
    monthName: p.monthName,
    entriesCount: p._count.entries,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));
}

/**
 * Seçilen yıl ve ay için veritabanındaki yemeklerden dengeli ve zengin
 * karışık öğle yemeği taslak menüsü oluşturur.
 * Kural: Pazar günleri kesinlikle hariç tutulur.
 */
export async function generateSmartMonthlyMenu(options: {
  year: number;
  month: number;
}) {
  const { year, month } = options;
  const monthName = `${MONTH_NAMES_TR[month - 1]} ${year}`;

  // Veritabanındaki tüm aktif yemekleri çek
  const allMeals = await prisma.meal.findMany({
    where: { isActive: true },
  });

  // Kategorilere göre grupla
  const mealsByCat: Record<string, string[]> = {
    corba: [],
    ana_yemek: [],
    yan_yemek: [],
    salata: [],
    tatli: [],
    icecek: [],
  };

  for (const m of allMeals) {
    if (mealsByCat[m.category]) {
      mealsByCat[m.category].push(m.name);
    }
  }

  // Ana yemekleri alt gruplara ayır (Denge kuralı)
  const mainsByType = {
    et_tavuk: mealsByCat.ana_yemek.filter((m) => classifyMainDish(m) === 'et_tavuk'),
    sebze_bakliyat: mealsByCat.ana_yemek.filter((m) => classifyMainDish(m) === 'sebze_bakliyat'),
    hamur_isi: mealsByCat.ana_yemek.filter((m) => classifyMainDish(m) === 'hamur_isi'),
  };

  // Yan yemekleri sınıflandır (Bakliyat/Sebze yanına sadece pilav veya börek kuralı)
  const sidesByType = {
    pilav_borek: mealsByCat.yan_yemek.filter((s) => {
      const c = classifySideDish(s);
      return c === 'pilav' || c === 'borek';
    }),
    all: mealsByCat.yan_yemek,
  };

  // Seçilen ayın gün sayısını bul
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  const generatedEntries = [];
  const recentSoups: string[] = [];
  const recentMains: string[] = [];
  const recentSides: string[] = [];
  const recentDesserts: string[] = [];

  const pickRandom = (pool: string[], recentList: string[], maxRecent = 3): string => {
    if (!pool || pool.length === 0) return '';
    const available = pool.filter((item) => !recentList.includes(item));
    const candidates = available.length > 0 ? available : pool;
    const selected = candidates[Math.floor(Math.random() * candidates.length)];
    recentList.push(selected);
    if (recentList.length > maxRecent) {
      recentList.shift();
    }
    return selected;
  };

  let lastMainType: 'et_tavuk' | 'sebze_bakliyat' | 'hamur_isi' | null = null;
  const usedSideSubtypesThisWeek = new Set<SideSubType>();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    const dayOfWeek = dateObj.getUTCDay(); // 0: Pazar, 1: Pazartesi ... 6: Cumartesi
    if (dayOfWeek === 0) {
      // PAZAR GÜNLERİ KESİNLİKLE HARİÇ
      continue;
    }

    // Yeni hafta başlangıcı (Pazartesi): Haftalık kullanılan yan yemek çeşitlerini sıfırla
    if (dayOfWeek === 1) {
      usedSideSubtypesThisWeek.clear();
    }

    const dayName = TURKISH_DAYS[(dayOfWeek + 6) % 7];
    const dateStr = `${day} ${MONTH_NAMES_TR[month - 1]} ${year} ${dayName}`;

    // KURAL: Günler üst üste aynı ana yemek türü verilmez (Et/Tavuk <-> Sebze/Bakliyat dengesi)
    let targetType: 'et_tavuk' | 'sebze_bakliyat' | 'hamur_isi';
    if (dayOfWeek === 6 && Math.random() < 0.35 && lastMainType !== 'hamur_isi' && mainsByType.hamur_isi.length > 0) {
      targetType = 'hamur_isi';
    } else if (lastMainType === 'et_tavuk') {
      targetType = mainsByType.sebze_bakliyat.length > 0 ? 'sebze_bakliyat' : 'et_tavuk';
    } else if (lastMainType === 'sebze_bakliyat') {
      targetType = mainsByType.et_tavuk.length > 0 ? 'et_tavuk' : 'sebze_bakliyat';
    } else {
      // Ayın ilk iş günü: et veya tavukla başla
      targetType = mainsByType.et_tavuk.length > 0 ? 'et_tavuk' : 'sebze_bakliyat';
    }

    let mainPool = mainsByType[targetType].length > 0 ? mainsByType[targetType] : mealsByCat.ana_yemek;

    // Eğer bu hafta hem pirinç hem bulgur zaten verilmişse, pilav zorunluluğu olan yemekleri (bakliyat/döner vb.)
    // haftanın geri kalan günlerinde tercih etmeyerek diğer çeşitlere (makarna, erişte, börek) yer aç
    const bothPilavsUsed = usedSideSubtypesThisWeek.has('pirinc') && usedSideSubtypesThisWeek.has('bulgur');
    if (bothPilavsUsed && mainPool.length > 2) {
      const nonPilavMains = mainPool.filter((m) => {
        const normM = normalizeDishName(m);
        return !isBakliyat(m) && !normM.includes('karniyarik') && !normM.includes('doner');
      });
      if (nonPilavMains.length > 0) {
        mainPool = nonPilavMains;
      }
    }

    const main = pickRandom(mainPool, recentMains, 10);
    lastMainType = targetType;

    const isSaturday = dayOfWeek === 6;

    // 1. Çorba: Cumartesi günleri çorba eklenmez
    const soup = isSaturday ? '' : pickRandom(mealsByCat.corba, recentSoups, 4);

    // 2. Yan Yemek: Aynı hafta içinde çeşit tekrarı (bulgur, pirinç, makarna, erişte, börek, patates) yapılmaz!
    const { side, subType } = pickSideForWeek(main, mealsByCat.yan_yemek, usedSideSubtypesThisWeek, recentSides);
    if (side) {
      recentSides.push(side);
      if (recentSides.length > 4) {
        recentSides.shift();
      }
    }
    if (subType !== 'diger') {
      usedSideSubtypesThisWeek.add(subType);
    }

    // 3. Salata: Cumartesi günleri salata eklenmez
    let salad = '';
    if (!isSaturday) {
      salad = 'SALATABAR';
      if (Math.random() < 0.25 && mealsByCat.salata.length > 0) {
        salad = mealsByCat.salata[Math.floor(Math.random() * mealsByCat.salata.length)];
      }
    }

    // 4. Tatlı / İçecek: Cumartesi günleri tatlı eklenmez
    let sweetOrDrink = '';
    if (isSaturday) {
      // Cumartesi çorba, salata ve tatlı verilmez; pratik tamamlayıcı olarak ayran/içecek verilebilir
      if (mealsByCat.icecek.length > 0) {
        sweetOrDrink = mealsByCat.icecek.includes('AYRAN') ? 'AYRAN' : mealsByCat.icecek[0];
      }
    } else {
      const roll = Math.random();
      if (targetType === 'hamur_isi') {
        sweetOrDrink = Math.random() < 0.5 ? 'AYRAN' : pickRandom(mealsByCat.tatli, recentDesserts, 4);
      } else if (roll < 0.55 && mealsByCat.tatli.length > 0) {
        sweetOrDrink = pickRandom(mealsByCat.tatli, recentDesserts, 4);
      } else if (roll < 0.8) {
        sweetOrDrink = 'MEYVE';
      } else if (mealsByCat.icecek.length > 0) {
        sweetOrDrink = mealsByCat.icecek[Math.floor(Math.random() * mealsByCat.icecek.length)];
      }
    }

    const dayMeals = [soup, main, side, salad];
    if (sweetOrDrink && !dayMeals.includes(sweetOrDrink)) {
      dayMeals.push(sweetOrDrink);
    }

    const cleanItems = dayMeals.filter(Boolean);

    generatedEntries.push({
      dayNumber: day,
      dateStr,
      dayName,
      mealText: cleanItems.join(', '),
      items: cleanItems,
      isHoliday: false,
    });
  }

  return {
    year,
    month,
    monthName,
    entries: generatedEntries,
  };
}

