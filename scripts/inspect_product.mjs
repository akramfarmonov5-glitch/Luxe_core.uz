import * as cheerio from 'cheerio';

async function testProduct() {
  const url = 'https://optombazar.uz/uz/mahsulot/yangi-yil-2027-sovga-paketi-qishki-ertak-va-archa-orta';
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const title = $('h1').text().trim();
  const price = $('[class*="price"]').text().trim();
  const images = [];
  $('img').each((i, el) => {
    const src = $(el).attr('src');
    if (src && (src.includes('r2.dev') || src.includes('product') || src.includes('upload'))) {
      images.push(src);
    }
  });

  // Check JSON-LD
  let jsonLd = null;
  $('script[type="application/ld+json"]').each((i, el) => {
    try {
      const data = JSON.parse($(el).html());
      if (data['@type'] === 'Product' || data.name) {
        jsonLd = data;
      }
    } catch {}
  });

  // Check specs / details
  const details = [];
  $('table tr, dl div, [class*="spec"]').each((i, el) => {
    details.push($(el).text().trim().replace(/\s+/g, ' '));
  });

  console.log('Title:', title);
  console.log('Price:', price);
  console.log('Images:', [...new Set(images)]);
  console.log('JSON-LD:', JSON.stringify(jsonLd, null, 2));
  console.log('Details:', details.slice(0, 8));
}

testProduct().catch(console.error);
