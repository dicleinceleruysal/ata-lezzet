import * as XLSX from 'xlsx';

export interface ExportMenuEntry {
  id?: string;
  date?: string;
  dateStr: string;
  dayName: string;
  items?: string[] | string;
  mealText?: string;
  isHoliday?: boolean;
}

export interface FormattedMenuRow {
  dayNumber: number;
  dateStr: string;
  dayName: string;
  isSunday: boolean;
  mealTextUpper: string;
}

const TURKISH_MONTHS = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

const TURKISH_DAYS = [
  'Pazar',
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
];

export function parseDishList(items: unknown, mealText?: string): string[] {
  if (Array.isArray(items)) return items.map(String).filter(Boolean);
  if (typeof items === 'string') {
    try {
      if (items.trim().startsWith('[')) {
        const parsed = JSON.parse(items);
        if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
      }
      return items.split(',').map((s) => s.trim()).filter(Boolean);
    } catch {
      // fallback
    }
  }
  if (typeof mealText === 'string') {
    return mealText.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

/**
 * Kullanıcı görselindeki format için ayın tüm günlerini (1'den 30/31'e kadar) oluşturur.
 * Pazar günleri tabloda yer alır ancak Öğle Yemeği hücresi boştur.
 * Yemek isimleri büyük harfle (UPPERCASE) ve virgülle ayrılmış olarak formatlanır.
 */
export function getFullMonthRows(
  monthNameInput: string,
  entries: ExportMenuEntry[],
  inputYear?: number,
  inputMonth?: number
): { title: string; year: number; month: number; rows: FormattedMenuRow[] } {
  let year = inputYear || 2026;
  let month = inputMonth;

  // Eğer yıl veya ay belirtilmemişse entry'lerden veya monthName'den çıkar
  if (!month && entries && entries.length > 0) {
    for (const entry of entries) {
      if (entry.date) {
        const d = new Date(entry.date);
        if (!isNaN(d.getTime())) {
          year = d.getUTCFullYear();
          month = d.getUTCMonth() + 1;
          break;
        }
      }
    }
  }

  // monthNameInput içerisinden ay adını bul
  const lowerInput = (monthNameInput || '').toLocaleLowerCase('tr-TR');
  if (!month) {
    const foundIdx = TURKISH_MONTHS.findIndex((m) =>
      lowerInput.includes(m.toLocaleLowerCase('tr-TR'))
    );
    if (foundIdx !== -1) {
      month = foundIdx + 1;
    } else {
      month = new Date().getMonth() + 1;
    }
  }

  // Yıl bilgisi monthName içinde geçiyorsa yakala
  const yearMatch = monthNameInput?.match(/\b(20\d\d)\b/);
  if (yearMatch) {
    year = parseInt(yearMatch[1], 10);
  }

  const monthLabel = TURKISH_MONTHS[month - 1] || 'Eylül';
  // Başlık görseldeki gibi: "AĞUSTOS AYI YEMEK LİSTESİ"
  const title = `${monthLabel.toLocaleUpperCase('tr-TR')} AYI YEMEK LİSTESİ`;

  // Gün numarasına göre (1..31) mevcut yemekleri eşleştir
  const entryByDay = new Map<number, ExportMenuEntry>();
  entries.forEach((e) => {
    let dayNum: number | null = null;
    if (e.date) {
      const d = new Date(e.date);
      if (!isNaN(d.getTime())) {
        dayNum = d.getUTCDate();
      }
    }
    if (!dayNum && e.dateStr) {
      const parsed = parseInt(e.dateStr.trim().split(' ')[0], 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 31) {
        dayNum = parsed;
      }
    }
    if (dayNum) {
      entryByDay.set(dayNum, e);
    }
  });

  // Ayın kaç gün çektiğini bul
  const totalDays = new Date(year, month, 0).getDate();
  const rows: FormattedMenuRow[] = [];

  for (let d = 1; d <= totalDays; d++) {
    // UTC üzerinden gün hesabı
    const dateObj = new Date(Date.UTC(year, month - 1, d, 12, 0, 0));
    const dayOfWeek = dateObj.getUTCDay(); // 0: Pazar, 1: Pazartesi, ...
    const dayName = TURKISH_DAYS[dayOfWeek];
    const isSunday = dayOfWeek === 0;

    // Tarih sütunu görseldeki gibi: "1 Ağustos 2026 Cumartesi"
    const dateStr = `${d} ${monthLabel} ${year} ${dayName}`;

    let mealTextUpper = '';
    if (!isSunday) {
      const entry = entryByDay.get(d);
      if (entry) {
        const dishes = parseDishList(entry.items, entry.mealText);
        if (dishes.length > 0) {
          mealTextUpper = dishes
            .map((dish) => dish.trim().toLocaleUpperCase('tr-TR'))
            .filter(Boolean)
            .join(', ');
        } else if (entry.mealText) {
          mealTextUpper = entry.mealText.trim().toLocaleUpperCase('tr-TR');
        }
      }
    }

    rows.push({
      dayNumber: d,
      dateStr,
      dayName,
      isSunday,
      mealTextUpper,
    });
  }

  return { title, year, month, rows };
}

/**
 * Kullanıcı görselindeki formatta 2 sütunlu Excel tablosu (.xlsx) üretir.
 * - Başlık: "AĞUSTOS AYI YEMEK LİSTESİ" (A1:B1 birleşik, ortalı, kalın)
 * - Sütun 1: "TARİH"
 * - Sütun 2: "ÖĞLE YEMEĞİ"
 */
export function exportMonthlyMenuToExcel(
  monthName: string,
  entries: ExportMenuEntry[],
  year?: number,
  month?: number
) {
  const { title, rows } = getFullMonthRows(monthName, entries, year, month);

  const aoa: (string | number)[][] = [
    [title, ''], // A1-B1 birleşecek
    ['TARİH', 'ÖĞLE YEMEĞİ'],
  ];

  rows.forEach((r) => {
    aoa.push([r.dateStr, r.mealTextUpper]);
  });

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Başlığı A1:B1 birleştir
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
  ];

  // Sütun genişlikleri (Tarih ve Yemek Listesi tam sığacak şekilde)
  ws['!cols'] = [
    { wch: 32 }, // TARİH
    { wch: 85 }, // ÖĞLE YEMEĞİ
  ];

  // Satır yükseklikleri
  ws['!rows'] = [
    { hpt: 30 }, // Başlık satırı
    { hpt: 24 }, // Tablo başlıkları (TARİH, ÖĞLE YEMEĞİ)
  ];

  const wb = XLSX.utils.book_new();
  const safeSheetName = (title || 'Yemek_Listesi').replace(/[\/\\?*[\]]/g, '').substring(0, 31);
  XLSX.utils.book_append_sheet(wb, ws, safeSheetName);

  const safeFilename = `${title.replace(/\s+/g, '_')}.xlsx`;
  XLSX.writeFile(wb, safeFilename);
}
