import * as cheerio from 'cheerio';

async function main() {
  const url = 'https://optombazar.uz/uz/katalog/yangi-yil-2027-paket-va-qutilari';
  console.log(`Fetching ${url}...`);
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  // Check __NEXT_DATA__
  const nextData = $('#__NEXT_DATA__').html();
  if (nextData) {
    console.log('Found __NEXT_DATA__!');
    const parsed = JSON.parse(nextData);
    console.log('JSON:', JSON.stringify(parsed?.props?.pageProps, null, 2).slice(0, 1000));
  }

  // Check Next.js 13+ RSC script chunks or hydration data
  let selfData = [];
  $('script').each((i, el) => {
    const text = $(el).html() || '';
    if (text.includes('self.__next_f.push') && text.includes('yangi-yil')) {
      selfData.push(text);
    }
  });
  console.log(`Found ${selfData.length} hydration script chunks with yangi-yil`);

  // Extract products from DOM
  const products = [];
  $('a[href*="/mahsulot/"], a[href*="/product/"]').each((i, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().trim();
    const img = $(el).find('img').attr('src');
    if (href) {
      products.push({ href, text, img });
    }
  });

  console.log(`Found ${products.length} product card links in DOM`);
  // Group by href
  const uniqueHrefs = [...new Set(products.map(p => p.href))];
  console.log('Unique product URLs:', uniqueHrefs);

  // Let's inspect the cards
  const cardElements = $('article, [class*="card"], [class*="product"]').filter((i, el) => {
    return $(el).find('a[href*="/mahsulot/"]').length > 0;
  });
  console.log(`Found ${cardElements.length} product card containers`);
}

main().catch(console.error);
