import HomeClient from './HomeClient';
import { SITE_URL } from '../../lib/siteUrl';
import { loadApprovedReviews } from '../../lib/reviews';
import type { Review } from '../../types';

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const activeLang = lang || 'uz';
  const reviewsData = await loadApprovedReviews(6).catch(() => [] as Review[]);
  const reviews: Review[] = reviewsData
    .filter((review) => typeof review.comment === 'string' && review.comment.trim().length > 0)
    .slice(0, 3) as Review[];

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LUXECORE',
    url: SITE_URL,
    inLanguage: activeLang,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/${activeLang}?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <HomeClient featuredReviews={reviews} />
    </>
  );
}
