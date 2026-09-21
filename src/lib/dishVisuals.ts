/**
 * Yemek Görselleri ve Açıklamaları Kütüphanesi
 * Yemeklerin isminden ne olduğunu bilmeyen kullanıcılar için
 * hem görsel referans hem de iştah açıcı kısa açıklamalar sunar.
 */

export interface DishVisualInfo {
  imageUrl: string | null;
  description: string;
}

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

// Yaygın Türk mutfağı ve tabldot yemekleri için açıklama ve yüksek kaliteli görsel sözlüğü
export const CURATED_DISH_INFO: Record<string, DishVisualInfo> = {
  // === ÇORBALAR ===
  'mercimek corbasi': {
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
    description: 'Kırmızı mercimek, tereyağı, soğan ve nane ile hazırlanan geleneksel sıcak başlangıç çorbası.',
  },
  'ezogelin corbasi': {
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
    description: 'Kırmızı mercimek, bulgur, pirinç ve domates sosuyla hazırlanan zengin kıvamlı Anadolu çorbası.',
  },
  'ezogelin corba': {
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
    description: 'Kırmızı mercimek, bulgur, pirinç ve domates sosuyla hazırlanan zengin kıvamlı Anadolu çorbası.',
  },
  'tarhana corbasi': {
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
    description: 'Güneşte kurutulmuş doğal tarhana, tereyağı ve nane ile pişen şifa dolu çorba.',
  },
  'yayla corbasi': {
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
    description: 'Süzme yoğurt, pirinç, nane ve tereyağlı sosla hazırlanan ferahlatıcı çorba.',
  },
  'sehriye corbasi': {
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
    description: 'Tavuk suyu ve domates sosuyla pişirilen hafif arpa veya tel şehriye çorbası.',
  },
  'domates corbasi': {
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
    description: 'Taze fırınlanmış domatesler ve tereyağı ile hazırlanan pürüzsüz kıvamlı çorba.',
  },
  'mantar corbasi': {
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
    description: 'İnce kıyılmış taze kültür mantarları ve hafif krema lezzetiyle hazırlanan çorba.',
  },
  'tandir corbasi': {
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
    description: 'Et suyu, nohut, buğday ve baharatlarla tandır usulü pişirilen doyurucu çorba.',
  },

  // === ANA YEMEKLER (ET & KEBAP & TAVUK) ===
  'firinda karniyarik': {
    imageUrl: 'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=600&auto=format&fit=crop&q=80',
    description: 'Közlenmiş patlıcan içine kıymalı, soğanlı, domates ve biberli harç ile fırınlanan geleneksel ana yemek.',
  },
  'karniyarik': {
    imageUrl: 'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=600&auto=format&fit=crop&q=80',
    description: 'Közlenmiş patlıcan içine kıymalı, soğanlı, domates ve biberli harç ile fırınlanan geleneksel ana yemek.',
  },
  'tavuk sote': {
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop&q=80',
    description: 'Küp doğranmış yumuşacık tavuk göğsü, renkli köy biberleri ve domates sosuyla tavada sotelenmiş lezzet.',
  },
  'orman kebabi': {
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    description: 'Kuşbaşı dana eti, bezelye, havuç ve patates küplerinin fırında kekikle buluştuğu zengin kebap.',
  },
  'izgara kofte': {
    imageUrl: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&auto=format&fit=crop&q=80',
    description: 'Özel baharatlarla yoğrulmuş, içi sulu ızgara dana köfte.',
  },
  'izmir kofte': {
    imageUrl: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&auto=format&fit=crop&q=80',
    description: 'Fırında elma dilim patates, domates ve biberle pişirilen nefis soslu anne köftesi.',
  },
  'arnavut cigeri': {
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
    description: 'Küp doğranmış ve unlanarak kızartılmış yumuşacık ciğer, sumaklı soğan eşliğinde.',
  },
  'adana kebap': {
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
    description: 'Zırhla kıyılmış kuzu ve dana eti, pul biber ve kuyruk yağı ile hazırlanan ızgara kebap.',
  },
  'tas kebabi': {
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    description: 'Kuşbaşı dana eti ve patatesin domates salçasıyla ağır ateşte piştiği sulu et yemeği.',
  },
  'kavurma': {
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    description: 'Kendi yağında ağır ateşte lokum gibi kavrulmuş dana eti.',
  },
  'et doner': {
    imageUrl: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=600&auto=format&fit=crop&q=80',
    description: 'Özel marine edilmiş yaprak dana eti döner.',
  },
  'tavuk doner': {
    imageUrl: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=600&auto=format&fit=crop&q=80',
    description: 'Özel sosla marine edilip ateşte çevrilmiş lezzetli tavuk döner.',
  },
  'firin tavuk': {
    imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&auto=format&fit=crop&q=80',
    description: 'Baharatlı sosla nar gibi kızartılmış fırın tavuk porsiyonu.',
  },

  // === ANA YEMEKLER (BAKLİYAT & SEBZE & DOLMA) ===
  'kuru fasulye': {
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    description: 'Tereyağlı ve salçalı sosla ağır ateşte pişirilen geleneksel kuru fasulye yemeği.',
  },
  'kuru fasulye (etli)': {
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    description: 'Kuşbaşı et ile lezzetlendirilmiş güveç kıvamında kuru fasulye.',
  },
  'etli kuru fasulye': {
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    description: 'Kuşbaşı et ile lezzetlendirilmiş güveç kıvamında kuru fasulye.',
  },
  'nohut yemeği': {
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    description: 'Lokum kıvamında pişirilmiş etli veya sade nohut yemeği.',
  },
  'etli nohut': {
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    description: 'Kuşbaşı et ile lezzetlendirilmiş lokum kıvamında nohut yemeği.',
  },
  'biber dolmasi': {
    imageUrl: 'https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?w=600&auto=format&fit=crop&q=80',
    description: 'Pirinçli, kıymalı ve baharatlı harç ile doldurulmuş taze dolmalık biberler.',
  },
  'yesil fasulye': {
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    description: 'Taze çalı fasulyesi, domates ve zeytinyağı ile hazırlanan hafif yaz yemeği.',
  },
  'manti': {
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
    description: 'Kıymalı el açması mantı taneleri, sarımsaklı yoğurt ve kızgın naneli tereyağı eşliğinde.',
  },
  'menemen': {
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
    description: 'Taze domates, biber ve yumurtanın tavada harmanlandığı sıcak lezzet.',
  },

  // === YAN YEMEKLER (PİLAV & MAKARNA & BÖREK) ===
  'sehriyeli pirinc pilavi': {
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
    description: 'Kavrulmuş arpa şehriyeler ve tereyağıyla tane tane dökülen klasik pirinç pilavı.',
  },
  'pirinc pilavi': {
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
    description: 'Tereyağlı, tane tane dökülen baldo pirinç pilavı.',
  },
  'sebzeli bulgur pilavi': {
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
    description: 'Domates, köy biberi ve soğan ile demlendirilmiş nefis bulgur pilavı.',
  },
  'bulgur pilavi': {
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
    description: 'Tereyağı ve hafif salça ile demlenmiş lezzetli bulgur pilavı.',
  },
  'ispanakli borek': {
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    description: 'İnce yufkalar arasında taze ıspanak ve beyaz peynirli fırınlanmış tepsi böreği.',
  },
  'peynirli makarna': {
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
    description: 'Tereyağlı makarna üzerine ufalanmış beyaz peynir ve maydanoz.',
  },
  'yogurtlu makarna': {
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
    description: 'Sarımsaklı süzme yoğurt ve üzerine gezdirilen kızgın tereyağlı pul biber soslu makarna.',
  },
  'makarna': {
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
    description: 'Tereyağlı veya soslu haşlanmış tabldot makarna.',
  },
  'patates puresi': {
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
    description: 'Süt ve tereyağı ile pürüzsüz kıvamda ezilmiş sıcak patates püresi.',
  },

  // === SALATA & MEZELER ===
  'salatabar': {
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
    description: 'Mevsim yeşillikleri, taze domates, salatalık, mısır, havuç ve zeytinyağlı taze salata.',
  },
  'coban salata': {
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
    description: 'Küp doğranmış domates, salatalık, sivri biber, soğan ve zeytinyağlı klasik salata.',
  },
  'cacik': {
    imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80',
    description: 'Süzme yoğurt, ince kıyılmış taze salatalık, nane ve sızma zeytinyağı ile ferahlatıcı lezzet.',
  },
  'piyaz': {
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    description: 'Haşlanmış kuru fasulye, piyazlık soğan, maydanoz, sumak ve zeytinyağlı geleneksel meze.',
  },

  // === TATLILAR ===
  'cevizli baklava (2 dilim)': {
    imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format&fit=crop&q=80',
    description: 'İncecik açılmış kırk kat yufka, bol Toros cevizi ve hafif şerbetli çıtır baklava.',
  },
  'baklava': {
    imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format&fit=crop&q=80',
    description: 'İncecik açılmış yufkalar, ceviz veya fıstık dolgusuyla fırınlanmış geleneksel tatlı.',
  },
  'profiterol': {
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    description: 'İçi özel vanilyalı pastacı kreması dolu şu hamuru topları ve üzerine bol akışkan çikolata sosu.',
  },
  'firin sutlac': {
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    description: 'Toprak güveçte fırınlanmış üzeri nar gibi kızarmış geleneksel sütlü tatlı.',
  },
  'sutlac': {
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    description: 'Pirinç, süt ve vanilya ile pişirilen üzeri tarçınlı hafif sütlü tatlı.',
  },
  'kemalpasa': {
    imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format&fit=crop&q=80',
    description: 'Peynir mayalı hamur toplarının şerbette kaynatılmasıyla hazırlanan yumuşacık tatlı.',
  },
  'sekerpare': {
    imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=600&auto=format&fit=crop&q=80',
    description: 'İrmikli hamurdan hazırlanan üzeri fındıklı şerbetli geleneksel tatlı.',
  },
  'meyve': {
    imageUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80',
    description: 'Günün taze mevsim meyvesi porsiyonu.',
  },

  // === İÇECEKLER ===
  'ayran': {
    imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80',
    description: 'Doğal yoğurt, su ve az tuz ile çalkalanmış ferahlatıcı soğuk geleneksel içecek.',
  },
  'limonata': {
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    description: 'Taze sıkılmış limon suyu, nane yaprakları ve buzla hazırlanan ev yapımı ferahlık.',
  },
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

const CATEGORY_DEFAULT_DESCRIPTIONS: Record<string, string> = {
  corba: 'Özel baharatlarla taze demlenmiş sıcak başlangıç çorbası.',
  ana_yemek: 'Günün taze malzemeleriyle hazırlanmış doyurucu ana yemek.',
  yan_yemek: 'Ana yemeği en iyi şekilde tamamlayan lezzetli eşlikçi.',
  salata: 'Taze ve vitamin dolu mevsim sebzeleri tabağı.',
  tatli: 'Günün menüsünü tatlı bir dokunuşla tamamlayan ikram.',
  icecek: 'Yemeğin yanında servis edilen serinletici içecek.',
};

/**
 * Verilen yemek adı için varsa özel yüklenmiş görseli veya küratörlü görseli + açıklamayı döndürür.
 */
export function getDishVisualInfo(
  dishName: string,
  category = 'ana_yemek',
  customImageUrl?: string | null,
  customDescription?: string | null
): DishVisualInfo {
  const norm = normalizeVisualName(dishName);

  // 1. Veritabanından özel yüklenmiş görsel veya açıklama varsa öncelikli olarak onu kullan
  if (customImageUrl && customImageUrl.trim().length > 0) {
    return {
      imageUrl: customImageUrl.trim(),
      description: customDescription?.trim() || CURATED_DISH_INFO[norm]?.description || CATEGORY_DEFAULT_DESCRIPTIONS[category] || 'Özenle hazırlanmış günün lezzeti.',
    };
  }

  // 2. Birebir veya kısmi isim eşleşmesi
  if (CURATED_DISH_INFO[norm]) {
    return CURATED_DISH_INFO[norm];
  }

  // Kısmi eşleşme tara (Örn: "Şehriye Çorbası" içinde "sehriye")
  for (const [key, val] of Object.entries(CURATED_DISH_INFO)) {
    if (norm.includes(key) || key.includes(norm)) {
      return val;
    }
  }

  // 3. Kategori varsayılanı
  return {
    imageUrl: CATEGORY_DEFAULT_IMAGES[category] || null,
    description: customDescription?.trim() || CATEGORY_DEFAULT_DESCRIPTIONS[category] || 'Özenle hazırlanmış günün lezzeti.',
  };
}
