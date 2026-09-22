'use client';

import React, { useEffect } from 'react';
import {
  ExportMenuEntry,
  getFullMonthRows,
  exportMonthlyMenuToExcel,
  printMenuDocument,
} from '@/lib/exportUtils';

interface PrintMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthName: string;
  entries: ExportMenuEntry[];
  year?: number;
  month?: number;
}

export default function PrintMenuModal({
  isOpen,
  onClose,
  monthName,
  entries,
  year,
  month,
}: PrintMenuModalProps) {
  // ESC ile kapatma
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Görseldeki şablonu üret
  const { title, rows } = getFullMonthRows(monthName, entries, year, month);

  const handlePrint = () => {
    printMenuDocument(monthName, entries, year, month);
  };

  const handleExcel = () => {
    exportMonthlyMenuToExcel(monthName, entries, year, month);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-transparent print:static print:overflow-visible">
      {/* Modal Kutusu */}
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden border border-stone-200 print:max-w-none print:max-h-none print:shadow-none print:border-none print:rounded-none print:overflow-visible">
        
        {/* Üst Eylem Çubuğu (Yazdırmada Gizlenir) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-3.5 bg-stone-900 text-white print:hidden">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🖨️</span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                Yazdırma ve Dışa Aktarma
              </h3>
              <p className="text-[11px] text-stone-400 truncate max-w-xs sm:max-w-none">
                {title} (A4 Dikey Standart Tablo)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-between sm:justify-end w-full sm:w-auto">
            <button
              type="button"
              onClick={handleExcel}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Excel (.xlsx) olarak indir"
            >
              <span>📊</span>
              <span>Excel</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
              title="Yazdır veya PDF olarak kaydet"
            >
              <span>🖨️</span>
              <span>Yazdır / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer ml-1"
              title="Kapat (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Önizleme & Yazdırılabilir Belge Alanı */}
        <div className="p-2 sm:p-8 overflow-y-auto overflow-x-auto flex-1 bg-stone-200/70">
          <div
            id="printable-menu-document"
            className="bg-white p-6 sm:p-10 shadow-xl border-2 border-black max-w-4xl mx-auto text-black"
          >
            {/* Tablo Başlığı (Görseldeki gibi: "AĞUSTOS AYI YEMEK LİSTESİ") */}
            <h1 className="text-lg sm:text-2xl font-black text-center text-black tracking-wide uppercase mb-4 sm:mb-6">
              {title}
            </h1>

            {/* 2 Sütunlu Çerçeveli Standart Menü Tablosu */}
            <table className="w-full border-collapse border-2 border-black text-black text-left table-fixed">
              <thead>
                <tr className="bg-white">
                  <th className="border-2 border-black py-2 px-3 text-center font-black text-xs sm:text-sm tracking-wider uppercase w-[30%]">
                    TARİH
                  </th>
                  <th className="border-2 border-black py-2 px-3 text-center font-black text-xs sm:text-sm tracking-wider uppercase w-[70%]">
                    ÖĞLE YEMEĞİ
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.dayNumber}
                    className="border-b border-black hover:bg-amber-50/30"
                  >
                    {/* Tarih Sütunu */}
                    <td className="border border-black py-1.5 px-3 font-bold text-[11px] sm:text-xs text-black whitespace-nowrap align-middle">
                      {row.dateStr}
                    </td>

                    {/* Öğle Yemeği Sütunu (Pazar günleri boş, hafta içi büyük harf ve virgülle ayrılmış) */}
                    <td className="border border-black py-1.5 px-3 font-bold text-[11px] sm:text-xs text-black uppercase leading-tight align-middle">
                      {row.mealTextUpper || '\u00A0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alt Kapatma Çubuğu (Yazdırmada Gizlenir) */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 flex justify-end gap-2 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 font-bold text-xs cursor-pointer transition-colors"
          >
            Kapat
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
          >
            <span>🖨️</span>
            <span>Yazdır / PDF Al</span>
          </button>
        </div>
      </div>
    </div>
  );
}
