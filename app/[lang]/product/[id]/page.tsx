import { supabase, hasSupabaseCredentials } from '../../../../lib/supabaseClient';
import ProductClient from './ProductClient';
import { getLocalizedText } from '../../../../lib/i18nUtils';
import { MOCK_PRODUCTS } from '../../../../constants';
import { SITE_URL } from '../../../../lib/siteUrl';
import { productSlug } from '../../../../lib/slugify';
import { SEO_LANGUAGES } from '../../../../lib/seoLanguage';
import { loadApprovedProductReviews } from '../../../../lib/reviews';
import type { Review } from '../../../../types';

function resolveNumericProductId(raw: string): number | null {
  if (/^\d+$/.test(raw)) return Number(raw);
  const match = raw.match(/-(\d+)$/);
  if (match) return Number(match[1]);
  return null;
}

function toAbsoluteUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

async function loadProduct(rawId: string) {
  const numericId = resolveNumericProductId(rawId);

  if (hasSupabaseCredentials) {
    if (numericId !== null) {
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', numericId)
        .maybeSingle();
      if (product) return product;
    }

    const { data: bySlug } = await supabase
      .from('products')
      .select('*')
      .ilike('slug', `%${rawId}%`)
      .limit(1);
    if (bySlug && bySlug.length > 0) return bySlug[0];
  }

  return (
    MOCK_PRODUCTS.find((item) => {
      if (numericId !== null && item.id === numericId) return true;
      const slugUz = getLocalizedText(item.slug, 'uz');
      const slugRu = getLocalizedText(item.slug, 'ru');
      const slugEn = getLocalizedText(item.slug, 'en');
      return slugUz === rawId || slugRu === rawId || slugEn === rawId;
    }) || null
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string, lang: string }> }) {
  try {
    const { id, lang } = await params;
    const metadataProduct = await loadProduct(id);
    if (!metadataProduct) return { title: 'Mahsulot topilmadi | LUXECORE' };

    const activeLang = lang || 'uz';
    const productName = getLocalizedText(metadataProduct.name, activeLang);
    const minQty = Number(metadataProduct.itemsPerPackage) > 1 ? Number(metadataProduct.itemsPerPackage) : 100;
    const priceStr = metadataProduct.formattedPrice || `${Number(metadataProduct.price || 0).toLocaleString('uz-UZ')} UZS`;
    const baseDesc =
      getLocalizedText(metadataProduct.description, activeLang)
      || getLocalizedText(metadataProduct.shortDescription, activeLang)
      || `${productName}`;
    const productDesc = (
      activeLang === 'ru'
        ? `${baseDesc} Оптовая цена: ${priceStr} (мин. заказ ${minQty} шт). Купить оптом со склада Урикзор в Ташкенте — LUXECORE (luxe-core.uz).`
        : `${baseDesc} Optom narxi: ${priceStr} (min. buyurtma ${minQty} dona). Toshkent O'rikzor omboridan ulgurji xarid — LUXECORE (luxe-core.uz).`
    ).substring(0, 165);

    const title =
      activeLang === 'ru'
        ? `${productName} — купить оптом (${priceStr}) | LUXECORE (luxe-core.uz)`
        : `${productName} — optom ulgurji narxda (${priceStr}) | LUXECORE (luxe-core.uz)`;
    const canonicalPath = `/${activeLang}/product/${productSlug(metadataProduct as any, activeLang)}`;
    const languages: Record<string, string> = {};
    for (const altLang of SEO_LANGUAGES) {
      languages[altLang] = `${SITE_URL}/${altLang}/product/${productSlug(metadataProduct as any, altLang)}`;
    }
    languages['x-default'] = languages.uz;

    const absImage = toAbsoluteUrl(metadataProduct.image);
    const ogImages = absImage
      ? [{ url: absImage, alt: productName }]
      : [];

    return {
      title,
      description: productDesc,
      alternates: {
        canonical: `${SITE_URL}${canonicalPath}`,
        languages,
      },
      openGraph: {
        title,
        description: productDesc,
        url: `${SITE_URL}${canonicalPath}`,
        type: 'website',
        siteName: 'LUXECORE (luxe-core.uz)',
        images: ogImages,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: productDesc,
        images: absImage ? [absImage] : [],
      },
    };
  } catch (error) {
    return { title: 'Mahsulot | LUXECORE' };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string, lang: string }> }) {
  const { id, lang } = await params;
  const activeLang = lang || 'uz';
  const product = await loadProduct(id);
  const reviews = product ? await loadApprovedProductReviews(Number(product.id)) : [];
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const jsonLd = product ? {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: getLocalizedText(product.name, activeLang),
    image: [product.image, ...(product.images || [])].map(toAbsoluteUrl).filter(Boolean),
    description: getLocalizedText(product.shortDescription || product.description || product.name, activeLang),
    sku: `LUXE-${product.id}`,
    brand: { '@type': 'Brand', name: 'LUXECORE' },
    category: getLocalizedText(product.category, activeLang),
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/${activeLang}/product/${productSlug(product as any, activeLang)}`,
      priceCurrency: 'UZS',
      price: product.price,
      availability: (product.stock === undefined || product.stock === null || product.stock > 0)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'LUXECORE' },
    },
    ...(reviews.length > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: Number(averageRating.toFixed(1)),
        reviewCount: reviews.length,
      },
      review: reviews.slice(0, 5).map((review) => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: review.user_name || 'Customer' },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: 5,
        },
        reviewBody: review.comment || undefined,
      })),
    } : {}),
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductClient id={id} />
    </>
  );
}
