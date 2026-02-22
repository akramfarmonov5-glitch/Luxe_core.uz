import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return '';
};

export default async function handler(req: any, res: any) {
  try {
    const url = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
    const key = getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_KEY');

    if (!url || !key) {
      return res.status(500).json({ error: 'Server config missing' });
    }

    const supabase = createClient(url, key, { auth: { persistSession: false } });

    const { data: products, error } = await supabase
      .from('products')
      .select('*');

    if (error) throw error;

    const BASE_URL = process.env.SITE_URL || 'https://luxecoreuz.vercel.app';

    const xmlItems = (products || []).map((product: any) => `
    <item>
      <g:id>${product.id}</g:id>
      <g:title><![CDATA[${product.name}]]></g:title>
      <g:description><![CDATA[${product.shortDescription || product.name}]]></g:description>
      <g:link>${BASE_URL}?product_id=${product.id}</g:link>
      <g:image_link>${product.image}</g:image_link>
      <g:brand>LUXECORE</g:brand>
      <g:condition>new</g:condition>
      <g:availability>${(product.stock && product.stock > 0) ? 'in stock' : 'out of stock'}</g:availability>
      <g:price>${product.price} UZS</g:price>
      <g:google_product_category>Apparel &amp; Accessories</g:google_product_category>
    </item>
    `).join('');

    const xmlFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>LUXECORE Product Feed</title>
    <link>${BASE_URL}</link>
    <description>Premium luxury products from LUXECORE</description>
    ${xmlItems}
  </channel>
</rss>`;

    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send(xmlFeed);
  } catch (err: any) {
    console.error('Feed generation error:', err);
    res.status(500).json({ error: 'Failed to generate feed' });
  }
}
