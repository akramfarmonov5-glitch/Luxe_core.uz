import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

/**
 * ESLint 9 flat config (`.eslintrc.json` o'rniga).
 *
 * `eslint-config-next@16` flat config massiv yoki obyekt qaytarishi mumkin,
 * shuning uchun ikkala shaklni ham qo'llab-quvvatlaymiz.
 */
const asArray = (config) => (Array.isArray(config) ? config : [config]);

/**
 * Hozirgi kod bazasida `any` va "setState in effect" holatlari ko'p.
 * Ular `error` bo'lsa lint butunlay to'xtaydi, shuning uchun `warn` ga
 * tushirildi — yangi kodda bu qoidalarni qayta `error` qilish tavsiya etiladi
 * (texnik qarz ro'yxatida turibdi).
 */
const projectRules = {
  rules: {
    // Apostroflar o'zbek matnlarida ko'p — shovqin qiladi.
    'react/no-unescaped-entities': 'off',
    // Admin panelda tashqi URL rasmlari uchun oddiy <img> ishlatiladi.
    '@next/next/no-img-element': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react-hooks/set-state-in-effect': 'warn',
    // Effektlar funksiya e'lonidan keyinga ko'chirildi — bu qoida endi `error`.
    'react-hooks/immutability': 'error',
  },
};

const ignoredPaths = {
  // Bot o'z tsconfig/lintiga ega; build chiqimlari va statik fayllar tekshirilmaydi.
  ignores: ['.next/**', 'node_modules/**', 'bot/**', 'public/**', 'dist/**', 'scripts/**'],
};

const config = [...asArray(nextVitals), ...asArray(nextTs), projectRules, ignoredPaths];

export default config;
