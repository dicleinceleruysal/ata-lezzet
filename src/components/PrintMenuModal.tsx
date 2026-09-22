'use client';

import React, { useEffect } from 'react';
import {
  ExportMenuEntry,
  getFullMonthRows,
  exportMonthlyMenuToExcel,
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
    window.print();
  };

  const handleExcel = () => {
    exportMonthlyMenuToExcel(monthName, entries, year, month);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-transparent print:static print:overflow-visible">
      {/* Modal Kutusu */}
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden border border-stone-200 print:max-w-none print:max-h-none print:shadow-none print:border-none print:rounded-none print:overflow-visible">
        
        {/* Üst Eylem Çubuğu (Yazdırmada Gizlenir) */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-stone-900 text-white print:hidden">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🖨️</span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">
                Yazdırma ve Dışa Aktarma Önizlemesi
              </h3>
              <p className="text-[11px] text-stone-400">
                {title} (Standart Tablo Formatı)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExcel}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Excel (.xlsx) olarak indir"
            >
              <span>📊</span>
              <span className="hidden sm:inline">Excel İndir (.xlsx)</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
              title="Yazdır veya PDF olarak kaydet"
            >
              <span>🖨️</span>
              <span>Yazdır / PDF Kaydet</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer ml-1"
              title="Kapat (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Önizleme & Yazdırılabilir Belge Alanı */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-stone-100 print:bg-white print:p-0 print:overflow-visible">
          <div
            id="printable-menu-document"
            className="bg-white p-6 sm:p-8 rounded-xl shadow-xs border border-stone-200 max-w-3xl mx-auto text-black print:shadow-none print:border-none print:p-0 print:max-w-none print:m-0"
          >
            {/* Tablo Başlığı (Görseldeki gibi: "AĞUSTOS AYI YEMEK LİSTESİ") */}
            <h1 className="text-base sm:text-xl font-black text-center text-black tracking-wide uppercase mb-3 sm:mb-4">
              {title}
            </h1>

            {/* 2 Sütunlu Çerçeveli Standart Menü Tablosu */}
            <table className="w-full border-collapse border-2 border-black text-black text-left">
              <thead>
                <tr className="bg-white">
                  <th className="border-2 border-black py-1.5 sm:py-2 px-2.5 sm:px-3 text-center font-black text-xs sm:text-sm tracking-wider uppercase w-[32%]">
                    TARİH
                  </th>
                  <th className="border-2 border-black py-1.5 sm:py-2 px-2.5 sm:px-3 text-center font-black text-xs sm:text-sm tracking-wider uppercase w-[68%]">
                    ÖĞLE YEMEĞİ
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.dayNumber}
                    className="border-b border-black hover:bg-amber-50/20 print:hover:bg-transparent page-break-inside-avoid"
                  >
                    {/* Tarih Sütunu */}
                    <td className="border border-black py-1 px-2 font-bold text-[10.5px] sm:text-xs text-black whitespace-nowrap align-middle">
                      {row.dateStr}
                    </td>

                    {/* Öğle Yemeği Sütunu (Pazar günleri boş, hafta içi büyük harf ve virgülle ayrılmış) */}
                    <td className="border border-black py-1 px-2 font-bold text-[10.5px] sm:text-xs text-black uppercase leading-tight align-middle">
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
