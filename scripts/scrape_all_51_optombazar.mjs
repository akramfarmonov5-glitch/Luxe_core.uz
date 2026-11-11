import * as cheerio from 'cheerio';
import fs from 'fs';

async function scrapePage(url) {
  const res = await fetch(url);
  if (!res.ok) return null;
  const html = await res.text();
  const $ = cheerio.load(html);

  let productLd = null;
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const d = JSON.parse($(el).html());
      if (d['@type'] === 'Product') productLd = d;
    } catch {}
  });

  const h1 = $('h1').first().text().trim();
  const metaDesc = $('meta[name="description"]').attr('content') || '';
  const altUz = $('link[hreflang="uz"]').attr('href') || '';
  const altRu = $('link[hreflang="ru"]').attr('href') || '';

  // Also extract tier rows from the main table
  const tierRows = [];
  $('table tr').each((_, tr) => {
    const rowText = $(tr).text().replace(/\s+/g, ' ').trim();
    if (rowText) tierRows.push(rowText);
  });

  const images = [];
  if (productLd?.image) {
    if (Array.isArray(productLd.image)) images.push(...productLd.image);
    else images.push(productLd.image);
  }

  return {
    name: (productLd?.name || h1 || '').replace(/^Nomi\s*\(ruscha\)\s*:\s*/i, '').trim(),
    description: (productLd?.description || metaDesc || '').trim(),
    sku: productLd?.sku || '',
    price: Math.round(Number(productLd?.offers?.price || 0)) || 2500,
    minQty: Number(productLd?.offers?.eligibleQuantity?.minValue || 100) || 100,
    images: [...new Set(images)].filter(Boolean),
    tierRows,
    altUz,
    altRu,
  };
}

async function run() {
  const ruPaths = [];
  for (let page = 1; page <= 5; page++) {
    const url = page === 1
      ? 'https://optombazar.uz/ru/katalog/yangi-yil-2027-paket-va-qutilari'
      : `https://optombazar.uz/ru/katalog/yangi-yil-2027-paket-va-qutilari?page=${page}`;
    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);
    let added = 0;
    $('a[href*="/ru/mahsulot/"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !ruPaths.includes(href)) {
        ruPaths.push(href);
        added++;
      }
    });
    if (added === 0 && page > 1) break;
  }

  console.log(`Found ${ruPaths.length} unique products across RU catalog pages.`);
  const results = [];

  for (let i = 0; i < ruPaths.length; i++) {
    const ruRel = ruPaths[i];
    const ruUrl = `https://optombazar.uz${ruRel}`;
    const uzRel = ruRel.replace(/^\/ru\/mahsulot\//, '/uz/mahsulot/');
    const uzUrl = `https://optombazar.uz${uzRel}`;

    const [ruData, uzData] = await Promise.all([scrapePage(ruUrl), scrapePage(uzUrl)]);
    if (!ruData && !uzData) {
      console.error(`Failed both RU and UZ for ${ruRel}`);
      continue;
    }

    const slugRaw = ruRel.replace(/^\/ru\/mahsulot\//, '').replace(/[^a-z0-9-]/g, '');
    const mergedImages = [...new Set([...(ruData?.images || []), ...(uzData?.images || [])])];

    results.push({
      index: i + 1,
      slugRaw,
      sku: ruData?.sku || uzData?.sku || `YY-${2027}-${i + 1}`,
      price: ruData?.price || uzData?.price || 2500,
      minQty: ruData?.minQty || uzData?.minQty || 100,
      nameUz: uzData?.name || ruData?.name || '',
      nameRu: ruData?.name || uzData?.name || '',
      descUz: uzData?.description || '',
      descRu: ruData?.description || '',
      tierRowsRu: ruData?.tierRows || [],
      tierRowsUz: uzData?.tierRows || [],
      r2Images: mergedImages,
    });

    console.log(`[${i + 1}/${ruPaths.length}] ${ruData?.name?.slice(0, 45)} | ${ruData?.price} UZS | imgs: ${mergedImages.length}`);
  }

  fs.writeFileSync('scripts/optombazar_all_51.json', JSON.stringify(results, null, 2), 'utf8');
  console.log(`\nSaved ${results.length} products to scripts/optombazar_all_51.json`);
}

run();
