import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
        return process.env[key] as string;
    }
    return '';
};

const BASE_URL = 'https://luxe-core-uz-three.vercel.app';

export default async function handler(req: any, res: any) {
    try {
        const url = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
        const key = getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_KEY');

        let products: any[] = [];
        let categories: any[] = [];
        let blogPosts: any[] = [];

        if (url && key) {
            const supabase = createClient(url, key, { auth: { persistSession: false } });

            const [prodRes, catRes, blogRes] = await Promise.all([
                supabase.from('products').select('id, name, image, price, created_at'),
                supabase.from('categories').select('id, slug, name, image'),
                supabase.from('blog_posts').select('id, title, image, date'),
            ]);

            products = prodRes.data || [];
            categories = catRes.data || [];
            blogPosts = blogRes.data || [];
        }

        const today = new Date().toISOString().split('T')[0];

        // Static pages
        let urls = `
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/#tracking</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>`;

        // Category pages
        for (const cat of categories) {
            urls += `
  <url>
    <loc>${BASE_URL}/#category/${cat.slug || cat.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        }

        // Product pages
        for (const p of products) {
            const lastmod = p.created_at ? p.created_at.split('T')[0] : today;
            urls += `
  <url>
    <loc>${BASE_URL}/#product/${p.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>${p.image ? `
    <image:image>
      <image:loc>${p.image}</image:loc>
      <image:title>${escapeXml(p.name || '')}</image:title>
    </image:image>` : ''}
  </url>`;
        }

        // Blog posts
        for (const post of blogPosts) {
            const lastmod = post.date || today;
            urls += `
  <url>
    <loc>${BASE_URL}/#blog/${post.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>${post.image ? `
    <image:image>
      <image:loc>${post.image}</image:loc>
      <image:title>${escapeXml(post.title || '')}</image:title>
    </image:image>` : ''}
  </url>`;
        }

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

        res.setHeader('Content-Type', 'application/xml; charset=utf-8');
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=600');
        res.status(200).send(xml);
    } catch (err: any) {
        console.error('Sitemap error:', err);
        res.status(500).send('<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
    }
}

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}
