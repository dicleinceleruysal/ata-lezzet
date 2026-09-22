import type { PrismaClient } from '@prisma/client';

export const INITIAL_MEALS: Array<{ name: string; category: string; calories: number; imageUrl?: string | null }> = [
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
    "imageUrl": "https://images.unsplash.com/photo-1556881286-fc6915169721?w=600&auto=format&fit=crop&q=80"
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
    "imageUrl": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80"
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
    "imageUrl": "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80"
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
    "imageUrl": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80"
  },
  {
    "name": "PUDİNG",
    "category": "tatli",
    "calories": 165,
    "imageUrl": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80"
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
    "imageUrl": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80"
  },
  {
    "name": "SÜTLAÇ",
    "category": "tatli",
    "calories": 210,
    "imageUrl": "/dishes/firin_sutlac.jpg"
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
    "imageUrl": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80"
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

export const EYLUL_2026_LIST = [
  { day: 1, dateStr: '1 Eylül 2026', dayName: 'Salı', mealText: 'ŞEHRİYE ÇORBASI, YEŞİL FASÜLYE, YOĞURTLU MAKARNA, MEYVE, SALATABAR' },
  { day: 2, dateStr: '2 Eylül 2026', dayName: 'Çarşamba', mealText: 'MERCİMEK ÇORBASI, ARNAVUT CİĞERİ, BULGUR PİLAVI, AYRAN, SALATABAR' },
  { day: 3, dateStr: '3 Eylül 2026', dayName: 'Perşembe', mealText: 'TANDIR ÇORBASI, BİBER DOLMASI, PEYNİRLİ MAKARNA, PROFİTEROL, SALATABAR' },
  { day: 4, dateStr: '4 Eylül 2026', dayName: 'Cuma', mealText: 'YEŞİL MERCİMEK ÇORBASI, IZGARA KÖFTE, PİLAV, SALATABAR' },
  { day: 5, dateStr: '5 Eylül 2026', dayName: 'Cumartesi', mealText: 'TARHANA ÇORBASI, MENEMEN, MAKARNA' },
  { day: 7, dateStr: '7 Eylül 2026', dayName: 'Pazartesi', mealText: 'YOĞURT ÇORBASI, TAVUK ŞİNİTSEL, SPAGETTİ MAKARNA, FIRIN SÜTLAÇ, SALATABAR' },
  { day: 8, dateStr: '8 Eylül 2026', dayName: 'Salı', mealText: 'EZOGELİN ÇORBA, ISPANAK YEMEĞİ, FIRIN MAKARNA, SALATABAR' },
  { day: 9, dateStr: '9 Eylül 2026', dayName: 'Çarşamba', mealText: 'DOMATES ÇORBASI, PİZZA, PATATES KIZARTMASI, İÇECEK, SALATABAR' },
  { day: 10, dateStr: '10 Eylül 2026', dayName: 'Perşembe', mealText: 'TARHANA ÇORBASI, KABAK DOLMA, ERİŞTE, KARPUZ, SALATABAR' },
  { day: 11, dateStr: '11 Eylül 2026', dayName: 'Cuma', mealText: 'BROKOLİ ÇORBASI, ÇÖKERTME KEBABI, PİLAV, SALATABAR' },
  { day: 12, dateStr: '12 Eylül 2026', dayName: 'Cumartesi', mealText: 'PİDE, AYRAN' },
  { day: 14, dateStr: '14 Eylül 2026', dayName: 'Pazartesi', mealText: 'MERCİMEK ÇORBASI, TAVUK SOTE, PİRİNÇ PİLAVI, CACIK, SALATABAR' },
  { day: 15, dateStr: '15 Eylül 2026', dayName: 'Salı', mealText: 'YAYLA ÇORBASI, KARNIYARIK, BULGUR PİLAVI, MEYVE, SALATABAR' },
  { day: 16, dateStr: '16 Eylül 2026', dayName: 'Çarşamba', mealText: 'EZOGELİN ÇORBASI, KURU FASULYE, ŞEHRİYELİ PİLAV, TURŞU, SALATABAR' },
  { day: 17, dateStr: '17 Eylül 2026', dayName: 'Perşembe', mealText: 'DOMATES ÇORBASI, İZMİR KÖFTE, MAKARNA, SÜTLAÇ, SALATABAR' },
  { day: 18, dateStr: '18 Eylül 2026', dayName: 'Cuma', mealText: 'DÜĞÜN ÇORBASI, TAS KEBABI, PİLAV, AYRAN, SALATABAR' },
  { day: 19, dateStr: '19 Eylül 2026', dayName: 'Cumartesi', mealText: 'LAHMACUN, AYRAN, SALATABAR' },
  { day: 21, dateStr: '21 Eylül 2026', dayName: 'Pazartesi', mealText: 'ŞEHRİYE ÇORBASI, TAVUK DÖNER, PİLAV, TATLI, SALATABAR' },
  { day: 22, dateStr: '22 Eylül 2026', dayName: 'Salı', mealText: 'MERCİMEK ÇORBASI, ET KAVURMA, BULGUR PİLAVI, MEYVE, SALATABAR' },
  { day: 23, dateStr: '23 Eylül 2026', dayName: 'Çarşamba', mealText: 'EZOGELİN ÇORBASI, KÖFTE PATATES, MAKARNA, AYRAN, SALATABAR' },
  { day: 24, dateStr: '24 Eylül 2026', dayName: 'Perşembe', mealText: 'YAYLA ÇORBASI, BEZELYE YEMEĞİ, PİRİNÇ PİLAVI, CACIK, SALATABAR' },
  { day: 25, dateStr: '25 Eylül 2026', dayName: 'Cuma', mealText: 'TARHANA ÇORBASI, FIRIN TAVUK, PİLAV, KEMALPAŞA, SALATABAR' },
  { day: 26, dateStr: '26 Eylül 2026', dayName: 'Cumartesi', mealText: 'KIYMALI BÖREK, AYRAN, MEYVE' },
  { day: 28, dateStr: '28 Eylül 2026', dayName: 'Pazartesi', mealText: 'DOMATES ÇORBASI, GÜVEÇTE KÖFTE, MAKARNA, SÜTLAÇ, SALATABAR' },
  { day: 29, dateStr: '29 Eylül 2026', dayName: 'Salı', mealText: 'MERCİMEK ÇORBASI, KURU FASULYE, PİRİNÇ PİLAVI, TURŞU, SALATABAR' },
  { day: 30, dateStr: '30 Eylül 2026', dayName: 'Çarşamba', mealText: 'TANDIR ÇORBASI, TAVUK KAVURMA, BULGUR PİLAVI, AYRAN, SALATABAR' },
];

let seedPromise: Promise<void> | null = null;

export async function ensureDatabaseSeeded(prisma: PrismaClient): Promise<void> {
  if (seedPromise) return seedPromise;

  seedPromise = (async () => {
    try {
      const mealCount = await prisma.meal.count();
      if (mealCount === 0) {
        console.log('[ensureSeed] Veritabanı boş tespit edildi, 164 tabldot yemeği yükleniyor...');
        for (const m of INITIAL_MEALS) {
          await prisma.meal.create({
            data: {
              name: m.name,
              category: m.category,
              calories: m.calories,
              imageUrl: m.imageUrl || null,
              isActive: true,
            },
          });
        }
        console.log('[ensureSeed] 164 yemek başarıyla oluşturuldu.');
      }

      const planCount = await prisma.monthlyPlan.count();
      if (planCount === 0) {
        console.log('[ensureSeed] Eylül 2026 aylık planı yükleniyor...');
        const plan = await prisma.monthlyPlan.create({
          data: {
            year: 2026,
            month: 9,
            monthName: 'Eylül 2026',
          },
        });

        for (const item of EYLUL_2026_LIST) {
          const itemDate = new Date(Date.UTC(2026, 8, item.day, 12, 0, 0));
          const itemsArray = item.mealText.split(',').map((s) => s.trim()).filter(Boolean);

          await prisma.dailyMenuEntry.create({
            data: {
              monthlyPlanId: plan.id,
              date: itemDate,
              dateStr: item.dateStr,
              dayName: item.dayName,
              mealText: item.mealText,
              items: JSON.stringify(itemsArray),
              isHoliday: false,
            },
          });
        }
        console.log('[ensureSeed] Eylül 2026 planı başarıyla oluşturuldu.');
      }
    } catch (err) {
      console.error('[ensureSeed] Hata:', err);
    }
  })();

  return seedPromise;
}
