import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SITE_URL } from '../../lib/siteUrl';
import { getLocalizedText } from '../../lib/i18nUtils';
import { productSlug } from '../../lib/slugify';
import { findCategoryByValue } from '../../lib/categoryUtils';
import type { Category } from '../../types';

const BASE_URL = SITE_URL;

export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let products: any[] = [];
  let categories: Category[] = [];

  try {
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const [productsResult, categoriesResult] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('categories').select('*'),
      ]);
      if (productsResult.error) throw productsResult.error;
      if (categoriesResult.error) throw categoriesResult.error;
      products = productsResult.data || [];
      categories = (categoriesResult.data || []) as Category[];
    }
  } catch (err) {
    console.error('Catalog Feed Supabase Error:', err);
  }

  if (products.length === 0) products = getFallbackProducts();
  if (categories.length === 0) categories = getFallbackCategories();
  const fallbackCategories = getFallbackCategories();

  const xmlItems = products.map((product) => {
    const category = findCategoryByValue(product.category, categories);
    const fallbackCategory = findCategoryByValue(product.category, fallbackCategories);
    const googleProductCategory =
      category?.googleProductCategory ||
      fallbackCategory?.googleProductCategory ||
      product.googleProductCategory ||
      'Apparel & Accessories';

    return `
    <item>
      <g:id>${product.id}</g:id>
      <g:title><![CDATA[${getLocalizedText(product.name, 'uz')}]]></g:title>
      <g:description><![CDATA[${getLocalizedText(product.shortDescription || product.description || product.name, 'uz')}]]></g:description>
      <g:link>${BASE_URL}/uz/product/${productSlug(product, 'uz')}</g:link>
      <g:image_link>${product.image}</g:image_link>
      <g:brand>LUXECORE</g:brand>
      <g:condition>new</g:condition>
      <g:availability>${(product.stock && product.stock > 0) ? 'in stock' : 'out of stock'}</g:availability>
      <g:price>${product.price} UZS</g:price>
      <g:google_product_category>${escapeXml(googleProductCategory)}</g:google_product_category>
    </item>
    `;
  }).join('');

  const xmlFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>LUXECORE Product Feed</title>
    <link>${BASE_URL}</link>
    <description>Premium mahsulotlar LUXECORE dan</description>
    ${xmlItems}
  </channel>
</rss>`;

  return new NextResponse(xmlFeed, {
    status: 200,
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

function getFallbackProducts() {
  return [
    { id: 1, name: 'Midnight Chronograph', category: 'Soatlar', price: 12500000, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop', shortDescription: 'Olmos qoplamali premium soat', stock: 5 },
    { id: 2, name: 'Royal Leather Bag', category: 'Sumkalar', price: 4800000, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop', shortDescription: 'Italiya charmidan premium sumka', stock: 5 },
  ];
}

function getFallbackCategories(): Category[] {
  return [
    {
      id: 'fallback_watches',
      name: 'Soatlar',
      slug: 'soatlar',
      image: '',
      googleProductCategory: 'Apparel & Accessories > Jewelry > Watches',
    },
    {
      id: 'fallback_bags',
      name: 'Sumkalar',
      slug: 'sumkalar',
      image: '',
      googleProductCategory: 'Apparel & Accessories > Handbags, Wallets & Cases',
    },
  ];
}

function escapeXml(value: string) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
