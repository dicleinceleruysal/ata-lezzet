import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const mealCount = await prisma.meal.count();
  const noteCount = await prisma.userNote.count();
  const activeWeeklyPlan = await prisma.weeklyPlan.findFirst({
    orderBy: { createdAt: 'desc' },
    include: {
      dailyPlans: {
        include: { meals: true },
      },
    },
  });

  const monthlyPlanCount = await prisma.monthlyPlan.count();
  const latestMonth = await prisma.monthlyPlan.findFirst({
    orderBy: [{ year: 'desc' }, { month: 'desc' }],
    include: { entries: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
          Yönetici Paneli
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Aylık ve günlük menüleri belirleyin, yemek arşivini yönetin ve kullanıcı geri bildirimlerini inceleyin.
        </p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Link
          href="/admin/listeler"
          className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Aylık Menü Planı
            </span>
            <span className="text-2xl">📅</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-extrabold text-stone-900">
              {latestMonth ? `${latestMonth.monthName}` : 'Plan Yok'}
            </span>
            <div className="text-xs text-stone-500 font-medium mt-1">
              {latestMonth ? `${latestMonth.entries.length} Gün (Pazar Hariç)` : 'Menü ekleyin'}
            </div>
          </div>
          <p className="text-xs text-amber-600 font-semibold mt-3 group-hover:underline">
            Aylık Listeyi Düzenle &rarr;
          </p>
        </Link>

        <Link
          href="/admin/yemekler"
          className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">
              Kayıtlı Yemekler
            </span>
            <span className="text-2xl">🍲</span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-stone-900">{mealCount}</span>
            <span className="text-xs text-stone-500 ml-1.5 font-medium">Adet Yemek</span>
          </div>
          <p className="text-xs text-orange-600 font-semibold mt-3 group-hover:underline">
            Yemek Listesine Git &rarr;
          </p>
        </Link>

        <Link
          href="/admin/notlar"
          className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Kullanıcı Notları
            </span>
            <span className="text-2xl">📝</span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-stone-900">{noteCount}</span>
            <span className="text-xs text-stone-500 ml-1.5 font-medium">Gelen Not</span>
          </div>
          <p className="text-xs text-stone-600 font-semibold mt-3 group-hover:underline">
            Notları Oku &rarr;
          </p>
        </Link>
      </div>

      {/* Hızlı Başlangıç Rehberi */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-900 space-y-2">
        <h3 className="font-bold text-base flex items-center gap-2">
          <span>💡</span> Aylık Liste Yönetimi Nasıl Çalışır?
        </h3>
        <p className="text-sm text-amber-800 leading-relaxed">
          Kullanıcılar ana ekranda <strong>Günün Menüsü</strong> ve <strong>Aylık Liste</strong> seçeneklerini görür. Listenizde <strong>Pazar günleri kesinlikle yer almaz</strong>.{' '}
          <Link href="/admin/listeler" className="underline font-bold">
            Menü Yönetimi
          </Link>{' '}
          sayfasından elinizdeki Excel veya Word tablosunu tek seferde topluca yapıştırabilir veya günleri tek tek doğrudan düzenleyebilirsiniz.
        </p>
      </div>
    </div>
  );
}
