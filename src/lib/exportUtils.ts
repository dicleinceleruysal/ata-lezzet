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
 * Aylık menüyü biçimlendirilmiş Excel (.xlsx) dosyası olarak indirir.
 */
export function exportMonthlyMenuToExcel(
  monthName: string,
  entries: ExportMenuEntry[],
  getCaloriesFn: (dish: string) => number
) {
  const cleanTitle = `Ata Lezzet - ${monthName || 'Aylık'} Yemek Menüsü`;

  const rows: (string | number)[][] = [
    [cleanTitle],
    ['Oluşturulma Tarihi: ' + new Date().toLocaleDateString('tr-TR')],
    [], // Boş satır
    [
      'Sıra',
      'Tarih',
      'Gün',
      '1. Kap (Çorba)',
      '2. Kap (Ana Yemek)',
      '3. Kap (Yan Yemek)',
      '4. Kap (Salata/Tatlı/İçecek)',
      'Tüm Menü İçeriği',
      'Toplam Kalori (kcal)',
    ],
  ];

  entries.forEach((entry, idx) => {
    const dishes = parseDishList(entry.items, entry.mealText);
    const totalCal = dishes.reduce((sum, d) => sum + getCaloriesFn(d), 0);

    const corba = dishes[0] || '-';
    const anaYemek = dishes[1] || '-';
    const yanYemek = dishes[2] || '-';
    const ekstra = dishes.slice(3).join(', ') || '-';
    const allDishes = dishes.join(' + ') || entry.mealText || '-';

    rows.push([
      idx + 1,
      entry.dateStr,
      entry.dayName,
      corba,
      anaYemek,
      yanYemek,
      ekstra,
      allDishes,
      totalCal > 0 ? totalCal : '-',
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Sütun genişliklerini ayarla
  ws['!cols'] = [
    { wch: 6 },  // Sıra
    { wch: 16 }, // Tarih
    { wch: 12 }, // Gün
    { wch: 22 }, // 1. Kap
    { wch: 24 }, // 2. Kap
    { wch: 22 }, // 3. Kap
    { wch: 25 }, // 4. Kap
    { wch: 45 }, // Tüm Menü
    { wch: 20 }, // Toplam Kalori
  ];

  const wb = XLSX.utils.book_new();
  const sheetName = (monthName || 'Yemek_Menusu').replace(/[\/\\?*[\]]/g, '').substring(0, 31);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  const filename = `Ata_Lezzet_${(monthName || 'Yemek_Menusu').replace(/\s+/g, '_')}.xlsx`;
  XLSX.writeFile(wb, filename);
}
