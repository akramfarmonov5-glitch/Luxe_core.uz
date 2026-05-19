import { supabase } from '../../../../lib/supabaseClient';
import ProductClient from './ProductClient';
import { getLocalizedText } from '../../../../lib/i18nUtils';
import { MOCK_PRODUCTS } from '../../../../constants';
import { SITE_URL } from '../../../../lib/siteUrl';
import { productSlug } from '../../../../lib/slugify';
import { SEO_LANGUAGES } from '../../../../lib/seoLanguage';
import { loadApprovedProductReviews } from '../../../../lib/reviews';
import type { Review } from '../../../../types';

function resolveProductId(raw: string): string {
  if (!isNaN(Number(raw))) return raw;
  if (raw.includes('-')) {
    const parts = raw.split('-');
    return parts[parts.length - 1];
  }
  return raw;
}

async function loadProduct(rawId: string) {
  const productId = resolveProductId(rawId);
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();
  return product || MOCK_PRODUCTS.find((item) => item.id === Number(productId)) || null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string, lang: string }> }) {
  try {
    const { id, lang } = await params;
    const metadataProduct = await loadProduct(id);
    if (!metadataProduct) return { title: 'Mahsulot topilmadi | LUXECORE' };

    const activeLang = lang || 'uz';
    const productName = getLocalizedText(metadataProduct.name, activeLang);
    const productDesc = (
      getLocalizedText(metadataProduct.description, activeLang)
      || getLocalizedText(metadataProduct.shortDescription, activeLang)
      || `${productName} - LUXECORE premium kolleksiyasidan`
    ).substring(0, 160);

    const title = `${productName} | LUXECORE`;
    const canonicalPath = `/${activeLang}/product/${productSlug(metadataProduct as any, activeLang)}`;
    const languages: Record<string, string> = {};
    for (const altLang of SEO_LANGUAGES) {
      languages[altLang] = `/${altLang}/product/${productSlug(metadataProduct as any, altLang)}`;
    }
    languages['x-default'] = languages.uz;

    const ogImages = metadataProduct.image
      ? [{ url: metadataProduct.image, alt: productName }]
      : [];

    return {
      title,
      description: productDesc,
      alternates: {
        canonical: canonicalPath,
        languages,
      },
      openGraph: {
        title,
        description: productDesc,
        url: `${SITE_URL}${canonicalPath}`,
        type: 'website',
        siteName: 'LUXECORE',
        images: ogImages,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: productDesc,
        images: metadataProduct.image ? [metadataProduct.image] : [],
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
    image: [product.image, ...(product.images || [])].filter(Boolean),
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
