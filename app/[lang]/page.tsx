import HomeClient from './HomeClient';
import { SITE_URL } from '../../lib/siteUrl';
import { supabase } from '../../lib/supabaseClient';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../../constants';
import { getLocalizedText } from '../../lib/i18nUtils';
import { slugify, productSlug } from '../../lib/slugify';
import type { Category, Product } from '../../types';

async function loadHomeData() {
  const [{ data: categoriesData }, { data: productsData }] = await Promise.all([
    supabase.from('categories').select('*'),
    supabase.from('products').select('*'),
  ]);
  const categories: Category[] = (categoriesData && categoriesData.length > 0)
    ? (categoriesData as unknown as Category[])
    : MOCK_CATEGORIES;
  const products: Product[] = (productsData && productsData.length > 0)
    ? (productsData as unknown as Product[])
    : MOCK_PRODUCTS;
  return { categories, products };
}

function homeCopy(lang: string) {
  return ({
    uz: {
      title: 'LUXECORE — Premium onlayn do\'kon',
      intro: 'Eksklyuziv soatlar, sumkalar, parfyumeriya va aksessuarlar. O\'zbekistondagi ishonchli premium do\'kon.',
      categories: 'Kategoriyalar',
      featured: 'Tanlangan mahsulotlar',
    },
    ru: {
      title: 'LUXECORE — Премиум онлайн-магазин',
      intro: 'Эксклюзивные часы, сумки, парфюмерия и аксессуары. Надежный премиум-магазин в Узбекистане.',
      categories: 'Категории',
      featured: 'Избранные товары',
    },
    en: {
      title: 'LUXECORE — Premium online store',
      intro: 'Exclusive watches, bags, perfume and accessories. The trusted premium store in Uzbekistan.',
      categories: 'Categories',
      featured: 'Featured products',
    },
  } as const)[lang as 'uz' | 'ru' | 'en'] || ({
    title: 'LUXECORE',
    intro: '',
    categories: 'Categories',
    featured: 'Featured products',
  } as const);
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const activeLang = lang || 'uz';
  const { categories, products } = await loadHomeData();
  const copy = homeCopy(activeLang);

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LUXECORE',
    url: SITE_URL,
    inLanguage: activeLang,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/${activeLang}?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const featuredProducts = products.slice(0, 8);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* Bot-readable content; hidden visually but present in HTML for crawlers */}
      <div className="sr-only" aria-hidden="true">
        <h1>{copy.title}</h1>
        <p>{copy.intro}</p>

        <h2>{copy.categories}</h2>
        <ul>
          {categories.map((c) => {
            const slug = getLocalizedText(c.slug, activeLang) || slugify(getLocalizedText(c.name, activeLang));
            return (
              <li key={String(c.id)}>
                <a href={`/${activeLang}/category/${slug}`}>{getLocalizedText(c.name, activeLang)}</a>
              </li>
            );
          })}
        </ul>

        <h2>{copy.featured}</h2>
        <ul>
          {featuredProducts.map((p) => (
            <li key={p.id}>
              <a href={`/${activeLang}/product/${productSlug(p as any, activeLang)}`}>
                {getLocalizedText(p.name, activeLang)}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <HomeClient />
    </>
  );
}
