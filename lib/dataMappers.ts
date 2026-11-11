import { slugify } from './slugify';
import { getLocalizedText } from './i18nUtils';
import type { Product, Category } from '../types';

/**
 * Supabase qatorlarini UI modeliga aylantiruvchi SOF funksiyalar.
 *
 * Ular `lib/globalData.ts` dan ajratildi: `globalData` `next/cache`
 * (`unstable_cache`) import qiladi, shuning uchun uni klient komponentdan
 * import qilish mo'rt va bundle'ni og'irlashtiradi. Admin komponentlari endi
 * faqat shu faylni ishlatadi.
 */

export function mapProducts(rows: any[]): Product[] {
  return rows.map((p) => ({
    ...p,
    formattedPrice: new Intl.NumberFormat('uz-UZ').format(Number(p.price)) + ' UZS',
    shortDescription: p.description || '',
    specs: p.specifications || [],
    videoUrl: p.videoUrl || '',
  })) as Product[];
}

export function mapCategories(rows: any[]): Category[] {
  return rows.map((c) => ({
    ...c,
    slug: c.slug || slugify(getLocalizedText(c.name, 'uz')),
  })) as Category[];
}
