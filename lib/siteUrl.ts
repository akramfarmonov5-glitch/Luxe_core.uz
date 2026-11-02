const rawSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://luxe-core.uz')
  .trim()
  .replace(/\/+$/, '')
  .replace(/^https?:\/\/(www\.)?luxecore\.uz$/i, 'https://luxe-core.uz')
  .replace(/^https?:\/\/www\.luxe-core\.uz$/i, 'https://luxe-core.uz');

export const SITE_URL = rawSiteUrl || 'https://luxe-core.uz';

export const BRAND_ALTERNATE_NAMES = [
  'LUXECORE',
  'LUXECORE.UZ',
  'LuxeCore',
  'Luxe Core',
  'Luxe-Core.uz',
  'LuxeCore Optom',
  'ЛюксКор',
  'Люкс Кор Урикзар',
];
