import { getLocalizedText } from './i18nUtils';

const CYRILLIC_MAP: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh',
  з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
  п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts',
  ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu',
  я: 'ya', ў: 'o', қ: 'q', ғ: 'g', ҳ: 'h',
};

function transliterate(str: string): string {
  return str
    .split('')
    .map((ch) => CYRILLIC_MAP[ch] ?? ch)
    .join('');
}

/**
 * SEO-friendly slug yaratish
 * "Bolalar shirinlik qutisi Archa (1.5-2 kg)" → "bolalar-shirinlik-qutisi-archa-1-5-2-kg"
 */
export function slugify(text: string): string {
  if (!text) return '';
  return transliterate(text.toString().toLowerCase().trim())
    .replace(/['`’ʻʼ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '-')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Mahsulot uchun unique SEO slug yaratish (id bilan)
 */
export function productSlug(product: { id: number; name: unknown; slug?: unknown }, lang = 'uz'): string {
  const localizedSlug = getLocalizedText(product.slug, lang) || getLocalizedText(product.slug, 'uz');
  const localizedName = getLocalizedText(product.name, lang) || getLocalizedText(product.name, 'uz');
  const rawBase = slugify(localizedSlug || localizedName) || 'mahsulot';
  const suffix = `-${product.id}`;
  return rawBase.endsWith(suffix) ? rawBase : `${rawBase}${suffix}`;
}

/**
 * Slug dan mahsulot ID olish
 * "archa-1-5-2kg-2" → 2
 */
export function getIdFromSlug(slug: string): number | null {
  const parts = slug.split('-');
  const id = parseInt(parts[parts.length - 1], 10);
  return isNaN(id) ? null : id;
}

/**
 * Blog post uchun SEO slug yaratish
 */
export function blogSlug(post: { id: number; title: unknown; slug?: unknown }, lang = 'uz'): string {
  const localizedSlug = getLocalizedText(post.slug, lang) || getLocalizedText(post.slug, 'uz');
  const localizedTitle = getLocalizedText(post.title, lang) || getLocalizedText(post.title, 'uz');
  const rawBase = slugify(localizedSlug || localizedTitle) || 'maqola';
  const suffix = `-${post.id}`;
  return rawBase.endsWith(suffix) ? rawBase : `${rawBase}${suffix}`;
}

/**
 * Blog slug dan ID olish
 */
export function getBlogIdFromSlug(slug: string): number | null {
  const parts = slug.split('-');
  const id = parseInt(parts[parts.length - 1], 10);
  return isNaN(id) ? null : id;
}
