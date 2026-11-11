import BlogIndexClient from './BlogIndexClient';
import { SITE_URL } from '../../../lib/siteUrl';
import { SEO_LANGUAGES } from '../../../lib/seoLanguage';
import { fetchGlobalData } from '../../../lib/globalData';
import { getLocalizedText } from '../../../lib/i18nUtils';
import { blogSlug } from '../../../lib/slugify';

export const revalidate = 120;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const activeLang = lang || 'uz';

  const titles: Record<string, string> = {
    uz: "B2B Ulgurji Blog va Maqolalar — Qadoqlash sirlari | LUXECORE",
    ru: 'Блог об оптовой упаковке и B2B поставках | LUXECORE',
    en: 'Wholesale Packaging Blog & Business Guides | LUXECORE',
  };

  const descriptions: Record<string, string> = {
    uz: "Yangi yil 2027 sovg'a qutilari, Kraft va Zip-Lock paketlar, bir martalik idishlar va sarpo qutilarini O'rikzor omboridan arzon ulgurji xarid qilish bo'yicha ekspert maqolalar.",
    ru: 'Экспертные статьи и руководства по закупке новогодней упаковки 2027, крафт и Zip-Lock пакетов, одноразовой посуды оптом со склада Урикзор.',
    en: 'Expert articles on wholesale New Year 2027 boxes, Kraft bags, disposable tableware, and packaging sourcing in Tashkent.',
  };

  const languages: Record<string, string> = {};
  for (const altLang of SEO_LANGUAGES) {
    languages[altLang] = `${SITE_URL}/${altLang}/blog`;
  }
  languages['x-default'] = `${SITE_URL}/uz/blog`;

  return {
    title: titles[activeLang] || titles.uz,
    description: descriptions[activeLang] || descriptions.uz,
    alternates: {
      canonical: `${SITE_URL}/${activeLang}/blog`,
      languages,
    },
    openGraph: {
      title: titles[activeLang] || titles.uz,
      description: descriptions[activeLang] || descriptions.uz,
      url: `${SITE_URL}/${activeLang}/blog`,
      type: 'website',
      siteName: 'LUXECORE (luxe-core.uz)',
      images: [{ url: `${SITE_URL}/logo.jpg`, alt: 'LUXECORE Blog' }],
    },
  };
}

export default async function BlogIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const activeLang = lang || 'uz';
  const { blogPosts } = await fetchGlobalData();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'LUXECORE B2B Blog',
    url: `${SITE_URL}/${activeLang}/blog`,
    blogPost: blogPosts.slice(0, 20).map((post) => ({
      '@type': 'BlogPosting',
      headline: getLocalizedText(post.title, activeLang),
      url: `${SITE_URL}/${activeLang}/blog/${blogSlug(post as any, activeLang)}`,
      datePublished: post.date,
      image: post.image,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogIndexClient lang={activeLang} />
    </>
  );
}
