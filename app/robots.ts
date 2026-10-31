import type { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/siteUrl';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
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
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
