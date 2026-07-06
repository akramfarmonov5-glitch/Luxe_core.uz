import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Admin panel istalgan https manzildan rasm URL kiritishi mumkin,
    // shuning uchun barcha https hostlarga ruxsat beriladi
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  turbopack: {
    root: rootDir,
  },
};

export default nextConfig;
