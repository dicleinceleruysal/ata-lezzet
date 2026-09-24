import { prisma } from './prisma';

export interface SeedMeal {
  name: string;
  category: string;
  calories?: number | null;
  imageUrl?: string | null;
}

export const INITIAL_MEALS: SeedMeal[] = [
  {
    "name": "ADANA KEBAP",
    "category": "ana_yemek",
    "calories": 310,
    "imageUrl": "/dishes/adana_kebap.jpg"
  },
  {
    "name": "ANKARA TAVA",
    "category": "ana_yemek",
    "calories": 360,
    "imageUrl": "/dishes/ankara_tava.jpg"
  },
  {
    "name": "ARABAŞI ÇORBASI",
    "category": "corba",
    "calories": 135,
    "imageUrl": "/dishes/arabasi_corbasi.jpg"
  },
  {
    "name": "ARNAVUT CİĞERİ",
    "category": "ana_yemek",
    "calories": 310,
    "imageUrl": "/dishes/arnavut_cigeri.jpg"
  },
  {
    "name": "AVCI BÖREĞİ",
    "category": "yan_yemek",
    "calories": 290,
    "imageUrl": "/dishes/avci_boregi.jpg"
  },
  {
    "name": "AYRAN",
    "category": "icecek",
    "calories": 70,
    "imageUrl": "/dishes/ayran.jpg"
  },
  {
    "name": "AĞLAYAN PASTA",
    "category": "tatli",
    "calories": 250,
    "imageUrl": "/dishes/aglayan_pasta.jpg"
  },
  {
    "name": "AŞURE",
    "category": "tatli",
    "calories": 240,
    "imageUrl": "/dishes/asure.jpg"
  },
  {
    "name": "BARBUNYA YEMEĞİ",
    "category": "ana_yemek",
    "calories": 260,
    "imageUrl": "/dishes/barbunya_yemegi.jpg"
  },
  {
    "name": "BEZELYE YEMEĞİ",
    "category": "ana_yemek",
    "calories": 190,
    "imageUrl": "/dishes/bezelye_yemegi.jpg"
  },
  {
    "name": "BEĞENDİLİ KEBAP",
    "category": "ana_yemek",
    "calories": 370,
    "imageUrl": "/dishes/begendili_kebap.jpg"
  },
  {
    "name": "BROKOLİ ÇORBASI",
    "category": "corba",
    "calories": 85,
    "imageUrl": "/dishes/brokoli_corbasi.jpg"
  },
  {
    "name": "BULGUR PİLAVI",
    "category": "yan_yemek",
    "calories": 195,
    "imageUrl": "/dishes/bulgur_pilavi.jpg"
  },
  {
    "name": "BİBER DOLMASI",
    "category": "ana_yemek",
    "calories": 220,
    "imageUrl": "/dishes/biber_dolmasi.jpg"
  },
  {
    "name": "BİBER KIZARTMASI",
    "category": "yan_yemek",
    "calories": 150,
    "imageUrl": "/dishes/biber_kizartmasi.jpg"
  },
  {
    "name": "CACIK",
    "category": "salata",
    "calories": 70,
    "imageUrl": "/dishes/cacik.jpg"
  },
  {
    "name": "Cevizli Baklava (2 Dilim)",
    "category": "tatli",
    "calories": 280,
    "imageUrl": "/dishes/cevizli_baklava_2_dilim.jpg"
  },
  {
    "name": "DOMATES ÇORBASI",
    "category": "corba",
    "calories": 105,
    "imageUrl": "/dishes/domates_corbasi.jpg"
  },
  {
    "name": "DÜĞÜN ÇORBASI",
    "category": "corba",
    "calories": 145,
    "imageUrl": "/dishes/dugun_corbasi.jpg"
  },
  {
    "name": "ELBASAN TAVA",
    "category": "ana_yemek",
    "calories": 340,
    "imageUrl": "/dishes/elbasan_tava.jpg"
  },
  {
    "name": "ERİŞTE",
    "category": "yan_yemek",
    "calories": 220,
    "imageUrl": "/dishes/eriste.jpg"
  },
  {
    "name": "ET DÖNER",
    "category": "ana_yemek",
    "calories": 280,
    "imageUrl": "/dishes/et_doner.jpg"
  },
  {
    "name": "ET KAVURMA",
    "category": "ana_yemek",
    "calories": 340,
    "imageUrl": "/dishes/et_kavurma.jpg"
  },
  {
    "name": "ETLİ KURU FASÜLYE",
    "category": "ana_yemek",
    "calories": 290,
    "imageUrl": "/dishes/etli_kuru_fasulye.jpg"
  },
  {
    "name": "ETLİ MEVSİM TÜRLÜ",
    "category": "ana_yemek",
    "calories": 240,
    "imageUrl": "/dishes/etli_mevsim_turlu.jpg"
  },
  {
    "name": "ETLİ NOHUT",
    "category": "ana_yemek",
    "calories": 290,
    "imageUrl": "/dishes/etli_nohut.jpg"
  },
  {
    "name": "ETLİ PATATES YEMEĞİ",
    "category": "ana_yemek",
    "calories": 280,
    "imageUrl": "/dishes/etli_patates_yemegi.jpg"
  },
  {
    "name": "EZOGELİN ÇORBA",
    "category": "corba",
    "calories": 120,
    "imageUrl": "/dishes/ezogelin_corba.jpg"
  },
  {
    "name": "FIRIN MAKARNA",
    "category": "yan_yemek",
    "calories": 270,
    "imageUrl": "/dishes/firin_makarna.jpg"
  },
  {
    "name": "FIRIN SÜTLAÇ",
    "category": "tatli",
    "calories": 210,
    "imageUrl": "/dishes/firin_sutlac.jpg"
  },
  {
    "name": "FIRIN TAVUK",
    "category": "ana_yemek",
    "calories": 270,
    "imageUrl": "/dishes/firin_tavuk.jpg"
  },
  {
    "name": "FIRINDA BAHARATLI PATATES",
    "category": "yan_yemek",
    "calories": 180,
    "imageUrl": "/dishes/firinda_baharatli_patates.jpg"
  },
  {
    "name": "FIRINDA SEBZELİ TAVUK",
    "category": "ana_yemek",
    "calories": 260,
    "imageUrl": "/dishes/firinda_sebzeli_tavuk.jpg"
  },
  {
    "name": "FIRINDA SOSLU TAVUK BAGET",
    "category": "ana_yemek",
    "calories": 260,
    "imageUrl": "/dishes/firinda_soslu_tavuk_baget.jpg"
  },
  {
    "name": "FIRINDA TAVUK PİRZOLA",
    "category": "ana_yemek",
    "calories": 280,
    "imageUrl": "/dishes/firinda_tavuk_pirzola.jpg"
  },
  {
    "name": "Fırında Karnıyarık",
    "category": "ana_yemek",
    "calories": 260,
    "imageUrl": "/dishes/karniyarik.jpg"
  },
  {
    "name": "GELİN TÜLÜ TATLISI",
    "category": "tatli",
    "calories": 230,
    "imageUrl": "/dishes/gelin_tulu_tatlisi.jpg"
  },
  {
    "name": "GÜVEÇTE KÖFTE",
    "category": "ana_yemek",
    "calories": 320,
    "imageUrl": "/dishes/guvecte_kofte.jpg"
  },
  {
    "name": "HAMBURGER",
    "category": "ana_yemek",
    "calories": 360,
    "imageUrl": "/dishes/hamburger.jpg"
  },
  {
    "name": "HASANPAŞA KÖFTE",
    "category": "ana_yemek",
    "calories": 330,
    "imageUrl": "/dishes/hasanpasa_kofte.jpg"
  },
  {
    "name": "HAVUÇ ÇORBASI",
    "category": "corba",
    "calories": 95,
    "imageUrl": "/dishes/havuc_corbasi.jpg"
  },
  {
    "name": "HAŞHAŞLI REVANİ",
    "category": "tatli",
    "calories": 260,
    "imageUrl": "/dishes/hashasli_revani.jpg"
  },
  {
    "name": "ISLAK KEK",
    "category": "tatli",
    "calories": 250,
    "imageUrl": "/dishes/islak_kek.jpg"
  },
  {
    "name": "ISPANAK YEMEĞİ",
    "category": "ana_yemek",
    "calories": 160,
    "imageUrl": "/dishes/ispanak_yemegi.jpg"
  },
  {
    "name": "ISPANAKLI BÖREK",
    "category": "yan_yemek",
    "calories": 240,
    "imageUrl": "/dishes/ispanakli_borek.jpg"
  },
  {
    "name": "IZGARA KANAT",
    "category": "ana_yemek",
    "calories": 290,
    "imageUrl": "/dishes/izgara_kanat.jpg"
  },
  {
    "name": "IZGARA KÖFTE",
    "category": "ana_yemek",
    "calories": 270,
    "imageUrl": "/dishes/izgara_kofte.jpg"
  },
  {
    "name": "KABAK DOLMA",
    "category": "ana_yemek",
    "calories": 210,
    "imageUrl": "/dishes/kabak_dolma.jpg"
  },
  {
    "name": "KABAK SANDAL",
    "category": "ana_yemek",
    "calories": 220,
    "imageUrl": "/dishes/kabak_sandal.jpg"
  },
  {
    "name": "KADINBUDU KÖFTE",
    "category": "ana_yemek",
    "calories": 290,
    "imageUrl": "/dishes/kadinbudu_kofte.jpg"
  },
  {
    "name": "KALBURA BASTI TATLISI",
    "category": "tatli",
    "calories": 260,
    "imageUrl": "/dishes/kalbura_basti_tatlisi.jpg"
  },
  {
    "name": "KARIŞIK KIZARTMA",
    "category": "ana_yemek",
    "calories": 280,
    "imageUrl": "/dishes/karisik_kizartma.jpg"
  },
  {
    "name": "KARNABAHAR GRATEN",
    "category": "ana_yemek",
    "calories": 230,
    "imageUrl": "/dishes/karnabahar_graten.jpg"
  },
  {
    "name": "KARNIYARIK",
    "category": "ana_yemek",
    "calories": 260,
    "imageUrl": "/dishes/karniyarik.jpg"
  },
  {
    "name": "KAVURMA",
    "category": "ana_yemek",
    "calories": 340,
    "imageUrl": "/dishes/kavurma.jpg"
  },
  {
    "name": "KAZANDİBİ",
    "category": "tatli",
    "calories": 190,
    "imageUrl": "/dishes/kazandibi.jpg"
  },
  {
    "name": "KEMALPAŞA",
    "category": "tatli",
    "calories": 210,
    "imageUrl": "/dishes/kemalpasa.jpg"
  },
  {
    "name": "KIBRIS TATLISI",
    "category": "tatli",
    "calories": 270,
    "imageUrl": "/dishes/kibris_tatlisi.jpg"
  },
  {
    "name": "KIYMALI BÖREK",
    "category": "yan_yemek",
    "calories": 280,
    "imageUrl": "/dishes/kiymali_borek.jpg"
  },
  {
    "name": "KIYMALI PIRASA",
    "category": "ana_yemek",
    "calories": 190,
    "imageUrl": "/dishes/kiymali_pirasa.jpg"
  },
  {
    "name": "KOMPOSTO",
    "category": "tatli",
    "calories": 110,
    "imageUrl": "/dishes/komposto.jpg"
  },
  {
    "name": "KREMALI MANTAR KAVURMA",
    "category": "ana_yemek",
    "calories": 220,
    "imageUrl": "/dishes/kremali_mantar_kavurma.jpg"
  },
  {
    "name": "KREMALI MANTARLI TAVUK",
    "category": "ana_yemek",
    "calories": 320,
    "imageUrl": "/dishes/kremali_mantarli_tavuk.jpg"
  },
  {
    "name": "KREMALI TAVUK",
    "category": "ana_yemek",
    "calories": 310,
    "imageUrl": "/dishes/kremali_tavuk.jpg"
  },
  {
    "name": "KURU FASULYE",
    "category": "ana_yemek",
    "calories": 250,
    "imageUrl": "/dishes/kuru_fasulye.jpg"
  },
  {
    "name": "KURU FASÜLYE",
    "category": "ana_yemek",
    "calories": 250,
    "imageUrl": "/dishes/kuru_fasulye.jpg"
  },
  {
    "name": "KÖRİLİ TAVUK",
    "category": "ana_yemek",
    "calories": 270,
    "imageUrl": "/dishes/korili_tavuk.jpg"
  },
  {
    "name": "KÖYLÜM ÇORBA",
    "category": "corba",
    "calories": 120,
    "imageUrl": "/dishes/koylum_corba.jpg"
  },
  {
    "name": "LAHMACUN",
    "category": "ana_yemek",
    "calories": 240,
    "imageUrl": "/dishes/lahmacun.jpg"
  },
  {
    "name": "LAVAŞ ÜSTÜ TAVUK TANTUNİ",
    "category": "ana_yemek",
    "calories": 320,
    "imageUrl": "/dishes/lavas_ustu_tavuk_tantuni.jpg"
  },
  {
    "name": "LAZANYA",
    "category": "ana_yemek",
    "calories": 340,
    "imageUrl": "/dishes/lazanya.jpg"
  },
  {
    "name": "MAKARNA",
    "category": "yan_yemek",
    "calories": 220,
    "imageUrl": "/dishes/makarna.jpg"
  },
  {
    "name": "MANTAR KAVURMA",
    "category": "ana_yemek",
    "calories": 170,
    "imageUrl": "/dishes/mantar_kavurma.jpg"
  },
  {
    "name": "MANTAR ÇORBASI",
    "category": "corba",
    "calories": 100,
    "imageUrl": "/dishes/mantar_corbasi.jpg"
  },
  {
    "name": "MANTI",
    "category": "ana_yemek",
    "calories": 340,
    "imageUrl": "/dishes/manti.jpg"
  },
  {
    "name": "MENEMEN",
    "category": "ana_yemek",
    "calories": 190,
    "imageUrl": "/dishes/menemen.jpg"
  },
  {
    "name": "MERCİMEK ÇORBASI",
    "category": "corba",
    "calories": 125,
    "imageUrl": "/dishes/mercimek_corbasi.jpg"
  },
  {
    "name": "MEVSİM TÜRLÜ",
    "category": "ana_yemek",
    "calories": 180,
    "imageUrl": "/dishes/mevsim_turlu.jpg"
  },
  {
    "name": "MEYHANE PİLAVI",
    "category": "yan_yemek",
    "calories": 200,
    "imageUrl": "/dishes/meyhane_pilavi.jpg"
  },
  {
    "name": "MEYVE",
    "category": "tatli",
    "calories": 55,
    "imageUrl": "/dishes/meyve.jpg"
  },
  {
    "name": "MISIR ÇORBASI",
    "category": "corba",
    "calories": 120,
    "imageUrl": "/dishes/misir_corbasi.jpg"
  },
  {
    "name": "MİSKET KÖFTE",
    "category": "ana_yemek",
    "calories": 280,
    "imageUrl": "/dishes/misket_kofte.jpg"
  },
  {
    "name": "Orman Kebabı",
    "category": "ana_yemek",
    "calories": 310,
    "imageUrl": "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80"
  },
  {
    "name": "PATATES KIZARTMASI",
    "category": "yan_yemek",
    "calories": 250,
    "imageUrl": "/dishes/patates_kizartmasi.jpg"
  },
  {
    "name": "PATATES OTURTMA",
    "category": "ana_yemek",
    "calories": 280,
    "imageUrl": "/dishes/patates_oturtma.jpg"
  },
  {
    "name": "PATATES PÜRESİ",
    "category": "yan_yemek",
    "calories": 160,
    "imageUrl": "/dishes/patates_puresi.jpg"
  },
  {
    "name": "PATATES SALATASI",
    "category": "salata",
    "calories": 150,
    "imageUrl": "/dishes/patates_salatasi.jpg"
  },
  {
    "name": "PATATES YEMEĞİ",
    "category": "ana_yemek",
    "calories": 210,
    "imageUrl": "/dishes/patates_yemegi.jpg"
  },
  {
    "name": "PATATESLİ KOL BÖREĞİ",
    "category": "yan_yemek",
    "calories": 260,
    "imageUrl": "/dishes/patatesli_kol_boregi.jpg"
  },
  {
    "name": "PATLICAN MUSAKKA",
    "category": "ana_yemek",
    "calories": 270,
    "imageUrl": "/dishes/patlican_musakka.jpg"
  },
  {
    "name": "PAÇANGA BÖREĞİ",
    "category": "yan_yemek",
    "calories": 300,
    "imageUrl": "/dishes/pacanga_boregi.jpg"
  },
  {
    "name": "PEYNİRLİ BÖREK",
    "category": "yan_yemek",
    "calories": 260,
    "imageUrl": "/dishes/peynirli_borek.jpg"
  },
  {
    "name": "PEYNİRLİ ERİŞTE",
    "category": "yan_yemek",
    "calories": 245,
    "imageUrl": "/dishes/peynirli_eriste.jpg"
  },
  {
    "name": "PEYNİRLİ MAKARNA",
    "category": "yan_yemek",
    "calories": 240,
    "imageUrl": "/dishes/peynirli_makarna.jpg"
  },
  {
    "name": "PROFİTEROL",
    "category": "tatli",
    "calories": 260,
    "imageUrl": "/dishes/profiterol.jpg"
  },
  {
    "name": "PUDİNG",
    "category": "tatli",
    "calories": 165,
    "imageUrl": "/dishes/puding.jpg"
  },
  {
    "name": "PÜRELİ ANTRİKOT",
    "category": "ana_yemek",
    "calories": 360,
    "imageUrl": "/dishes/pureli_antrikot.jpg"
  },
  {
    "name": "PİDE",
    "category": "ana_yemek",
    "calories": 320,
    "imageUrl": "/dishes/pide.jpg"
  },
  {
    "name": "PİLAV",
    "category": "yan_yemek",
    "calories": 230,
    "imageUrl": "/dishes/pilav.jpg"
  },
  {
    "name": "PİRİNÇ PİLAVI",
    "category": "yan_yemek",
    "calories": 230,
    "imageUrl": "/dishes/pirinc_pilavi.jpg"
  },
  {
    "name": "PİZZA",
    "category": "ana_yemek",
    "calories": 320,
    "imageUrl": "/dishes/pizza.jpg"
  },
  {
    "name": "ROSTO ET",
    "category": "ana_yemek",
    "calories": 290,
    "imageUrl": "/dishes/rosto_et.jpg"
  },
  {
    "name": "ROSTO KÖFTE",
    "category": "ana_yemek",
    "calories": 310,
    "imageUrl": "/dishes/rosto_kofte.jpg"
  },
  {
    "name": "SALATA",
    "category": "salata",
    "calories": 55,
    "imageUrl": "/dishes/salata.jpg"
  },
  {
    "name": "SALATABAR",
    "category": "salata",
    "calories": 55,
    "imageUrl": "/dishes/salatabar.jpg"
  },
  {
    "name": "SEBZE ÇORBASI",
    "category": "corba",
    "calories": 90,
    "imageUrl": "/dishes/sebze_corbasi.jpg"
  },
  {
    "name": "SEBZELİ BULGUR PİLAVI",
    "category": "yan_yemek",
    "calories": 185,
    "imageUrl": "/dishes/sebzeli_bulgur_pilavi.jpg"
  },
  {
    "name": "SEBZELİ PİRİNÇ PİLAVI",
    "category": "yan_yemek",
    "calories": 215,
    "imageUrl": "/dishes/sebzeli_pirinc_pilavi.jpg"
  },
  {
    "name": "SEBZELİ TAVUKLU BÖREK",
    "category": "yan_yemek",
    "calories": 270,
    "imageUrl": "/dishes/sebzeli_tavuklu_borek.jpg"
  },
  {
    "name": "SEMİZ YEMEĞİ",
    "category": "ana_yemek",
    "calories": 150,
    "imageUrl": "/dishes/semiz_yemegi.jpg"
  },
  {
    "name": "SOSLU MAKARNA",
    "category": "yan_yemek",
    "calories": 230,
    "imageUrl": "/dishes/soslu_makarna.jpg"
  },
  {
    "name": "SOYA SOSLU TAVUK",
    "category": "ana_yemek",
    "calories": 260,
    "imageUrl": "/dishes/soya_soslu_tavuk.jpg"
  },
  {
    "name": "SOĞUK ÇORBA",
    "category": "corba",
    "calories": 110,
    "imageUrl": "/dishes/soguk_corba.jpg"
  },
  {
    "name": "SPAGETTİ MAKARNA",
    "category": "yan_yemek",
    "calories": 225,
    "imageUrl": "/dishes/spagetti_makarna.jpg"
  },
  {
    "name": "SUPANGELE",
    "category": "tatli",
    "calories": 200,
    "imageUrl": "/dishes/supangele.jpg"
  },
  {
    "name": "SÜTLAÇ",
    "category": "tatli",
    "calories": 210,
    "imageUrl": "/dishes/sutlac.jpg"
  },
  {
    "name": "TANDIR ÇORBASI",
    "category": "corba",
    "calories": 160,
    "imageUrl": "/dishes/tandir_corbasi.jpg"
  },
  {
    "name": "TARHANA ÇORBASI",
    "category": "corba",
    "calories": 115,
    "imageUrl": "/dishes/tarhana_corbasi.jpg"
  },
  {
    "name": "TAS KEBABI",
    "category": "ana_yemek",
    "calories": 320,
    "imageUrl": "/dishes/tas_kebabi.jpg"
  },
  {
    "name": "TAVUK BEYTİ",
    "category": "ana_yemek",
    "calories": 340,
    "imageUrl": "/dishes/tavuk_beyti.jpg"
  },
  {
    "name": "TAVUK DÖNER",
    "category": "ana_yemek",
    "calories": 260,
    "imageUrl": "/dishes/tavuk_doner.jpg"
  },
  {
    "name": "TAVUK FAJİTA",
    "category": "ana_yemek",
    "calories": 280,
    "imageUrl": "/dishes/tavuk_fajita.jpg"
  },
  {
    "name": "TAVUK KAVURMA",
    "category": "ana_yemek",
    "calories": 270,
    "imageUrl": "/dishes/tavuk_kavurma.jpg"
  },
  {
    "name": "TAVUK SOTE",
    "category": "ana_yemek",
    "calories": 250,
    "imageUrl": "/dishes/tavuk_sote.jpg"
  },
  {
    "name": "TAVUK SULTAN KEBABI",
    "category": "ana_yemek",
    "calories": 350,
    "imageUrl": "/dishes/tavuk_sultan_kebabi.jpg"
  },
  {
    "name": "TAVUK ÇÖPŞİŞ",
    "category": "ana_yemek",
    "calories": 260,
    "imageUrl": "/dishes/tavuk_copsis.jpg"
  },
  {
    "name": "TAVUK ŞNİTZEL",
    "category": "ana_yemek",
    "calories": 310,
    "imageUrl": "/dishes/tavuk_snitzel.jpg"
  },
  {
    "name": "TAVUK ŞİŞ KEBAP",
    "category": "ana_yemek",
    "calories": 270,
    "imageUrl": "/dishes/tavuk_sis_kebap.jpg"
  },
  {
    "name": "TAVUKLU BÜRYAN PİLAVI",
    "category": "ana_yemek",
    "calories": 360,
    "imageUrl": "/dishes/tavuklu_buryan_pilavi.jpg"
  },
  {
    "name": "TAVUKLU MAKLUBE",
    "category": "ana_yemek",
    "calories": 380,
    "imageUrl": "/dishes/tavuklu_maklube.jpg"
  },
  {
    "name": "TAVUKLU ORMAN KEBABI",
    "category": "ana_yemek",
    "calories": 280,
    "imageUrl": "/dishes/tavuklu_orman_kebabi.jpg"
  },
  {
    "name": "TAVUKLU SARAY SARMASI",
    "category": "ana_yemek",
    "calories": 310,
    "imageUrl": "/dishes/tavuklu_saray_sarmasi.jpg"
  },
  {
    "name": "TAVUKLU ÇÖKERTME KEBABI",
    "category": "ana_yemek",
    "calories": 330,
    "imageUrl": "/dishes/tavuklu_cokertme_kebabi.jpg"
  },
  {
    "name": "TAVUKSUYU ÇORBA",
    "category": "corba",
    "calories": 120,
    "imageUrl": "/dishes/tavuksuyu_corba.jpg"
  },
  {
    "name": "TAZE FASÜLYE",
    "category": "ana_yemek",
    "calories": 160,
    "imageUrl": "/dishes/taze_fasulye.jpg"
  },
  {
    "name": "TERBİYELİ ET HAŞLAMA",
    "category": "ana_yemek",
    "calories": 290,
    "imageUrl": "/dishes/terbiyeli_et_haslama.jpg"
  },
  {
    "name": "TOYGA ÇORBASI",
    "category": "corba",
    "calories": 125,
    "imageUrl": "/dishes/toyga_corbasi.jpg"
  },
  {
    "name": "TURŞU",
    "category": "salata",
    "calories": 20,
    "imageUrl": "/dishes/tursu.jpg"
  },
  {
    "name": "TİRAMİSU",
    "category": "tatli",
    "calories": 240,
    "imageUrl": "/dishes/tiramisu.jpg"
  },
  {
    "name": "YALANCI MANTI",
    "category": "ana_yemek",
    "calories": 320,
    "imageUrl": "/dishes/yalanci_manti.jpg"
  },
  {
    "name": "YAYLA ÇORBASI",
    "category": "corba",
    "calories": 130,
    "imageUrl": "/dishes/yayla_corbasi.jpg"
  },
  {
    "name": "YEŞİL MERCİMEK",
    "category": "ana_yemek",
    "calories": 240,
    "imageUrl": "/dishes/yesil_mercimek.jpg"
  },
  {
    "name": "YEŞİL MERCİMEK ÇORBASI",
    "category": "corba",
    "calories": 125,
    "imageUrl": "/dishes/yesil_mercimek_corbasi.jpg"
  },
  {
    "name": "YOĞURT ÇORBASI",
    "category": "corba",
    "calories": 125,
    "imageUrl": "/dishes/yayla_corbasi.jpg"
  },
  {
    "name": "YOĞURTLU MAKARNA",
    "category": "yan_yemek",
    "calories": 230,
    "imageUrl": "/dishes/yogurtlu_makarna.jpg"
  },
  {
    "name": "ÇITIR PİLİÇ",
    "category": "ana_yemek",
    "calories": 310,
    "imageUrl": "/dishes/citir_pilic.jpg"
  },
  {
    "name": "ÇOBAN KAVURMA",
    "category": "ana_yemek",
    "calories": 330,
    "imageUrl": "/dishes/coban_kavurma.jpg"
  },
  {
    "name": "ÇÖKERTME KEBABI",
    "category": "ana_yemek",
    "calories": 370,
    "imageUrl": "/dishes/cokertme_kebabi.jpg"
  },
  {
    "name": "ÇİN USULÜ TAVUK",
    "category": "ana_yemek",
    "calories": 260,
    "imageUrl": "/dishes/cin_usulu_tavuk.jpg"
  },
  {
    "name": "İSLİM KEBABI",
    "category": "ana_yemek",
    "calories": 320,
    "imageUrl": "/dishes/islim_kebabi.jpg"
  },
  {
    "name": "İZMİR KÖFTE",
    "category": "ana_yemek",
    "calories": 310,
    "imageUrl": "/dishes/izmir_kofte.jpg"
  },
  {
    "name": "İÇECEK",
    "category": "icecek",
    "calories": 80,
    "imageUrl": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80"
  },
  {
    "name": "ŞAKŞUKA",
    "category": "salata",
    "calories": 120,
    "imageUrl": "/dishes/saksuka.jpg"
  },
  {
    "name": "ŞEHRİYE PİLAVI",
    "category": "yan_yemek",
    "calories": 220,
    "imageUrl": "/dishes/sehriye_pilavi.jpg"
  },
  {
    "name": "ŞEHRİYE ÇORBASI",
    "category": "corba",
    "calories": 110,
    "imageUrl": "/dishes/sehriye_corbasi.jpg"
  },
  {
    "name": "ŞEHRİYELİ BULGUR PİLAVI",
    "category": "yan_yemek",
    "calories": 200,
    "imageUrl": "/dishes/sehriyeli_bulgur_pilavi.jpg"
  },
  {
    "name": "ŞEHRİYELİ PİRİNÇ PİLAVI",
    "category": "yan_yemek",
    "calories": 230,
    "imageUrl": "/dishes/sehriyeli_pirinc_pilavi.jpg"
  }
];

export const INITIAL_MONTHLY_PLANS = [
  {
    "year": 2026,
    "month": 9,
    "monthName": "Eylül 2026",
    "entries": [
      {
        "date": "2026-09-01T12:00:00.000Z",
        "dateStr": "1 Eylül 2026 Salı",
        "dayName": "Salı",
        "mealText": "ŞEHRİYE ÇORBASI, YEŞİL FASÜLYE, YOĞURTLU MAKARNA, MEYVE, SALATABAR",
        "items": [
          "ŞEHRİYE ÇORBASI",
          "YEŞİL FASÜLYE",
          "YOĞURTLU MAKARNA",
          "MEYVE",
          "SALATABAR"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-02T12:00:00.000Z",
        "dateStr": "2 Eylül 2026 Çarşamba",
        "dayName": "Çarşamba",
        "mealText": "MERCİMEK ÇORBASI, ARNAVUT CİĞERİ, BULGUR PİLAVI, AYRAN, SALATABAR",
        "items": [
          "MERCİMEK ÇORBASI",
          "ARNAVUT CİĞERİ",
          "BULGUR PİLAVI",
          "AYRAN",
          "SALATABAR"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-03T12:00:00.000Z",
        "dateStr": "3 Eylül 2026 Perşembe",
        "dayName": "Perşembe",
        "mealText": "TANDIR ÇORBASI, BİBER DOLMASI, PEYNİRLİ MAKARNA, PROFİTEROL, SALATABAR",
        "items": [
          "TANDIR ÇORBASI",
          "BİBER DOLMASI",
          "PEYNİRLİ MAKARNA",
          "PROFİTEROL",
          "SALATABAR"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-04T12:00:00.000Z",
        "dateStr": "4 Eylül 2026 Cuma",
        "dayName": "Cuma",
        "mealText": "YEŞİL MERCİMEK ÇORBASI, IZGARA KÖFTE, PİLAV, SALATABAR",
        "items": [
          "YEŞİL MERCİMEK ÇORBASI",
          "IZGARA KÖFTE",
          "PİLAV",
          "SALATABAR"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-05T12:00:00.000Z",
        "dateStr": "5 Eylül 2026 Cumartesi",
        "dayName": "Cumartesi",
        "mealText": "TARHANA ÇORBASI, MENEMEN, MAKARNA",
        "items": [
          "TARHANA ÇORBASI",
          "MENEMEN",
          "MAKARNA"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-07T12:00:00.000Z",
        "dateStr": "7 Eylül 2026 Pazartesi",
        "dayName": "Pazartesi",
        "mealText": "YOĞURT ÇORBASI, TAVUK ŞİNİTSEL, SPAGETTİ MAKARNA, FIRIN SÜTLAÇ, SALATABAR",
        "items": [
          "YOĞURT ÇORBASI",
          "TAVUK ŞİNİTSEL",
          "SPAGETTİ MAKARNA",
          "FIRIN SÜTLAÇ",
          "SALATABAR"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-08T12:00:00.000Z",
        "dateStr": "8 Eylül 2026 Salı",
        "dayName": "Salı",
        "mealText": "EZOGELİN ÇORBA, ISPANAK YEMEĞİ, FIRIN MAKARNA, SALATABAR",
        "items": [
          "EZOGELİN ÇORBA",
          "ISPANAK YEMEĞİ",
          "FIRIN MAKARNA",
          "SALATABAR"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-09T12:00:00.000Z",
        "dateStr": "9 Eylül 2026 Çarşamba",
        "dayName": "Çarşamba",
        "mealText": "DOMATES ÇORBASI, PİZZA, PATATES KIZARTMASI, İÇECEK, SALATABAR",
        "items": [
          "DOMATES ÇORBASI",
          "PİZZA",
          "PATATES KIZARTMASI",
          "İÇECEK",
          "SALATABAR"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-10T12:00:00.000Z",
        "dateStr": "10 Eylül 2026 Perşembe",
        "dayName": "Perşembe",
        "mealText": "TARHANA ÇORBASI, KABAK DOLMA, ERİŞTE, KARPUZ, SALATABAR",
        "items": [
          "TARHANA ÇORBASI",
          "KABAK DOLMA",
          "ERİŞTE",
          "KARPUZ",
          "SALATABAR"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-11T12:00:00.000Z",
        "dateStr": "11 Eylül 2026 Cuma",
        "dayName": "Cuma",
        "mealText": "BROKOLİ ÇORBASI, ÇÖKERTME KEBABI, PİLAV, SALATABAR",
        "items": [
          "BROKOLİ ÇORBASI",
          "ÇÖKERTME KEBABI",
          "PİLAV",
          "SALATABAR"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-12T12:00:00.000Z",
        "dateStr": "12 Eylül 2026 Cumartesi",
        "dayName": "Cumartesi",
        "mealText": "PİDE, AYRAN",
        "items": [
          "PİDE",
          "AYRAN"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-14T12:00:00.000Z",
        "dateStr": "14 Eylül 2026 Pazartesi",
        "dayName": "Pazartesi",
        "mealText": "KÖYLÜM ÇORBA, ET DÖNER, PİLAV, SALATABAR",
        "items": [
          "KÖYLÜM ÇORBA",
          "ET DÖNER",
          "PİLAV",
          "SALATABAR"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-15T12:00:00.000Z",
        "dateStr": "15 Eylül 2026 Salı",
        "dayName": "Salı",
        "mealText": "SOĞUK ÇORBA, ROSTO KÖFTE, PATATES PÜRESİ, SOSLU MAKARNA, SALATABAR",
        "items": [
          "SOĞUK ÇORBA",
          "ROSTO KÖFTE",
          "PATATES PÜRESİ",
          "SOSLU MAKARNA",
          "SALATABAR"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-16T12:00:00.000Z",
        "dateStr": "16 Eylül 2026 Çarşamba",
        "dayName": "Çarşamba",
        "mealText": "DÜĞÜN ÇORBASI, PATATES OTURTMA, MAKARNA, AĞLAYAN PASTA, SALATABAR",
        "items": [
          "DÜĞÜN ÇORBASI",
          "PATATES OTURTMA",
          "MAKARNA",
          "AĞLAYAN PASTA",
          "SALATABAR"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-17T12:00:00.000Z",
        "dateStr": "17 Eylül 2026 Perşembe",
        "dayName": "Perşembe",
        "mealText": "EZOGELİN ÇORBASI, KARNIYARIK, PİLAV, SALATABAR",
        "items": [
          "EZOGELİN ÇORBASI",
          "KARNIYARIK",
          "PİLAV",
          "SALATABAR"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-18T12:00:00.000Z",
        "dateStr": "18 Eylül 2026 Cuma",
        "dayName": "Cuma",
        "mealText": "YEŞİL MERCİMEK ÇORBASI, YALANCI MANTI, PATATES SALATASI, MEYVE, SALATABAR",
        "items": [
          "YEŞİL MERCİMEK ÇORBASI",
          "YALANCI MANTI",
          "PATATES SALATASI",
          "MEYVE",
          "SALATABAR"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-19T12:00:00.000Z",
        "dateStr": "19 Eylül 2026 Cumartesi",
        "dayName": "Cumartesi",
        "mealText": "ÇOBAN KAVURMA, PİLAV, SALATA",
        "items": [
          "ÇOBAN KAVURMA",
          "PİLAV",
          "SALATA"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-21T12:00:00.000Z",
        "dateStr": "21 Eylül 2026 Pazartesi",
        "dayName": "Pazartesi",
        "mealText": "SEBZE ÇORBASI, KURU FASÜLYE, PİRİNÇ PİLAVI, SALATABAR",
        "items": [
          "SEBZE ÇORBASI",
          "KURU FASÜLYE",
          "PİRİNÇ PİLAVI",
          "SALATABAR"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-22T12:00:00.000Z",
        "dateStr": "22 Eylül 2026 Salı",
        "dayName": "Salı",
        "mealText": "HAVUÇ ÇORBASI, ADANA KEBAP, BULGUR PİLAVI, SALATABAR",
        "items": [
          "HAVUÇ ÇORBASI",
          "ADANA KEBAP",
          "BULGUR PİLAVI",
          "SALATABAR"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-23T12:00:00.000Z",
        "dateStr": "23 Eylül 2026 Çarşamba",
        "dayName": "Çarşamba",
        "mealText": "MERCİMEK ÇORBASI, ETLİ MEVSİM TÜRLÜ, YOĞURTLU MAKARNA, HAŞHAŞLI REVANİ, SALATABAR",
        "items": [
          "MERCİMEK ÇORBASI",
          "ETLİ MEVSİM TÜRLÜ",
          "YOĞURTLU MAKARNA",
          "HAŞHAŞLI REVANİ",
          "SALATABAR"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-24T12:00:00.000Z",
        "dateStr": "24 Eylül 2026 Perşembe",
        "dayName": "Perşembe",
        "mealText": "MANTAR ÇORBASI, ÇITIR PİLİÇ, SPAGETTİ MAKARNA, SALATABAR",
        "items": [
          "MANTAR ÇORBASI",
          "ÇITIR PİLİÇ",
          "SPAGETTİ MAKARNA",
          "SALATABAR"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-25T12:00:00.000Z",
        "dateStr": "25 Eylül 2026 Cuma",
        "dayName": "Cuma",
        "mealText": "TARHANA ÇORBASI, PÜRELİ ANTRİKOT, MEYHANE PİLAVI, SALATABAR",
        "items": [
          "TARHANA ÇORBASI",
          "PÜRELİ ANTRİKOT",
          "MEYHANE PİLAVI",
          "SALATABAR"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-26T12:00:00.000Z",
        "dateStr": "26 Eylül 2026 Cumartesi",
        "dayName": "Cumartesi",
        "mealText": "DOMATES ÇORBASI, KARIŞIK KIZARTMA, MAKARNA",
        "items": [
          "DOMATES ÇORBASI",
          "KARIŞIK KIZARTMA",
          "MAKARNA"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-28T12:00:00.000Z",
        "dateStr": "28 Eylül 2026 Pazartesi",
        "dayName": "Pazartesi",
        "mealText": "ŞEHRİYE ÇORBASI, PATLICAN MUSAKKA, PİLAV, KALBURA BASTI TATLISI, SALATABAR",
        "items": [
          "ŞEHRİYE ÇORBASI",
          "PATLICAN MUSAKKA",
          "PİLAV",
          "KALBURA BASTI TATLISI",
          "SALATABAR"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-29T12:00:00.000Z",
        "dateStr": "29 Eylül 2026 Salı",
        "dayName": "Salı",
        "mealText": "MERCİMEK ÇORBASI, KADINBUDU KÖFTE, ERİŞTE, SALATABAR",
        "items": [
          "MERCİMEK ÇORBASI",
          "KADINBUDU KÖFTE",
          "ERİŞTE",
          "SALATABAR"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-09-30T12:00:00.000Z",
        "dateStr": "30 Eylül 2026 Çarşamba",
        "dayName": "Çarşamba",
        "mealText": "YAYLA ÇORBASI, BARBUNYA YEMEĞİ, YOĞURTLU MAKARNA, MEYVE, SALATABAR",
        "items": [
          "YAYLA ÇORBASI",
          "BARBUNYA YEMEĞİ",
          "YOĞURTLU MAKARNA",
          "MEYVE",
          "SALATABAR"
        ],
        "isHoliday": false
      }
    ]
  },
  {
    "year": 2026,
    "month": 11,
    "monthName": "Kasım 2026",
    "entries": [
      {
        "date": "2026-11-02T12:00:00.000Z",
        "dateStr": "2 Kasım 2026 Pazartesi",
        "dayName": "Pazartesi",
        "mealText": "MANTAR ÇORBASI, KREMALI TAVUK, PATATES PÜRESİ, SALATABAR, KAZANDİBİ",
        "items": [
          "MANTAR ÇORBASI",
          "KREMALI TAVUK",
          "PATATES PÜRESİ",
          "SALATABAR",
          "KAZANDİBİ"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-03T12:00:00.000Z",
        "dateStr": "3 Kasım 2026 Salı",
        "dayName": "Salı",
        "mealText": "KÖYLÜM ÇORBA, PATATES OTURTMA, BULGUR PİLAVI, SALATABAR, ISLAK KEK",
        "items": [
          "KÖYLÜM ÇORBA",
          "PATATES OTURTMA",
          "BULGUR PİLAVI",
          "SALATABAR",
          "ISLAK KEK"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-04T12:00:00.000Z",
        "dateStr": "4 Kasım 2026 Çarşamba",
        "dayName": "Çarşamba",
        "mealText": "EZOGELİN ÇORBA, TAS KEBABI, ERİŞTE, SALATABAR, MEYVE",
        "items": [
          "EZOGELİN ÇORBA",
          "TAS KEBABI",
          "ERİŞTE",
          "SALATABAR",
          "MEYVE"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-05T12:00:00.000Z",
        "dateStr": "5 Kasım 2026 Perşembe",
        "dayName": "Perşembe",
        "mealText": "TEL ŞEHRİYE ÇORBASI, ETLİ KURU FASÜLYE, ŞEHRİYELİ PİRİNÇ PİLAVI, SALATABAR, MEYVE",
        "items": [
          "TEL ŞEHRİYE ÇORBASI",
          "ETLİ KURU FASÜLYE",
          "ŞEHRİYELİ PİRİNÇ PİLAVI",
          "SALATABAR",
          "MEYVE"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-06T12:00:00.000Z",
        "dateStr": "6 Kasım 2026 Cuma",
        "dayName": "Cuma",
        "mealText": "YOĞURT ÇORBASI, KADINBUDU KÖFTE, SOSLU MAKARNA, SALATABAR, AYRAN",
        "items": [
          "YOĞURT ÇORBASI",
          "KADINBUDU KÖFTE",
          "SOSLU MAKARNA",
          "SALATABAR",
          "AYRAN"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-07T12:00:00.000Z",
        "dateStr": "7 Kasım 2026 Cumartesi",
        "dayName": "Cumartesi",
        "mealText": "LAHMACUN, AYRAN",
        "items": [
          "LAHMACUN",
          "AYRAN"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-09T12:00:00.000Z",
        "dateStr": "9 Kasım 2026 Pazartesi",
        "dayName": "Pazartesi",
        "mealText": "TEL ŞEHRİYE ÇORBASI, TAVUK ŞİNİTSEL, ŞEHRİYELİ PİRİNÇ PİLAVI, SALATABAR, MEYVE",
        "items": [
          "TEL ŞEHRİYE ÇORBASI",
          "TAVUK ŞİNİTSEL",
          "ŞEHRİYELİ PİRİNÇ PİLAVI",
          "SALATABAR",
          "MEYVE"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-10T12:00:00.000Z",
        "dateStr": "10 Kasım 2026 Salı",
        "dayName": "Salı",
        "mealText": "YAYLA ÇORBASI, MEVSİM TÜRLÜ, ŞEHRİYE PİLAVI, SALATABAR, MEYVE",
        "items": [
          "YAYLA ÇORBASI",
          "MEVSİM TÜRLÜ",
          "ŞEHRİYE PİLAVI",
          "SALATABAR",
          "MEYVE"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-11T12:00:00.000Z",
        "dateStr": "11 Kasım 2026 Çarşamba",
        "dayName": "Çarşamba",
        "mealText": "EZOGELİN ÇORBA, ÇÖKERTME KEBABI, SPAGETTİ MAKARNA, SALATABAR, MEYVE",
        "items": [
          "EZOGELİN ÇORBA",
          "ÇÖKERTME KEBABI",
          "SPAGETTİ MAKARNA",
          "SALATABAR",
          "MEYVE"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-12T12:00:00.000Z",
        "dateStr": "12 Kasım 2026 Perşembe",
        "dayName": "Perşembe",
        "mealText": "KREMALI MANTAR ÇORBASI, BEZELYE YEMEĞİ, PEYNİRLİ BÖREK, SALATABAR, KOMPOSTO",
        "items": [
          "KREMALI MANTAR ÇORBASI",
          "BEZELYE YEMEĞİ",
          "PEYNİRLİ BÖREK",
          "SALATABAR",
          "KOMPOSTO"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-13T12:00:00.000Z",
        "dateStr": "13 Kasım 2026 Cuma",
        "dayName": "Cuma",
        "mealText": "MERCİMEK ÇORBASI, TAVUK ŞİNİTSEL, PEYNİRLİ ERİŞTE, TURŞU, MEYVE",
        "items": [
          "MERCİMEK ÇORBASI",
          "TAVUK ŞİNİTSEL",
          "PEYNİRLİ ERİŞTE",
          "TURŞU",
          "MEYVE"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-14T12:00:00.000Z",
        "dateStr": "14 Kasım 2026 Cumartesi",
        "dayName": "Cumartesi",
        "mealText": "KREMALI MANTAR KAVURMA, MAKARNA, AYRAN",
        "items": [
          "KREMALI MANTAR KAVURMA",
          "MAKARNA",
          "AYRAN"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-16T12:00:00.000Z",
        "dateStr": "16 Kasım 2026 Pazartesi",
        "dayName": "Pazartesi",
        "mealText": "YOĞURT ÇORBASI, TAVUK KAVURMA, PATATES KIZARTMASI, PATATES SALATASI, PROFİTEROL",
        "items": [
          "YOĞURT ÇORBASI",
          "TAVUK KAVURMA",
          "PATATES KIZARTMASI",
          "PATATES SALATASI",
          "PROFİTEROL"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-17T12:00:00.000Z",
        "dateStr": "17 Kasım 2026 Salı",
        "dayName": "Salı",
        "mealText": "TARHANA ÇORBASI, ETLİ PATATES YEMEĞİ, SEBZELİ PİRİNÇ PİLAVI, ŞAKŞUKA, KAZANDİBİ",
        "items": [
          "TARHANA ÇORBASI",
          "ETLİ PATATES YEMEĞİ",
          "SEBZELİ PİRİNÇ PİLAVI",
          "ŞAKŞUKA",
          "KAZANDİBİ"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-18T12:00:00.000Z",
        "dateStr": "18 Kasım 2026 Çarşamba",
        "dayName": "Çarşamba",
        "mealText": "ÇORBA, HASANPAŞA KÖFTE, PEYNİRLİ MAKARNA, ŞAKŞUKA, MEYVE",
        "items": [
          "ÇORBA",
          "HASANPAŞA KÖFTE",
          "PEYNİRLİ MAKARNA",
          "ŞAKŞUKA",
          "MEYVE"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-19T12:00:00.000Z",
        "dateStr": "19 Kasım 2026 Perşembe",
        "dayName": "Perşembe",
        "mealText": "SOĞUK ÇORBA, KREMALI MANTAR KAVURMA, SEBZELİ BULGUR PİLAVI, SALATABAR, GELİN TÜLÜ TATLISI",
        "items": [
          "SOĞUK ÇORBA",
          "KREMALI MANTAR KAVURMA",
          "SEBZELİ BULGUR PİLAVI",
          "SALATABAR",
          "GELİN TÜLÜ TATLISI"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-20T12:00:00.000Z",
        "dateStr": "20 Kasım 2026 Cuma",
        "dayName": "Cuma",
        "mealText": "HAVUÇ ÇORBASI, PÜRELİ ANTRİKOT, ERİŞTE, CACIK, MEYVE",
        "items": [
          "HAVUÇ ÇORBASI",
          "PÜRELİ ANTRİKOT",
          "ERİŞTE",
          "CACIK",
          "MEYVE"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-21T12:00:00.000Z",
        "dateStr": "21 Kasım 2026 Cumartesi",
        "dayName": "Cumartesi",
        "mealText": "PİDE, AYRAN",
        "items": [
          "PİDE",
          "AYRAN"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-23T12:00:00.000Z",
        "dateStr": "23 Kasım 2026 Pazartesi",
        "dayName": "Pazartesi",
        "mealText": "MERCİMEK ÇORBASI, ET DÖNER, ŞEHRİYELİ PİRİNÇ PİLAVI, SALATABAR, PUDİNG",
        "items": [
          "MERCİMEK ÇORBASI",
          "ET DÖNER",
          "ŞEHRİYELİ PİRİNÇ PİLAVI",
          "SALATABAR",
          "PUDİNG"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-24T12:00:00.000Z",
        "dateStr": "24 Kasım 2026 Salı",
        "dayName": "Salı",
        "mealText": "TARHANA ÇORBASI, KIYMALI PIRASA, SEBZELİ PİRİNÇ PİLAVI, SALATABAR, FIRIN SÜTLAÇ",
        "items": [
          "TARHANA ÇORBASI",
          "KIYMALI PIRASA",
          "SEBZELİ PİRİNÇ PİLAVI",
          "SALATABAR",
          "FIRIN SÜTLAÇ"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-25T12:00:00.000Z",
        "dateStr": "25 Kasım 2026 Çarşamba",
        "dayName": "Çarşamba",
        "mealText": "ŞEHRİYE ÇORBASI, IZGARA KÖFTE, BİBER KIZARTMASI, SALATABAR, MEYVE",
        "items": [
          "ŞEHRİYE ÇORBASI",
          "IZGARA KÖFTE",
          "BİBER KIZARTMASI",
          "SALATABAR",
          "MEYVE"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-26T12:00:00.000Z",
        "dateStr": "26 Kasım 2026 Perşembe",
        "dayName": "Perşembe",
        "mealText": "DOMATES ÇORBASI, ETLİ MEVSİM TÜRLÜ, BULGUR PİLAVI, SALATABAR, KOMPOSTO",
        "items": [
          "DOMATES ÇORBASI",
          "ETLİ MEVSİM TÜRLÜ",
          "BULGUR PİLAVI",
          "SALATABAR",
          "KOMPOSTO"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-27T12:00:00.000Z",
        "dateStr": "27 Kasım 2026 Cuma",
        "dayName": "Cuma",
        "mealText": "MISIR ÇORBASI, TAVUK SOTE, SOSLU MAKARNA, SALATABAR, TİRAMİSU",
        "items": [
          "MISIR ÇORBASI",
          "TAVUK SOTE",
          "SOSLU MAKARNA",
          "SALATABAR",
          "TİRAMİSU"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-28T12:00:00.000Z",
        "dateStr": "28 Kasım 2026 Cumartesi",
        "dayName": "Cumartesi",
        "mealText": "MENEMEN,MAKARNA",
        "items": [
          "MENEMEN",
          "MAKARNA"
        ],
        "isHoliday": false
      },
      {
        "date": "2026-11-30T12:00:00.000Z",
        "dateStr": "30 Kasım 2026 Pazartesi",
        "dayName": "Pazartesi",
        "mealText": "SOĞUK ÇORBA, İSLİM KEBABI, SOSLU MAKARNA, ŞAKŞUKA, AĞLAYAN PASTA",
        "items": [
          "SOĞUK ÇORBA",
          "İSLİM KEBABI",
          "SOSLU MAKARNA",
          "ŞAKŞUKA",
          "AĞLAYAN PASTA"
        ],
        "isHoliday": false
      }
    ]
  }
];

let hasSeeded = false;

export async function ensureDatabaseSeeded(client?: any) {
  if (hasSeeded) return;

  const db = client || prisma;

  try {
    const mealCount = await db.meal.count();
    if (mealCount === 0) {
      console.log('Veritabanı boş, 157 yemek aktarılıyor...');
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
      // Yalnızca veritabanında henüz bulunmayan ilk başlangıç yemeklerini ekle (Kullanıcının mevcut verilerini ve fotoğraflarını ASLA ezme!)
      for (const meal of INITIAL_MEALS) {
        const existing = await db.meal.findFirst({
          where: { name: meal.name },
        });
        if (!existing) {
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

    // Kodda tanımlı olup veritabanında henüz bulunmayan aylık planları aktar
    for (const plan of INITIAL_MONTHLY_PLANS) {
      const existingPlan = await db.monthlyPlan.findUnique({
        where: { year_month: { year: plan.year, month: plan.month } },
      });

      if (!existingPlan) {
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
        console.log(`[Seed] ${plan.monthName} planı veritabanına eklendi.`);
      }
    }

    hasSeeded = true;
  } catch (err) {
    console.error('ensureDatabaseSeeded hatası:', err);
  }
}
