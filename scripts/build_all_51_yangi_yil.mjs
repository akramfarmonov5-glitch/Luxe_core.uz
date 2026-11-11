import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const matchedData = JSON.parse(fs.readFileSync('scripts/optombazar_51_matched.json', 'utf8'));

// Exact verified manual visual overrides for the 6 edge cases & gallery additions
const PRIMARY_OVERRIDES = {
  26: ['/products/yangi-yil/yangi-yil-karobkalar-optom-36.png'],
  32: ['/products/yangi-yil/yangi-yil-karobkalar-optom.png'],
  35: ['/products/yangi-yil/yangi-yil-karobkalar-optom-46.png'],
  37: ['/products/yangi-yil/yangi-yil-karobkalar-optom-48.png'],
  39: ['/products/yangi-yil/yangi-yil-karobkalar-optom-50.png'],
  41: ['/products/yangi-yil/yangi-yil-karobkalar-optom-52.png'],
};

const GALLERY_ADDITIONS = {
  11: ['/products/yangi-yil/yangi-yil-karobkalar-optom-044.png'],
  14: ['/products/yangi-yil/yangi-yil-karobkalar-optom-15.png'],
  8: ['/products/yangi-yil/yangi-yil-karobkalar-optom-1.png'],
};

const CYRILLIC_MAP = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh',
  з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
  п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts',
  ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu',
  я: 'ya', ў: 'o', қ: 'q', ғ: 'g', ҳ: 'h',
};

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .split('')
    .map((ch) => CYRILLIC_MAP[ch] ?? ch)
    .join('')
    .replace(/['`’ʻʼ«»"]/g, '')
    .replace(/[^a-z0-9\s-]/g, '-')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function translateToEnTitle(nameUz, nameRu) {
  let s = nameUz || nameRu;
  const pairs = [
    [/Yangi yil 2027 sovg[‘']a paketi/gi, 'New Year 2027 Gift Bag'],
    [/Yangi yil sovg[‘']a qutisi \(karton paket\)/gi, 'New Year Cardboard Gift Bag'],
    [/Yangi yil sovg[‘']a qutisi \(karton karobka\)/gi, 'New Year Candy Gift Box'],
    [/Yangi yil sovg[‘']a qutisi \(derazali uycha\)/gi, 'New Year Window House Box'],
    [/Yangi yil sovg[‘']a qutisi \(darchali uycha-karobka\)/gi, 'New Year 3D Window House Box'],
    [/Yangi yil sovg[‘']a qutisi \(derazali karobka\)/gi, 'New Year Window Gift Box'],
    [/Yangi yil sovg[‘']a qutisi \(sandiqcha-karobka\)/gi, 'New Year Treasure Chest Gift Box'],
    [/Yangi yil sovg[‘']a qutisi \(milliy dizayn\)/gi, 'Traditional National Ornament Gift Box'],
    [/Yangi yil qopqoqli sovg[‘']a qutisi \(kub-karobka\)/gi, 'New Year Luxury Cube Box with Lid'],
    [/Yangi yil sovg[‘']a qutisi \(qasr-karobka\)/gi, 'New Year Palace Candy Box'],
    [/Yangi yil sovg[‘']a qutisi \(uycha-karobka\)/gi, 'New Year Cottage Candy Box'],
    [/Yangi yil sovg[‘']a qutisi \(tutqichli karobka\)/gi, 'New Year Handle Candy Box'],
    [/Yangi yil sovg[‘']a qutisi \(ip-tutqichli karobka\)/gi, 'New Year Rope-Handle Gift Box'],
    [/Yangi yil sovg[‘']a qutisi \(olti burchakli karobka\)/gi, 'New Year Hexagonal Gift Box'],
    [/Yangi yil sovg[‘']a qutisi \(darchali olti burchakli karobka\)/gi, 'New Year Hexagonal Window Box'],
    [/Yangi yil sovg[‘']a paketi \(shaffof darchali qopcha\)/gi, 'New Year Clear-Window Treat Pouch'],
    [/Yangi yil sovg[‘']a qutisi \(fonar-karobka\)/gi, 'New Year Lantern Candy Box'],
    [/Yangi yil sovg[‘']a qutisi \(portfel-karobka\)/gi, 'New Year Briefcase Gift Box'],
    [/Yangi yil sovg[‘']a qutisi \(tasmali tutqichli karobka\)/gi, 'New Year Ribbon-Handle Gift Box'],
    [/Yangi yil sovg[‘']a qutisi \(archa darchali karobka\)/gi, 'New Year Tree-Window Gift Box'],
    [/Yangi yil sovg[‘']a qutisi \(shaklli tutqichli karobka\)/gi, 'New Year Die-Cut Handle Box'],
    [/Yangi yil sovg[‘']a qutisi \(darchali karobka\)/gi, 'New Year Window Gift Box'],
    [/Yangi yil sovg[‘']a qutisi \(tasmali kub-karobka\)/gi, 'New Year Ribbon Bow Cube Box'],
    [/Yangi yil sovg[‘']a qutisi \(ip-tutqichli sumka-karobka\)/gi, 'New Year Rope-Handle Tote Box'],
    [/Yangi yil sovg[‘']a qutisi \(tutqichli sumkacha\)/gi, 'New Year Gift Handbag Box'],
    [/Qishki ertak va archa/gi, 'Winter Tale & Tree'],
    [/Qorbobo va bolalar/gi, 'Santa & Kids'],
    [/Qorbobo va qorbola/gi, 'Santa & Snowman'],
    [/Qorbobo va uycha/gi, 'Santa & Cottage'],
    [/Masha va ayiq uycha yonida/gi, 'Masha & Bear at Cottage'],
    [/Masha va ayiq/gi, 'Masha & The Bear'],
    [/Qishki uycha/gi, 'Winter House'],
    [/Qishki o['’]yinlar/gi, 'Winter Games'],
    [/Sehrli oqshom va qorbola/gi, 'Magical Evening & Snowman'],
    [/Mikki va Minni/gi, 'Mickey & Minnie'],
    [/Qorbobo va oltin naqsh/gi, 'Santa & Gold Ornament'],
    [/Yangi yilingiz bilan!?/gi, 'Happy New Year'],
    [/Qorbobo va archa/gi, 'Santa & Tree'],
    [/Qorbobo chanada/gi, 'Santa on Sleigh'],
    [/Quvnoq sichqonchalar/gi, 'Merry Mice'],
    [/Qorbobo va qorqiz/gi, 'Santa & Snow Maiden'],
    [/Baxt ostonada/gi, 'Happiness on the Threshold'],
    [/Qorbobo qasri/gi, 'Santa Palace'],
    [/Vinni Pux va do['’]stlari/gi, 'Winnie the Pooh & Friends'],
    [/Yangi yil archasi/gi, 'New Year Tree'],
    [/Bolalar va qorbola/gi, 'Kids & Snowman'],
    [/Quvnoq pingvincha/gi, 'Cheerful Penguin'],
    [/Qorbobo va o['’]rmon hayvonlari/gi, 'Santa & Woodland Animals'],
    [/Elflar uychasi/gi, 'Elves Cottage'],
    [/Qishki ertak/gi, 'Winter Tale'],
    [/Quvnoq qorbolalar/gi, 'Cheerful Snowmen'],
    [/Qorbobo va gulchambar/gi, 'Santa & Wreath'],
    [/Qorbobo va bayramona shahar/gi, 'Santa & Festive Town'],
    [/Qorbobo uychasi/gi, 'Santa Cottage'],
    [/Qorbobo va qorbolalar/gi, 'Santa & Snowmen'],
    [/Qorqiz va ertaknamo ot/gi, 'Snow Maiden & White Horse'],
    [/Qorbobo va Ayiqpolvon/gi, 'Santa & Bear'],
    [/Sehrli fonar/gi, 'Magic Lantern'],
    [/Musiqiy bayram/gi, 'Musical Holiday'],
    [/Yangi yil pochtasi/gi, 'Holiday Mail'],
    [/Qorqiz va olmaxon/gi, 'Snow Maiden & Squirrel'],
    [/Sehrli tun/gi, 'Magic Night'],
    [/Qorbobo va shirinliklar/gi, 'Santa with Candies'],
    [/Musiqachi Qorbobo va Bug['’]ucha/gi, 'Musical Santa & Reindeer'],
    [/Qorbobo va ayiqcha qorxodda/gi, 'Santa & Bear on Snowmobile'],
    [/Uchta quvnoq qorbola/gi, 'Three Merry Snowmen'],
    [/Ertaknamo Qorbobo va Qorqiz/gi, 'Fairytale Santa & Snow Maiden'],
    [/Sovg['’]ali qorbolacha/gi, 'Little Snowman with Gift'],
    [/Sovg['’]ali Qorqiz/gi, 'Snow Maiden with Gift'],
    [/Qorboboning oltin uychasi/gi, 'Golden Santa Cottage'],
    [/Quvnoq hayvonchalar va Qorbola/gi, 'Merry Animals & Snowman'],
    [/Oltin yog['’]du/gi, 'Golden Glow'],
    [/o['‘’]rta/gi, 'Medium'],
    [/Qorbobo/gi, 'Santa Claus'],
    [/ sm\)/gi, ' cm)'],
  ];
  for (const [re, rep] of pairs) {
    s = s.replace(re, rep);
  }
  return s;
}

function extractDimensions(text) {
  const m = String(text || '').match(/(\d+(?:[.,]\d+)?\s*[xх×]\s*\d+(?:[.,]\d+)?(?:\s*[xх×]\s*\d+(?:[.,]\d+)?)?\s*(?:sm|см|cm))/i);
  if (m) {
    return m[1].replace(/см/gi, 'sm').replace(/х/gi, 'x');
  }
  return null;
}

function cleanBrand(text) {
  return String(text || '')
    .replace(/Optombazar\.uz/gi, 'LUXECORE (luxe-core.uz)')
    .replace(/Optombazar/gi, 'LUXECORE')
    .replace(/\r\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const processed = matchedData.products.map((raw) => {
  const idx = raw.index;
  const baseImages = PRIMARY_OVERRIDES[idx] || raw.matchedLocalImages;
  const extraImages = GALLERY_ADDITIONS[idx] || [];
  const allImages = [...new Set([...baseImages, ...extraImages])].filter(Boolean);
  const primaryImage = allImages[0] || `/products/yangi-yil/yangi-yil-karobkalar-optom-${idx}.png`;

  const nameUz = cleanBrand(raw.nameUz);
  const nameRu = cleanBrand(raw.nameRu);
  const nameEn = translateToEnTitle(nameUz, nameRu);

  const dims = extractDimensions(nameUz + ' ' + raw.descUz + ' ' + nameRu + ' ' + raw.descRu);
  const minQty = raw.minQty || (raw.price >= 12000 ? 50 : 100);
  const isBag = /paket|paketi|qopcha|кулёк/i.test(nameUz + ' ' + nameRu);

  const baseDescUz = cleanBrand(raw.descUz);
  const baseDescRu = cleanBrand(raw.descRu);

  const b2bSuffixUz = ` Toshkent O'rikzor omboridan minimal ${minQty} donadan boshlab ulgurji (optom) narxda xarid qiling. 500+ donadan avtomatik -5%, 1000+ donadan -10% VIP chegirma! Rasmiy yuk xati (Накладная) va Toshkentda 2 soatda yetkazib berish (2 mln so'mdan bepul).`;
  const b2bSuffixRu = ` Оптовая продажа со склада Урикзор (Ташкент) от ${minQty} шт. При заказе 500+ шт действует скидка -5%, от 1000+ шт — VIP-скидка -10%. Официальная накладная и доставка по Ташкенту за 2 часа (бесплатно от 2 млн сум).`;

  const descUz = baseDescUz ? `${baseDescUz}${b2bSuffixUz}` : `${nameUz}.${b2bSuffixUz}`;
  const descRu = baseDescRu ? `${baseDescRu}${b2bSuffixRu}` : `${nameRu}.${b2bSuffixRu}`;
  const descEn = `${nameEn} (${dims || 'Standard gift size'}). Wholesale packaging from LUXECORE Tashkent Urikzor warehouse starting from ${minQty} pcs. Bulk discounts: -5% (500+ pcs), -10% VIP (1000+ pcs). Official B2B invoice and fast delivery across Uzbekistan.`;

  const specs = [
    {
      label: { uz: 'Artikul (SKU)', ru: 'Артикул (SKU)', en: 'SKU' },
      value: { uz: raw.sku, ru: raw.sku, en: raw.sku },
    },
    ...(dims
      ? [{
          label: { uz: "O'lchami", ru: 'Размер', en: 'Dimensions' },
          value: { uz: dims, ru: dims.replace(/sm/gi, 'см'), en: dims.replace(/sm/gi, 'cm') },
        }]
      : []),
    {
      label: { uz: 'Material', ru: 'Материал', en: 'Material' },
      value: isBag
        ? { uz: 'Yaltiroq laminatsiyalangan karton / BOPP', ru: 'Глянцевый ламинированный картон / БОПП', en: 'Glossy laminated carton / BOPP' }
        : { uz: 'Qalin xrom-karton (300 g/m²)', ru: 'Плотный хром-эрзац картон (300 г/м²)', en: 'Rigid coated paperboard (300 gsm)' },
    },
    {
      label: { uz: 'Min. buyurtma', ru: 'Мин. заказ', en: 'Min. Order' },
      value: { uz: `${minQty} dona (1 pachka)`, ru: `${minQty} шт (1 уп.)`, en: `${minQty} pcs (1 pack)` },
    },
    {
      label: { uz: 'Ulgurji chegirma', ru: 'Оптовые скидки', en: 'Wholesale Tiers' },
      value: { uz: '500+ (-5%), 1000+ (-10% VIP)', ru: '500+ (-5%), 1000+ (-10% VIP)', en: '500+ (-5%), 1000+ (-10% VIP)' },
    },
    {
      label: { uz: 'Yetkazib berish', ru: 'Доставка', en: 'Delivery' },
      value: { uz: 'Toshkentda 2 soatda, viloyatga 1 kunda', ru: 'По Ташкенту за 2 ч, в регионы за 1 день', en: 'Tashkent in 2 hrs, regions in 1 day' },
    },
  ];

  const slugUz = raw.slugRaw || slugify(nameUz);
  const slugRu = slugify(nameRu) || slugUz;
  const slugEn = slugify(nameEn) || slugUz;

  return {
    index: idx,
    nameObj: { uz: nameUz, ru: nameRu, en: nameEn },
    slugObj: { uz: slugUz, ru: slugRu, en: slugEn },
    descObj: { uz: descUz, ru: descRu, en: descEn },
    price: raw.price,
    formattedPrice: `${new Intl.NumberFormat('uz-UZ').format(raw.price)} UZS`,
    category: 'yangi-yil-2027',
    image: primaryImage,
    images: allImages,
    itemsPerPackage: minQty,
    stock: 30000,
    is_bestseller: idx <= 10,
    is_premium: raw.price >= 7500,
    specs,
  };
});

fs.writeFileSync('scripts/yangi_yil_51_final.json', JSON.stringify(processed, null, 2), 'utf8');
console.log(`Prepared ${processed.length} fully SEO-optimized and image-matched products.`);

// 1. Update constants.ts MOCK_PRODUCTS (replace all existing yangi-yil-2027 mock entries with these 51)
const constantsPath = path.resolve('constants.ts');
let constantsContent = fs.readFileSync(constantsPath, 'utf8').replace(/\r\n/g, '\n');

const startMarker = 'export const MOCK_PRODUCTS: Product[] = [';
const endMarker = '  {\n    id: 4,\n    name: "Magnitli Premium Oq Quti",';

const sIdx = constantsContent.indexOf(startMarker);
const eIdx = constantsContent.indexOf(endMarker);

if (sIdx === -1 || eIdx === -1) {
  console.error('Could not find MOCK_PRODUCTS markers in constants.ts');
  process.exit(1);
}

const tsArrayItems = processed.map((p, i) => {
  const mockObj = {
    id: 101 + i,
    name: p.nameObj,
    slug: p.slugObj,
    price: p.price,
    formattedPrice: p.formattedPrice,
    category: 'yangi-yil-2027',
    image: p.image,
    images: p.images,
    shortDescription: p.descObj,
    itemsPerPackage: p.itemsPerPackage,
    stock: p.stock,
    is_bestseller: p.is_bestseller,
    is_premium: p.is_premium,
    specs: p.specs,
  };
  const lines = ['  {'];
  for (const [k, v] of Object.entries(mockObj)) {
    lines.push(`    ${k}: ${JSON.stringify(v)},`);
  }
  lines.push('  }');
  return lines.join('\n');
}).join(',\n') + ',\n';

constantsContent = constantsContent.slice(0, sIdx + startMarker.length) + '\n' + tsArrayItems + constantsContent.slice(eIdx);
fs.writeFileSync(constantsPath, constantsContent, 'utf8');
console.log('Updated constants.ts with all 51 Yangi Yil products!');

// 2. Regenerate supabase_sync_production_b2b.sql for live production (brlnshhzvitxpjpftovb)
const blogMatch = constantsContent.match(/export const DEFAULT_BLOG_POSTS:\s*BlogPost\[\]\s*=\s*(\[[\s\S]*\]);?\s*$/m);
const blogPosts = blogMatch ? JSON.parse(blogMatch[1].replace(/;$/, '')) : [];

function sqlStr(val) {
  if (val === null || val === undefined) return 'NULL';
  return "'" + String(val).replace(/'/g, "''") + "'";
}

function sqlTextArray(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return "'{}'::text[]";
  return `ARRAY[${arr.map(sqlStr).join(', ')}]::text[]`;
}

let sql = `-- ============================================================
-- LUXECORE.UZ — Jonli Production Supabase (brlnshhzvitxpjpftovb)
-- 51 ta SEO-optimizatsiya qilingan Yangi Yil 2027 mahsuloti
-- (62 ta shaffof PNG rasmlar vizuallashtirilgan holda aniq bog'landi!)
-- hamda 4 ta B2B SEO Blog Maqola
-- ============================================================

UPDATE public.categories
SET
  image = '/products/yangi-yil/yangi-yil-karobkalar-optom-42.png',
  name = ${sqlStr(JSON.stringify({ uz: "Yangi Yil 2027 Qutilari", ru: "Новогодние пакеты и коробки 2027", en: "New Year 2027 Gift Boxes & Bags" }))},
  description = ${sqlStr(JSON.stringify({ uz: "Yangi Yil 2027 bayram va bolalar shirinlik qutilari hamda karton paketlari Toshkent O'rikzor omboridan ulgurji narxlarda.", ru: "Новогодние подарочные коробки для конфет и пакеты 2027 оптом со склада Урикзор в Ташкенте.", en: "New Year 2027 holiday candy boxes and gift bags wholesale from Tashkent Urikzor warehouse." }))}
WHERE slug::text ILIKE '%yangi-yil-2027%';

INSERT INTO public.categories (name, slug, image, description, "googleProductCategory")
SELECT
  ${sqlStr(JSON.stringify({ uz: "Yangi Yil 2027 Qutilari", ru: "Новогодние пакеты и коробки 2027", en: "New Year 2027 Gift Boxes & Bags" }))},
  ${sqlStr(JSON.stringify({ uz: "yangi-yil-2027", ru: "yangi-yil-2027", en: "yangi-yil-2027" }))},
  '/products/yangi-yil/yangi-yil-karobkalar-optom-42.png',
  ${sqlStr(JSON.stringify({ uz: "Yangi Yil 2027 bayram va bolalar shirinlik qutilari hamda karton paketlari Toshkent O'rikzor omboridan ulgurji narxlarda.", ru: "Новогодние подарочные коробки для конфет и пакеты 2027 оптом со склада Урикзор в Ташкенте.", en: "New Year 2027 holiday candy boxes and gift bags wholesale from Tashkent Urikzor warehouse." }))},
  'Home & Garden > Linens & Bedding > Holiday Ornaments'
WHERE NOT EXISTS (
  SELECT 1 FROM public.categories WHERE slug::text ILIKE '%yangi-yil-2027%'
);

DO $$
DECLARE
  v_cat_id bigint;
BEGIN
  SELECT id INTO v_cat_id FROM public.categories WHERE slug::text ILIKE '%yangi-yil-2027%' LIMIT 1;

`;

// Replace IDs 1..5 in production (the 5 old placeholder Yangi Yil items) with real products 1..5 so no Unsplash placeholders remain in yangi-yil-2027,
// and insert/update items 6..51 cleanly by slug!
for (let i = 0; i < processed.length; i++) {
  const p = processed[i];
  const nameJson = JSON.stringify(p.nameObj);
  const slugJson = JSON.stringify(p.slugObj);
  const descJson = JSON.stringify(p.descObj);
  const specsJson = JSON.stringify(p.specs);

  if (i < 5) {
    const legacyId = i + 1;
    sql += `  IF EXISTS (SELECT 1 FROM public.products WHERE id = ${legacyId} AND category = 'yangi-yil-2027') THEN
    UPDATE public.products SET
      name = ${sqlStr(nameJson)},
      slug = ${sqlStr(slugJson)},
      price = ${Number(p.price)},
      category = 'yangi-yil-2027',
      "categoryId" = v_cat_id,
      image = ${sqlStr(p.image)},
      images = ${sqlTextArray(p.images)},
      description = ${sqlStr(descJson)},
      stock = ${Number(p.stock)},
      "itemsPerPackage" = ${Number(p.itemsPerPackage)},
      specifications = ${sqlStr(specsJson)}::jsonb,
      is_bestseller = ${Boolean(p.is_bestseller)},
      is_premium = ${Boolean(p.is_premium)}
    WHERE id = ${legacyId};
  ELSIF EXISTS (SELECT 1 FROM public.products WHERE slug::text ILIKE ${sqlStr('%' + p.slugObj.uz + '%')}) THEN
    UPDATE public.products SET
      name = ${sqlStr(nameJson)},
      slug = ${sqlStr(slugJson)},
      price = ${Number(p.price)},
      category = 'yangi-yil-2027',
      "categoryId" = v_cat_id,
      image = ${sqlStr(p.image)},
      images = ${sqlTextArray(p.images)},
      description = ${sqlStr(descJson)},
      stock = ${Number(p.stock)},
      "itemsPerPackage" = ${Number(p.itemsPerPackage)},
      specifications = ${sqlStr(specsJson)}::jsonb,
      is_bestseller = ${Boolean(p.is_bestseller)},
      is_premium = ${Boolean(p.is_premium)}
    WHERE slug::text ILIKE ${sqlStr('%' + p.slugObj.uz + '%')};
  ELSE
    INSERT INTO public.products (
      name, slug, price, category, "categoryId", image, images, description, stock, "itemsPerPackage", specifications, is_bestseller, is_premium
    ) VALUES (
      ${sqlStr(nameJson)}, ${sqlStr(slugJson)}, ${Number(p.price)}, 'yangi-yil-2027', v_cat_id,
      ${sqlStr(p.image)}, ${sqlTextArray(p.images)}, ${sqlStr(descJson)}, ${Number(p.stock)},
      ${Number(p.itemsPerPackage)}, ${sqlStr(specsJson)}::jsonb, ${Boolean(p.is_bestseller)}, ${Boolean(p.is_premium)}
    );
  END IF;

`;
  } else {
    sql += `  IF EXISTS (SELECT 1 FROM public.products WHERE slug::text ILIKE ${sqlStr('%' + p.slugObj.uz + '%')}) THEN
    UPDATE public.products SET
      name = ${sqlStr(nameJson)},
      slug = ${sqlStr(slugJson)},
      price = ${Number(p.price)},
      category = 'yangi-yil-2027',
      "categoryId" = v_cat_id,
      image = ${sqlStr(p.image)},
      images = ${sqlTextArray(p.images)},
      description = ${sqlStr(descJson)},
      stock = ${Number(p.stock)},
      "itemsPerPackage" = ${Number(p.itemsPerPackage)},
      specifications = ${sqlStr(specsJson)}::jsonb,
      is_bestseller = ${Boolean(p.is_bestseller)},
      is_premium = ${Boolean(p.is_premium)}
    WHERE slug::text ILIKE ${sqlStr('%' + p.slugObj.uz + '%')};
  ELSE
    INSERT INTO public.products (
      name, slug, price, category, "categoryId", image, images, description, stock, "itemsPerPackage", specifications, is_bestseller, is_premium
    ) VALUES (
      ${sqlStr(nameJson)}, ${sqlStr(slugJson)}, ${Number(p.price)}, 'yangi-yil-2027', v_cat_id,
      ${sqlStr(p.image)}, ${sqlTextArray(p.images)}, ${sqlStr(descJson)}, ${Number(p.stock)},
      ${Number(p.itemsPerPackage)}, ${sqlStr(specsJson)}::jsonb, ${Boolean(p.is_bestseller)}, ${Boolean(p.is_premium)}
    );
  END IF;

`;
  }
}

sql += `END $$;

-- 4 ta B2B SEO Blog maqolalarini joylash / yangilash
`;

for (const post of blogPosts) {
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

sql += `SELECT setval(pg_get_serial_sequence('public.products', 'id'), COALESCE((SELECT MAX(id) FROM public.products), 1));
SELECT setval(pg_get_serial_sequence('public.blog_posts', 'id'), COALESCE((SELECT MAX(id) FROM public.blog_posts), 1));
SELECT setval(pg_get_serial_sequence('public.categories', 'id'), COALESCE((SELECT MAX(id) FROM public.categories), 1));
`;

fs.writeFileSync('supabase_sync_production_b2b.sql', sql, 'utf8');
console.log('Generated supabase_sync_production_b2b.sql with all 51 Yangi Yil products + 4 SEO blog posts!');

// 3. Also sync local .env.local Supabase (cuhaqoahculndvzpriuq) with all 51 properly-matched products
async function syncDevSupabase() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cuhaqoahculndvzpriuq.supabase.co';
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aGFxb2FoY3VsbmR2enByaXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE0OTExOSwiZXhwIjoyMDgzNzI1MTE5fQ.VbQ9hUEif1XoRLXKDPPUbecsHE7h29bba5u1XmWLFOc';
  const client = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data: catList } = await client.from('categories').select('id, slug');
  const cat = catList?.find((c) => String(c.slug).includes('yangi-yil-2027'));
  const catId = cat ? cat.id : null;

  if (catId) {
    await client.from('categories').update({
      image: '/products/yangi-yil/yangi-yil-karobkalar-optom-42.png',
    }).eq('id', catId);
  }

  let updated = 0;
  let inserted = 0;
  for (const p of processed) {
    const payload = {
      name: JSON.stringify(p.nameObj),
      slug: JSON.stringify(p.slugObj),
      price: p.price,
      category: 'yangi-yil-2027',
      categoryId: catId,
      image: p.image,
      images: p.images,
      description: JSON.stringify(p.descObj),
      stock: p.stock,
      itemsPerPackage: p.itemsPerPackage,
      specifications: p.specs,
      is_bestseller: p.is_bestseller,
      is_premium: p.is_premium,
    };

    const { data: existing } = await client
      .from('products')
      .select('id')
      .ilike('slug', `%${p.slugObj.uz}%`)
      .limit(1);

    if (existing && existing.length > 0) {
      const { error } = await client.from('products').update(payload).eq('id', existing[0].id);
      if (error) console.error('Update error:', p.slugObj.uz, error.message);
      else updated++;
    } else {
      const { error } = await client.from('products').insert([payload]);
      if (error) console.error('Insert error:', p.slugObj.uz, error.message);
      else inserted++;
    }
  }

  console.log(`Synced dev Supabase (${SUPABASE_URL}): updated ${updated}, inserted ${inserted} (total 51).`);
}

syncDevSupabase();
