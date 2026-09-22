'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getMealCalories } from '@/lib/mealCalories';
import { getDishImageUrl } from '@/lib/dishVisuals';

interface MealItem {
  id: string;
  name: string;
  category: string;
  calories?: number | null;
  imageUrl?: string | null;
  createdAt: string;
}

const ITEMS_PER_PAGE = 20;

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

// Cihazdan yüklenen görseli otomatik olarak canvas üzerinde boyutlandırıp sıkıştıran yardımcı
function compressAndResizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 640;
        const MAX_HEIGHT = 480;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        // Optimize JPEG data URL (yaklaşık 25-45 KB)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Görsel işlenemedi.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Dosya okunamadı.'));
    reader.readAsDataURL(file);
  });
}

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
    imageUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Dosya yükleme input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Satır Düzenleme State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editCalories, setEditCalories] = useState<string>('');
  const [editImageUrl, setEditImageUrl] = useState('');

  // Görsel Büyük Önizleme Modalı
  const [previewModalImage, setPreviewModalImage] = useState<{
    url: string;
    title: string;
    category: string;
  } | null>(null);

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

  // Yeni yemek için dosya seçildiğinde
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressAndResizeImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: compressed }));
    } catch {
      setFeedback({ type: 'error', text: 'Görsel yüklenirken bir sorun oluştu.' });
    }
  };

  // Düzenleme modunda dosya seçildiğinde
  const handleEditFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressAndResizeImage(file);
      setEditImageUrl(compressed);
    } catch {
      setFeedback({ type: 'error', text: 'Görsel yüklenirken bir sorun oluştu.' });
    }
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
          name: formData.name.trim(),
          category: formData.category,
          calories: cal,
          imageUrl: formData.imageUrl.trim() || null,
        }),
      });

      if (!res.ok) throw new Error('Yemek eklenemedi.');

      setFeedback({ type: 'success', text: `"${formData.name}" (${cal} kcal) görseliyle birlikte başarıyla eklendi!` });
      setFormData({ name: '', category: 'corba', calories: '', imageUrl: '' });
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
    setEditImageUrl(meal.imageUrl || '');
  };

  // Düzenlemeyi İptal Et
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditCategory('');
    setEditCalories('');
    setEditImageUrl('');
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
          imageUrl: editImageUrl.trim() || null,
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

  // Sayfalama (Pagination)
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
            <span>Yemek & Görsel Yönetimi</span>
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Yemeklerin fotoğraflarını yükleyin veya güncelleyin. Fotoğrafı olmayan yemekler için otomatik görsel ve açıklama desteği devrededir.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setFormOpen(!formOpen)}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-black rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
        >
          {formOpen ? (
            <>
              <span>✕</span>
              <span>Formu Kapat</span>
            </>
          ) : (
            <>
              <span>+</span>
              <span>Yeni Yemek & Görsel Ekle</span>
            </>
          )}
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
            className="text-xs opacity-70 hover:opacity-100 font-bold ml-4 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Yeni Yemek & Görsel Ekleme Formu */}
      {formOpen && (
        <div className="bg-white p-6 rounded-2xl border-2 border-amber-300 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
              <span>✨</span>
              <span>Yeni Yemek & Görsel Ekle</span>
            </h3>
            <span className="text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-bold">
              Fotoğraflı Yemek Kaydı
            </span>
          </div>

          <form onSubmit={handleAddMeal} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1">
                  Yemek Adı *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Örn: Orman Kebabı, Fırında Karnıyarık..."
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
                  🔥 Boş bırakılırsa standart tabldot kalori referansından otomatik atanır.
                </p>
              </div>
            </div>

            {/* Yemek Görseli Ekleme Bölümü */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700">
                📸 Yemek Görseli (Fotoğraf Yükle veya Bağlantı Yapıştır)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                {/* 1. Cihazdan Dosya Seç */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-4 bg-white hover:bg-amber-50 text-stone-800 border border-stone-300 hover:border-amber-400 rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <span>📁</span>
                    <span>Bilgisayardan / Telefondan Fotoğraf Seç</span>
                  </button>
                  <p className="text-[10px] text-stone-400 mt-1">
                    Otomatik olarak optimize edilir ve veritabanına güvenle işlenir.
                  </p>
                </div>

                {/* 2. Web URL Yapıştır */}
                <div>
                  <input
                    type="url"
                    value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="Veya görsel linki yapıştırın (https://...)"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                  />
                </div>
              </div>

              {/* Canlı Görsel Önizleme */}
              {formData.imageUrl && (
                <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-amber-200">
                  <img
                    src={formData.imageUrl}
                    alt="Yemek Önizleme"
                    className="w-16 h-16 object-cover rounded-xl border border-amber-300 shadow-2xs"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-800 truncate">
                      Görsel başarıyla yüklendi / tanımlandı
                    </p>
                    <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                      ✓ Menü ekranında bu yemek için bu fotoğraf gösterilecek.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    ✕ Görseli Kaldır
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5"
              >
                <span>💾</span>
                <span>{saving ? 'Kaydediliyor...' : 'Yemeği Veritabanına Kaydet'}</span>
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
              placeholder="Yemek adı veya kategori ara... (örn: Pilav, Çorba, Kebab)"
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
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 text-xs cursor-pointer"
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
                      <th className="px-3 py-3.5 w-12 text-center">#</th>
                      <th className="px-4 py-3.5 w-20 text-center">GÖRSEL</th>
                      <th className="px-5 py-3.5">YEMEK ADI</th>
                      <th className="px-5 py-3.5 w-56">KATEGORİ</th>
                      <th className="px-5 py-3.5 w-28 text-center">KALORİ</th>
                      <th className="px-5 py-3.5 w-40 text-center">İŞLEMLER</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white font-medium">
                    {currentMeals.map((m, index) => {
                      const isEditing = editingId === m.id;
                      const rowNumber = startIndex + index + 1;
                      const badgeClass = CATEGORY_COLORS[m.category] || 'bg-stone-100 text-stone-800 border-stone-300';
                      const currentCal = m.calories !== null && m.calories !== undefined ? m.calories : getMealCalories(m.name, m.category);
                      
                      // Yemek görseli bilgisi (özel veya kütüphane desteği)
                      const dishImageUrl = m.imageUrl || getDishImageUrl(m.name, m.category);
                      const hasCustomImage = Boolean(m.imageUrl);

                      return (
                        <tr key={m.id} className="hover:bg-amber-50/40 transition-colors">
                          <td className="px-3 py-3.5 text-center text-stone-400 font-bold">
                            {rowNumber}
                          </td>

                          {/* Görsel Sütunu */}
                          <td className="px-4 py-3 text-center align-middle">
                            {isEditing ? (
                              <div className="flex flex-col items-center gap-1">
                                {editImageUrl ? (
                                  <div className="relative group w-12 h-12">
                                    <img
                                      src={editImageUrl}
                                      alt="Önizleme"
                                      className="w-12 h-12 object-cover rounded-xl border border-amber-400 shadow-2xs"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setEditImageUrl('')}
                                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] flex items-center justify-center cursor-pointer"
                                      title="Görseli Kaldır"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 rounded-xl border border-dashed border-stone-300 flex items-center justify-center bg-stone-50 text-stone-400 text-[10px] text-center font-bold">
                                    Yok
                                  </div>
                                )}
                                <input
                                  ref={editFileInputRef}
                                  type="file"
                                  accept="image/*"
                                  onChange={handleEditFileUpload}
                                  className="hidden"
                                />
                                <button
                                  type="button"
                                  onClick={() => editFileInputRef.current?.click()}
                                  className="text-[10px] text-amber-700 hover:text-amber-900 font-bold underline cursor-pointer"
                                >
                                  {editImageUrl ? 'Değiştir' : '+ Yükle'}
                                </button>
                              </div>
                            ) : dishImageUrl ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewModalImage({
                                    url: dishImageUrl,
                                    title: m.name,
                                    category: CATEGORY_NAMES[m.category] || m.category,
                                  })
                                }
                                className="relative group cursor-pointer block mx-auto"
                                title="Büyütmek için tıklayın"
                              >
                                <img
                                  src={dishImageUrl}
                                  alt={m.name}
                                  className="w-12 h-12 object-cover rounded-xl border border-stone-200 shadow-2xs group-hover:scale-110 group-hover:border-amber-400 transition-all"
                                />
                              </button>
                            ) : (
                              <div className="w-12 h-12 mx-auto rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 text-lg">
                                🍽️
                              </div>
                            )}
                          </td>

                          {/* Yemek Adı */}
                          <td className="px-5 py-3.5 align-middle">
                            {isEditing ? (
                              <div className="space-y-1.5">
                                <input
                                  type="text"
                                  value={editName}
                                  onChange={(e) => handleEditNameChange(e.target.value)}
                                  className="w-full px-3 py-1.5 rounded-lg border border-amber-400 text-xs sm:text-sm font-bold text-stone-900 focus:outline-none bg-amber-50/50"
                                  placeholder="Yemek adı..."
                                />
                                <input
                                  type="text"
                                  value={editImageUrl.startsWith('data:') ? '' : editImageUrl}
                                  onChange={(e) => setEditImageUrl(e.target.value)}
                                  placeholder="Görsel URL linki (https://...)"
                                  className="w-full px-2.5 py-1 text-[11px] rounded-lg border border-stone-200 focus:outline-none bg-white"
                                />
                              </div>
                            ) : (
                              <div className="font-black text-stone-900 text-sm">
                                {m.name}
                              </div>
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
                                  title="Yemeği & Görseli Düzenle"
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

            {/* Sayfalama Kontrolleri (Pagination) */}
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
                    className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    &larr; Önceki
                  </button>

                  {/* Sayfa Numaraları */}
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
                    className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Sonraki &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Görsel & Detay Önizleme Modalı */}
      {previewModalImage && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewModalImage(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-md w-full shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full bg-stone-100">
              <img
                src={previewModalImage.url}
                alt={previewModalImage.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setPreviewModalImage(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center text-sm font-black transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                  {previewModalImage.category}
                </span>
                <span className="text-xs text-stone-400 font-medium">Yemek Görseli</span>
              </div>
              <h3 className="text-xl font-black text-stone-900">
                {previewModalImage.title}
              </h3>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setPreviewModalImage(null)}
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-black rounded-xl transition-colors cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
