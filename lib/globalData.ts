import { supabase, hasSupabaseCredentials } from './supabaseClient';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, DEFAULT_HERO_CONTENT, DEFAULT_NAVIGATION } from '../constants';
import { slugify } from './slugify';
import { getLocalizedText } from './i18nUtils';
import type { Product, Category, HeroContent, NavigationSettings, BlogPost } from '../types';

export interface GlobalData {
  products: Product[];
  categories: Category[];
  heroContent: HeroContent;
  navigationSettings: NavigationSettings;
  blogPosts: BlogPost[];
}

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

// Mock data faqat Supabase sozlanmagan (lokal dev) muhitda ishlatiladi.
// Credentials mavjud bo'lsa — baza bo'sh bo'lsa ham bo'sh ro'yxat qaytadi.
export async function fetchGlobalData(): Promise<GlobalData> {
  if (!hasSupabaseCredentials) {
    return {
      products: MOCK_PRODUCTS,
      categories: MOCK_CATEGORIES,
      heroContent: DEFAULT_HERO_CONTENT,
      navigationSettings: DEFAULT_NAVIGATION,
      blogPosts: [],
    };
  }

  const [productsRes, categoriesRes, heroRes, blogRes, navRes] = await Promise.allSettled([
    supabase.from('products').select('*').order('id', { ascending: false }),
    supabase.from('categories').select('*'),
    supabase.from('hero_content').select('*').single(),
    supabase.from('blog_posts').select('*').order('date', { ascending: false }),
    supabase.from('navigation_settings').select('*').single(),
  ]);

  const products = productsRes.status === 'fulfilled' && productsRes.value.data
    ? mapProducts(productsRes.value.data)
    : [];

  const categories = categoriesRes.status === 'fulfilled' && categoriesRes.value.data
    ? mapCategories(categoriesRes.value.data)
    : [];

  let heroContent: HeroContent = DEFAULT_HERO_CONTENT;
  if (heroRes.status === 'fulfilled' && heroRes.value.data) {
    const heroData: any = heroRes.value.data;
    heroContent = {
      badge: heroData.badge || DEFAULT_HERO_CONTENT.badge,
      title: heroData.title || DEFAULT_HERO_CONTENT.title,
      description: heroData.description || '',
      buttonText: heroData.buttonText || heroData.button_text || DEFAULT_HERO_CONTENT.buttonText,
      images: heroData.images || [],
    };
  }

  let blogPosts: BlogPost[] = [];
  if (blogRes.status === 'fulfilled' && blogRes.value.data) {
    blogPosts = blogRes.value.data.map((post: any) => ({
      ...post,
      seo: post.seo || {
        title: post.seo_title || post.title,
        description: post.seo_description || '',
        keywords: post.seo_keywords || [],
      },
    })) as BlogPost[];
  }

  let navigationSettings: NavigationSettings = DEFAULT_NAVIGATION;
  if (navRes.status === 'fulfilled' && navRes.value.data) {
    const navData: any = navRes.value.data;
    navigationSettings = {
      menuItems: navData.menuItems || navData.menu_items || [],
      socialLinks: navData.socialLinks || navData.social_links || [],
    };
  }

  return { products, categories, heroContent, navigationSettings, blogPosts };
}
