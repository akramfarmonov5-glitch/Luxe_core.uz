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
  const content = getInfoContent('returns', lang || 'uz');
  const languages: Record<string, string> = {};
  for (const altLang of SEO_LANGUAGES) {
    languages[altLang] = `/${altLang}/returns`;
  }
  languages['x-default'] = languages.uz;

  return {
    title: `${content.title} | LUXECORE`,
    description: content.description,
    alternates: {
      canonical: `/${lang || 'uz'}/returns`,
      languages,
    },
  };
}

export default function ReturnsPage() {
  return <InfoPage topic="returns" />;
}
