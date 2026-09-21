'use client';

import React, { useState, useEffect } from 'react';
import { getMealCalories } from '@/lib/mealCalories';

interface MealItem {
  id: string;
  name: string;
  category: string;
  calories?: number | null;
  createdAt: string;
}

const ITEMS_PER_PAGE = 25;

const CATEGORY_NAMES: Record<string, string> = {
  corba: 'Çorba',
  ana_yemek: 'Ana Yemek',
  yan_yemek: 'Yan Yemek (Pilav, Makarna, Börek)',
  salata: 'Salata / Meze',
  tatli: 'Tatlı / Meyve',
  icecek: 'İçecek',
};

const CATEGORY_COLORS: Record<string, string> = {
  corba: 'bg-amber-100 text-amber-900 border-amber-300',
  ana_yemek: 'bg-rose-100 text-rose-950 border-rose-300',
  yan_yemek: 'bg-orange-100 text-orange-950 border-orange-300',
  salata: 'bg-emerald-100 text-emerald-950 border-emerald-300',
  tatli: 'bg-purple-100 text-purple-950 border-purple-300',
  icecek: 'bg-sky-100 text-sky-950 border-sky-300',
};

export default function AdminYemeklerPage() {
  const [meals, setMeals] = useState<MealItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Yeni Yemek Ekleme State
  const [formData, setFormData] = useState({
    name: '',
    category: 'corba',
    calories: '',
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Satır Düzenleme State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editCalories, setEditCalories] = useState<string>('');

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/meals');
      if (res.ok) {
        const data = await res.json();
        setMeals(data);
      }
    } catch {
      setFeedback({ type: 'error', text: 'Yemekler yüklenemedi.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleNameChange = (val: string) => {
    const lower = val.toLowerCase();
    let cat = formData.category;
    if (
      lower.includes('pilav') ||
      lower.includes('makarna') ||
      lower.includes('börek') ||
      lower.includes('borek')
    ) {
      cat = 'yan_yemek';
    } else if (lower.includes('çorba') || lower.includes('corba')) {
      cat = 'corba';
    } else if (lower.includes('salata') || lower.includes('cacık') || lower.includes('turşu') || lower.includes('meze')) {
      cat = 'salata';
    } else if (lower.includes('tatlı') || lower.includes('tatli') || lower.includes('sütlaç') || lower.includes('baklava') || lower.includes('puding')) {
      cat = 'tatli';
    }
    const autoCal = getMealCalories(val, cat);
    setFormData((prev) => ({
      ...prev,
      name: val,
      category: cat,
      calories: prev.calories ? prev.calories : (autoCal > 0 ? String(autoCal) : ''),
    }));
  };

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSaving(true);
    setFeedback(null);

    try {
      const cal = formData.calories ? parseInt(formData.calories, 10) : getMealCalories(formData.name, formData.category);
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          calories: cal,
        }),
      });

      if (!res.ok) throw new Error('Yemek eklenemedi.');

      setFeedback({ type: 'success', text: `"${formData.name}" (${cal} kcal) başarıyla veritabanına eklendi!` });
      setFormData({ name: '', category: 'corba', calories: '' });
      setFormOpen(false);
      fetchMeals();
    } catch (err: unknown) {
      setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Hata oluştu.' });
    } finally {
      setSaving(false);
    }
  };

  // Düzenleme Başlat
  const handleStartEdit = (meal: MealItem) => {
    setEditingId(meal.id);
    setEditName(meal.name);
    setEditCategory(meal.category);
    setEditCalories(meal.calories !== null && meal.calories !== undefined ? String(meal.calories) : String(getMealCalories(meal.name, meal.category)));
  };

  // Düzenlemeyi İptal Et
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditCategory('');
    setEditCalories('');
  };

  // Düzenleme sırasında isim değiştiğinde otomatik kategori tespiti
  const handleEditNameChange = (val: string) => {
    setEditName(val);
    const lower = val.toLowerCase();
    if (
      lower.includes('pilav') ||
      lower.includes('makarna') ||
      lower.includes('börek') ||
      lower.includes('borek')
    ) {
      setEditCategory('yan_yemek');
    }
  };

  // Düzenlemeyi Kaydet
  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) {
      setFeedback({ type: 'error', text: 'Yemek adı boş bırakılamaz.' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const cal = editCalories ? parseInt(editCalories, 10) : getMealCalories(editName, editCategory);
      const res = await fetch('/api/meals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name: editName.trim(),
          category: editCategory,
          calories: cal,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Yemek güncellenemedi.');
      }

      setFeedback({ type: 'success', text: `"${editName}" (${cal} kcal) başarıyla güncellendi!` });
      setEditingId(null);
      fetchMeals();
    } catch (err: unknown) {
      setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Güncelleme hatası.' });
    } finally {
      setSaving(false);
    }
  };

  // Yemek Sil
  const handleDeleteMeal = async (id: string, name: string) => {
    if (!confirm(`"${name}" yemeğini veritabanından silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/meals?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Yemek silinemedi.');

      setFeedback({ type: 'success', text: `"${name}" başarıyla silindi.` });
      fetchMeals();
    } catch (err: unknown) {
      setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Silme hatası.' });
    }
  };

  const filteredMeals = meals.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      (CATEGORY_NAMES[m.category] || m.category).toLowerCase().includes(q)
    );
  });

  // Sayfalama (Pagination) Hesaplamaları - Her sayfada 25 yemek
  const totalItems = filteredMeals.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentMeals = filteredMeals.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Başlık Alanı */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span>🍲</span>
            <span>Yemek Yönetimi</span>
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Veritabanındaki yemekleri doğrudan düzenleyin, yeni yemek ekleyin veya silin.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setFormOpen(!formOpen)}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-black rounded-xl transition-all cursor-pointer shadow-xs"
        >
          {formOpen ? '✕ Formu Kapat' : '+ Yeni Yemek Ekle'}
        </button>
      </div>

      {/* Bildirim Alanı */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm font-semibold border flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-200'
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Yeni Yemek Ekleme Formu (Açıklama ve Kalori kaldırıldı) */}
      {formOpen && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="text-lg font-black text-stone-900">Yeni Yemek Ekle</h3>
          <form onSubmit={handleAddMeal} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1">
                  Yemek Adı *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Örn: Kıymalı Börek, Pirinç Pilavı, Makarna..."
                  className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-stone-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1">
                  Kategori *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white font-bold text-stone-800"
                >
                  <option value="corba">Çorba</option>
                  <option value="ana_yemek">Ana Yemek</option>
                  <option value="yan_yemek">Yan Yemek (Pilav, Makarna, Börek)</option>
                  <option value="salata">Salata / Meze</option>
                  <option value="tatli">Tatlı / Meyve</option>
                  <option value="icecek">İçecek</option>
                </select>
                {(formData.name.toLowerCase().includes('pilav') ||
                  formData.name.toLowerCase().includes('makarna') ||
                  formData.name.toLowerCase().includes('börek') ||
                  formData.name.toLowerCase().includes('borek')) && (
                  <p className="text-[11px] text-amber-700 font-semibold mt-1">
                    ✨ Pilav, makarna veya börek tespit edildi &rarr; Otomatik &quot;Yan Yemek&quot; grubuna atandı.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1">
                  Porsiyon Kalorisi (kcal)
                </label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  placeholder="Otomatik hesaplanır veya giriniz..."
                  className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-stone-50/50 font-bold"
                />
                <p className="text-[11px] text-stone-400 font-semibold mt-1">
                  🔥 Boş bırakılırsa standart kurumsal tabldot kalori referansından otomatik hesaplanır.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {saving ? 'Ekleniyor...' : '💾 Veritabanına Kaydet'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Yemek Tablosu ve Arama */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs space-y-4 p-6">
        {/* Arama Kutusu ve Sayaç */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Yemek adı veya kategori ara... (örn: Pilav, Çorba)"
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-amber-500 bg-stone-50"
            />
            <span className="absolute left-3.5 top-2.5 text-stone-400 text-xs">🔍</span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 text-xs"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 self-center text-xs font-bold text-stone-500">
            <span>Toplam {totalItems} Yemek</span>
            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
              Sayfa {validCurrentPage} / {totalPages}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-stone-500 space-y-2">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold">Yemekler yükleniyor...</p>
          </div>
        ) : totalItems === 0 ? (
          <div className="p-12 text-center text-stone-500 bg-stone-50 rounded-xl border border-dashed border-stone-200">
            <p className="text-sm font-bold">Aradığınız kriterde yemek bulunamadı.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-stone-700 border-collapse">
                  <thead className="sticky top-0 z-10 bg-stone-100 text-[11px] uppercase text-stone-700 font-black tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="px-5 py-3.5 w-14 text-center">#</th>
                      <th className="px-5 py-3.5">YEMEK ADI</th>
                      <th className="px-5 py-3.5 w-60">KATEGORİ</th>
                      <th className="px-5 py-3.5 w-32 text-center">KALORİ</th>
                      <th className="px-5 py-3.5 w-40 text-center">İŞLEMLER</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white font-medium">
                    {currentMeals.map((m, index) => {
                      const isEditing = editingId === m.id;
                      const rowNumber = startIndex + index + 1;
                      const badgeClass = CATEGORY_COLORS[m.category] || 'bg-stone-100 text-stone-800 border-stone-300';
                      const currentCal = m.calories !== null && m.calories !== undefined ? m.calories : getMealCalories(m.name, m.category);

                      return (
                        <tr key={m.id} className="hover:bg-amber-50/40 transition-colors">
                          <td className="px-5 py-3.5 text-center text-stone-400 font-bold">
                            {rowNumber}
                          </td>

                          {/* Yemek Adı */}
                          <td className="px-5 py-3.5 align-middle">
                            {isEditing ? (
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => handleEditNameChange(e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-amber-400 text-xs sm:text-sm font-bold text-stone-900 focus:outline-none bg-amber-50/50"
                              />
                            ) : (
                              <span className="font-bold text-stone-900 text-sm">
                                {m.name}
                              </span>
                            )}
                          </td>

                          {/* Kategori */}
                          <td className="px-5 py-3.5 align-middle">
                            {isEditing ? (
                              <select
                                value={editCategory}
                                onChange={(e) => setEditCategory(e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg border border-amber-400 text-xs font-bold text-stone-900 focus:outline-none bg-white"
                              >
                                <option value="corba">Çorba</option>
                                <option value="ana_yemek">Ana Yemek</option>
                                <option value="yan_yemek">Yan Yemek (Pilav, Makarna, Börek)</option>
                                <option value="salata">Salata / Meze</option>
                                <option value="tatli">Tatlı / Meyve</option>
                                <option value="icecek">İçecek</option>
                              </select>
                            ) : (
                              <span
                                className={`inline-block text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md border shadow-2xs ${badgeClass}`}
                              >
                                {CATEGORY_NAMES[m.category] || m.category}
                              </span>
                            )}
                          </td>

                          {/* Kalori */}
                          <td className="px-5 py-3.5 align-middle text-center">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editCalories}
                                onChange={(e) => setEditCalories(e.target.value)}
                                className="w-24 px-2 py-1 rounded-lg border border-amber-400 text-xs font-bold text-stone-900 text-center focus:outline-none bg-amber-50/50"
                              />
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-black text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                                <span>🔥</span>
                                <span>{currentCal} kcal</span>
                              </span>
                            )}
                          </td>

                          {/* İşlemler (Düzenle, Kaydet, Sil) */}
                          <td className="px-5 py-3.5 text-center align-middle">
                            {isEditing ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleSaveEdit(m.id)}
                                  disabled={saving}
                                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                                  title="Kaydet"
                                >
                                  💾 Kaydet
                                </button>
                                <button
                                  type="button"
                                  onClick={handleCancelEdit}
                                  className="px-2.5 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                                  title="İptal"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(m)}
                                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-stone-700 text-xs font-bold transition-colors cursor-pointer border border-stone-200"
                                  title="Yemeği Düzenle"
                                >
                                  ✏️ Düzenle
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMeal(m.id, m.name)}
                                  className="px-2 py-1 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                                  title="Yemeği Sil"
                                >
                                  🗑️
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sayfalama Kontrolleri (Pagination: 1 2 3... 25 Adet Sıralama) */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-100">
                <div className="text-xs font-semibold text-stone-500 text-center sm:text-left">
                  Toplam <span className="font-bold text-stone-800">{totalItems}</span> yemekten{' '}
                  <span className="font-bold text-amber-700">
                    {startIndex + 1} - {endIndex}
                  </span>{' '}
                  arası gösteriliyor (Her sayfada {ITEMS_PER_PAGE} adet)
                </div>

                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  {/* Önceki Sayfa */}
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={validCurrentPage === 1}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    &larr; Önceki
                  </button>

                  {/* Sayfa Numaraları 1, 2, 3... */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isActive = pageNum === validCurrentPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`min-w-[34px] h-[34px] px-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          isActive
                            ? 'bg-amber-500 text-white shadow-xs border border-amber-600 scale-105'
                            : 'bg-white text-stone-700 hover:bg-amber-50 border border-stone-200 hover:border-amber-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Sonraki Sayfa */}
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={validCurrentPage === totalPages}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Sonraki &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
