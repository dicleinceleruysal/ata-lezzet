/**
 * Verilen tarihin gelecekte olup olmadığını kontrol eder.
 * Kullanıcıların sadece bugüne ve geçmişe oy verebilmesi için kullanılır.
 */
export function isDateInFuture(
  date?: string | Date | null,
  dateStr?: string | null
): boolean {
  const now = new Date();
  // Bugünün yerel gece sonu: 23:59:59.999
  const todayEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );

  // 1. Önce dateStr string'ini ayrıştır ("29 Eylül 2026 Salı" veya "29 Eylül 2026")
  if (dateStr && typeof dateStr === 'string') {
    const parts = dateStr.trim().split(/\s+/);
    if (parts.length >= 3) {
      const day = parseInt(parts[0], 10);
      const rawMonth = parts[1]
        .toLowerCase()
        .replace(/i̇/g, 'i')
        .replace(/ı/g, 'i')
        .replace(/ş/g, 's');
      const year = parseInt(parts[2], 10);

      const monthMap: Record<string, number> = {
        ocak: 0,
        subat: 1,
        mart: 2,
        nisan: 3,
        mayis: 4,
        haziran: 5,
        temmuz: 6,
        agustos: 7,
        eylul: 8,
        ekim: 9,
        kasim: 10,
        aralik: 11,
      };

      const month = monthMap[rawMonth];
      if (!isNaN(day) && month !== undefined && !isNaN(year)) {
        const entryDate = new Date(year, month, day, 12, 0, 0);
        return entryDate.getTime() > todayEnd.getTime();
      }
    }
  }

  // 2. ISO Date objesini dene
  if (date) {
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      const dLocal = new Date(
        d.getUTCFullYear(),
        d.getUTCMonth(),
        d.getUTCDate(),
        12,
        0,
        0
      );
      if (dLocal.getTime() > todayEnd.getTime()) {
        return true;
      }
    }
  }

  return false;
}
