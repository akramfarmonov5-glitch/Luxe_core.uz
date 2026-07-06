import InfoPage from '../../../components/InfoPage';
import { getInfoContent } from '../../../lib/infoContent';
import { SEO_LANGUAGES } from '../../../lib/seoLanguage';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const content = getInfoContent('delivery', lang || 'uz');
  const languages: Record<string, string> = {};
  for (const altLang of SEO_LANGUAGES) {
    languages[altLang] = `/${altLang}/delivery`;
  }
  languages['x-default'] = languages.uz;

  return {
    title: `${content.title} | LUXECORE`,
    description: content.description,
    alternates: {
      canonical: `/${lang || 'uz'}/delivery`,
      languages,
    },
  };
}

export default function DeliveryPage() {
  return <InfoPage topic="delivery" />;
}
