export function normalizeDishName(s: string): string {
  if (!s) return '';
  return s
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim();
}

/**
 * Bakliyat yemeklerini tespit eder:
 * Kuru fasulye, nohut, barbunya, mercimek yemeği vb.
 */
export function isBakliyat(dishName: string): boolean {
  const n = normalizeDishName(dishName);
  if (n.includes('nohut') || n.includes('barbunya') || n.includes('mercimek')) {
    return true;
  }
  if (n.includes('fasulye') || n.includes('fasulyesi')) {
    // Taze fasulye yeşil sebzedir; kuru fasulye bakliyattır
    if (n.includes('taze') || n.includes('yesil')) {
      return false;
    }
    return true;
  }
  return false;
}

/**
 * Ana yemeği türüne göre sınıflandırır:
 * - 'hamur_isi': Mantı, Pide, Pizza, Lahmacun, Yağlama vb. (Yan yemek verilmez)
 * - 'sebze_bakliyat': Kuru fasulye, nohut, barbunya, ıspanak, bezelye, karnıyarık vb.
 * - 'et_tavuk': Et, tavuk, köfte, kebap, sote vb.
 */
export function classifyMainDish(dishName: string): 'hamur_isi' | 'sebze_bakliyat' | 'et_tavuk' {
  const n = normalizeDishName(dishName);

  if (
    n.includes('manti') ||
    n.includes('pide') ||
    n.includes('pizza') ||
    n.includes('lahmacun') ||
    n.includes('yaglama')
  ) {
    return 'hamur_isi';
  }

  if (
    n.includes('fasulye') ||
    n.includes('fasulyesi') ||
    n.includes('nohut') ||
    n.includes('barbunya') ||
    n.includes('ispanak') ||
    n.includes('bezelye') ||
    n.includes('dolma') ||
    n.includes('sarma') ||
    n.includes('karniyarik') ||
    n.includes('musakka') ||
    n.includes('oturtma') ||
    n.includes('turlu') ||
    n.includes('semiz') ||
    n.includes('kizartma') ||
    n.includes('patates yemegi') ||
    n.includes('mantar kavurma') ||
    n.includes('sandal') ||
    n.includes('menemen') ||
    n.includes('imam bayildi') ||
    n.includes('kabak kalye') ||
    n.includes('kabak yemegi') ||
    n.includes('pirasa') ||
    n.includes('karnabahar') ||
    n.includes('brokoli') ||
    n.includes('bamya') ||
    n.includes('enginar') ||
    n.includes('mercimek yemegi')
  ) {
    return 'sebze_bakliyat';
  }

  return 'et_tavuk';
}

/**
 * Yan yemeği türüne göre sınıflandırır:
 * - 'pilav': Pirinç pilavı, bulgur pilavı vb.
 * - 'borek': Sigara böreği, su böreği, tepsi böreği vb.
 * - 'makarna': Spagetti, makarna, kuskus, erişte vb.
 * - 'patates_diger': Patates kızartması, püre vb.
 */
export function classifySideDish(dishName: string): 'pilav' | 'borek' | 'makarna' | 'patates_diger' {
  const n = normalizeDishName(dishName);
  if (n.includes('pilav')) return 'pilav';
  if (n.includes('borek') || n.includes('boregi')) return 'borek';
  if (n.includes('makarna') || n.includes('spagetti') || n.includes('eriste') || n.includes('kuskus') || n.includes('noodle')) {
    return 'makarna';
  }
  return 'patates_diger';
}

/**
 * Böreğin peynirli olup olmadığını kontrol eder:
 * (Peynirli Börek, Peynirli Su Böreği, Sigara Böreği, Kaşarlı/Lorlu Börek vb.)
 */
export function isCheeseBorek(dishName: string): boolean {
  const n = normalizeDishName(dishName);
  if (!n.includes('borek') && !n.includes('boregi')) return false;

  // Etli / tavuklu / kıymalı / pastırmalı börekleri kesinlikle hariç tut
  if (n.includes('kiymali') || n.includes('avci') || n.includes('tavuk') || n.includes('pacanga')) {
    return false;
  }

  // Peynirli veya geleneksel peynirli su/sigara böreği
  if (
    n.includes('peynir') ||
    n.includes('su boreg') ||
    n.includes('sigara boreg') ||
    n.includes('kasar') ||
    n.includes('lor')
  ) {
    return true;
  }

  return false;
}

/**
 * Ana yemeğe göre verilebilecek uygun yan yemekleri filtreler:
 * 1. Hamur işi (Mantı, pide vb.) -> [] (Yan yemek verilmez)
 * 2. Bakliyat, Karnıyarık ve Dönerler -> Kesinlikle sadece Pilav çeşitleri
 * 3. Sebze (Türlü, musakka vb.) -> Pilav veya PEYNİRLİ Börek çeşitleri
 * 4. Et / Tavuk -> Pilav, Makarna, Patates/Püre veya PEYNİRLİ Börek (asla kıymalı/etli börek verilmez)
 */
export function getValidSidesForMain(mainDishName: string, allSideDishes: string[]): string[] {
  const mainType = classifyMainDish(mainDishName);

  if (mainType === 'hamur_isi') {
    return [];
  }

  const normMain = normalizeDishName(mainDishName);

  // KURAL: Bakliyat yemeklerinin, Karnıyarık ve Dönerlerin yanına pilav çeşiti ver.
  if (
    isBakliyat(mainDishName) ||
    normMain.includes('karniyarik') ||
    normMain.includes('doner')
  ) {
    const pilavs = allSideDishes.filter((s) => classifySideDish(s) === 'pilav');
    return pilavs.length > 0 ? pilavs : allSideDishes;
  }

  // KURAL: Sebzelerin yanına pilav veya PEYNİRLİ börek ver.
  if (mainType === 'sebze_bakliyat') {
    const valid = allSideDishes.filter((s) => {
      const c = classifySideDish(s);
      if (c === 'pilav') return true;
      if (c === 'borek') return isCheeseBorek(s);
      return false;
    });
    return valid.length > 0 ? valid : allSideDishes;
  }

  // Et / Tavuk yemeği:
  // KURAL: Yemek etli tavuklu ise börekler peynirli olsun.
  return allSideDishes.filter((s) => {
    const c = classifySideDish(s);
    if (c === 'borek') {
      return isCheeseBorek(s);
    }
    return true; // Pilav, makarna, patates/püre serbest
  });
}

export type SideSubType = 'pirinc' | 'bulgur' | 'makarna' | 'eriste' | 'borek' | 'patates' | 'diger';

/**
 * Yan yemeğin alt çeşidini döndürür:
 * 'pirinc' | 'bulgur' | 'makarna' | 'eriste' | 'borek' | 'patates'
 */
export function getSideSubType(dishName: string): SideSubType {
  const n = normalizeDishName(dishName);
  if (n.includes('eriste')) return 'eriste';
  if (n.includes('makarna') || n.includes('spagetti') || n.includes('kuskus') || n.includes('noodle')) return 'makarna';
  if (n.includes('borek') || n.includes('boregi')) return 'borek';
  if (n.includes('bulgur') || n.includes('meyhane')) return 'bulgur';
  if (n.includes('pirinc') || n.includes('pilav')) return 'pirinc';
  if (n.includes('patates') || n.includes('pure') || n.includes('kizartma')) return 'patates';
  return 'diger';
}

/**
 * Aynı hafta içinde tekrara düşmeden (bulgur, pirinç, makarna, erişte, börek, patates)
 * ana yemeğe uygun yan yemek seçer.
 */
export function pickSideForWeek(
  mainDishName: string,
  allSideDishes: string[],
  usedSubtypesThisWeek: Set<SideSubType>,
  recentSides: string[] = []
): { side: string; subType: SideSubType } {
  const validSides = getValidSidesForMain(mainDishName, allSideDishes);
  if (validSides.length === 0) {
    return { side: '', subType: 'diger' };
  }

  // Aynı hafta içinde henüz kullanılmamış çeşitleri filtrele
  const freshSides = validSides.filter((s) => !usedSubtypesThisWeek.has(getSideSubType(s)));
  let candidatePool = freshSides.length > 0 ? freshSides : validSides;

  const mainType = classifyMainDish(mainDishName);
  // Et/Tavuk yemeklerinde; sebze ve bakliyatın ihtiyaç duyacağı pirinç ve bulguru rezerve etmek için
  // öncelikle makarna, erişte, patates tercih et
  if (mainType === 'et_tavuk' && freshSides.length > 0) {
    const preferredForMeat = freshSides.filter((s) => {
      const sub = getSideSubType(s);
      return sub === 'makarna' || sub === 'eriste' || sub === 'patates';
    });
    if (preferredForMeat.length > 0) {
      candidatePool = preferredForMeat;
    }
  }

  // Son günlerde çıkan yan yemekleri filtrele
  const availableWithoutRecent = candidatePool.filter((item) => !recentSides.includes(item));
  const finalCandidates = availableWithoutRecent.length > 0 ? availableWithoutRecent : candidatePool;

  const selected = finalCandidates[Math.floor(Math.random() * finalCandidates.length)];
  const subType = getSideSubType(selected);
  return { side: selected, subType };
}
