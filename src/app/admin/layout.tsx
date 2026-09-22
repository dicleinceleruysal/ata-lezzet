import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col text-stone-900">
      {/* Admin Üst Bar */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="flex items-center gap-2.5 font-bold text-stone-900 text-lg group">
                <img
                  src="/ata-lezzet-logo.jpg"
                  alt="Ata Lezzet"
                  className="w-9 h-9 rounded-xl object-cover border border-amber-200 shadow-xs group-hover:scale-105 transition-transform"
                />
                <span>Ata Lezzet <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 ml-1">Admin</span></span>
              </Link>

              <div className="hidden sm:flex sm:space-x-4 text-sm font-medium">
                <Link
                  href="/admin/listeler"
                  className="px-3 py-2 rounded-lg text-stone-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                >
                  📅 Menü Yönetimi
                </Link>
                <Link
                  href="/admin/yemekler"
                  className="px-3 py-2 rounded-lg text-stone-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                >
                  🍲 Yemekler
                </Link>
                <Link
                  href="/admin/notlar"
                  className="px-3 py-2 rounded-lg text-stone-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                >
                  📝 Notlar
                </Link>
                <Link
                  href="/admin/puanlama"
                  className="px-3 py-2 rounded-lg text-stone-700 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                >
                  ⭐ Puanlama
                </Link>
              </div>
            </div>

            <div className="flex items-center">
              <Link
                href="/"
                className="text-xs sm:text-sm font-medium text-stone-500 hover:text-stone-900 px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-50 transition-colors"
              >
                🌐 Kullanıcı Ekranı
              </Link>
            </div>
          </div>
        </div>

        {/* Mobil Alt Menü */}
        <div className="sm:hidden border-t border-stone-100 px-4 py-2 flex justify-around text-xs font-medium bg-stone-50">
          <Link href="/admin/listeler" className="text-stone-700 hover:text-amber-700 py-1">
            📅 Menüler
          </Link>
          <Link href="/admin/yemekler" className="text-stone-700 hover:text-amber-700 py-1">
            🍲 Yemekler
          </Link>
          <Link href="/admin/notlar" className="text-stone-700 hover:text-amber-700 py-1">
            📝 Notlar
          </Link>
          <Link href="/admin/puanlama" className="text-stone-700 hover:text-amber-700 py-1">
            ⭐ Puanlama
          </Link>
        </div>
      </nav>

      {/* Admin Sayfa İçeriği */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Alt Bilgi */}
      <Footer />
    </div>
  );
}
