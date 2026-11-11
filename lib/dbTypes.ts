/**
 * Supabase jadvallarining satr tiplari (row types).
 *
 * Maqsad: `any` o'rniga aniq tiplar. Supabase klienti generatsiya qilingan
 * tiplarsiz ishlatilgani uchun `data` `any` bo'lib keladi — biz uni shu
 * tiplarga keltiramiz.
 *
 * Eslatma: `name`, `description`, `title` kabi maydonlar bazada **JSON
 * lokalizatsiya** satri (`{"uz":"...","ru":"..."}`) yoki oddiy matn bo'lishi
 * mumkin; shuning uchun ular `string` deb belgilangan va `getLocalizedText`
 * orqali o'qiladi.
 */

export interface DbProduct {
  id: number;
  name: string;
  slug?: string | null;
  price: number;
  image: string;
  category: string;
  categoryId?: number | null;
  description?: string | null;
  stock?: number | null;
  itemsPerPackage?: number | null;
  images?: string[] | null;
  videoUrl?: string | null;
  specifications?: unknown;
  is_premium?: boolean | null;
  is_bestseller?: boolean | null;
  created_at?: string | null;
}

export interface DbCategory {
  id: number;
  name: string;
  slug?: string | null;
  image: string;
  description?: string | null;
  googleProductCategory?: string | null;
  created_at?: string | null;
}

export interface DbBlogPost {
  id: number;
  title: string;
  slug?: string | null;
  image: string;
  content: unknown;
  date: string;
  seo?: unknown;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: unknown;
  created_at?: string | null;
}

export interface DbHeroContent {
  id?: string;
  badge?: string | null;
  title?: string | null;
  description?: string | null;
  buttonText?: string | null;
  button_text?: string | null;
  images?: string[] | null;
  active?: boolean | null;
}

export interface DbNavigationSettings {
  id?: string;
  menuItems?: unknown;
  menu_items?: unknown;
  socialLinks?: unknown;
  social_links?: unknown;
}

export interface DbOrderItem {
  id?: number;
  productId?: number;
  name?: string;
  quantity?: number;
  price?: number;
  image?: string;
}

export interface DbOrder {
  id: string;
  customerName: string;
  phone: string;
  total: number;
  status?: string | null;
  paymentMethod?: string | null;
  date: string;
  user_id?: string | null;
  items?: unknown;
  shipping_address?: string | null;
  city?: string | null;
  telegram_user_id?: number | string | null;
  stock_reserved?: boolean | null;
  created_at?: string | null;
}

export interface DbLead {
  id: string;
  name: string;
  phone: string;
  last_message?: string | null;
  created_at?: string | null;
}

export interface DbBotUser {
  telegram_id: number;
  name?: string | null;
  username?: string | null;
  phone?: string | null;
  address?: string | null;
  lang?: string | null;
  cart?: unknown;
  created_at?: string | null;
}

export interface DbPromoCode {
  id?: number;
  code: string;
  discount_percent: number;
  active?: boolean | null;
  expires_at?: string | null;
  created_at?: string | null;
}

export interface DbUserDevice {
  id?: number;
  user_id?: string | null;
  telegram_id?: number | null;
  lead_id?: string | null;
  fcm_token: string;
  device_info?: string | null;
  created_at?: string | null;
}

/** Buyurtma elementlarini `DbOrderItem[]` ga xavfsiz keltirish. */
export function toDbOrderItems(value: unknown): DbOrderItem[] {
  return Array.isArray(value) ? (value as DbOrderItem[]) : [];
}
