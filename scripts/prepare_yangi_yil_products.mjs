import { scrapeOptombazarYangiYil } from './scrape_optombazar_yangi_yil.mjs';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cuhaqoahculndvzpriuq.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1aGFxb2FoY3VsbmR2enByaXVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE0OTExOSwiZXhwIjoyMDgzNzI1MTE5fQ.VbQ9hUEif1XoRLXKDPPUbecsHE7h29bba5u1XmWLFOc';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function transliterateRu(text) {
  return text
    .replace(/Yangi yil 2027 sovg‘a paketi/gi, 'Новогодний подарочный пакет 2027')
    .replace(/Yangi yil sovg'a qutisi \(karton paket\)/gi, 'Новогодняя подарочная коробка (картонный пакет)')
    .replace(/Yangi yil sovg'a qutisi \(karton karobka\)/gi, 'Новогодняя коробка для конфет (картон)')
    .replace(/Yangi yil sovg'a qutisi \(derazali uycha\)/gi, 'Новогодняя коробка с окошком «Домик»')
    .replace(/Yangi yil sovg'a qutisi \(derazali karobka\)/gi, 'Новогодняя коробка с окошком')
    .replace(/Yangi yil sovg'a qutisi \(sandiqcha-karobka\)/gi, 'Новогодняя коробка «Сундучок»')
    .replace(/Yangi yil sovg'a qutisi \(milliy dizayn\)/gi, 'Новогодняя коробка с национальным узором')
    .replace(/Yangi yil qopqoqli sovg'a qutisi \(kub-karobka\)/gi, 'Новогодняя коробка куб с крышкой')
    .replace(/Yangi yil sovg'a qutisi \(qasr-karobka\)/gi, 'Новогодняя коробка «Замок»')
    .replace(/Yangi yil sovg'a qutisi \(uycha-karobka\)/gi, 'Новогодняя коробка «Избушка»')
    .replace(/Yangi yil sovg'a qutisi \(tutqichli karobka\)/gi, 'Новогодняя коробка с ручкой')
    .replace(/Qishki ertak va archa/gi, 'Зимняя сказка и елка')
    .replace(/Qorbobo va bolalar/gi, 'Дед Мороз и дети')
    .replace(/Qorbobo va qorbola/gi, 'Дед Мороз и снеговик')
    .replace(/Qorbobo va uycha/gi, 'Дед Мороз и домик')
    .replace(/Masha va ayiq va uycha/gi, 'Маша и медведь с домиком')
    .replace(/Masha va ayiq/gi, 'Маша и медведь')
    .replace(/Qishki uycha/gi, 'Зимний домик')
    .replace(/Qishki o'yinlar/gi, 'Зимние забавы')
    .replace(/Sehrli oqshom va qorbola/gi, 'Волшебная ночь и снеговик')
    .replace(/Mikki va Minni/gi, 'Микки и Минни Маус')
    .replace(/Qorbobo va oltin naqsh/gi, 'Дед Мороз и золотой орнамент')
    .replace(/Yangi yilingiz bilan/gi, 'С Новым Годом')
    .replace(/Qorbobo va archa/gi, 'Дед Мороз и новогодняя елка')
    .replace(/Qorbobo chanada/gi, 'Дед Мороз на санях')
    .replace(/Quvnoq sichqonchalar/gi, 'Веселые мышата')
    .replace(/Qorbobo va qorqiz/gi, 'Дед Мороз и Снегурочка')
    .replace(/Baxt ostonada/gi, 'Счастье на пороге')
    .replace(/Qorbobo qasri/gi, 'Дворец Деда Мороза')
    .replace(/Vinni Pux va do'stlari/gi, 'Винни Пух и друзья')
    .replace(/Yangi yil archasi/gi, 'Новогодняя елочка')
    .replace(/Bolalar va qorbola/gi, 'Дети и снеговик')
    .replace(/Quvnoq pingvincha/gi, 'Веселый пингвин')
    .replace(/Qorbobo va o'rmon hayvonlari/gi, 'Дед Мороз и лесные звери')
    .replace(/o‘rta/gi, 'средний')
    .replace(/Qorbobo/gi, 'Дед Мороз');
}

function transliterateEn(text) {
  return text
    .replace(/Yangi yil 2027 sovg‘a paketi/gi, 'New Year 2027 Gift Bag')
    .replace(/Yangi yil sovg'a qutisi \(karton paket\)/gi, 'Holiday Cardboard Gift Bag')
    .replace(/Yangi yil sovg'a qutisi \(karton karobka\)/gi, 'New Year Candy Box (Carton)')
    .replace(/Yangi yil sovg'a qutisi \(derazali uycha\)/gi, 'New Year Window House Box')
    .replace(/Yangi yil sovg'a qutisi \(derazali karobka\)/gi, 'New Year Clear Window Box')
    .replace(/Yangi yil sovg'a qutisi \(sandiqcha-karobka\)/gi, 'New Year Treasure Chest Box')
    .replace(/Yangi yil sovg'a qutisi \(milliy dizayn\)/gi, 'Traditional Gold Ornament Gift Box')
    .replace(/Yangi yil qopqoqli sovg'a qutisi \(kub-karobka\)/gi, 'New Year Cube Box with Lid')
    .replace(/Yangi yil sovg'a qutisi \(qasr-karobka\)/gi, 'New Year Castle Box')
    .replace(/Yangi yil sovg'a qutisi \(uycha-karobka\)/gi, 'New Year Cottage Gift Box')
    .replace(/Yangi yil sovg'a qutisi \(tutqichli karobka\)/gi, 'New Year Handle Candy Box')
    .replace(/Qishki ertak va archa/gi, 'Winter Tale & Tree')
    .replace(/Qorbobo va bolalar/gi, 'Santa & Kids')
    .replace(/Qorbobo va qorbola/gi, 'Santa & Snowman')
    .replace(/Qorbobo va uycha/gi, 'Santa & Cottage')
    .replace(/Masha va ayiq/gi, 'Masha & The Bear')
    .replace(/Qishki uycha/gi, 'Winter House')
    .replace(/Qishki o'yinlar/gi, 'Winter Games')
    .replace(/Sehrli oqshom va qorbola/gi, 'Magical Night & Snowman')
    .replace(/Mikki va Minni/gi, 'Mickey & Minnie')
    .replace(/Qorbobo va oltin naqsh/gi, 'Santa & Gold Ornament')
    .replace(/Yangi yilingiz bilan/gi, 'Happy New Year')
    .replace(/Qorbobo va archa/gi, 'Santa & Tree')
    .replace(/Qorbobo chanada/gi, 'Santa on Sleigh')
    .replace(/Quvnoq sichqonchalar/gi, 'Merry Mice')
    .replace(/Qorbobo va qorqiz/gi, 'Santa & Snow Maiden')
    .replace(/Baxt ostonada/gi, 'Joy on the Threshold')
    .replace(/Qorbobo qasri/gi, 'Santa Castle')
    .replace(/Vinni Pux va do'stlari/gi, 'Winnie the Pooh & Friends')
    .replace(/Yangi yil archasi/gi, 'Holiday Tree')
    .replace(/Bolalar va qorbola/gi, 'Kids & Snowman')
    .replace(/Quvnoq pingvincha/gi, 'Cheerful Penguin')
    .replace(/Qorbobo va o'rmon hayvonlari/gi, 'Santa & Woodland Animals')
    .replace(/o‘rta/gi, 'Medium')
    .replace(/Qorbobo/gi, 'Santa');
}

export async function prepareAndInsertYangiYilProducts() {
  console.log('--- Scraping and preparing 24 Yangi Yil 2027 products ---');
  const scraped = await scrapeOptombazarYangiYil();
  console.log(`Scraped ${scraped.length} products`);

  // 1. Ensure 'yangi-yil-2027' category exists in Supabase
  let categoryId = null;
  const { data: catList } = await supabase.from('categories').select('id, slug');
  const existingCat = catList?.find(c => {
    try {
      const s = typeof c.slug === 'string' && c.slug.startsWith('{') ? JSON.parse(c.slug).uz : c.slug;
      return s === 'yangi-yil-2027';
    } catch {
      return false;
    }
  });

  if (existingCat) {
    categoryId = existingCat.id;
    console.log(`Found existing category ID: ${categoryId}`);
  } else {
    console.log('Creating "yangi-yil-2027" category in Supabase...');
    const { data: newCat, error: catErr } = await supabase.from('categories').insert([{
      name: JSON.stringify({ uz: "Yangi Yil 2027 Sovg'a Paket va Qutilari", ru: "Новогодние пакеты и коробки 2027", en: "New Year 2027 Bags and Boxes" }),
      slug: JSON.stringify({ uz: "yangi-yil-2027", ru: "noviy-god-2027", en: "new-year-2027" }),
      image: '/products/yangi-yil/yangi-yil-karobkalar-optom-1.png',
      description: JSON.stringify({ uz: "Yangi Yil 2027 bayram va bolalar shirinlik qutilari, karton paketlar Toshkent O'rikzor ulgurji narxlarida.", ru: "Новогодние коробки для конфет и подарочные пакеты 2027 оптом со склада Урикзор в Ташкенте.", en: "New Year 2027 holiday candy boxes and gift bags wholesale from Tashkent Urikzor warehouse." }),
      googleProductCategory: "Home & Garden > Linens & Bedding > Holiday Ornaments"
    }]).select();

    if (catErr) {
      console.error('Error creating category:', catErr);
    } else if (newCat && newCat[0]) {
      categoryId = newCat[0].id;
      console.log(`Created category ID: ${categoryId}`);
    }
  }

  // Read available local PNG files
  const pngDir = path.resolve('public', 'products', 'yangi-yil');
  const pngFiles = fs.readdirSync(pngDir).filter(f => f.endsWith('.png'));
  console.log(`Available local PNG files: ${pngFiles.length}`);

  const processedProducts = [];

  for (let i = 0; i < scraped.length; i++) {
    const raw = scraped[i];

    // Select primary local PNG image
    const primaryPng = `/products/yangi-yil/yangi-yil-karobkalar-optom-${i + 1}.png`;
    // Secondary angle image if available
    const secondaryPng = pngFiles[(i + 24) % pngFiles.length]
      ? `/products/yangi-yil/${pngFiles[(i + 24) % pngFiles.length]}`
      : primaryPng;

    const titleUz = raw.name;
    const titleRu = transliterateRu(raw.name);
    const titleEn = transliterateEn(raw.name);

    const descUz = `${raw.description} Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.`;
    const descRu = `${titleRu} оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.`;
    const descEn = `${titleEn} wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery.`;

    const specs = [
      { label: { uz: "Material", ru: "Материал", en: "Material" }, value: { uz: "Qalin xrom-karton (300 g/m²)", ru: "Плотный хром-эрзац картон (300 г/м²)", en: "Rigid chromo board (300 gsm)" } },
      { label: { uz: "Sig'imi", ru: "Вместимость", en: "Capacity" }, value: { uz: "1 – 1.5 kg shirinlik va sovg'alar", ru: "1 – 1.5 кг сладостей и подарков", en: "1 - 1.5 kg candies and gifts" } },
      { label: { uz: "Min. buyurtma", ru: "Мин. заказ", en: "Min. Order" }, value: { uz: "100 dona (1 pachka)", ru: "100 шт (1 пачка)", en: "100 pcs (1 pack)" } },
      { label: { uz: "Ulgurji chegirma", ru: "Оптовая скидка", en: "Wholesale Discount" }, value: { uz: "500+ (-5%), 1000+ (-10% VIP)", ru: "500+ (-5%), 1000+ (-10% VIP)", en: "500+ (-5%), 1000+ (-10% VIP)" } },
      { label: { uz: "Yetkazib berish", ru: "Доставка", en: "Delivery" }, value: { uz: "Toshkentda 2 soatda, viloyatga 1 kunda", ru: "По Ташкенту за 2 часа, в области за 1 день", en: "Tashkent in 2 hrs, regions in 1 day" } }
    ];

    const isBestseller = i < 8;
    const isPremium = raw.price >= 5000;
    const itemsPerPackage = raw.price >= 10000 ? 50 : 100;

    const productPayload = {
      name: JSON.stringify({ uz: titleUz, ru: titleRu, en: titleEn }),
      slug: JSON.stringify({ uz: raw.slug, ru: raw.slug, en: raw.slug }),
      price: raw.price,
      category: 'yangi-yil-2027',
      categoryId: categoryId,
      image: primaryPng,
      images: [primaryPng, secondaryPng, ...raw.images.slice(0, 2)],
      description: JSON.stringify({ uz: descUz, ru: descRu, en: descEn }),
      stock: 30000,
      itemsPerPackage,
      specifications: specs,
      is_bestseller: isBestseller,
      is_premium: isPremium
    };

    processedProducts.push(productPayload);
  }

  // Save to JSON for fallback and mock imports
  fs.writeFileSync(path.resolve('scripts', 'yangi_yil_products_data.json'), JSON.stringify(processedProducts, null, 2), 'utf-8');
  console.log(`Saved products data to scripts/yangi_yil_products_data.json`);

  console.log(`\nReady to insert ${processedProducts.length} products into Supabase...`);

  // Insert into Supabase
  for (let i = 0; i < processedProducts.length; i++) {
    const item = processedProducts[i];
    const parsedSlug = JSON.parse(item.slug).uz;
    const { data: existing } = await supabase
      .from('products')
      .select('id, slug')
      .ilike('slug', `%${parsedSlug}%`);

    if (existing && existing.length > 0) {
      console.log(`Updating product [${i + 1}/24]: ${JSON.parse(item.name).uz.slice(0, 40)} (ID: ${existing[0].id})`);
      const { error } = await supabase.from('products').update(item).eq('id', existing[0].id);
      if (error) console.error(`Update error for ${parsedSlug}:`, error);
    } else {
      console.log(`Inserting product [${i + 1}/24]: ${JSON.parse(item.name).uz.slice(0, 40)}`);
      const { error } = await supabase.from('products').insert([item]);
      if (error) console.error(`Insert error for ${parsedSlug}:`, error);
    }
  }

  console.log('--- All 24 products inserted/updated into Supabase! ---');
  return processedProducts;
}

if (process.argv[1]?.endsWith('prepare_yangi_yil_products.mjs')) {
  prepareAndInsertYangiYilProducts()
    .then(() => console.log('Import completed successfully!'))
    .catch(err => {
      console.error('Import failed:', err);
      process.exit(1);
    });
}
