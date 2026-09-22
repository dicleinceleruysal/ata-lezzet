import React from 'react';
import Footer from '@/components/Footer';
import AdminNavbar from '@/components/AdminNavbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col text-stone-900">
      {/* Admin Responsive Üst Bar */}
      <AdminNavbar />

      {/* Admin Sayfa İçeriği */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        {children}
      </main>

      {/* Alt Bilgi */}
      <Footer />
    </div>
  );
}
