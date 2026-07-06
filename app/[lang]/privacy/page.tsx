import InfoPage from '../../../components/InfoPage';
import { getInfoContent } from '../../../lib/infoContent';
import { SEO_LANGUAGES } from '../../../lib/seoLanguage';

// Statik kontent — 1 soat keshlanadi (har so'rovda qayta render qilinmaydi)
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const content = getInfoContent('privacy', lang || 'uz');
  const languages: Record<string, string> = {};
  for (const altLang of SEO_LANGUAGES) {
    languages[altLang] = `/${altLang}/privacy`;
  }
  languages['x-default'] = languages.uz;

  return {
    title: `${content.title} | LUXECORE`,
    description: content.description,
    alternates: {
      canonical: `/${lang || 'uz'}/privacy`,
      languages,
    },
  };
}

export default function PrivacyPage() {
  return <InfoPage topic="privacy" />;
}
