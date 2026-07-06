import InfoPage from '../../../components/InfoPage';
import { getInfoContent } from '../../../lib/infoContent';
import { SEO_LANGUAGES } from '../../../lib/seoLanguage';

// Statik kontent — build vaqtida oldindan generatsiya + 1 soat keshlanadi
export const revalidate = 3600;
export function generateStaticParams() {
  return [{ lang: 'uz' }, { lang: 'ru' }, { lang: 'en' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const content = getInfoContent('terms', lang || 'uz');
  const languages: Record<string, string> = {};
  for (const altLang of SEO_LANGUAGES) {
    languages[altLang] = `/${altLang}/terms`;
  }
  languages['x-default'] = languages.uz;

  return {
    title: `${content.title} | LUXECORE`,
    description: content.description,
    alternates: {
      canonical: `/${lang || 'uz'}/terms`,
      languages,
    },
  };
}

export default function TermsPage() {
  return <InfoPage topic="terms" />;
}
