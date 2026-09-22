/**
 * Yemek Görselleri Kütüphanesi
 * Türk mutfağı tabldot yemekleri için sade ve temiz arka planlı gerçekçi görsel kataloğu.
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

// Türk mutfağı ve kurumsal tabldot yemekleri için sade arka planlı gerçekçi görsel sözlüğü
export const CURATED_DISH_IMAGES: Record<string, string> = {
  'adana kebap': '/dishes/adana_kebap.jpg',
  'ankara tava': '/dishes/ankara_tava.jpg',
  'arabasi corbasi': '/dishes/arabasi_corbasi.jpg',
  'arnavut cigeri': '/dishes/arnavut_cigeri.jpg',
  'avci boregi': '/dishes/avci_boregi.jpg',
  'ayran': '/dishes/ayran.jpg',
  'aglayan pasta': '/dishes/aglayan_pasta.jpg',
  'asure': '/dishes/asure.jpg',
  'barbunya yemegi': '/dishes/barbunya_yemegi.jpg',
  'bezelye yemegi': '/dishes/bezelye_yemegi.jpg',
  'begendili kebap': '/dishes/begendili_kebap.jpg',
  'brokoli corbasi': '/dishes/brokoli_corbasi.jpg',
  'bulgur pilavi': '/dishes/bulgur_pilavi.jpg',
  'biber dolmasi': '/dishes/biber_dolmasi.jpg',
  'biber kizartmasi': '/dishes/biber_kizartmasi.jpg',
  'cacik': '/dishes/cacik.jpg',
  'cevizli baklava (2 dilim)': '/dishes/cevizli_baklava_2_dilim.jpg',
  'domates corbasi': '/dishes/domates_corbasi.jpg',
  'dugun corbasi': '/dishes/dugun_corbasi.jpg',
  'elbasan tava': '/dishes/elbasan_tava.jpg',
  'eriste': '/dishes/eriste.jpg',
  'et doner': '/dishes/et_doner.jpg',
  'et kavurma': '/dishes/et_kavurma.jpg',
  'etli kuru fasulye': '/dishes/etli_kuru_fasulye.jpg',
  'etli mevsim turlu': '/dishes/etli_mevsim_turlu.jpg',
  'etli nohut': '/dishes/etli_nohut.jpg',
  'etli patates yemegi': '/dishes/etli_patates_yemegi.jpg',
  'ezogelin corba': '/dishes/ezogelin_corba.jpg',
  'firin makarna': '/dishes/firin_makarna.jpg',
  'firin sutlac': '/dishes/firin_sutlac.jpg',
  'firin tavuk': '/dishes/firin_tavuk.jpg',
  'firinda baharatli patates': '/dishes/firinda_baharatli_patates.jpg',
  'firinda sebzeli tavuk': '/dishes/firinda_sebzeli_tavuk.jpg',
  'firinda soslu tavuk baget': '/dishes/firinda_soslu_tavuk_baget.jpg',
  'firinda tavuk pirzola': '/dishes/firinda_tavuk_pirzola.jpg',
  'firinda karniyarik': '/dishes/karniyarik.jpg',
  'gelin tulu tatlisi': '/dishes/gelin_tulu_tatlisi.jpg',
  'guvecte kofte': '/dishes/guvecte_kofte.jpg',
  'hamburger': '/dishes/hamburger.jpg',
  'hasanpasa kofte': '/dishes/hasanpasa_kofte.jpg',
  'havuc corbasi': '/dishes/havuc_corbasi.jpg',
  'hashasli revani': '/dishes/hashasli_revani.jpg',
  'islak kek': '/dishes/islak_kek.jpg',
  'ispanak yemegi': '/dishes/ispanak_yemegi.jpg',
  'ispanakli borek': '/dishes/ispanakli_borek.jpg',
  'izgara kanat': '/dishes/izgara_kanat.jpg',
  'izgara kofte': '/dishes/izgara_kofte.jpg',
  'kabak dolma': '/dishes/kabak_dolma.jpg',
  'kabak sandal': '/dishes/kabak_sandal.jpg',
  'kadinbudu kofte': '/dishes/kadinbudu_kofte.jpg',
  'kalbura basti tatlisi': '/dishes/kalbura_basti_tatlisi.jpg',
  'karisik kizartma': '/dishes/karisik_kizartma.jpg',
  'karnabahar graten': '/dishes/karnabahar_graten.jpg',
  'karniyarik': '/dishes/karniyarik.jpg',
  'kavurma': '/dishes/kavurma.jpg',
  'kazandibi': '/dishes/kazandibi.jpg',
  'kemalpasa': '/dishes/kemalpasa.jpg',
  'kibris tatlisi': '/dishes/kibris_tatlisi.jpg',
  'kiymali borek': '/dishes/kiymali_borek.jpg',
  'kiymali pirasa': '/dishes/kiymali_pirasa.jpg',
  'komposto': '/dishes/komposto.jpg',
  'kremali mantar kavurma': '/dishes/kremali_mantar_kavurma.jpg',
  'kremali mantarli tavuk': '/dishes/kremali_mantarli_tavuk.jpg',
  'kremali tavuk': '/dishes/kremali_tavuk.jpg',
  'kuru fasulye': '/dishes/kuru_fasulye.jpg',
  'korili tavuk': '/dishes/korili_tavuk.jpg',
  'koylum corba': '/dishes/koylum_corba.jpg',
  'lahmacun': '/dishes/lahmacun.jpg',
  'lavas ustu tavuk tantuni': '/dishes/lavas_ustu_tavuk_tantuni.jpg',
  'lazanya': '/dishes/lazanya.jpg',
  'makarna': '/dishes/makarna.jpg',
  'mantar kavurma': '/dishes/mantar_kavurma.jpg',
  'mantar corbasi': '/dishes/mantar_corbasi.jpg',
  'manti': '/dishes/manti.jpg',
  'menemen': '/dishes/menemen.jpg',
  'mercimek corbasi': '/dishes/mercimek_corbasi.jpg',
  'mevsim turlu': '/dishes/mevsim_turlu.jpg',
  'meyhane pilavi': '/dishes/meyhane_pilavi.jpg',
  'meyve': '/dishes/meyve.jpg',
  'misir corbasi': '/dishes/misir_corbasi.jpg',
  'misket kofte': '/dishes/misket_kofte.jpg',
  'orman kebabi': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
  'patates kizartmasi': '/dishes/patates_kizartmasi.jpg',
  'patates oturtma': '/dishes/patates_oturtma.jpg',
  'patates puresi': '/dishes/patates_puresi.jpg',
  'patates salatasi': '/dishes/patates_salatasi.jpg',
  'patates yemegi': '/dishes/patates_yemegi.jpg',
  'patatesli kol boregi': '/dishes/patatesli_kol_boregi.jpg',
  'patlican musakka': '/dishes/patlican_musakka.jpg',
  'pacanga boregi': '/dishes/pacanga_boregi.jpg',
  'peynirli borek': '/dishes/peynirli_borek.jpg',
  'peynirli eriste': '/dishes/peynirli_eriste.jpg',
  'peynirli makarna': '/dishes/peynirli_makarna.jpg',
  'profiterol': '/dishes/profiterol.jpg',
  'puding': '/dishes/puding.jpg',
  'pureli antrikot': '/dishes/pureli_antrikot.jpg',
  'pide': '/dishes/pide.jpg',
  'pilav': '/dishes/pilav.jpg',
  'pirinc pilavi': '/dishes/pirinc_pilavi.jpg',
  'pizza': '/dishes/pizza.jpg',
  'rosto et': '/dishes/rosto_et.jpg',
  'rosto kofte': '/dishes/rosto_kofte.jpg',
  'salata': '/dishes/salata.jpg',
  'salatabar': '/dishes/salatabar.jpg',
  'sebze corbasi': '/dishes/sebze_corbasi.jpg',
  'sebzeli bulgur pilavi': '/dishes/sebzeli_bulgur_pilavi.jpg',
  'sebzeli pirinc pilavi': '/dishes/sebzeli_pirinc_pilavi.jpg',
  'sebzeli tavuklu borek': '/dishes/sebzeli_tavuklu_borek.jpg',
  'semiz yemegi': '/dishes/semiz_yemegi.jpg',
  'soslu makarna': '/dishes/soslu_makarna.jpg',
  'soya soslu tavuk': '/dishes/soya_soslu_tavuk.jpg',
  'soguk corba': '/dishes/soguk_corba.jpg',
  'spagetti makarna': '/dishes/spagetti_makarna.jpg',
  'supangele': '/dishes/supangele.jpg',
  'sutlac': '/dishes/sutlac.jpg',
  'tandir corbasi': '/dishes/tandir_corbasi.jpg',
  'tarhana corbasi': '/dishes/tarhana_corbasi.jpg',
  'tas kebabi': '/dishes/tas_kebabi.jpg',
  'tavuk beyti': '/dishes/tavuk_beyti.jpg',
  'tavuk doner': '/dishes/tavuk_doner.jpg',
  'tavuk fajita': '/dishes/tavuk_fajita.jpg',
  'tavuk kavurma': '/dishes/tavuk_kavurma.jpg',
  'tavuk sote': '/dishes/tavuk_sote.jpg',
  'tavuk sultan kebabi': '/dishes/tavuk_sultan_kebabi.jpg',
  'tavuk copsis': '/dishes/tavuk_copsis.jpg',
  'tavuk snitzel': '/dishes/tavuk_snitzel.jpg',
  'tavuk sis kebap': '/dishes/tavuk_sis_kebap.jpg',
  'tavuklu buryan pilavi': '/dishes/tavuklu_buryan_pilavi.jpg',
  'tavuklu maklube': '/dishes/tavuklu_maklube.jpg',
  'tavuklu orman kebabi': '/dishes/tavuklu_orman_kebabi.jpg',
  'tavuklu saray sarmasi': '/dishes/tavuklu_saray_sarmasi.jpg',
  'tavuklu cokertme kebabi': '/dishes/tavuklu_cokertme_kebabi.jpg',
  'tavuksuyu corba': '/dishes/tavuksuyu_corba.jpg',
  'taze fasulye': '/dishes/taze_fasulye.jpg',
  'terbiyeli et haslama': '/dishes/terbiyeli_et_haslama.jpg',
  'toyga corbasi': '/dishes/toyga_corbasi.jpg',
  'tursu': '/dishes/tursu.jpg',
  'tiramisu': '/dishes/tiramisu.jpg',
  'yalanci manti': '/dishes/yalanci_manti.jpg',
  'yayla corbasi': '/dishes/yayla_corbasi.jpg',
  'yesil mercimek': '/dishes/yesil_mercimek.jpg',
  'yesil mercimek corbasi': '/dishes/yesil_mercimek_corbasi.jpg',
  'yogurt corbasi': '/dishes/yayla_corbasi.jpg',
  'yogurtlu makarna': '/dishes/yogurtlu_makarna.jpg',
  'citir pilic': '/dishes/citir_pilic.jpg',
  'coban kavurma': '/dishes/coban_kavurma.jpg',
  'cokertme kebabi': '/dishes/cokertme_kebabi.jpg',
  'cin usulu tavuk': '/dishes/cin_usulu_tavuk.jpg',
  'islim kebabi': '/dishes/islim_kebabi.jpg',
  'izmir kofte': '/dishes/izmir_kofte.jpg',
  'icecek': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
  'saksuka': '/dishes/saksuka.jpg',
  'sehriye pilavi': '/dishes/sehriye_pilavi.jpg',
  'sehriye corbasi': '/dishes/sehriye_corbasi.jpg',
  'sehriyeli bulgur pilavi': '/dishes/sehriyeli_bulgur_pilavi.jpg',
  'sehriyeli pirinc pilavi': '/dishes/sehriyeli_pirinc_pilavi.jpg',
};

// Kategoriye göre genel görsel yedeği
const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  corba: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
  ana_yemek: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
  yan_yemek: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
  salata: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
  tatli: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
  icecek: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80',
};

/**
 * Verilen yemek adı için varsa yüklenmiş görseli veya katalog görselini döndürür.
 */
export function getDishImageUrl(
  dishName: string,
  category = 'ana_yemek',
  customImageUrl?: string | null
): string | null {
  // 1. Veritabanında kayıtlı görsel varsa doğrudan kullan
  if (customImageUrl && customImageUrl.trim().length > 0) {
    return customImageUrl.trim();
  }

  const norm = normalizeVisualName(dishName);

  // 2. Birebir eşleşme
  if (CURATED_DISH_IMAGES[norm]) {
    return CURATED_DISH_IMAGES[norm];
  }

  // 3. Kısmi eşleşme tara (Örn: "Şehriye Çorbası" içinde "sehriye")
  for (const [key, val] of Object.entries(CURATED_DISH_IMAGES)) {
    if (norm.includes(key) || key.includes(norm)) {
      return val;
    }
  }

  // 4. Kategori varsayılanı
  return CATEGORY_DEFAULT_IMAGES[category] || null;
}
