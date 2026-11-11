import fs from 'fs';

const products = JSON.parse(fs.readFileSync('scripts/yangi_yil_products_data.json', 'utf8'));

// Extract DEFAULT_BLOG_POSTS from constants.ts cleanly via simple eval or regex
const constantsContent = fs.readFileSync('constants.ts', 'utf8');
const blogMatch = constantsContent.match(/export const DEFAULT_BLOG_POSTS:\s*BlogPost\[\]\s*=\s*(\[[\s\S]*\]);?\s*$/m);
let blogPosts = [];
if (blogMatch) {
  blogPosts = JSON.parse(blogMatch[1].replace(/;$/, ''));
}

function sqlStr(val) {
  if (val === null || val === undefined) return 'NULL';
  return "'" + String(val).replace(/'/g, "''") + "'";
}

function sqlTextArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return "'{}'::text[]";
  const elems = arr.map((item) => sqlStr(item)).join(', ');
  return `ARRAY[${elems}]::text[]`;
}

let sql = `-- ============================================================
-- LUXECORE.UZ — Jonli Production Supabase (brlnshhzvitxpjpftovb)
-- Yangi Yil 2027 (24 ta real mahsulot + 62 ta PNG rasm) va 4 ta B2B SEO maqola
-- Supabase Dashboard -> SQL Editor -> Paste & Run
-- ============================================================

-- 1. Yangi Yil 2027 kategoriyasi rasmini yangilash (yangi shaffof PNG rasmga)
UPDATE public.categories
SET image = '/products/yangi-yil/yangi-yil-karobkalar-optom-1.png'
WHERE slug::text ILIKE '%yangi-yil-2027%';

-- 2. Yangi Yil 2027 kategoriyasi mavjud bo'lmasa yaratish
INSERT INTO public.categories (name, slug, image, description, "googleProductCategory")
SELECT
  ${sqlStr(JSON.stringify({ uz: "Yangi Yil 2027 Qutilari", ru: "Новогодняя упаковка 2027", en: "New Year 2027 Boxes" }))},
  ${sqlStr(JSON.stringify({ uz: "yangi-yil-2027", ru: "yangi-yil-2027", en: "yangi-yil-2027" }))},
  '/products/yangi-yil/yangi-yil-karobkalar-optom-1.png',
  ${sqlStr(JSON.stringify({ uz: "Yangi Yil 2027 bayram va bolalar shirinlik qutilari ulgurji narxlarda.", ru: "Новогодние коробки для конфет и подарочные пакеты 2027 оптом.", en: "New Year 2027 holiday gift boxes wholesale." }))},
  'Home & Garden > Linens & Bedding > Holiday Ornaments'
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories WHERE slug::text ILIKE '%yangi-yil-2027%'
);

-- 3. 24 ta real Yangi Yil 2027 mahsulotlarini qo'shish / yangilash (categoryId = yuqoridagi yangi-yil-2027 ID)
DO $$
DECLARE
  v_cat_id bigint;
BEGIN
  SELECT id INTO v_cat_id FROM public.categories WHERE slug::text ILIKE '%yangi-yil-2027%' LIMIT 1;

`;

for (const p of products) {
  const uzSlug = JSON.parse(p.slug).uz;
  sql += `  IF EXISTS (SELECT 1 FROM public.products WHERE slug::text ILIKE ${sqlStr('%' + uzSlug + '%')}) THEN
    UPDATE public.products SET
      name = ${sqlStr(p.name)},
      price = ${Number(p.price)},
      category = 'yangi-yil-2027',
      "categoryId" = v_cat_id,
      image = ${sqlStr(p.image)},
      images = ${sqlTextArray(p.images)},
      description = ${sqlStr(p.description)},
      stock = ${Number(p.stock)},
      "itemsPerPackage" = ${Number(p.itemsPerPackage)},
      specifications = ${sqlStr(JSON.stringify(p.specifications))}::jsonb,
      is_bestseller = ${Boolean(p.is_bestseller)},
      is_premium = ${Boolean(p.is_premium)}
    WHERE slug::text ILIKE ${sqlStr('%' + uzSlug + '%')};
  ELSE
    INSERT INTO public.products (
      name, slug, price, category, "categoryId", image, images, description, stock, "itemsPerPackage", specifications, is_bestseller, is_premium
    ) VALUES (
      ${sqlStr(p.name)},
      ${sqlStr(p.slug)},
      ${Number(p.price)},
      'yangi-yil-2027',
      v_cat_id,
      ${sqlStr(p.image)},
      ${sqlTextArray(p.images)},
      ${sqlStr(p.description)},
      ${Number(p.stock)},
      ${Number(p.itemsPerPackage)},
      ${sqlStr(JSON.stringify(p.specifications))}::jsonb,
      ${Boolean(p.is_bestseller)},
      ${Boolean(p.is_premium)}
    );
  END IF;

`;
}

sql += `END $$;

-- 4. 4 ta B2B SEO Blog maqolalarini jonli bazaga joylash (yoki yangilash)
`;

for (const post of blogPosts) {
  const uzSlug = post.slug?.uz || '';
  sql += `INSERT INTO public.blog_posts (id, title, slug, image, content, date, seo)
VALUES (
  ${Number(post.id)},
  ${sqlStr(JSON.stringify(post.title))},
  ${sqlStr(JSON.stringify(post.slug))},
  ${sqlStr(post.image)},
  ${sqlStr(JSON.stringify(post.content))},
  ${sqlStr(post.date)},
  ${sqlStr(JSON.stringify(post.seo || {}))}::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  image = EXCLUDED.image,
  content = EXCLUDED.content,
  date = EXCLUDED.date,
  seo = EXCLUDED.seo;

`;
}

sql += `-- Sequence'larni sinxronlashtirish
SELECT setval(pg_get_serial_sequence('public.products', 'id'), COALESCE((SELECT MAX(id) FROM public.products), 1));
SELECT setval(pg_get_serial_sequence('public.blog_posts', 'id'), COALESCE((SELECT MAX(id) FROM public.blog_posts), 1));
SELECT setval(pg_get_serial_sequence('public.categories', 'id'), COALESCE((SELECT MAX(id) FROM public.categories), 1));
`;

fs.writeFileSync('supabase_sync_production_b2b.sql', sql, 'utf8');
console.log('Generated supabase_sync_production_b2b.sql with', products.length, 'products and', blogPosts.length, 'blog posts!');
