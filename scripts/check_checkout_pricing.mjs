/**
 * Checkout narx hisobi testi — `lib/checkout.server.ts`.
 *
 * Supabase'ga murojaat qilmaydi: promo-kod resolver inject qilinadi.
 * Ishlatish:
 *   node --experimental-strip-types scripts/check_checkout_pricing.mjs
 */
import assert from 'node:assert/strict';
import {
  calculateCheckoutPricing,
  normalizeCheckoutItems,
  MIN_ORDER_AMOUNT,
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
} from '../lib/checkout.server.ts';

/** Test uchun soxta mahsulot. */
const product = (id, price, extra = {}) => ({
  id,
  name: { uz: `Mahsulot ${id}`, ru: `Товар ${id}`, en: `Product ${id}` },
  price,
  image: '/logo.jpg',
  category: 'sovga-qutilari',
  stock: 100000,
  itemsPerPackage: 10,
  ...extra,
});

const noPromo = async (code) => ({
  normalizedPromo: String(code || '').toUpperCase(),
  promoRate: undefined,
  promoStatus: code ? 'invalid' : 'none',
});

const tenPercent = async (code) => ({
  normalizedPromo: String(code || '').toUpperCase(),
  promoRate: 0.1,
  promoStatus: 'valid',
});

// --- 1. Oddiy hisob (bazaviy narx, yetkazish to'lovi) ---
{
  const products = [product(1, 20000)];
  const items = [{ id: 1, quantity: 10 }]; // 200 000 — minimal summa chegarasida
  const pricing = await calculateCheckoutPricing(items, products, null, noPromo);

  assert.equal(pricing.subtotal, 200000, 'subtotal');
  assert.equal(pricing.discountAmount, 0, 'chegirma yo`q');
  assert.equal(pricing.deliveryFee, DELIVERY_FEE, 'yetkazish to`lovi');
  assert.equal(pricing.total, 200000 + DELIVERY_FEE, 'jami');
  assert.equal(pricing.meetsMinimumOrderAmount, true, 'minimal summa');
  assert.equal(pricing.promoStatus, 'none', 'promo holati');
}

// --- 2. 500+ pog'onasida -5% va pastga yaxlitlash ---
{
  const products = [product(2, 1200)];
  const items = [{ id: 2, quantity: 500 }];
  const pricing = await calculateCheckoutPricing(items, products, null, noPromo);

  assert.equal(pricing.subtotal, 1100 * 500, '500+ pog`ona narxi');
  assert.equal(pricing.meetsMinimumOrderAmount, true, 'minimal summa');
}

// --- 3. Bepul yetkazish chegarasi (2 mln) ---
{
  const products = [product(3, 250000)];
  const items = [{ id: 3, quantity: 10 }]; // 2 500 000
  const pricing = await calculateCheckoutPricing(items, products, null, noPromo);

  assert.equal(pricing.subtotal, 2500000, 'subtotal');
  assert.equal(pricing.deliveryFee, 0, 'bepul yetkazish');
  assert.ok(pricing.subtotal >= FREE_DELIVERY_THRESHOLD, 'chegaradan yuqori');
}

// --- 4. Promo-kod chegirmasi (10%) ---
{
  const products = [product(4, 100000)];
  const items = [{ id: 4, quantity: 10 }]; // 1 000 000
  const pricing = await calculateCheckoutPricing(items, products, 'LUXE10', tenPercent);

  assert.equal(pricing.subtotal, 1000000, 'subtotal');
  assert.equal(pricing.discountAmount, 100000, '10% chegirma');
  assert.equal(pricing.appliedPromo, 'LUXE10', 'qo`llangan promo');
  assert.equal(pricing.promoValid, true, 'promo valid');
  assert.equal(pricing.promoStatus, 'valid', 'promo holati');
}

// --- 5. Minimal summadan past buyurtma ---
{
  const products = [product(5, 10000)];
  const items = [{ id: 5, quantity: 10 }]; // 100 000
  const pricing = await calculateCheckoutPricing(items, products, null, noPromo);

  assert.equal(pricing.subtotal, 100000, 'subtotal');
  assert.equal(pricing.meetsMinimumOrderAmount, false, 'minimal summadan past');
  assert.equal(pricing.minimumOrderAmount, MIN_ORDER_AMOUNT, 'minimal summa qiymati');
}

// --- 6. Yetarli qoldiq bo'lmasa xato ---
{
  const products = [product(6, 20000, { stock: 5 })];
  await assert.rejects(
    calculateCheckoutPricing([{ id: 6, quantity: 10 }], products, null, noPromo),
    /yetarli stock mavjud emas/,
    'qoldiq yetmasa xato',
  );
}

// --- 7. Items normalizatsiyasi (bir xil id lar qo'shiladi, noto'g'ri qiymat rad etiladi) ---
{
  const normalized = normalizeCheckoutItems([
    { id: 1, quantity: 10 },
    { id: 1, quantity: 5 },
    { id: 2, quantity: 3 },
  ]);
  assert.deepEqual(normalized, [
    { id: 1, quantity: 15 },
    { id: 2, quantity: 3 },
  ], 'bir xil id lar birlashtiriladi');

  assert.throws(() => normalizeCheckoutItems([{ id: 0, quantity: 1 }]), /Invalid product id/);
  assert.throws(() => normalizeCheckoutItems([{ id: 1, quantity: -1 }]), /Invalid product quantity/);
  assert.throws(() => normalizeCheckoutItems([]), /At least one item is required/);
  assert.throws(() => normalizeCheckoutItems('x'), /Items must be an array/);
}

console.log('✅ checkout-pricing test: 7 blok (subtotal, pog`ona, yetkazish, promo, min summa, stock, normalize) o`tdi');
