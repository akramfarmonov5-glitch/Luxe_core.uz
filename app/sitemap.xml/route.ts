import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SITE_URL } from '../../lib/siteUrl';

const BASE_URL = SITE_URL;
const LANGUAGES = ['uz', 'ru', 'en'] as const;
type Lang = typeof LANGUAGES[number];

interface SitemapImageData {
  image?: string;
  imageTitle?: string;
  imageCaption?: string;
}

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const today = new Date().toISOString().split('T')[0];

  try {
    let products: any[] = [];
    let categories: any[] = [];
    let blogPosts: any[] = [];

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const [prodRes, catRes, blogRes] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('categories').select('*'),
        supabase.from('blog_posts').select('*').order('date', { ascending: false }),
      ]);

      if (prodRes.data) products = prodRes.data;
      if (catRes.data) categories = catRes.data;
      if (blogRes.data) blogPosts = blogRes.data;
    }

    // Fallback ro'yxatlar faqat Supabase sozlanmagan muhitda ishlatiladi
    if (!supabaseUrl || !supabaseKey) {
      if (products.length === 0) products = getFallbackProducts();
      if (categories.length === 0) categories = getFallbackCategories();
    }

    let urls = '';

    urls += renderLocalizedUrl('/', today, 'daily', '1.0');
    urls += renderLocalizedUrl('/delivery', today, 'monthly', '0.5');
    urls += renderLocalizedUrl('/returns', today, 'monthly', '0.5');
    urls += renderLocalizedUrl('/faq', today, 'monthly', '0.5');
    urls += renderLocalizedUrl('/privacy', today, 'yearly', '0.3');
    urls += renderLocalizedUrl('/terms', today, 'yearly', '0.3');

    for (const cat of categories) {
      urls += renderLocalizedCategoryUrl(cat, today, 'weekly', '0.9', {
        image: cat.image,
        imageTitle: getLocalizedText(cat.name, 'uz'),
      });
    }

    for (const product of products) {
      urls += renderLocalizedEntityUrl('product', product, today, 'weekly', '0.8', {
        image: product.image,
        imageTitle: getLocalizedText(product.name, 'uz'),
        imageCaption: getLocalizedText(product.shortDescription || product.description || product.name, 'uz'),
      });
    }

    for (const post of blogPosts) {
      urls += renderLocalizedEntityUrl('blog', post, post.date || today, 'monthly', '0.7', {
        image: post.image,
        imageTitle: getLocalizedText(post.title, 'uz'),
      });
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}
</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    console.error('Sitemap Generation Error:', err);
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/uz</loc>
    <lastmod>${today}</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>`;
    return new NextResponse(fallback, {
      status: 200,
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}

function renderLocalizedUrl(path: string, lastmod: string, changefreq: string, priority: string, imageData: SitemapImageData = {}) {
  return LANGUAGES.map((lang) => {
    const loc = localizedUrl(path, lang);
    const alternates = LANGUAGES.map((altLang) =>
      `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${localizedUrl(path, altLang)}" />`
    ).join('\n');
    const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${localizedUrl(path, 'uz')}" />`;
    const image = imageData.image ? `
    <image:image>
      <image:loc>${escapeXml(imageData.image)}</image:loc>
      <image:title>${escapeXml(imageData.imageTitle || '')}</image:title>${imageData.imageCaption ? `
      <image:caption>${escapeXml(imageData.imageCaption)}</image:caption>` : ''}
    </image:image>` : '';

    return `
  <url>
    <loc>${loc}</loc>
${alternates}
${xDefault}
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${image}
  </url>`;
  }).join('');
}

function renderLocalizedCategoryUrl(category: any, lastmod: string, changefreq: string, priority: string, imageData: SitemapImageData = {}) {
  return LANGUAGES.map((lang) => {
    const loc = localizedUrl(`/category/${getCategorySlug(category, lang)}`, lang);
    const alternates = LANGUAGES.map((altLang) =>
      `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${localizedUrl(`/category/${getCategorySlug(category, altLang)}`, altLang)}" />`
    ).join('\n');
    const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${localizedUrl(`/category/${getCategorySlug(category, 'uz')}`, 'uz')}" />`;
    const image = imageData.image ? `
    <image:image>
      <image:loc>${escapeXml(imageData.image)}</image:loc>
      <image:title>${escapeXml(imageData.imageTitle || '')}</image:title>${imageData.imageCaption ? `
      <image:caption>${escapeXml(imageData.imageCaption)}</image:caption>` : ''}
    </image:image>` : '';

    return `
  <url>
    <loc>${loc}</loc>
${alternates}
${xDefault}
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${image}
  </url>`;
  }).join('');
}

function renderLocalizedEntityUrl(entityType: string, entity: any, lastmod: string, changefreq: string, priority: string, imageData: SitemapImageData = {}) {
  return LANGUAGES.map((lang) => {
    const path = `/${entityType}/${getEntitySlug(entityType, entity, lang)}`;
    const loc = localizedUrl(path, lang);
    const alternates = LANGUAGES.map((altLang) =>
      `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${localizedUrl(`/${entityType}/${getEntitySlug(entityType, entity, altLang)}`, altLang)}" />`
    ).join('\n');
    const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${localizedUrl(`/${entityType}/${getEntitySlug(entityType, entity, 'uz')}`, 'uz')}" />`;
    const image = imageData.image ? `
    <image:image>
      <image:loc>${escapeXml(imageData.image)}</image:loc>
      <image:title>${escapeXml(imageData.imageTitle || '')}</image:title>${imageData.imageCaption ? `
      <image:caption>${escapeXml(imageData.imageCaption)}</image:caption>` : ''}
    </image:image>` : '';

    return `
  <url>
    <loc>${loc}</loc>
${alternates}
${xDefault}
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${image}
  </url>`;
  }).join('');
}

function localizedUrl(path: string, lang: Lang) {
  return `${BASE_URL}${path === '/' ? `/${lang}` : `/${lang}${path}`}`;
}

function getCategorySlug(category: any, lang: Lang) {
  return getLocalizedText(category.slug, lang) || slugify(getLocalizedText(category.name, lang));
}

function getEntitySlug(entityType: string, entity: any, lang: Lang) {
  const source = entityType === 'blog' ? entity.title : entity.name;
  return `${getLocalizedText(entity.slug, lang) || slugify(getLocalizedText(source, lang))}-${entity.id}`;
}

function getLocalizedText(text: any, lang: Lang): string {
  if (!text) return '';
  if (typeof text === 'string') {
    try {
      const parsed = JSON.parse(text);
      if (parsed && (parsed.uz !== undefined || parsed.ru !== undefined || parsed.en !== undefined)) {
        return parsed[lang] || parsed.uz || '';
      }
    } catch {
      return text;
    }
  }
  if (typeof text === 'object') {
    return text[lang] || text.uz || '';
  }
  return String(text);
}

function slugify(text: string) {
  if (!text) return '';
  return text.toString().toLowerCase().trim()
    .replace(/['`']/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeXml(str: string) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getFallbackProducts() {
  return [
    { id: 1, name: { uz: 'Midnight Chronograph', ru: 'Midnight Chronograph', en: 'Midnight Chronograph' }, category: 'soatlar', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop', shortDescription: { uz: 'Eksklyuziv premium soat.', ru: 'Eksklyuziv premium soat.', en: 'Exclusive premium watch.' } },
  ];
}

function getFallbackCategories() {
  return [
    { slug: 'soatlar', name: { uz: 'Soatlar', ru: 'Soatlar', en: 'Watches' } },
    { slug: 'sumkalar', name: { uz: 'Sumkalar', ru: 'Sumkalar', en: 'Bags' } },
    { slug: 'parfyumeriya', name: { uz: 'Parfyumeriya', ru: 'Parfyumeriya', en: 'Perfume' } },
  ];
}
