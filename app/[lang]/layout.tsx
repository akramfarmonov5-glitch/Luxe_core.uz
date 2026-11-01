import '../globals.css';
import { Providers } from './Providers';
import ClientLayout from './ClientLayout';
import { SITE_URL } from '../../lib/siteUrl';
import { fetchGlobalData } from '../../lib/globalData';

const siteUrl = SITE_URL;
const logoUrl = `${siteUrl}/logo.jpg`;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang || 'uz';
  const metadataMap: Record<string, any> = {
    uz: {
      title: 'Sovg\'a qutilari, Yangi Yil 2027 va Paketlar ulgurji narxda — LUXECORE',
      description: 'Sovg\'a qutilari, To\'y va Sarpo qutilari, Yangi Yil 2027 qadoqlari, Zip-Lock va Kraft paketlar ulgurji narxlarda. O\'rikzor omboridan butun O\'zbekistonga tezkor yetkazib beramiz.',
      keywords: ['sovg\'a qutisi', 'yangi yil 2027 qutilari', 'to\'y qutilari', 'sarpo qutisi', 'kraft paket', 'zip lock paket', 'bopp paket', 'ulgurji savdo', 'O\'rikzor', 'Toshkent'],
    },
    ru: {
      title: 'Подарочные коробки, Новогодняя упаковка 2027 и пакеты оптом — LUXECORE',
      description: 'Подарочные и свадебные коробки, новогодняя упаковка 2027, крафт и Zip-Lock пакеты по оптовым ценам со склада Урикзор. Доставка по всему Узбекистану.',
      keywords: ['подарочные коробки оптом', 'новогодняя упаковка 2027', 'свадебные коробки', 'крафт пакеты', 'зип лок пакеты', 'БОПП пакеты', 'Урикзор', 'Ташкент'],
    },
    en: {
      title: 'Gift Boxes, New Year 2027 Packaging & Bags Wholesale — LUXECORE',
      description: 'Wholesale gift boxes, wedding boxes, New Year 2027 packaging, Kraft & Zip-Lock bags directly from warehouse. Fast delivery across Uzbekistan.',
      keywords: ['wholesale gift boxes', 'packaging boxes', 'craft bags', 'zip lock bags', 'wedding boxes', 'holiday packaging', 'Tashkent', 'Uzbekistan'],
    },
  };
  const metadata = metadataMap[l] || metadataMap.uz;

  return {
    metadataBase: new URL(siteUrl),
    ...metadata,
    applicationName: 'LUXECORE',
    alternates: {
      canonical: `/${l}`,
      languages: {
        uz: '/uz',
        ru: '/ru',
        en: '/en',
        'x-default': '/uz',
      },
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon-16x16.png?v=20260430', type: 'image/png', sizes: '16x16' },
        { url: '/favicon-32x32.png?v=20260430', type: 'image/png', sizes: '32x32' },
        { url: '/favicon-48x48.png?v=20260430', type: 'image/png', sizes: '48x48' },
        { url: '/favicon.png?v=20260430', type: 'image/png', sizes: '32x32' },
      ],
      apple: [
        { url: '/apple-touch-icon.png?v=20260430', sizes: '180x180', type: 'image/png' },
      ],
      shortcut: ['/favicon.ico'],
    },
    manifest: '/manifest.webmanifest',
    openGraph: {
      type: 'website',
      url: `${siteUrl}/${l}`,
      siteName: 'LUXECORE',
      title: metadata.title,
      description: metadata.description,
      images: [
        {
          url: logoUrl,
          width: 1024,
          height: 1024,
          alt: 'LUXECORE logo',
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: metadata.title,
      description: metadata.description,
      images: [logoUrl],
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const initialData = await fetchGlobalData().catch(() => null);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LUXECORE',
    url: siteUrl,
    logo: logoUrl,
    sameAs: ['https://t.me/luxecoreuz'],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+998-99-644-84-44',
      contactType: 'customer service',
      areaServed: 'UZ',
      availableLanguage: ['Uzbek', 'Russian', 'English'],
    },
  };

  return (
    <html lang={lang || 'uz'} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0B1F1A" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=20260430" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=20260430" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png?v=20260430" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=20260430" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <Providers initialData={initialData}>
          <ClientLayout lang={lang}>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
