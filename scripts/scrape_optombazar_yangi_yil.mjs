import * as cheerio from 'cheerio';

export async function scrapeOptombazarYangiYil() {
  const categoryUrl = 'https://optombazar.uz/uz/katalog/yangi-yil-2027-paket-va-qutilari';
  console.log(`Fetching catalog: ${categoryUrl}...`);
  const res = await fetch(categoryUrl);
  const html = await res.text();
  const $ = cheerio.load(html);

  const links = [];
  $('a[href*="/mahsulot/"]').each((i, el) => {
    const href = $(el).attr('href');
    if (href && !links.includes(href)) {
      links.push(href);
    }
  });

  console.log(`Found ${links.length} products to scrape...`);
  const products = [];

  for (let i = 0; i < links.length; i++) {
    const relUrl = links[i];
    const fullUrl = `https://optombazar.uz${relUrl}`;
    try {
      const pRes = await fetch(fullUrl);
      const pHtml = await pRes.text();
      const p$ = cheerio.load(pHtml);

      let jsonLd = null;
      p$('script[type="application/ld+json"]').each((j, el) => {
        try {
          const d = JSON.parse(p$(el).html());
          if (d['@type'] === 'Product' || d.name) jsonLd = d;
        } catch {}
      });

      const title = jsonLd?.name || p$('h1').first().text().trim();
      const rawPrice = jsonLd?.offers?.price || 2500;
      const price = Math.round(Number(rawPrice)) || 2500;
      const desc = jsonLd?.description || p$('p').first().text().trim();

      // Collect images
      const images = [];
      if (jsonLd?.image) {
        if (Array.isArray(jsonLd.image)) images.push(...jsonLd.image);
        else images.push(jsonLd.image);
      }
      p$('img').each((k, el) => {
        const src = p$(el).attr('src');
        if (src && src.includes('r2.dev') && !images.includes(src)) {
          images.push(src);
        }
      });

      const mainImage = images[0] || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000';
      const cleanSlug = relUrl.replace('/uz/mahsulot/', '').replace(/[^a-z0-9-]/g, '');

      // Parse specs from text if available
      const specs = [
        { label: "Kategoriya", value: "Yangi Yil 2027 qutilari" },
        { label: "Min. buyurtma", value: "100 dona (1 pachka)" },
        { label: "Yetkazib berish", value: "Toshkentda 2 soatda, viloyatga 1 kunda" }
      ];

      products.push({
        name: title,
        slug: cleanSlug,
        price,
        formattedPrice: `${new Intl.NumberFormat('uz-UZ').format(price)} UZS`,
        image: mainImage,
        images: images.slice(0, 4),
        description: desc.replace(/Optombazar/gi, 'LUXECORE'),
        category: 'yangi-yil-2027',
        categoryId: 1,
        itemsPerPackage: 100,
        stock: 25000,
        specs
      });

      console.log(`[${i + 1}/${links.length}] Scraped: ${title.slice(0, 45)} - ${price} UZS`);
    } catch (err) {
      console.error(`Failed to scrape ${fullUrl}:`, err.message);
    }
  }

  return products;
}

if (process.argv[1]?.endsWith('scrape_optombazar_yangi_yil.mjs')) {
  scrapeOptombazarYangiYil().then(prods => {
    console.log(`\nSuccessfully scraped total ${prods.length} products!`);
    console.log('Sample product:', JSON.stringify(prods[0], null, 2));
  });
}
