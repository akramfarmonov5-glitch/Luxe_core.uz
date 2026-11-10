import fs from 'fs';
import path from 'path';

const rawData = JSON.parse(fs.readFileSync('scripts/yangi_yil_products_data.json', 'utf8'));

// Format products for constants.ts
const yangiYilProducts = rawData.map((item, idx) => {
  const nameObj = JSON.parse(item.name);
  const slugObj = JSON.parse(item.slug);
  const descObj = JSON.parse(item.description);

  return {
    id: 101 + idx,
    name: nameObj,
    slug: slugObj,
    price: item.price,
    formattedPrice: `${item.price.toLocaleString('uz-UZ')} UZS`,
    category: 'yangi-yil-2027',
    image: item.image,
    images: item.images,
    shortDescription: descObj,
    itemsPerPackage: item.itemsPerPackage,
    stock: item.stock,
    is_bestseller: item.is_bestseller,
    is_premium: item.is_premium,
    specs: item.specifications
  };
});

const constantsPath = path.resolve('constants.ts');
let content = fs.readFileSync(constantsPath, 'utf8').replace(/\r\n/g, '\n');

// Update cat_1 image to local PNG
content = content.replace(
  `image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop',\n    description: 'Yangi Yil 2027`,
  `image: '/products/yangi-yil/yangi-yil-karobkalar-optom-1.png',\n    description: 'Yangi Yil 2027`
);

// Find MOCK_PRODUCTS slice to replace (from export const MOCK_PRODUCTS: Product[] = [ up to id: 4)
const startMarker = 'export const MOCK_PRODUCTS: Product[] = [';
const endMarker = '  {\n    id: 4,\n    name: "Magnitli Premium Oq Quti",';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found in constants.ts');
  process.exit(1);
}

// Convert objects to clean formatted TS string
function formatObj(obj, indent = 2) {
  const pad = ' '.repeat(indent);
  const innerPad = ' '.repeat(indent + 2);
  const lines = ['{'];
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') {
      lines.push(`${innerPad}${k}: ${JSON.stringify(v)},`);
    } else if (typeof v === 'number' || typeof v === 'boolean') {
      lines.push(`${innerPad}${k}: ${v},`);
    } else if (Array.isArray(v)) {
      lines.push(`${innerPad}${k}: ${JSON.stringify(v)},`);
    } else if (typeof v === 'object' && v !== null) {
      lines.push(`${innerPad}${k}: ${JSON.stringify(v)},`);
    }
  }
  lines.push(`${pad}}`);
  return lines.join('\n');
}

const formattedYangiYil = yangiYilProducts.map(p => '  ' + formatObj(p, 2)).join(',\n') + ',\n';

const newContent = content.slice(0, startIndex + startMarker.length) + '\n' + formattedYangiYil + content.slice(endIndex);

fs.writeFileSync(constantsPath, newContent, 'utf8');
console.log('constants.ts updated successfully with 24 Yangi Yil products!');
