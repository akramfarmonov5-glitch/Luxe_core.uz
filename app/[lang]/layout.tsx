import '../globals.css';
import Script from 'next/script';
import { Providers } from './Providers';
import ClientLayout from './ClientLayout';
import { SITE_URL, BRAND_ALTERNATE_NAMES } from '../../lib/siteUrl';
import { fetchGlobalData } from '../../lib/globalData';

const siteUrl = SITE_URL;
const logoUrl = `${siteUrl}/logo.jpg`;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = lang || 'uz';
  const metadataMap: Record<string, any> = {
    uz: {
      title: 'Sovg\'a qutilari, Paketlar, Qadoqlash, Bir martalik idishlar va Yangi Yil 2027 optom (ulgurji) — LUXECORE (luxe-core.uz)',
      description: 'LUXECORE (luxe-core.uz) — optom sovg\'a qutilari, yangi yil uchun 2027 yil qutilari, to\'y va sarpo qutilari, kraft, Zip-Lock, BOPP paketlar, qadoqlash materiallari hamda bir martalik idishlar O\'rikzor omboridan ulgurji narxlarda. Toshkent va viloyatlarga tezkor yetkazib berish.',
      keywords: [
        'luxecore',
        'luxecore uz',
        'luxe-core.uz',
        'luxe core toshkent',
        'lux core optom',
        'люкскор ташкент',
        'optom',
        'paketlar',
        'paketlar optom',
        'qadoqlash',
        'qadoqlash materiallari',
        'bir martalik idishlar',
        'bir martalik idishlar optom',
        'odnorazoviy idishlar',
        'yangi yil uchun',
        '2027 yil',
        'yangi yil 2027 qutilari',
        'sovg\'a qutilari optom',
        'sovg\'a qutisi',
        'to\'y qutilari',
        'sarpo qutisi',
        'kraft paket',
        'zip lock paket',
        'bopp paket',
        'ulgurji savdo',
        'O\'rikzor optom',
        'Toshkent',
      ],
    },
    ru: {
      title: 'Подарочные коробки, Пакеты, Упаковка, Одноразовая посуда и Новогодняя упаковка 2027 оптом — LUXECORE (luxe-core.uz)',
      description: 'LUXECORE (luxe-core.uz / ЛюксКор) — оптом подарочные и свадебные коробки, новогодняя упаковка на 2027 год, крафт, Zip-Lock и БОПП пакеты, упаковочные материалы и одноразовая посуда со склада Урикзор в Ташкенте. Быстрая доставка по всему Узбекистану.',
      keywords: [
        'luxecore',
        'luxecore uz',
        'luxe-core.uz',
        'luxe core toshkent',
        'lux core optom',
        'люкскор ташкент',
        'люкскор урикзор',
        'оптом',
        'пакеты оптом',
        'упаковка оптом',
        'одноразовая посуда оптом',
        'новогодняя упаковка 2027',
        'подарки на новый год 2027',
        'подарочные коробки оптом',
        'свадебные коробки сарпо',
        'крафт пакеты ташкент',
        'зип лок пакеты для маркетплейсов',
        'БОПП пакеты',
        'контейнеры для еды оптом',
        'Урикзор оптом',
        'Ташкент',
      ],
    },
    en: {
      title: 'Wholesale Gift Boxes, Packaging, Bags, Disposable Tableware & New Year 2027 — LUXECORE (luxe-core.uz)',
      description: 'LUXECORE (luxe-core.uz) — wholesale gift boxes, New Year 2027 holiday packaging, wedding boxes, Kraft & Zip-Lock bags, packaging supplies and disposable tableware from Urikzor warehouse in Tashkent.',
      keywords: [
        'luxecore',
        'luxecore uz',
        'luxe-core.uz',
        'luxe core toshkent',
        'lux core optom',
        'люкскор ташкент',
        'wholesale packaging',
        'gift boxes wholesale',
        'kraft bags',
        'zip lock bags',
        'disposable tableware',
        'New Year 2027 boxes',
        'Tashkent',
        'Uzbekistan',
      ],
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
        { url: '/favicon.ico?v=20261112', sizes: 'any' },
        { url: '/favicon-16x16.png?v=20261112', type: 'image/png', sizes: '16x16' },
        { url: '/favicon-32x32.png?v=20261112', type: 'image/png', sizes: '32x32' },
        { url: '/favicon-48x48.png?v=20261112', type: 'image/png', sizes: '48x48' },
        { url: '/favicon.png?v=20261112', type: 'image/png', sizes: '32x32' },
      ],
      apple: [
        { url: '/apple-touch-icon.png?v=20261112', sizes: '180x180', type: 'image/png' },
      ],
      shortcut: ['/favicon.ico?v=20261112'],
    },
    manifest: '/manifest.webmanifest',
    openGraph: {
      type: 'website',
      url: `${siteUrl}/${l}`,
      siteName: 'LUXECORE (luxe-core.uz)',
      title: metadata.title,
      description: metadata.description,
      images: [
        {
          url: logoUrl,
          width: 1024,
          height: 1024,
          alt: 'LUXECORE (luxe-core.uz) logo',
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
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || 'c60e9863ba102b04',
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
  // GA4: `lib/analytics.ts` dagi barcha ecommerce eventlari faqat shu skript
  // yuklanganda ishlaydi. Env berilmasa — skript umuman chiqmaydi.
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_ID;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LUXECORE (luxe-core.uz)',
    alternateName: BRAND_ALTERNATE_NAMES,
    url: siteUrl,
    logo: logoUrl,
    sameAs: ['https://t.me/luxecoreuz', 'https://instagram.com/luxe_core_uz'],
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
        <link rel="icon" href="/favicon.ico?v=20261112" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=20261112" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=20261112" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png?v=20261112" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=20261112" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        {gaMeasurementId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaMeasurementId}');`}
            </Script>
          </>
        )}
        <Providers initialData={initialData} lang={lang || 'uz'}>
          <ClientLayout lang={lang}>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
