import InfoPage from '../../../components/InfoPage';
import { getInfoContent } from '../../../lib/infoContent';
import { SEO_LANGUAGES } from '../../../lib/seoLanguage';
import { SITE_URL } from '../../../lib/siteUrl';

// Statik kontent — build vaqtida oldindan generatsiya + 1 soat keshlanadi
export const revalidate = 3600;
export function generateStaticParams() {
  return [{ lang: 'uz' }, { lang: 'ru' }, { lang: 'en' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const activeLang = lang || 'uz';
  const content = getInfoContent('faq', activeLang);
  const languages: Record<string, string> = {};
  for (const altLang of SEO_LANGUAGES) {
    languages[altLang] = `${SITE_URL}/${altLang}/faq`;
  }
  languages['x-default'] = languages.uz;

  return {
    title: content.title,
    description: content.description,
    keywords: [
      'luxecore',
      'luxecore uz',
      'luxe-core.uz',
      'luxe core toshkent',
      'lux core optom',
      'люкскор ташкент',
      'faq',
      'optom qadoqlash',
    ],
    alternates: {
      canonical: `${SITE_URL}/${activeLang}/faq`,
      languages,
    },
  };
}

export default async function FaqPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const content = getInfoContent('faq', lang || 'uz');

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.sections.map((section) => ({
      '@type': 'Question',
      name: section.heading,
      acceptedAnswer: {
        '@type': 'Answer',
        text: section.body,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <InfoPage topic="faq" />
    </>
  );
}
