/**
 * Yemek Listem - Temel Veri Tipleri
 * İleride eklenecek veritabanı ve admin paneli yapıları gözetilerek tasarlanmıştır.
 */

export type MealCategory = 'corba' | 'ana_yemek' | 'yan_yemek' | 'salata' | 'tatli' | 'icecek';

export interface Meal {
  id: string;
  name: string;
  category: MealCategory;
  description?: string;
  calories?: number;
  imageUrl?: string;
}

export interface DailyMealPlan {
  date: string; // ISO format (YYYY-MM-DD)
  dayName: string; // Pazartesi, Salı, vb.
  meals: Meal[];
}

export interface WeeklyMealPlan {
  id: string;
  year: number;
  weekNumber: number;
  startDate: string;
  endDate: string;
  days: DailyMealPlan[];
  createdAt: string;
}

export interface UserNote {
  id: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'archived';
  clientIp?: string;
}
