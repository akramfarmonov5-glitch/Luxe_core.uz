import CatalogClient from './CatalogClient';
import { SITE_URL } from '../../../lib/siteUrl';
import { SEO_LANGUAGES } from '../../../lib/seoLanguage';
import { fetchGlobalData } from '../../../lib/globalData';
import { getLocalizedText } from '../../../lib/i18nUtils';
import { productSlug } from '../../../lib/slugify';

export const revalidate = 120;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const activeLang = lang || 'uz';

  const titles: Record<string, string> = {
    uz: "Ulgurji (Optom) Katalog — Sovg'a qutilari, Yangi Yil 2027, Paketlar | LUXECORE",
    ru: 'Оптовый каталог — Подарочные коробки, Новый год 2027, Пакеты | LUXECORE',
    en: 'Wholesale Packaging Catalog — Gift Boxes, Bags, New Year 2027 | LUXECORE',
  };

  const descriptions: Record<string, string> = {
    uz: "LUXECORE to'liq B2B ulgurji katalogi. 100 donadan boshlab optom narxlar, 500+ (-5%) va 1000+ (-10% VIP) chegirmalar, Excel prays-list va Toshkent bo'ylab 2 soatda yetkazib berish.",
    ru: 'Полный оптовый каталог LUXECORE со склада Урикзор. Цены от 100 штук, скидки до -10%, прайс-лист Excel и доставка по Ташкенту за 2 часа.',
    en: 'Complete LUXECORE wholesale packaging catalog from Urikzor warehouse, Tashkent. Tiered bulk discounts up to -10%, downloadable Excel price list.',
  };

  const languages: Record<string, string> = {};
  for (const altLang of SEO_LANGUAGES) {
    languages[altLang] = `${SITE_URL}/${altLang}/catalog`;
  }
  languages['x-default'] = `${SITE_URL}/uz/catalog`;

  return {
    title: titles[activeLang] || titles.uz,
    description: descriptions[activeLang] || descriptions.uz,
    alternates: {
      canonical: `${SITE_URL}/${activeLang}/catalog`,
      languages,
    },
    openGraph: {
      title: titles[activeLang] || titles.uz,
      description: descriptions[activeLang] || descriptions.uz,
      url: `${SITE_URL}/${activeLang}/catalog`,
      type: 'website',
      siteName: 'LUXECORE (luxe-core.uz)',
      images: [{ url: `${SITE_URL}/logo.jpg`, alt: 'LUXECORE Catalog' }],
    },
  };
}

export default async function CatalogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const activeLang = lang || 'uz';
  const { products } = await fetchGlobalData();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: activeLang === 'ru' ? 'Оптовый каталог LUXECORE' : 'LUXECORE Ulgurji Katalogi',
    url: `${SITE_URL}/${activeLang}/catalog`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 50).map((p, index) => ({
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
      <CatalogClient />
    </>
  );
}
