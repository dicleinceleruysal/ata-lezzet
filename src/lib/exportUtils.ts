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

/**
 * Kullanıcı görselindeki formatta izole bir iframe içinde SADECE tabloyu yazdırır.
 * Web sayfasının diğer kısımları, butonlar, menüler veya arka plan KESİNLİKLE yazıcıya/PDF'e gitmez.
 */
export function printMenuDocument(
  monthName: string,
  entries: ExportMenuEntry[],
  year?: number,
  month?: number
) {
  if (typeof window === 'undefined') return;

  const { title, rows } = getFullMonthRows(monthName, entries, year, month);
  const totalDays = rows.length || 31;
  // A4 yüksekliği 297mm. Kenar boşlukları 8mm+8mm = 16mm. Kullanılabilir alan = 281mm.
  // Başlık + marjinler: ~16mm, Tablo başlığı: ~10mm.
  // Satırlara kalan tam yükseklik: ~252mm.
  const rowHeightMm = Math.max(7.2, Math.min(8.6, 252 / totalDays)).toFixed(1);

  const rowsHtml = rows
    .map(
      (r) => `
      <tr style="height: ${rowHeightMm}mm;">
        <td class="date-col">${r.dateStr}</td>
        <td class="meal-col">${r.mealTextUpper || '&nbsp;'}</td>
      </tr>
    `
    )
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 8mm 12mm 8mm 12mm;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            width: 100%;
            height: 100%;
            background: #fff !important;
            color: #000 !important;
            font-family: Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          .page-wrapper {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          .title {
            text-align: center;
            font-size: 19px;
            font-weight: 900;
            margin-bottom: 5mm;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: #000 !important;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            border: 2.5px solid #000 !important;
            table-layout: fixed;
          }
          thead tr {
            height: 9.5mm;
            background-color: #fff !important;
          }
          th {
            border: 2.5px solid #000 !important;
            padding: 0 8px;
            text-align: center;
            font-weight: 900;
            font-size: 13px;
            text-transform: uppercase;
            color: #000 !important;
            background-color: #fff !important;
            vertical-align: middle;
          }
          tr {
            page-break-inside: avoid;
          }
          td {
            border: 1.5px solid #000 !important;
            padding: 0 8px;
            font-size: 11px;
            font-weight: bold;
            line-height: 1.25;
            color: #000 !important;
            vertical-align: middle;
            overflow: hidden;
          }
          .date-col {
            width: 30%;
            white-space: nowrap;
          }
          .meal-col {
            width: 70%;
            text-transform: uppercase;
          }
        </style>
      </head>
      <body>
        <div class="page-wrapper">
          <h1 class="title">${title}</h1>
          <table>
            <thead>
              <tr>
                <th class="date-col">TARİH</th>
                <th class="meal-col">ÖĞLE YEMEĞİ</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </body>
    </html>
  `;

  // Gizli bir iframe oluşturup izole şekilde yazdır
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  iframe.style.opacity = '0';
  iframe.style.pointerEvents = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
    return;
  }

  doc.open();
  doc.write(htmlContent);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.error('Yazdırma tetiklenirken hata:', e);
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 3000);
    }
  }, 250);
}


