'use client';

import React, { useState, useEffect } from 'react';
import {
  classifyMainDish,
  classifySideDish,
  getValidSidesForMain,
  pickSideForWeek,
  SideSubType,
  getSideSubType,
} from '@/lib/mealRules';
import { getMealCalories } from '@/lib/mealCalories';
import PrintMenuModal from '@/components/PrintMenuModal';
import { exportMonthlyMenuToExcel } from '@/lib/exportUtils';

interface MealItem {
  id: string;
  name: string;
  category: string;
  calories?: number | null;
}

interface MonthlyDailyEntry {
  id?: string;
  dayNumber?: number;
  dateStr: string;
  dayName: string;
  mealText: string;
  items?: string[];
  isHoliday?: boolean;
}

interface MonthlyPlanData {
  id: string;
  year: number;
  month: number;
  monthName: string;
  entries: {
    id: string;
    date: string;
    dateStr: string;
    dayName: string;
    mealText: string;
    items: string[];
    isHoliday: boolean;
  }[];
}

const MONTHS_LIST = [
  { value: 1, label: 'Ocak' },
  { value: 2, label: 'Şubat' },
  { value: 3, label: 'Mart' },
  { value: 4, label: 'Nisan' },
  { value: 5, label: 'Mayıs' },
  { value: 6, label: 'Haziran' },
  { value: 7, label: 'Temmuz' },
  { value: 8, label: 'Ağustos' },
  { value: 9, label: 'Eylül' },
  { value: 10, label: 'Ekim' },
  { value: 11, label: 'Kasım' },
  { value: 12, label: 'Aralık' },
];

const WEEKDAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi']; // PAZAR KESİNLİKLE YOK!

const CATEGORY_NAMES: Record<string, string> = {
  corba: 'Çorba',
  ana_yemek: 'Ana Yemek',
  yan_yemek: 'Yan Yemek (Pilav, Makarna, Börek)',
  salata: 'Salata / Meze',
  tatli: 'Tatlı',
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

function normalizeFoodText(str: string): string {
  if (!str) return '';
  return str
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim();
}

function autoDetectCategory(dishName: string): string {
  const norm = normalizeFoodText(dishName);

  if (
    norm.includes('corba') ||
    norm.includes('mercimek') ||
    norm.includes('ezogelin') ||
    norm.includes('tarhana') ||
    norm.includes('yayla') ||
    norm.includes('sehriye') ||
    norm.includes('domates corbasi') ||
    norm.includes('kelle paca') ||
    norm.includes('iskembe') ||
    norm.includes('dugun corbasi')
  ) {
    return 'corba';
  }

  if (
    norm.includes('pilav') ||
    norm.includes('makarna') ||
    norm.includes('borek') ||
    norm.includes('pure') ||
    norm.includes('eriste') ||
    norm.includes('bulgur') ||
    norm.includes('manti') ||
    norm.includes('patates kizartmasi') ||
    norm.includes('spagetti') ||
    norm.includes('kuskus') ||
    norm.includes('noodle')
  ) {
    return 'yan_yemek';
  }

  if (
    norm.includes('salata') ||
    norm.includes('salatabar') ||
    norm.includes('cacik') ||
    norm.includes('tursu') ||
    norm.includes('piyaz') ||
    norm.includes('yogurt') ||
    norm.includes('meze') ||
    norm.includes('haydari') ||
    norm.includes('humus') ||
    norm.includes('ezme')
  ) {
    return 'salata';
  }

  if (
    norm.includes('ayran') ||
    norm.includes('icecek') ||
    norm.includes('limonata') ||
    norm.includes('salgam') ||
    norm.includes('kola') ||
    norm.includes('fanta') ||
    norm.includes('gazoz') ||
    norm.includes('meyve suyu') ||
    norm.includes('soda')
  ) {
    return 'icecek';
  }

  if (
    norm.includes('tatli') ||
    norm.includes('pasta') ||
    norm.includes('profiterol') ||
    norm.includes('kemalpasa') ||
    norm.includes('sutlac') ||
    norm.includes('puding') ||
    norm.includes('muhallebi') ||
    norm.includes('kazandibi') ||
    norm.includes('keskul') ||
    norm.includes('revani') ||
    norm.includes('sekerpare') ||
    norm.includes('kadayif') ||
    norm.includes('kunefe') ||
    norm.includes('baklava') ||
    norm.includes('sobiyet') ||
    norm.includes('helva') ||
    norm.includes('komposto') ||
    norm.includes('hosaf') ||
    norm.includes('trilece') ||
    norm.includes('gullac') ||
    norm.includes('tulumba') ||
    norm.includes('lokma') ||
    norm.includes('asure') ||
    norm.includes('parfe') ||
    norm.includes('magnolia') ||
    norm.includes('tiramisu') ||
    norm.includes('supangle') ||
    norm.includes('sufle') ||
    norm.includes('kek') ||
    norm.includes('browni') ||
    norm.includes('kurabiye') ||
    norm.includes('dondurma') ||
    norm.includes('ekler') ||
    norm.includes('tart') ||
    norm.includes('turta') ||
    norm.includes('irmik') ||
    norm.includes('lokum') ||
    norm.includes('pismaniye') ||
    norm.includes('cezerye') ||
    norm.includes('kabak tatlisi') ||
    norm.includes('ayva tatlisi') ||
    norm.includes('kalburabasti') ||
    norm.includes('dilber dudagi') ||
    norm.includes('bulbul yuvasi') ||
    norm.includes('vezir parmagi') ||
    norm.includes('sambali') ||
    norm.includes('cheesecake') ||
    norm.includes('tartalet') ||
    norm.includes('waffle') ||
    norm.includes('pankek') ||
    norm.includes('meyve') ||
    norm.includes('karpuz') ||
    norm.includes('kavun') ||
    norm.includes('elma') ||
    norm.includes('armut') ||
    norm.includes('portakal') ||
    norm.includes('mandalina') ||
    norm.includes('muz') ||
    norm.includes('uzum') ||
    norm.includes('cilek') ||
    norm.includes('seftali') ||
    norm.includes('erik') ||
    norm.includes('kiraz') ||
    norm.includes('kayisi') ||
    norm.includes('incir') ||
    norm.includes('hurma') ||
    norm.includes('ananas') ||
    norm.includes('kivi') ||
    norm.includes('nar')
  ) {
    return 'tatli';
  }

  return 'ana_yemek';
}

function parseItems(text: string): string[] {
  return text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

interface ApprovedMonthPlan {
  id: string;
  year: number;
  month: number;
  monthName: string;
  entriesCount: number;
}

export default function AdminListelerPage() {
  const [activeTab, setActiveTab] = useState<'monthly' | 'wizard'>('monthly');

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // Eylül

  const [approvedPlans, setApprovedPlans] = useState<ApprovedMonthPlan[]>([]);
  const [monthlyEntries, setMonthlyEntries] = useState<MonthlyDailyEntry[]>([]);
  const [availableMeals, setAvailableMeals] = useState<MealItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Yazdırma ve Excel Durumu
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const handleExportExcel = () => {
    const monthLabel = MONTHS_LIST.find((m) => m.value === selectedMonth)?.label || 'Menü';
    const monthTitle = `${monthLabel} ${selectedYear}`;
    exportMonthlyMenuToExcel(monthTitle, monthlyEntries, selectedYear, selectedMonth);
  };

  // Sihirbaz (Otomatik Oluşturucu) State
  const [wizardYear, setWizardYear] = useState<number>(2026);
  const [wizardMonth, setWizardMonth] = useState<number>(10); // Varsayılan Ekim
  const [wizardEntries, setWizardEntries] = useState<MonthlyDailyEntry[]>([]);
  const [wizardLoading, setWizardLoading] = useState<boolean>(false);
  const [wizardSaving, setWizardSaving] = useState<boolean>(false);
  const [pickerTarget, setPickerTarget] = useState<'monthly' | 'wizard'>('monthly');

  // Yemek Seçici Modal State
  const [pickerDayIndex, setPickerDayIndex] = useState<number | null>(null);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerCategoryFilter, setPickerCategoryFilter] = useState<string>('all');
  const [newMealCategory, setNewMealCategory] = useState<string>('ana_yemek');
  const [quickAddLoading, setQuickAddLoading] = useState(false);

  // Onaylanmış aylık planları çek
  const loadApprovedPlans = async () => {
    try {
      const res = await fetch('/api/plans/monthly?summary=true');
      if (res.ok) {
        const data = await res.json();
        setApprovedPlans(data);
      }
    } catch {
      // Hata durumunda sessiz kal
    }
  };

  // Aylık planı ve veritabanı yemeklerini getir
  const loadData = async (year: number, month: number) => {
    setLoading(true);
    setFeedback(null);
    try {
      const [planRes, mealsRes] = await Promise.all([
        fetch(`/api/plans/monthly?year=${year}&month=${month}`),
        fetch('/api/meals'),
      ]);

      if (mealsRes.ok) {
        const mealsData = await mealsRes.json();
        setAvailableMeals(mealsData);
      }

      if (planRes.ok) {
        const data: MonthlyPlanData = await planRes.json();
        const clean = data.entries
          .filter((e) => e.dayName?.toLowerCase().trim() !== 'pazar')
          .map((e) => ({
            id: e.id,
            dateStr: e.dateStr,
            dayName: e.dayName,
            mealText: e.mealText,
            items: parseItems(e.mealText),
            isHoliday: e.isHoliday,
          }));
        setMonthlyEntries(clean);
      } else {
        setMonthlyEntries([]);
      }
    } catch {
      setFeedback({ type: 'error', text: 'Veriler yüklenirken hata oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApprovedPlans();
  }, []);

  useEffect(() => {
    loadData(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  // Onaylı Ay Sekmesine Tıklandığında
  const handleSelectApprovedMonth = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    setActiveTab('monthly');
  };

  // Otomatik Menü Sihirbazını Çalıştır
  const handleGenerateWizard = async () => {
    setWizardLoading(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/plans/monthly/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: wizardYear, month: wizardMonth }),
      });

      if (!res.ok) throw new Error('Otomatik menü üretilemedi.');
      const data = await res.json();
      const generatedList = data.plan?.entries || [];
      setWizardEntries(generatedList);

      const mName = MONTHS_LIST.find((m) => m.value === wizardMonth)?.label || '';
      setFeedback({
        type: 'success',
        text: `✨ ${mName} ${wizardYear} için ${generatedList.length} günlük dengeli taslak menü başarıyla oluşturuldu! Aşağıdan inceleyip düzenleyebilirsiniz.`,
      });
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Menü oluşturulurken hata oluştu.',
      });
    } finally {
      setWizardLoading(false);
    }
  };

  // Sihirbazda Tek Bir Günü Yeniden Karma Yap
  const handleRegenerateWizardDay = (dayIndex: number) => {
    if (!wizardEntries[dayIndex]) return;
    const dayName = wizardEntries[dayIndex].dayName;

    const mains = availableMeals.filter((m) => m.category === 'ana_yemek').map((m) => m.name);
    const sides = availableMeals.filter((m) => m.category === 'yan_yemek').map((m) => m.name);
    const soups = availableMeals.filter((m) => m.category === 'corba').map((m) => m.name);
    const salads = availableMeals.filter((m) => m.category === 'salata').map((m) => m.name);
    const desserts = availableMeals.filter((m) => m.category === 'tatli').map((m) => m.name);
    const drinks = availableMeals.filter((m) => m.category === 'icecek').map((m) => m.name);

    const mainsByType = {
      et_tavuk: mains.filter((m) => classifyMainDish(m) === 'et_tavuk'),
      sebze_bakliyat: mains.filter((m) => classifyMainDish(m) === 'sebze_bakliyat'),
      hamur_isi: mains.filter((m) => classifyMainDish(m) === 'hamur_isi'),
    };

    const sidesByType = {
      pilav_borek: sides.filter((s) => {
        const c = classifySideDish(s);
        return c === 'pilav' || c === 'borek';
      }),
      all: sides,
    };

    const pickOne = (arr: string[]) => (arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : '');

    // Önceki günün ana yemek türünü tespit et (varsa tersini seç)
    let prevType: 'et_tavuk' | 'sebze_bakliyat' | 'hamur_isi' | null = null;
    if (dayIndex > 0 && wizardEntries[dayIndex - 1]) {
      const prevItems = wizardEntries[dayIndex - 1].items || parseItems(wizardEntries[dayIndex - 1].mealText);
      for (const item of prevItems) {
        if (autoDetectCategory(item) === 'ana_yemek') {
          prevType = classifyMainDish(item);
          break;
        }
      }
    }

    let targetType: 'et_tavuk' | 'sebze_bakliyat' | 'hamur_isi';
    if (dayName === 'Cumartesi' && Math.random() < 0.35 && prevType !== 'hamur_isi' && mainsByType.hamur_isi.length > 0) {
      targetType = 'hamur_isi';
    } else if (prevType === 'et_tavuk') {
      targetType = mainsByType.sebze_bakliyat.length > 0 ? 'sebze_bakliyat' : 'et_tavuk';
    } else if (prevType === 'sebze_bakliyat') {
      targetType = mainsByType.et_tavuk.length > 0 ? 'et_tavuk' : 'sebze_bakliyat';
    } else {
      targetType = mainsByType.et_tavuk.length > 0 ? 'et_tavuk' : 'sebze_bakliyat';
    }

    const mainPool = mainsByType[targetType].length > 0 ? mainsByType[targetType] : mains;
    const main = pickOne(mainPool);

    const isSaturday = dayName === 'Cumartesi';

    // 1. Çorba: Cumartesi günleri çorba eklenmez
    const soup = isSaturday ? '' : pickOne(soups);

    // 2. Yan Yemek: Aynı hafta içinde çeşit tekrarı (bulgur, pirinç, makarna, erişte, börek, patates) yapılmaz
    const usedSubtypesThisWeek = new Set<SideSubType>();
    for (let i = dayIndex - 1; i >= 0; i--) {
      const d = wizardEntries[i];
      if (!d) break;
      const dItems = d.items || parseItems(d.mealText);
      for (const it of dItems) {
        if (autoDetectCategory(it) === 'yan_yemek') {
          usedSubtypesThisWeek.add(getSideSubType(it));
        }
      }
      if (d.dayName === 'Pazartesi') break;
    }
    if (dayName !== 'Cumartesi') {
      for (let i = dayIndex + 1; i < wizardEntries.length; i++) {
        const d = wizardEntries[i];
        if (!d || d.dayName === 'Pazartesi') break;
        const dItems = d.items || parseItems(d.mealText);
        for (const it of dItems) {
          if (autoDetectCategory(it) === 'yan_yemek') {
            usedSubtypesThisWeek.add(getSideSubType(it));
          }
        }
      }
    }

    const { side } = pickSideForWeek(main, sides, usedSubtypesThisWeek);

    // 3. Salata: Cumartesi günleri salata eklenmez
    const salad = isSaturday
      ? ''
      : Math.random() < 0.25 && salads.length > 0
      ? pickOne(salads)
      : 'SALATABAR';

    // 4. Tatlı / İçecek: Cumartesi günleri tatlı/meyve eklenmez
    let sweetOrDrink = '';
    if (isSaturday) {
      if (drinks.length > 0) {
        sweetOrDrink = drinks.includes('AYRAN') ? 'AYRAN' : drinks[0];
      }
    } else {
      const r = Math.random();
      if (targetType === 'hamur_isi') {
        sweetOrDrink = Math.random() < 0.5 ? 'AYRAN' : pickOne(desserts);
      } else if (r < 0.55 && desserts.length > 0) {
        sweetOrDrink = pickOne(desserts);
      } else if (r < 0.8) {
        sweetOrDrink = 'MEYVE';
      } else if (drinks.length > 0) {
        sweetOrDrink = pickOne(drinks);
      }
    }

    const newItems = [soup, main, side, salad];
    if (sweetOrDrink && !newItems.includes(sweetOrDrink)) {
      newItems.push(sweetOrDrink);
    }

    const clean = newItems.filter(Boolean);
    const updated = [...wizardEntries];
    updated[dayIndex] = {
      ...updated[dayIndex],
      items: clean,
      mealText: clean.join(', '),
    };
    setWizardEntries(updated);
  };

  // Sihirbazda Bir Günden Yemek Çıkar
  const handleRemoveDishFromWizardDay = (dayIndex: number, dishIndex: number) => {
    const updated = [...wizardEntries];
    const currentItems = updated[dayIndex].items || parseItems(updated[dayIndex].mealText);
    const newItems = currentItems.filter((_, i) => i !== dishIndex);
    updated[dayIndex].items = newItems;
    updated[dayIndex].mealText = newItems.join(', ');
    setWizardEntries(updated);
  };

  // Sihirbazda Bir Güne Yemek Ekle
  const handleAddDishToWizardDay = (dayIndex: number, dishName: string) => {
    const updated = [...wizardEntries];
    const currentItems = updated[dayIndex].items || parseItems(updated[dayIndex].mealText);
    if (!currentItems.some((item) => item.toLowerCase() === dishName.toLowerCase())) {
      const newItems = [...currentItems, dishName];
      updated[dayIndex].items = newItems;
      updated[dayIndex].mealText = newItems.join(', ');
      setWizardEntries(updated);
    }
  };

  // Sihirbaz Listesini Onayla ve Yayınla
  const handleApproveAndSaveWizard = async () => {
    if (wizardEntries.length === 0) {
      setFeedback({ type: 'error', text: 'Kaydedilecek taslak liste bulunamadı.' });
      return;
    }

    setWizardSaving(true);
    setFeedback(null);
    try {
      const mLabel = MONTHS_LIST.find((m) => m.value === wizardMonth)?.label;
      const monthName = `${mLabel} ${wizardYear}`;
      const res = await fetch('/api/plans/monthly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: wizardYear,
          month: wizardMonth,
          monthName,
          entries: wizardEntries,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Kaydedilemedi.');
      }

      setFeedback({
        type: 'success',
        text: `🎉 Harika! ${monthName} aylık yemek listesi başarıyla onaylandı, sekme olarak oluşturuldu ve sisteme yayınlandı!`,
      });

      // Onaylı aylar listesini yenile
      await loadApprovedPlans();

      // Yeni onaylanan aya geçiş yap
      setSelectedYear(wizardYear);
      setSelectedMonth(wizardMonth);
      setActiveTab('monthly');
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Kaydedilirken hata oluştu.',
      });
    } finally {
      setWizardSaving(false);
    }
  };

  // Bir günden yemeği çıkar
  const handleRemoveDishFromDay = (dayIndex: number, dishIndex: number) => {
    const updated = [...monthlyEntries];
    const currentItems = updated[dayIndex].items || parseItems(updated[dayIndex].mealText);
    const newItems = currentItems.filter((_, i) => i !== dishIndex);
    updated[dayIndex].items = newItems;
    updated[dayIndex].mealText = newItems.join(', ');
    setMonthlyEntries(updated);
  };

  // Bir güne yemek ekle
  const handleAddDishToDay = (dayIndex: number, dishName: string) => {
    const updated = [...monthlyEntries];
    const currentItems = updated[dayIndex].items || parseItems(updated[dayIndex].mealText);
    
    // Zaten ekli mi kontrol et
    if (!currentItems.some((item) => item.toLowerCase() === dishName.toLowerCase())) {
      const newItems = [...currentItems, dishName];
      updated[dayIndex].items = newItems;
      updated[dayIndex].mealText = newItems.join(', ');
      setMonthlyEntries(updated);
    }
  };

  // O anda veritabanına yeni yemek ekle ve güne ata
  const handleQuickAddMealToDatabase = async () => {
    const trimmed = pickerSearch.trim();
    if (!trimmed || pickerDayIndex === null) return;

    setQuickAddLoading(true);
    try {
      const cat = newMealCategory || autoDetectCategory(trimmed);

      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmed,
          category: cat,
        }),
      });

      if (!res.ok) throw new Error('Yemek eklenemedi.');
      const data = await res.json();
      const createdMeal: MealItem = data.meal;

      // Veritabanı yemek listesini güncelle
      setAvailableMeals((prev) => [...prev, createdMeal]);

      // Seçili güne hemen ekle
      if (pickerTarget === 'wizard') {
        handleAddDishToWizardDay(pickerDayIndex, createdMeal.name);
      } else {
        handleAddDishToDay(pickerDayIndex, createdMeal.name);
      }

      setPickerSearch('');
      setFeedback({
        type: 'success',
        text: `"${createdMeal.name}" veritabanına (${CATEGORY_NAMES[createdMeal.category] || createdMeal.category}) olarak eklendi ve bugünün listesine dahil edildi!`,
      });
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Yemek eklenirken hata oluştu.',
      });
    } finally {
      setQuickAddLoading(false);
    }
  };

  // Yeni gün ekle
  const handleAddNewDay = () => {
    const nextDayNum = monthlyEntries.length + 1;
    const monthName = MONTHS_LIST.find((m) => m.value === selectedMonth)?.label || 'Eylül';
    const newEntry: MonthlyDailyEntry = {
      dateStr: `${nextDayNum} ${monthName} ${selectedYear} Pazartesi`,
      dayName: 'Pazartesi',
      mealText: 'ÇORBA, ANA YEMEK, PİLAV, SALATABAR',
      items: ['ÇORBA', 'ANA YEMEK', 'PİLAV', 'SALATABAR'],
      isHoliday: false,
    };
    setMonthlyEntries([...monthlyEntries, newEntry]);
  };

  // Satır sil
  const handleDeleteEntry = (index: number) => {
    const updated = monthlyEntries.filter((_, i) => i !== index);
    setMonthlyEntries(updated);
  };

  // Veritabanına kaydet
  const handleSaveMonthlyPlan = async () => {
    if (monthlyEntries.length === 0) {
      setFeedback({ type: 'error', text: 'Kaydedilecek gün bulunmuyor.' });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      const monthName = `${MONTHS_LIST.find((m) => m.value === selectedMonth)?.label} ${selectedYear}`;
      const res = await fetch('/api/plans/monthly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: selectedYear,
          month: selectedMonth,
          monthName,
          entries: monthlyEntries,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Kaydedilemedi.');
      }

      setFeedback({
        type: 'success',
        text: `Tebrikler! ${monthName} aylık yemek listesi başarıyla kaydedildi. Menüdeki tüm yemekler veritabanı ile senkronize edildi.`,
      });
      loadData(selectedYear, selectedMonth);
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Kaydedilirken hata oluştu.',
      });
    } finally {
      setSaving(false);
    }
  };

  // Yemek Seçici Modal Arama Filtrelemesi
  const filteredMealsForPicker = availableMeals.filter((m) => {
    const matchesSearch = pickerSearch.trim() === '' || m.name.toLowerCase().includes(pickerSearch.toLowerCase());
    const matchesCat = pickerCategoryFilter === 'all' || m.category === pickerCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const exactMatchExists = availableMeals.some(
    (m) => m.name.toLowerCase() === pickerSearch.trim().toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* Üst Başlık */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span>📅</span>
            <span>Aylık Yemek Listesi Yönetimi</span>
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Günlere veritabanından yemek ekleyin, veritabanında yoksa anında yeni yemek oluşturun.
          </p>
        </div>

        {/* Ay / Yıl Seçimi */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
            className="px-3.5 py-2 rounded-xl border border-stone-300 font-bold text-stone-800 text-sm focus:outline-none focus:border-amber-500 bg-stone-50"
          >
            {MONTHS_LIST.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="px-3.5 py-2 rounded-xl border border-stone-300 font-bold text-stone-800 text-sm focus:outline-none focus:border-amber-500 bg-stone-50"
          >
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
          </select>
        </div>
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

      {/* Onaylanmış Aylar ve Ana Sekmeler */}
      <div className="space-y-3 pb-2 border-b border-stone-200">
        {/* Onaylı Ay Sekmeleri */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-50 p-3 rounded-2xl border border-stone-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase tracking-wider text-stone-500 mr-1 flex items-center gap-1.5">
              <span>📅</span>
              <span>Onaylanmış Aylar:</span>
            </span>

            {approvedPlans.length === 0 ? (
              <span className="text-xs text-stone-400 font-semibold italic">Henüz onaylı ay kaydı yok</span>
            ) : (
              approvedPlans.map((plan) => {
                const isCurrentView =
                  activeTab === 'monthly' &&
                  selectedYear === plan.year &&
                  selectedMonth === plan.month;

                return (
                  <button
                    key={`${plan.year}-${plan.month}`}
                    type="button"
                    onClick={() => handleSelectApprovedMonth(plan.year, plan.month)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center gap-1.5 ${
                      isCurrentView
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-stone-700 hover:bg-amber-50/70 border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    <span>{plan.monthName}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        isCurrentView ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {plan.entriesCount} gün
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <div className="text-xs font-bold text-amber-900 bg-amber-100/70 px-3 py-1 rounded-lg border border-amber-200">
            Toplam <strong>{availableMeals.length}</strong> çeşit yemek hazır
          </div>
        </div>

        {/* Ana İşlem Sekmeleri */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('monthly')}
            className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'monthly'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <span>📋</span>
            <span>
              {MONTHS_LIST.find((m) => m.value === selectedMonth)?.label} {selectedYear} Menüsü ({monthlyEntries.length} Gün)
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('wizard');
              if (wizardEntries.length === 0) {
                handleGenerateWizard();
              }
            }}
            className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'wizard'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs ring-2 ring-orange-400/40'
                : 'bg-white text-orange-900 hover:bg-orange-50/70 border border-orange-200 shadow-2xs'
            }`}
          >
            <span>✨</span>
            <span>Yeni Liste Oluştur (Otomatik Menü)</span>
          </button>
        </div>
      </div>

      {/* 1. SEKME: GÜNLÜK YEMEK TABLOSU & VERİTABANINDAN YEMEK SEÇİMİ */}
      {activeTab === 'monthly' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-black text-stone-900">
                {MONTHS_LIST.find((m) => m.value === selectedMonth)?.label} {selectedYear} Menü Düzenleyici
              </h2>
              <p className="text-xs text-stone-500">
                Her günün yanındaki <strong>&quot;+ Yemek Seç / Ekle&quot;</strong> butonuna basarak veritabanından yemek seçebilir veya anında yeni yemek ekleyebilirsiniz.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              <button
                type="button"
                onClick={handleExportExcel}
                disabled={monthlyEntries.length === 0}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors cursor-pointer border border-emerald-200 flex items-center gap-1.5 disabled:opacity-40"
                title="Aylık menüyü Excel (.xlsx) formatında indir"
              >
                <span>📊</span>
                <span>Excel İndir</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPrintModalOpen(true)}
                disabled={monthlyEntries.length === 0}
                className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer border border-stone-300 flex items-center gap-1.5 disabled:opacity-40"
                title="Aylık menüyü yazdır veya PDF olarak kaydet"
              >
                <span>🖨️</span>
                <span>Yazdır / PDF</span>
              </button>

              <button
                type="button"
                onClick={handleAddNewDay}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors cursor-pointer border border-stone-300"
              >
                + Yeni Gün Ekle
              </button>

              <button
                type="button"
                onClick={handleSaveMonthlyPlan}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                {saving ? 'Kaydediliyor...' : '💾 Listeyi Kaydet'}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-stone-500 space-y-2">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-bold text-stone-600">Aylık Liste ve Yemekler Yükleniyor...</p>
            </div>
          ) : monthlyEntries.length === 0 ? (
            <div className="p-12 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 space-y-3">
              <span className="text-3xl">📭</span>
              <p className="text-stone-700 font-bold">Bu ay için henüz menü girilmemiştir.</p>
              <button
                type="button"
                onClick={() => {
                  setWizardYear(selectedYear);
                  setWizardMonth(selectedMonth);
                  setActiveTab('wizard');
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 mx-auto cursor-pointer shadow-xs transition-colors"
              >
                <span>✨</span>
                <span>Sihirbaz ile Menü Oluştur</span>
              </button>
            </div>
          ) : (
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto max-h-[62vh]">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead className="sticky top-0 z-10 bg-stone-100 border-b border-stone-200 text-stone-700 font-black text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">#</th>
                      <th className="py-3 px-4 w-44 sm:w-52">TARİH</th>
                      <th className="py-3 px-4">GÜNÜN YEMEKLERİ (VERİTABANI SEÇİMLİ)</th>
                      <th className="py-3 px-4 w-20 text-center">İŞLEM</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white">
                    {monthlyEntries.map((entry, index) => {
                      const dishes = entry.items || parseItems(entry.mealText);
                      const dayCalories = dishes.reduce((sum, d) => {
                        const dbMeal = availableMeals.find((m) => m.name.toLowerCase() === d.toLowerCase());
                        const cal = dbMeal?.calories ? dbMeal.calories : getMealCalories(d, dbMeal?.category);
                        return sum + cal;
                      }, 0);

                      return (
                        <tr key={index} className="hover:bg-amber-50/40 transition-colors">
                          <td className="py-3.5 px-4 text-center font-bold text-stone-400">
                            {index + 1}
                          </td>

                          {/* Tarih & Gün */}
                          <td className="py-3.5 px-4 align-top w-44">
                            <input
                              type="text"
                              value={entry.dateStr}
                              onChange={(e) => {
                                const updated = [...monthlyEntries];
                                updated[index].dateStr = e.target.value;
                                setMonthlyEntries(updated);
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-bold text-stone-900 focus:outline-none focus:border-amber-500 bg-stone-50"
                            />
                            <div className="flex items-center justify-between gap-1 mt-1">
                              <span className="text-[11px] text-stone-500 font-semibold">
                                {entry.dayName}
                              </span>
                              {dayCalories > 0 && (
                                <span className="text-[10px] font-black text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                                  <span>🔥</span>
                                  <span>{dayCalories} kcal</span>
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Günün Yemekleri (Rozetler + Veritabanından Ekleme Butonu) */}
                          <td className="py-3.5 px-4 align-top">
                            <div className="space-y-2.5">
                              {/* Yemek Rozetleri */}
                              <div className="flex flex-wrap gap-1.5 items-center">
                                {dishes.map((dish, dIdx) => {
                                  const dbMeal = availableMeals.find(
                                    (m) => m.name.toLowerCase() === dish.toLowerCase()
                                  );
                                  const category = dbMeal ? dbMeal.category : autoDetectCategory(dish);
                                  const badgeColor = CATEGORY_COLORS[category] || 'bg-stone-100 text-stone-800 border-stone-300';
                                  const cal = dbMeal?.calories ? dbMeal.calories : getMealCalories(dish, category);

                                  return (
                                    <span
                                      key={dIdx}
                                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border shadow-2xs group ${badgeColor}`}
                                    >
                                      <span>{dish}</span>
                                      <span className="opacity-80 font-black text-[10px]">({cal} kcal)</span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveDishFromDay(index, dIdx)}
                                        className="text-stone-400 hover:text-rose-600 font-black text-xs leading-none transition-colors"
                                        title="Bu yemeği kaldır"
                                      >
                                        ✕
                                      </button>
                                    </span>
                                  );
                                })}

                                {/* Veritabanından Yemek Ekle Butonu */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPickerDayIndex(index);
                                    setPickerSearch('');
                                    setPickerCategoryFilter('all');
                                    setNewMealCategory(autoDetectCategory(''));
                                  }}
                                  className="inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-xs cursor-pointer"
                                >
                                  <span>+ Yemek Seç / Ekle</span>
                                </button>
                              </div>

                              {/* Metin Düzenleme (Hızlı Doğrudan Düzenleme) */}
                              <input
                                type="text"
                                value={entry.mealText}
                                onChange={(e) => {
                                  const updated = [...monthlyEntries];
                                  updated[index].mealText = e.target.value;
                                  updated[index].items = parseItems(e.target.value);
                                  setMonthlyEntries(updated);
                                }}
                                placeholder="Virgülle ayırarak yemek yazın veya düzenleyin..."
                                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-700 focus:outline-none focus:border-amber-400 bg-stone-50/50"
                              />
                            </div>
                          </td>

                          {/* Sil Butonu */}
                          <td className="py-3.5 px-4 text-center align-top">
                            <button
                              type="button"
                              onClick={() => handleDeleteEntry(index)}
                              className="w-8 h-8 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 font-bold transition-colors cursor-pointer"
                              title="Bu günü sil"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {monthlyEntries.length > 0 && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveMonthlyPlan}
                disabled={saving}
                className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {saving ? 'Kaydediliyor...' : '💾 Değişiklikleri Kaydet'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. SEKME: OTOMATİK YENİ LİSTE OLUŞTURUCU (MENÜ SİHİRBAZI) */}
      {activeTab === 'wizard' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-6">
          {/* Başlık & Kontroller */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-5 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                <span>✨</span>
                <span>Yeni Liste Oluştur (Otomatik Menü Sihirbazı)</span>
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-1">
                İstediğiniz ay ve yılı seçin. Sistem veritabanındaki <strong>176 çeşit</strong> yemekten dengeli (Çorba, Ana Yemek, Yan Yemek/Börek, Salata, Tatlı/Meyve/İçecek) ve <strong>Pazar günleri kesinlikle hariç</strong> karma menü üretir.
              </p>
            </div>

            {/* Ay ve Yıl Seçimi + Oluştur Butonu */}
            <div className="flex items-center gap-2.5 flex-wrap self-stretch lg:self-auto">
              <select
                value={wizardMonth}
                onChange={(e) => setWizardMonth(parseInt(e.target.value, 10))}
                className="px-3.5 py-2.5 rounded-xl border border-stone-300 font-bold text-stone-800 text-xs sm:text-sm focus:outline-none focus:border-amber-500 bg-stone-50 cursor-pointer"
              >
                {MONTHS_LIST.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>

              <select
                value={wizardYear}
                onChange={(e) => setWizardYear(parseInt(e.target.value, 10))}
                className="px-3.5 py-2.5 rounded-xl border border-stone-300 font-bold text-stone-800 text-xs sm:text-sm focus:outline-none focus:border-amber-500 bg-stone-50 cursor-pointer"
              >
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
                <option value={2028}>2028</option>
              </select>

              <button
                type="button"
                onClick={handleGenerateWizard}
                disabled={wizardLoading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {wizardLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Oluşturuluyor...</span>
                  </>
                ) : (
                  <>
                    <span>🎲</span>
                    <span>Menüyü Otomatik Oluştur</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Taslak Önizleme Alanı */}
          {wizardEntries.length > 0 ? (
            <div className="space-y-4">
              {/* Onay & Aksiyon Barı */}
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-600 text-white font-black text-xs">
                      TASLAK LİSTE
                    </span>
                    <span className="font-extrabold text-stone-900 text-sm">
                      {MONTHS_LIST.find((m) => m.value === wizardMonth)?.label} {wizardYear} Menüsü ({wizardEntries.length} Gün - Pazar günleri hariç)
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    Taslağı aşağıdan inceleyebilir, yemek çıkarıp ekleyebilir veya günleri tek tek yenileyebilirsiniz. <strong>&quot;Onayla ve Yayınla&quot;</strong> butonuna bastığınızda ayın sekmesi otomatik olarak oluşturulup takvime işlenecektir.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto flex-wrap">
                  <button
                    type="button"
                    onClick={handleGenerateWizard}
                    disabled={wizardLoading || wizardSaving}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold transition-colors border border-stone-300 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>🔄</span>
                    <span>Tümünü Yeniden Karma Yap</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleApproveAndSaveWizard}
                    disabled={wizardSaving}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black transition-all shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    {wizardSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Yayınlanıyor...</span>
                      </>
                    ) : (
                      <>
                        <span>✅</span>
                        <span>Bu Listeyi Onayla ve Yayınla</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Gün Gün Taslak Tablosu */}
              <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100/90 text-stone-700 uppercase font-black tracking-wider text-[11px] border-b border-stone-200">
                      <tr>
                        <th className="px-4 py-3.5 w-48">Tarih & Gün</th>
                        <th className="px-4 py-3.5">Oluşturulan Günlük Menü (Çorba, Ana Yemek, Yan Yemek/Börek, Salata, Tatlı/İçecek)</th>
                        <th className="px-4 py-3.5 text-center w-36">İşlem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {wizardEntries.map((entry, dayIdx) => {
                        const items = entry.items || parseItems(entry.mealText);
                        const dayCalories = items.reduce((sum, d) => {
                          const dbMeal = availableMeals.find((m) => m.name.toLowerCase() === d.toLowerCase());
                          const cal = dbMeal?.calories ? dbMeal.calories : getMealCalories(d, dbMeal?.category);
                          return sum + cal;
                        }, 0);

                        return (
                          <tr key={dayIdx} className="hover:bg-amber-50/40 transition-colors">
                            <td className="px-4 py-3 align-top font-bold text-stone-800">
                              <div className="text-xs font-extrabold text-stone-900">{entry.dateStr}</div>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                                  {entry.dayName}
                                </span>
                                {dayCalories > 0 && (
                                  <span className="inline-block px-1.5 py-0.5 text-[10px] font-black rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                                    🔥 {dayCalories} kcal
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="px-4 py-3 align-top">
                              <div className="space-y-2">
                                <div className="flex flex-wrap gap-1.5 items-center">
                                  {items.map((dish, dishIdx) => {
                                    const cat = autoDetectCategory(dish);
                                    const catColor = CATEGORY_COLORS[cat] || 'bg-stone-100 text-stone-800 border-stone-300';
                                    const dbMeal = availableMeals.find((m) => m.name.toLowerCase() === dish.toLowerCase());
                                    const cal = dbMeal?.calories ? dbMeal.calories : getMealCalories(dish, cat);

                                    return (
                                      <span
                                        key={dishIdx}
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border shadow-2xs ${catColor}`}
                                      >
                                        <span>{dish}</span>
                                        <span className="opacity-80 font-black text-[10px]">({cal} kcal)</span>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveDishFromWizardDay(dayIdx, dishIdx)}
                                          className="text-stone-400 hover:text-rose-600 font-black ml-0.5 cursor-pointer text-xs"
                                          title="Bu yemeği menüden çıkar"
                                        >
                                          ✕
                                        </button>
                                      </span>
                                    );
                                  })}

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPickerTarget('wizard');
                                      setPickerDayIndex(dayIdx);
                                      setPickerSearch('');
                                      setPickerCategoryFilter('all');
                                    }}
                                    className="px-2.5 py-1 rounded-lg border border-dashed border-amber-400 text-amber-700 hover:bg-amber-100/60 font-extrabold text-xs transition-colors cursor-pointer"
                                  >
                                    + Yemek Ekle
                                  </button>
                                </div>

                                {/* Doğrudan metin düzenleme */}
                                <input
                                  type="text"
                                  value={entry.mealText}
                                  onChange={(e) => {
                                    const updated = [...wizardEntries];
                                    updated[dayIdx].mealText = e.target.value;
                                    updated[dayIdx].items = parseItems(e.target.value);
                                    setWizardEntries(updated);
                                  }}
                                  placeholder="Virgülle ayırarak yemekleri düzenleyin..."
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-700 focus:outline-none focus:border-amber-400 bg-stone-50/50"
                                />
                              </div>
                            </td>

                            <td className="px-4 py-3 align-top text-center">
                              <button
                                type="button"
                                onClick={() => handleRegenerateWizardDay(dayIdx)}
                                className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-700 hover:text-amber-900 font-bold text-xs transition-colors border border-stone-200 cursor-pointer flex items-center justify-center gap-1 mx-auto"
                                title="Bu günün menüsünü yeniden karma yap"
                              >
                                <span>🔄</span>
                                <span>Günü Yenile</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Alt Onay Butonu */}
              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleApproveAndSaveWizard}
                  disabled={wizardSaving}
                  className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm transition-all shadow-md cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {wizardSaving ? 'Yayınlanıyor...' : '✅ Bu Listeyi Onayla ve Ay Sekmesine Ekle'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-16 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl mx-auto shadow-inner">
                ✨
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="font-black text-stone-800 text-base">Henüz Taslak Menü Oluşturulmadı</h3>
                <p className="text-xs text-stone-500">
                  Yukarıdan ayı ve yılı seçip <strong>&quot;Menüyü Otomatik Oluştur&quot;</strong> butonuna tıklayın. Sistem veritabanındaki 176 çeşit yemekten dengeli ve kurumsal bir aylık menü derleyecektir.
                </p>
              </div>
              <button
                type="button"
                onClick={handleGenerateWizard}
                disabled={wizardLoading}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs transition-all shadow-xs cursor-pointer"
              >
                {wizardLoading ? 'Oluşturuluyor...' : `🎲 ${MONTHS_LIST.find((m) => m.value === wizardMonth)?.label} ${wizardYear} Menüsünü Oluştur`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. SEKME: TOPLU LİSTE YAPIŞTIR */}
      {/* VERİTABANINDAN YEMEK SEÇİCİ & ANINDA YENİ YEMEK EKLEME MODALI */}
      {pickerDayIndex !== null && (
        (() => {
          const activeList = pickerTarget === 'wizard' ? wizardEntries : monthlyEntries;
          const entry = activeList[pickerDayIndex];
          if (!entry) return null;

          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
              onClick={() => setPickerDayIndex(null)}
            >
              <div
                className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-stone-200 text-stone-800 my-auto max-h-[88vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Başlığı */}
                <div className="px-6 py-4 border-b border-stone-200 bg-amber-50/70 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-extrabold bg-amber-200 text-amber-900">
                        {pickerTarget === 'wizard' ? 'Sihirbaz Taslağı' : 'Aylık Menü'}
                      </span>
                      <h3 className="text-lg font-black text-stone-900">
                        🍲 {entry.dateStr}
                      </h3>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Veritabanındaki yemeklerden seçin veya arama kutusundan anında yeni yemek ekleyin.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPickerDayIndex(null)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white hover:bg-stone-100 text-stone-600 font-bold border border-stone-200 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Gövdesi */}
                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                  {/* Günün Mevcut Seçili Yemekleri */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-stone-600">
                      Bu Günün Menüsüne Eklenen Yemekler:
                    </label>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 min-h-[44px] flex flex-wrap gap-1.5 items-center">
                      {(entry.items || []).length === 0 ? (
                        <span className="text-xs text-stone-400 font-medium">Henüz yemek eklenmedi. Aşağıdan seçin.</span>
                      ) : (
                        (entry.items || []).map((dish, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-950 shadow-2xs"
                          >
                            <span>{dish}</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (pickerTarget === 'wizard') {
                                  handleRemoveDishFromWizardDay(pickerDayIndex, i);
                                } else {
                                  handleRemoveDishFromDay(pickerDayIndex, i);
                                }
                              }}
                              className="text-stone-400 hover:text-rose-600 font-black text-xs cursor-pointer"
                            >
                              ✕
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Arama ve Kategori Filtresi */}
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={pickerSearch}
                        onChange={(e) => {
                          setPickerSearch(e.target.value);
                          setNewMealCategory(autoDetectCategory(e.target.value));
                        }}
                        placeholder="Veritabanında yemek ara veya yeni isim yaz..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-500 bg-stone-50"
                      />
                      <span className="absolute left-3 top-2.5 text-stone-400 text-sm">🔍</span>
                    </div>

                    {/* Kategori Filtre Butonları */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
                      {[
                        { id: 'all', label: 'Tümü' },
                        { id: 'corba', label: 'Çorbalar' },
                        { id: 'ana_yemek', label: 'Ana Yemekler' },
                        { id: 'yan_yemek', label: 'Yan Yemekler (Pilav/Makarna/Börek)' },
                        { id: 'salata', label: 'Salata / Meze' },
                        { id: 'tatli', label: 'Tatlılar' },
                        { id: 'icecek', label: 'İçecekler' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setPickerCategoryFilter(cat.id)}
                          className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                            pickerCategoryFilter === cat.id
                              ? 'bg-amber-500 text-white'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ANINDA VERİTABANINA EKLEME KARTI (Arama kelimesi tam eşleşmiyorsa görünür) */}
                  {pickerSearch.trim() && !exactMatchExists && (
                    <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">✨</span>
                        <div>
                          <h4 className="text-xs font-black text-amber-950">
                            &quot;{pickerSearch.trim()}&quot; Veritabanında Yok!
                          </h4>
                          <p className="text-[11px] text-amber-800">
                            Hemen şimdi veritabanına ekleyip bugünün menüsüne dahil edebilirsiniz.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                        <select
                          value={newMealCategory}
                          onChange={(e) => setNewMealCategory(e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-amber-400 text-xs font-bold bg-white text-stone-800 focus:outline-none"
                        >
                          <option value="corba">Kategori: Çorba</option>
                          <option value="ana_yemek">Kategori: Ana Yemek</option>
                          <option value="yan_yemek">Kategori: Yan Yemek (Pilav, Makarna, Börek)</option>
                          <option value="salata">Kategori: Salata / Meze</option>
                          <option value="tatli">Kategori: Tatlı</option>
                          <option value="icecek">Kategori: İçecek</option>
                        </select>

                        <button
                          type="button"
                          onClick={handleQuickAddMealToDatabase}
                          disabled={quickAddLoading}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          {quickAddLoading ? 'Ekleniyor...' : `➕ Veritabanına Ekle ve Bu Güne Ata`}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Veritabanındaki Yemeklerin Listesi */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-stone-600 block">
                      Veritabanında Kayıtlı Yemekler ({filteredMealsForPicker.length}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                      {filteredMealsForPicker.map((meal) => {
                        const isAlreadyAdded = (entry.items || []).some(
                          (item) => item.toLowerCase() === meal.name.toLowerCase()
                        );
                        const cal = meal.calories ? meal.calories : getMealCalories(meal.name, meal.category);

                        return (
                          <button
                            key={meal.id}
                            type="button"
                            onClick={() => {
                              if (pickerTarget === 'wizard') {
                                handleAddDishToWizardDay(pickerDayIndex, meal.name);
                              } else {
                                handleAddDishToDay(pickerDayIndex, meal.name);
                              }
                            }}
                            disabled={isAlreadyAdded}
                            className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                              isAlreadyAdded
                                ? 'bg-stone-50 border-stone-200 opacity-60 cursor-not-allowed'
                                : 'bg-white border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 shadow-2xs'
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <span className="text-xs font-bold text-stone-900 block truncate">
                                {meal.name}
                              </span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] text-stone-500 font-semibold">
                                  {CATEGORY_NAMES[meal.category] || meal.category}
                                </span>
                                <span className="text-[10px] text-amber-700 font-black bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60">
                                  🔥 {cal} kcal
                                </span>
                              </div>
                            </div>
                            <span className="text-xs font-black text-amber-600 flex-shrink-0">
                              {isAlreadyAdded ? '✓ Ekli' : '+ Ekle'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Modal Alt Kısım */}
                <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setPickerDayIndex(null)}
                    className="px-6 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-black text-xs transition-colors cursor-pointer"
                  >
                    Tamamla
                  </button>
                </div>
              </div>
            </div>
          );
        })()
      )}

      {/* Aylık Menü Yazdırma ve PDF Modal */}
      <PrintMenuModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        monthName={`${MONTHS_LIST.find((m) => m.value === selectedMonth)?.label || 'Menü'} ${selectedYear}`}
        entries={monthlyEntries}
        year={selectedYear}
        month={selectedMonth}
      />
    </div>
  );
}
