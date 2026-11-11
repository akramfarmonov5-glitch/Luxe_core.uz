import type { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/siteUrl';

const PRIVATE_PATHS = [
  '/api/',
  '/uz/admin',
  '/ru/admin',
  '/en/admin',
  '/uz/checkout',
  '/ru/checkout',
  '/en/checkout',
  '/uz/profile',
  '/ru/profile',
  '/en/profile',
  '/uz/tracking',
  '/ru/tracking',
  '/en/tracking',
];

/**
 * /robots.txt yagona manbasi — `public/robots.txt` olib tashlandi
 * (ikkita fayl bir yo'l uchun raqobatlashardi va qoidalari har xil edi).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        // Googlebot rasm/mobil indeksatsiyasi uchun to'liq ruxsat.
        userAgent: ['Googlebot', 'Googlebot-Image'],
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: 'YandexBot',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
