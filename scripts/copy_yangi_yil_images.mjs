import fs from 'fs';
import path from 'path';

const srcDir = 'C:\\Users\\pc\\Desktop\\yangi yil\\png';
const destDir = path.resolve('public', 'products', 'yangi-yil');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.png'));
console.log(`Found ${files.length} PNG files in ${srcDir}`);

const mapped = [];

for (const file of files) {
  // Normalize filename: "yangi  yil karobkalar optom 1.png" -> "yangi-yil-karobkalar-optom-1.png"
  const normalized = file
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\.-]/g, '');

  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, normalized);

  fs.copyFileSync(srcPath, destPath);
  mapped.push({
    original: file,
    normalized,
    publicUrl: `/products/yangi-yil/${normalized}`
  });
}

console.log(`Successfully copied ${mapped.length} images to ${destDir}!`);
console.log('Sample images:', mapped.slice(0, 5));
