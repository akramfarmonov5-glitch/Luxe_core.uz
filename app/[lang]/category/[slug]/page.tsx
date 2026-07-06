import { supabase, hasSupabaseCredentials } from '../../../../lib/supabaseClient';
import CategoryClient from './CategoryClient';
import { getLocalizedText } from '../../../../lib/i18nUtils';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../../../../constants';
import { SITE_URL } from '../../../../lib/siteUrl';
import { SEO_LANGUAGES } from '../../../../lib/seoLanguage';
import { slugify, productSlug } from '../../../../lib/slugify';
import type { Category, Product } from '../../../../types';

function getCategorySlug(category: Category, lang: string): string {
  return getLocalizedText(category.slug, lang) || slugify(getLocalizedText(category.name, lang));
}

function findCategoryBySlug(slug: string, categories: Category[]): Category | undefined {
  return categories.find((cat) => {
    const slugs = SEO_LANGUAGES.map((l) => getCategorySlug(cat, l));
    return slugs.includes(slug) || slugify(getLocalizedText(cat.name, 'uz')) === slug;
  });
}

async function loadCategoryData() {
  // Mock data faqat Supabase sozlanmagan (lokal dev) muhitda ishlatiladi
  if (!hasSupabaseCredentials) {
    return { categories: MOCK_CATEGORIES, products: MOCK_PRODUCTS };
  }
  const [{ data: categoriesData }, { data: productsData }] = await Promise.all([
    supabase.from('categories').select('*'),
    supabase.from('products').select('*'),
  ]);
  const categories: Category[] = (categoriesData as unknown as Category[]) || [];
  const products: Product[] = (productsData as unknown as Product[]) || [];
  return { categories, products };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string, lang: string }> }) {
  try {
    const { slug, lang } = await params;
    const activeLang = lang || 'uz';
    const { categories } = await loadCategoryData();

    const category = findCategoryBySlug(slug, categories);
    const categoryName = category
      ? getLocalizedText(category.name, activeLang)
      : slug;
    const description = (
      category ? getLocalizedText(category.description, activeLang) : ''
    ) || `${categoryName} - LUXECORE premium kolleksiyasi. Eksklyuziv mahsulotlarni buyurtma qiling.`;

    const title = `${categoryName} | LUXECORE`;
    const canonicalSlug = category ? getCategorySlug(category, activeLang) : slug;
    const canonicalPath = `/${activeLang}/category/${canonicalSlug}`;

    const languages: Record<string, string> = {};
    for (const altLang of SEO_LANGUAGES) {
      const altSlug = category ? getCategorySlug(category, altLang) : slug;
      languages[altLang] = `/${altLang}/category/${altSlug}`;
    }
    languages['x-default'] = languages.uz;

    const ogImage = category?.image;

    return {
      title,
      description: description.substring(0, 160),
      alternates: {
        canonical: canonicalPath,
        languages,
      },
      openGraph: {
        title,
        description,
        url: `${SITE_URL}${canonicalPath}`,
        type: 'website',
        siteName: 'LUXECORE',
        images: ogImage ? [{ url: ogImage, alt: categoryName }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch (error) {
    return { title: 'Kategoriya | LUXECORE' };
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string, lang: string }> }) {
  const { slug, lang } = await params;
  const activeLang = lang || 'uz';
  const { categories, products } = await loadCategoryData();

  const category = findCategoryBySlug(slug, categories);
  const categoryName = category ? getLocalizedText(category.name, activeLang) : slug;
  const categoryDescription = category
    ? getLocalizedText(category.description, activeLang)
    : `${categoryName} - LUXECORE`;
  const canonicalSlug = category ? getCategorySlug(category, activeLang) : slug;
  const canonicalUrl = `${SITE_URL}/${activeLang}/category/${canonicalSlug}`;

  const categoryProducts = category
    ? products.filter((p) => {
        const productCategoryKey = getLocalizedText(p.category, 'uz');
        const categoryKeyUz = getCategorySlug(category, 'uz');
        return slugify(productCategoryKey) === categoryKeyUz
          || productCategoryKey === getLocalizedText(category.name, 'uz');
      })
    : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} - LUXECORE`,
    description: categoryDescription,
    url: canonicalUrl,
    image: category?.image,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: categoryProducts.length,
      itemListElement: categoryProducts.slice(0, 50).map((p, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/${activeLang}/product/${productSlug(p as any, activeLang)}`,
        name: getLocalizedText(p.name, activeLang),
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CategoryClient />
    </>
  );
}
