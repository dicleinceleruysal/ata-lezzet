import type { PrismaClient } from '@prisma/client';

export const INITIAL_MEALS: Array<{ name: string; category: string; calories: number }> = [
  {
    "name": "Fırında Karnıyarık",
    "category": "ana_yemek",
    "calories": 260
  },
  {
    "name": "TAVUK SOTE",
    "category": "ana_yemek",
    "calories": 250
  },
  {
    "name": "Orman Kebabı",
    "category": "ana_yemek",
    "calories": 310
  },
  {
    "name": "ŞEHRİYELİ PİRİNÇ PİLAVI",
    "category": "yan_yemek",
    "calories": 230
  },
  {
    "name": "SEBZELİ BULGUR PİLAVI",
    "category": "yan_yemek",
    "calories": 185
  },
  {
    "name": "Cevizli Baklava (2 Dilim)",
    "category": "tatli",
    "calories": 280
  },
  {
    "name": "ISPANAKLI BÖREK",
    "category": "yan_yemek",
    "calories": 240
  },
  {
    "name": "ŞEHRİYELİ BULGUR PİLAVI",
    "category": "yan_yemek",
    "calories": 200
  },
  {
    "name": "MERCİMEK ÇORBASI",
    "category": "corba",
    "calories": 125
  },
  {
    "name": "ARNAVUT CİĞERİ",
    "category": "ana_yemek",
    "calories": 310
  },
  {
    "name": "BULGUR PİLAVI",
    "category": "yan_yemek",
    "calories": 195
  },
  {
    "name": "AYRAN",
    "category": "icecek",
    "calories": 70
  },
  {
    "name": "SALATABAR",
    "category": "salata",
    "calories": 55
  },
  {
    "name": "TANDIR ÇORBASI",
    "category": "corba",
    "calories": 160
  },
  {
    "name": "BİBER DOLMASI",
    "category": "ana_yemek",
    "calories": 220
  },
  {
    "name": "PEYNİRLİ MAKARNA",
    "category": "yan_yemek",
    "calories": 240
  },
  {
    "name": "PROFİTEROL",
    "category": "tatli",
    "calories": 260
  },
  {
    "name": "IZGARA KÖFTE",
    "category": "ana_yemek",
    "calories": 270
  },
  {
    "name": "TARHANA ÇORBASI",
    "category": "corba",
    "calories": 115
  },
  {
    "name": "MENEMEN",
    "category": "ana_yemek",
    "calories": 190
  },
  {
    "name": "MAKARNA",
    "category": "yan_yemek",
    "calories": 220
  },
  {
    "name": "YOĞURT ÇORBASI",
    "category": "corba",
    "calories": 125
  },
  {
    "name": "TAVUK ŞİNİTSEL",
    "category": "ana_yemek",
    "calories": 310
  },
  {
    "name": "SPAGETTİ MAKARNA",
    "category": "yan_yemek",
    "calories": 225
  },
  {
    "name": "FIRIN SÜTLAÇ",
    "category": "tatli",
    "calories": 210
  },
  {
    "name": "EZOGELİN ÇORBA",
    "category": "corba",
    "calories": 120
  },
  {
    "name": "ISPANAK YEMEĞİ",
    "category": "ana_yemek",
    "calories": 160
  },
  {
    "name": "FIRIN MAKARNA",
    "category": "yan_yemek",
    "calories": 270
  },
  {
    "name": "DOMATES ÇORBASI",
    "category": "corba",
    "calories": 105
  },
  {
    "name": "PİZZA",
    "category": "ana_yemek",
    "calories": 320
  },
  {
    "name": "PATATES KIZARTMASI",
    "category": "yan_yemek",
    "calories": 250
  },
  {
    "name": "İÇECEK",
    "category": "icecek",
    "calories": 80
  },
  {
    "name": "KABAK DOLMA",
    "category": "ana_yemek",
    "calories": 210
  },
  {
    "name": "ERİŞTE",
    "category": "yan_yemek",
    "calories": 220
  },
  {
    "name": "BROKOLİ ÇORBASI",
    "category": "corba",
    "calories": 85
  },
  {
    "name": "ÇÖKERTME KEBABI",
    "category": "ana_yemek",
    "calories": 370
  },
  {
    "name": "PİDE",
    "category": "ana_yemek",
    "calories": 320
  },
  {
    "name": "PİRİNÇ PİLAVI",
    "category": "yan_yemek",
    "calories": 230
  },
  {
    "name": "CACIK",
    "category": "salata",
    "calories": 70
  },
  {
    "name": "YAYLA ÇORBASI",
    "category": "corba",
    "calories": 130
  },
  {
    "name": "KARNIYARIK",
    "category": "ana_yemek",
    "calories": 260
  },
  {
    "name": "MEYVE",
    "category": "tatli",
    "calories": 55
  },
  {
    "name": "KURU FASULYE",
    "category": "ana_yemek",
    "calories": 250
  },
  {
    "name": "TURŞU",
    "category": "salata",
    "calories": 20
  },
  {
    "name": "İZMİR KÖFTE",
    "category": "ana_yemek",
    "calories": 310
  },
  {
    "name": "SÜTLAÇ",
    "category": "tatli",
    "calories": 210
  },
  {
    "name": "DÜĞÜN ÇORBASI",
    "category": "corba",
    "calories": 145
  },
  {
    "name": "TAS KEBABI",
    "category": "ana_yemek",
    "calories": 320
  },
  {
    "name": "LAHMACUN",
    "category": "ana_yemek",
    "calories": 240
  },
  {
    "name": "ŞEHRİYE ÇORBASI",
    "category": "corba",
    "calories": 110
  },
  {
    "name": "TAVUK DÖNER",
    "category": "ana_yemek",
    "calories": 260
  },
  {
    "name": "ET KAVURMA",
    "category": "ana_yemek",
    "calories": 340
  },
  {
    "name": "BEZELYE YEMEĞİ",
    "category": "ana_yemek",
    "calories": 190
  },
  {
    "name": "FIRIN TAVUK",
    "category": "ana_yemek",
    "calories": 270
  },
  {
    "name": "KEMALPAŞA",
    "category": "tatli",
    "calories": 210
  },
  {
    "name": "KIYMALI BÖREK",
    "category": "yan_yemek",
    "calories": 280
  },
  {
    "name": "GÜVEÇTE KÖFTE",
    "category": "ana_yemek",
    "calories": 320
  },
  {
    "name": "TAVUK KAVURMA",
    "category": "ana_yemek",
    "calories": 270
  },
  {
    "name": "YOĞURTLU MAKARNA",
    "category": "yan_yemek",
    "calories": 230
  },
  {
    "name": "KÖYLÜM ÇORBA",
    "category": "corba",
    "calories": 120
  },
  {
    "name": "ET DÖNER",
    "category": "ana_yemek",
    "calories": 280
  },
  {
    "name": "SOĞUK ÇORBA",
    "category": "corba",
    "calories": 110
  },
  {
    "name": "ROSTO KÖFTE",
    "category": "ana_yemek",
    "calories": 310
  },
  {
    "name": "PATATES PÜRESİ",
    "category": "yan_yemek",
    "calories": 160
  },
  {
    "name": "SOSLU MAKARNA",
    "category": "yan_yemek",
    "calories": 230
  },
  {
    "name": "PATATES OTURTMA",
    "category": "ana_yemek",
    "calories": 280
  },
  {
    "name": "AĞLAYAN PASTA",
    "category": "tatli",
    "calories": 250
  },
  {
    "name": "YALANCI MANTI",
    "category": "ana_yemek",
    "calories": 320
  },
  {
    "name": "PATATES SALATASI",
    "category": "salata",
    "calories": 150
  },
  {
    "name": "ÇOBAN KAVURMA",
    "category": "ana_yemek",
    "calories": 330
  },
  {
    "name": "SEBZE ÇORBASI",
    "category": "corba",
    "calories": 90
  },
  {
    "name": "HAVUÇ ÇORBASI",
    "category": "corba",
    "calories": 95
  },
  {
    "name": "ADANA KEBAP",
    "category": "ana_yemek",
    "calories": 310
  },
  {
    "name": "ETLİ MEVSİM TÜRLÜ",
    "category": "ana_yemek",
    "calories": 240
  },
  {
    "name": "HAŞHAŞLI REVANİ",
    "category": "tatli",
    "calories": 260
  },
  {
    "name": "MANTAR ÇORBASI",
    "category": "corba",
    "calories": 100
  },
  {
    "name": "ÇITIR PİLİÇ",
    "category": "ana_yemek",
    "calories": 310
  },
  {
    "name": "PÜRELİ ANTRİKOT",
    "category": "ana_yemek",
    "calories": 360
  },
  {
    "name": "MEYHANE PİLAVI",
    "category": "yan_yemek",
    "calories": 200
  },
  {
    "name": "KARIŞIK KIZARTMA",
    "category": "ana_yemek",
    "calories": 280
  },
  {
    "name": "PATLICAN MUSAKKA",
    "category": "ana_yemek",
    "calories": 270
  },
  {
    "name": "KALBURA BASTI TATLISI",
    "category": "tatli",
    "calories": 260
  },
  {
    "name": "KADINBUDU KÖFTE",
    "category": "ana_yemek",
    "calories": 290
  },
  {
    "name": "BARBUNYA YEMEĞİ",
    "category": "ana_yemek",
    "calories": 260
  },
  {
    "name": "KREMALI MANTAR ÇORBASI",
    "category": "corba",
    "calories": 155
  },
  {
    "name": "TEL ŞEHRİYE ÇORBASI",
    "category": "corba",
    "calories": 110
  },
  {
    "name": "ARABAŞI ÇORBASI",
    "category": "corba",
    "calories": 135
  },
  {
    "name": "TAVUKSUYU ÇORBA",
    "category": "corba",
    "calories": 120
  },
  {
    "name": "TOYGA ÇORBASI",
    "category": "corba",
    "calories": 125
  },
  {
    "name": "MISIR ÇORBASI",
    "category": "corba",
    "calories": 120
  },
  {
    "name": "TAZE FASÜLYE",
    "category": "ana_yemek",
    "calories": 160
  },
  {
    "name": "MANTI",
    "category": "ana_yemek",
    "calories": 340
  },
  {
    "name": "KAVURMA",
    "category": "ana_yemek",
    "calories": 340
  },
  {
    "name": "ROSTO ET",
    "category": "ana_yemek",
    "calories": 290
  },
  {
    "name": "FIRINDA TAVUK PİRZOLA",
    "category": "ana_yemek",
    "calories": 280
  },
  {
    "name": "ETLİ KURU FASÜLYE",
    "category": "ana_yemek",
    "calories": 290
  },
  {
    "name": "MEVSİM TÜRLÜ",
    "category": "ana_yemek",
    "calories": 180
  },
  {
    "name": "KABAK SANDAL",
    "category": "ana_yemek",
    "calories": 220
  },
  {
    "name": "TAVUK ÇÖPŞİŞ",
    "category": "ana_yemek",
    "calories": 260
  },
  {
    "name": "ETLİ PATATES YEMEĞİ",
    "category": "ana_yemek",
    "calories": 280
  },
  {
    "name": "ELBASAN TAVA",
    "category": "ana_yemek",
    "calories": 340
  },
  {
    "name": "SEMİZ YEMEĞİ",
    "category": "ana_yemek",
    "calories": 150
  },
  {
    "name": "MİSKET KÖFTE",
    "category": "ana_yemek",
    "calories": 280
  },
  {
    "name": "ETLİ NOHUT",
    "category": "ana_yemek",
    "calories": 290
  },
  {
    "name": "HAMBURGER",
    "category": "ana_yemek",
    "calories": 360
  },
  {
    "name": "ÇİN USULÜ TAVUK",
    "category": "ana_yemek",
    "calories": 260
  },
  {
    "name": "HASANPAŞA KÖFTE",
    "category": "ana_yemek",
    "calories": 330
  },
  {
    "name": "ANKARA TAVA",
    "category": "ana_yemek",
    "calories": 360
  },
  {
    "name": "MANTAR KAVURMA",
    "category": "ana_yemek",
    "calories": 170
  },
  {
    "name": "IZGARA KANAT",
    "category": "ana_yemek",
    "calories": 290
  },
  {
    "name": "TAVUK FAJİTA",
    "category": "ana_yemek",
    "calories": 280
  },
  {
    "name": "İSLİM KEBABI",
    "category": "ana_yemek",
    "calories": 320
  },
  {
    "name": "AVCI BÖREĞİ",
    "category": "yan_yemek",
    "calories": 290
  },
  {
    "name": "SEBZELİ PİRİNÇ PİLAVI",
    "category": "yan_yemek",
    "calories": 215
  },
  {
    "name": "BİBER KIZARTMASI",
    "category": "yan_yemek",
    "calories": 150
  },
  {
    "name": "PEYNİRLİ BÖREK",
    "category": "yan_yemek",
    "calories": 260
  },
  {
    "name": "PATATESLİ KOL BÖREĞİ",
    "category": "yan_yemek",
    "calories": 260
  },
  {
    "name": "ŞAKŞUKA",
    "category": "salata",
    "calories": 120
  },
  {
    "name": "AŞURE",
    "category": "tatli",
    "calories": 240
  },
  {
    "name": "KOMPOSTO",
    "category": "tatli",
    "calories": 110
  },
  {
    "name": "TİRAMİSU",
    "category": "tatli",
    "calories": 240
  },
  {
    "name": "GELİN TÜLÜ TATLISI",
    "category": "tatli",
    "calories": 230
  },
  {
    "name": "SUPANGELE",
    "category": "tatli",
    "calories": 200
  },
  {
    "name": "PUDİNG",
    "category": "tatli",
    "calories": 165
  },
  {
    "name": "KIBRIS TATLISI",
    "category": "tatli",
    "calories": 270
  },
  {
    "name": "ISLAK KEK",
    "category": "tatli",
    "calories": 250
  },
  {
    "name": "KAZANDİBİ",
    "category": "tatli",
    "calories": 190
  },
  {
    "name": "TERBİYELİ ET HAŞLAMA",
    "category": "ana_yemek",
    "calories": 290
  },
  {
    "name": "KREMALI MANTAR KAVURMA",
    "category": "ana_yemek",
    "calories": 220
  },
  {
    "name": "BEĞENDİLİ KEBAP",
    "category": "ana_yemek",
    "calories": 370
  },
  {
    "name": "LAVAŞ ÜSTÜ TAVUK TANTUNİ",
    "category": "ana_yemek",
    "calories": 320
  },
  {
    "name": "PATATES YEMEĞİ",
    "category": "ana_yemek",
    "calories": 210
  },
  {
    "name": "PEYNİRLİ ERİŞTE",
    "category": "yan_yemek",
    "calories": 245
  },
  {
    "name": "PAÇANGA BÖREĞİ",
    "category": "yan_yemek",
    "calories": 300
  },
  {
    "name": "SEBZELİ TAVUKLU BÖREK",
    "category": "yan_yemek",
    "calories": 270
  },
  {
    "name": "FIRINDA BAHARATLI PATATES",
    "category": "yan_yemek",
    "calories": 180
  },
  {
    "name": "ŞEHRİYE PİLAVI",
    "category": "yan_yemek",
    "calories": 220
  },
  {
    "name": "YEŞİL MERCİMEK",
    "category": "ana_yemek",
    "calories": 240
  },
  {
    "name": "KARNABAHAR GRATEN",
    "category": "ana_yemek",
    "calories": 230
  },
  {
    "name": "KIYMALI PIRASA",
    "category": "ana_yemek",
    "calories": 190
  },
  {
    "name": "KREMALI TAVUK",
    "category": "ana_yemek",
    "calories": 310
  },
  {
    "name": "FIRINDA SOSLU TAVUK BAGET",
    "category": "ana_yemek",
    "calories": 260
  },
  {
    "name": "KÖRİLİ TAVUK",
    "category": "ana_yemek",
    "calories": 270
  },
  {
    "name": "TAVUK ŞNİTZEL",
    "category": "ana_yemek",
    "calories": 310
  },
  {
    "name": "KREMALI MANTARLI TAVUK",
    "category": "ana_yemek",
    "calories": 320
  },
  {
    "name": "FIRINDA SEBZELİ TAVUK",
    "category": "ana_yemek",
    "calories": 260
  },
  {
    "name": "TAVUKLU SARAY SARMASI",
    "category": "ana_yemek",
    "calories": 310
  },
  {
    "name": "TAVUKLU ÇÖKERTME KEBABI",
    "category": "ana_yemek",
    "calories": 330
  },
  {
    "name": "SOYA SOSLU TAVUK",
    "category": "ana_yemek",
    "calories": 260
  },
  {
    "name": "TAVUKLU BÜRYAN PİLAVI",
    "category": "ana_yemek",
    "calories": 360
  },
  {
    "name": "TAVUK ŞİŞ KEBAP",
    "category": "ana_yemek",
    "calories": 270
  },
  {
    "name": "TAVUK SULTAN KEBABI",
    "category": "ana_yemek",
    "calories": 350
  },
  {
    "name": "TAVUK BEYTİ",
    "category": "ana_yemek",
    "calories": 340
  },
  {
    "name": "TAVUKLU MAKLUBE",
    "category": "ana_yemek",
    "calories": 380
  },
  {
    "name": "TAVUKLU ORMAN KEBABI",
    "category": "ana_yemek",
    "calories": 280
  },
  {
    "name": "LAZANYA",
    "category": "ana_yemek",
    "calories": 340
  },
  {
    "name": "YEŞİL FASÜLYE",
    "category": "ana_yemek",
    "calories": 160
  },
  {
    "name": "YEŞİL MERCİMEK ÇORBASI",
    "category": "corba",
    "calories": 125
  },
  {
    "name": "PİLAV",
    "category": "yan_yemek",
    "calories": 230
  },
  {
    "name": "KARPUZ",
    "category": "tatli",
    "calories": 45
  },
  {
    "name": "EZOGELİN ÇORBASI",
    "category": "corba",
    "calories": 120
  },
  {
    "name": "SALATA",
    "category": "salata",
    "calories": 55
  },
  {
    "name": "KURU FASÜLYE",
    "category": "ana_yemek",
    "calories": 250
  },
  {
    "name": "ÇORBA",
    "category": "corba",
    "calories": 115
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
