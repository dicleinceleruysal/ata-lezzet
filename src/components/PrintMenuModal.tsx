'use client';

import React, { useEffect } from 'react';
import { ExportMenuEntry, parseDishList, exportMonthlyMenuToExcel } from '@/lib/exportUtils';

interface PrintMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthName: string;
  entries: ExportMenuEntry[];
  getCaloriesFn: (dish: string) => number;
}

export default function PrintMenuModal({
  isOpen,
  onClose,
  monthName,
  entries,
  getCaloriesFn,
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

  const handlePrint = () => {
    window.print();
  };

  const handleExcel = () => {
    exportMonthlyMenuToExcel(monthName, entries, getCaloriesFn);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-transparent print:static">
      {/* Modal Kutusu */}
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-stone-200 print:max-w-none print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Üst Eylem Çubuğu (Yazdırmada Gizlenir) */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-stone-900 text-white print:hidden">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🖨️</span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">
                Yazdırma ve Dışa Aktarma Önizlemesi
              </h3>
              <p className="text-[11px] text-stone-400">
                {monthName} Aylık Tabldot Yemek Menüsü
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

        {/* Yazdırılabilir Belge Alanı (A4 Formatı) */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-stone-50 print:bg-white print:p-0 print:overflow-visible">
          <div
            id="printable-menu-document"
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-stone-200 max-w-4xl mx-auto text-stone-900 print:shadow-none print:border-none print:p-0 print:max-w-none"
          >
            {/* Yazdırma Belge Başlığı */}
            <div className="flex items-center justify-between border-b-2 border-stone-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/ata-lezzet-logo.jpg"
                  alt="Ata Lezzet"
                  className="w-12 h-12 rounded-xl object-cover border border-amber-300"
                />
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-stone-950 tracking-tight uppercase">
                    Ata Lezzet Tabldot Yemek Menüsü
                  </h1>
                  <p className="text-xs text-stone-600 font-semibold">
                    Sağlıklı, Hijyenik ve Dengeli Toplu Beslenme Hizmetleri
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 rounded-lg bg-stone-900 text-white font-black text-xs uppercase tracking-wider">
                  {monthName}
                </span>
                <p className="text-[10px] text-stone-500 font-medium mt-1">
                  Pazar günleri hariçtir
                </p>
              </div>
            </div>

            {/* Menü Tablosu */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-900 text-white text-[11px] uppercase tracking-wider font-extrabold print:bg-stone-900 print:text-white">
                    <th className="py-2.5 px-3 border border-stone-800 w-24">Tarih</th>
                    <th className="py-2.5 px-3 border border-stone-800 w-20">Gün</th>
                    <th className="py-2.5 px-3 border border-stone-800">Menü İçeriği (Yemekler)</th>
                    <th className="py-2.5 px-3 border border-stone-800 text-right w-24">Kalori</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {entries.map((entry, idx) => {
                    const dishes = parseDishList(entry.items, entry.mealText);
                    const totalCal = dishes.reduce((sum, d) => sum + getCaloriesFn(d), 0);
                    const isEven = idx % 2 === 0;

                    return (
                      <tr
                        key={entry.id || idx}
                        className={`${isEven ? 'bg-white' : 'bg-stone-50/80'} hover:bg-amber-50/40 print:hover:bg-transparent page-break-inside-avoid`}
                      >
                        <td className="py-2 px-3 font-bold text-stone-900 border border-stone-200 whitespace-nowrap">
                          {entry.dateStr}
                        </td>
                        <td className="py-2 px-3 font-semibold text-stone-700 border border-stone-200 whitespace-nowrap">
                          {entry.dayName}
                        </td>
                        <td className="py-2 px-3 font-medium text-stone-900 border border-stone-200 leading-snug">
                          {dishes.length > 0 ? (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {dishes.map((dish, dIdx) => (
                                <span key={dIdx} className="inline-flex items-center">
                                  <span className="font-semibold text-stone-900">{dish}</span>
                                  {dIdx < dishes.length - 1 && (
                                    <span className="text-amber-500 font-bold mx-1">·</span>
                                  )}
                                </span>
                              ))}
                            </div>
                          ) : (
                            entry.mealText || '-'
                          )}
                        </td>
                        <td className="py-2 px-3 font-bold text-stone-900 border border-stone-200 text-right whitespace-nowrap">
                          {totalCal > 0 ? `${totalCal} kcal` : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Alt Bilgi & İmza Alanı */}
            <div className="mt-6 pt-4 border-t-2 border-stone-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500 font-medium">
              <div>
                <p>📌 Menü içeriği tedarik koşulları ve mevsimsel durumlara göre değişiklik gösterebilir.</p>
                <p>Afiyet olsun! Ata Lezzet Yemekhane Hizmetleri</p>
              </div>

              <div className="text-right print:block hidden">
                <p className="font-bold text-stone-700">Diyetisyen / Gıda Mühendisi Onayı</p>
                <p className="mt-6 border-t border-stone-400 pt-1 text-[10px]">İmza / Kaşe</p>
              </div>
            </div>
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
