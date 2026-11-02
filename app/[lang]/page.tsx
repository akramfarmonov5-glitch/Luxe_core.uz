import HomeClient from './HomeClient';
import { SITE_URL } from '../../lib/siteUrl';
import { loadApprovedReviews } from '../../lib/reviews';
import type { Review } from '../../types';

// Bosh sahifa 120 soniya keshlanadi (global ma'lumot keshi bilan mos)
export const revalidate = 120;

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

  const storeSchema = {
    '@context': 'https://schema.org',
    '@type': 'WholesaleStore',
    name: 'LUXECORE — Ulgurji Sovg\'a Qutilari va Qadoqlash Materiallari',
    url: `${SITE_URL}/${activeLang}`,
    logo: `${SITE_URL}/logo.jpg`,
    image: `${SITE_URL}/logo.jpg`,
    description:
      activeLang === 'ru'
        ? 'Оптовый склад подарочных коробок, новогодней упаковки 2027, свадебных сарпо-сундуков, крафт и Zip-Lock пакетов на рынке Урикзор (Ташкент).'
        : 'Sovg\'a qutilari, Yangi Yil 2027 qadoqlari, To\'y va Sarpo qutilari, Kraft va Zip-Lock paketlar ulgurji ombori (Toshkent, O\'rikzor).',
    priceRange: '650 UZS - 95 000 UZS',
    address: {
      '@type': 'PostalAddress',
      streetAddress: "O'rikzor savdo majmuasi",
      addressLocality: 'Toshkent',
      addressCountry: 'UZ',
    },
    areaServed: 'UZ',
    sameAs: ['https://t.me/luxecoreuz'],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity:
      activeLang === 'ru'
        ? [
            {
              '@type': 'Question',
              name: 'Какой минимальный заказ в оптовом магазине LUXECORE?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Минимальная сумма заказа составляет 200 000 сум, а товары отпускаются упаковками (от 12, 50 или 100 штук в зависимости от модели).',
              },
            },
            {
              '@type': 'Question',
              name: 'Есть ли скидки при крупном опте (500+ и 1000+ штук)?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Да, при заказе от 500 штук одного наименования автоматически действует скидка -5%, а от 1000 штук — VIP-скидка -10%.',
              },
            },
            {
              '@type': 'Question',
              name: 'Как быстро доставляются заказы по Ташкенту и в регионы?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Со склада Урикзор по Ташкенту заказы доставляются за 2 часа (бесплатно от 2 млн сум), а в области Узбекистана — за 24 часа через BTS/Fargo или такси.',
              },
            },
          ]
        : [
            {
              '@type': 'Question',
              name: 'LUXECORE ulgurji do\'konida minimal buyurtma qancha?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Minimal buyurtma summasi 200 000 so\'m, mahsulotlar esa o\'z qadog\'iga qarab pachkalab (12, 50 yoki 100 donadan boshlab) sotiladi.',
              },
            },
            {
              '@type': 'Question',
              name: 'Katta hajmdagi buyurtmalarga (500+ va 1000+ dona) chegirma bormi?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Ha, bitta mahsulotdan 500+ dona olganda savatchada avtomatik -5%, 1000+ dona olganda esa -10% VIP ulgurji chegirma hisoblanadi.',
              },
            },
            {
              '@type': 'Question',
              name: 'Toshkent va viloyatlarga yetkazib berish qancha vaqt oladi?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'O\'rikzor omborimizdan Toshkent shahri bo\'ylab 2 soat ichida (2 mln so\'mdan yuqori buyurtmalarga bepul), barcha viloyatlarga esa 24 soat (1 kun) ichida BTS/Fargo pochta yoki taksi orqali yetkazib beriladi.',
              },
            },
          ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomeClient featuredReviews={reviews} />
    </>
  );
}
