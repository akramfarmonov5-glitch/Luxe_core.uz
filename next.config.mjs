import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url));

/**
 * Rasm optimizatori (`/_next/image`) uchun ruxsat etilgan tashqi hostlar.
 *
 * Ilgari `hostname: '**'` edi — istalgan sayt rasmlarini optimizatsiya qilish
 * mumkin bo'lgani uchun Vercel image-optimization kvotasi suiiste'mol qilinishi
 * mumkin edi. Yangi host kerak bo'lsa shu ro'yxatga qo'shing.
 */
const ALLOWED_IMAGE_HOSTS = [
  'res.cloudinary.com',
  'images.unsplash.com',
  'firebasestorage.googleapis.com',
  'api.qrserver.com',
  'i.ibb.co',
];

const supabaseHostname = (() => {
  try {
    const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return raw ? new URL(raw).hostname : null;
  } catch {
    return null;
  }
})();

const imageRemotePatterns = [
  ...ALLOWED_IMAGE_HOSTS.map((hostname) => ({ protocol: 'https', hostname })),
  ...(supabaseHostname
    ? [{ protocol: 'https', hostname: supabaseHostname, pathname: '/storage/v1/object/public/**' }]
    : []),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: imageRemotePatterns,
    // Optimallashgan rasmlar 1 kun keshlanadi (kvota va tezlik uchun).
    minimumCacheTTL: 60 * 60 * 24,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  turbopack: {
    root: rootDir,
  },
};

export default nextConfig;
