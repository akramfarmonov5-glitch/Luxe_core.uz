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
      title: 'LUXECORE | Premium Store',
      description: 'LUXECORE - O\'zbekistondagi premium onlayn do\'kon. Soatlar, sumkalar, parfyumeriya va eksklyuziv aksessuarlarni buyurtma qiling.',
    },
    ru: {
      title: 'LUXECORE | Premium Store',
      description: 'LUXECORE - premium onlayn do\'kon. Chasy, sumki, parfyumeriya va eksklyuziv aksessuarlar.',
    },
    en: {
      title: 'LUXECORE | Premium Store',
      description: 'LUXECORE is a premium online store in Uzbekistan for watches, bags, perfume, and exclusive accessories.',
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
