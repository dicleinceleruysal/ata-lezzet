/**
 * Yemek Görselleri Kütüphanesi
 * Yemeklerin fotoğraflarını ve kategorik görsel yedeklerini sağlar.
 */

// Türkçe karakterleri normalize etme
export function normalizeVisualName(str: string): string {
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

// Yaygın Türk mutfağı ve tabldot yemekleri için yüksek kaliteli görsel sözlüğü
export const CURATED_DISH_IMAGES: Record<string, string> = {
  // === GEMİNİ İLE ÜRETİLEN ÖZEL ARKA PLANSIZ GERÇEKÇİ TÜRK YEMEKLERİ ===
  'mercimek corbasi': '/dishes/mercimek_corbasi.jpg',
  'mercimek corba': '/dishes/mercimek_corbasi.jpg',
  'kirmizi mercimek corbasi': '/dishes/mercimek_corbasi.jpg',
  'suzen mercimek corbasi': '/dishes/mercimek_corbasi.jpg',
  'mercimek': '/dishes/mercimek_corbasi.jpg',

  'ezogelin corbasi': '/dishes/ezogelin_corbasi.jpg',
  'ezogelin corba': '/dishes/ezogelin_corbasi.jpg',
  'ezogelin': '/dishes/ezogelin_corbasi.jpg',

  'firinda karniyarik': '/dishes/karniyarik.jpg',
  'karniyarik': '/dishes/karniyarik.jpg',

  // === DİĞER ÇORBALAR (Sade / Arka Plansız) ===
  'tarhana corbasi': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
  'yayla corbasi': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
  'sehriye corbasi': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
  'domates corbasi': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
  'mantar corbasi': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
  'tandir corbasi': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',

  // === ANA YEMEKLER (ET & KEBAP & TAVUK) ===
  'tavuk sote': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop&q=80',
  'orman kebabi': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
  'izgara kofte': 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&auto=format&fit=crop&q=80',
  'izmir kofte': 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&auto=format&fit=crop&q=80',
  'arnavut cigeri': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
  'adana kebap': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
  'tas kebabi': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
  'kavurma': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
  'et doner': 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=600&auto=format&fit=crop&q=80',
  'tavuk doner': 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=600&auto=format&fit=crop&q=80',
  'firin tavuk': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&auto=format&fit=crop&q=80',

  // === ANA YEMEKLER (BAKLİYAT & SEBZE & DOLMA) ===
  'kuru fasulye': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
  'kuru fasulye (etli)': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
  'etli kuru fasulye': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
  'nohut yemeği': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
  'etli nohut': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
  'biber dolmasi': 'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=600&auto=format&fit=crop&q=80',
  'yesil fasulye': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
  'manti': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
  'menemen': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',

  // === YAN YEMEKLER (PİLAV & MAKARNA & BÖREK) ===
  'sehriyeli pirinc pilavi': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
  'pirinc pilavi': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
  'sebzeli bulgur pilavi': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
  'bulgur pilavi': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
  'ispanakli borek': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
  'peynirli makarna': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
  'yogurtlu makarna': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
  'makarna': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
  'patates puresi': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',

  // === SALATA & MEZELER ===
  'salatabar': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
  'coban salata': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
  'cacik': 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80',
  'piyaz': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',

  // === TATLILAR ===
  'cevizli baklava (2 dilim)': 'https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format&fit=crop&q=80',
  'baklava': 'https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format&fit=crop&q=80',
  'profiterol': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
  'firin sutlac': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
  'sutlac': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
  'kemalpasa': 'https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format&fit=crop&q=80',
  'sekerpare': 'https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format&fit=crop&q=80',
  'meyve': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80',

  // === İÇECEKLER ===
  'ayran': 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80',
  'limonata': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
};

// Kategoriye göre genel görsel yedeği (Eğer özel görsel veya sözlükte yoksa)
const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  corba: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
  ana_yemek: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
  yan_yemek: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
  salata: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
  tatli: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
  icecek: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80',
};

/**
 * Verilen yemek adı için varsa özel yüklenmiş görseli veya küratörlü görseli döndürür.
 */
export function getDishImageUrl(
  dishName: string,
  category = 'ana_yemek',
  customImageUrl?: string | null
): string | null {
  // 1. Veritabanından özel yüklenmiş görsel varsa doğrudan kullan
  if (customImageUrl && customImageUrl.trim().length > 0) {
    return customImageUrl.trim();
  }

  const norm = normalizeVisualName(dishName);

  // 2. Birebir veya kısmi isim eşleşmesi
  if (CURATED_DISH_IMAGES[norm]) {
    return CURATED_DISH_IMAGES[norm];
  }

  // Kısmi eşleşme tara (Örn: "Şehriye Çorbası" içinde "sehriye")
  for (const [key, val] of Object.entries(CURATED_DISH_IMAGES)) {
    if (norm.includes(key) || key.includes(norm)) {
      return val;
    }
  }

  // 3. Kategori varsayılanı
  return CATEGORY_DEFAULT_IMAGES[category] || null;
}
