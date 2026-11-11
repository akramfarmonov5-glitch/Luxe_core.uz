/**
 * Narx hisobi smoke-testi — `lib/pricing.ts`.
 *
 * Ishlatish:
 *   node --experimental-strip-types scripts/check_pricing.mjs
 *
 * Maqsad: optom pog'onalarida "chegirma" narxni oshirmasligini kafolatlash.
 */
import assert from 'node:assert/strict';
import { getWholesaleUnitPrice, getQuantityToNextTier } from '../lib/pricing.ts';

const cases = [
  // [baza, dona, kutilgan, izoh]
  [1000, 100, 1000, 'bazaviy pogona (chegirma yo`q)'],
  [1200, 500, 1100, '500+ = -5%, pastga yaxlitlash'],
  [1200, 1000, 1050, '1000+ = -10%, pastga yaxlitlash'],
  [240, 500, 200, 'avval 250 chiqardi (narx oshardi)'],
  [240, 1000, 200, '1000+ pastga yaxlitlash'],
  [199, 1000, 150, 'avval 200 chiqardi (narx oshardi)'],
  [499, 500, 450, '499 → 450'],
  [750, 1000, 650, '750 → 650'],
  [30, 1000, 30, 'baza 50 dan kichik — o`zgarmaydi'],
  [0, 1000, 0, 'nol baza'],
  [-5, 500, 0, 'manfiy baza'],
];

for (const [base, qty, expected, note] of cases) {
  const actual = getWholesaleUnitPrice(base, qty);
  assert.equal(actual, expected, `${base}×${qty}: kutilgan ${expected}, chiqdi ${actual} (${note})`);
}

// Invariant: chegirmali narx hech qachon bazaviy narxdan oshmaydi.
for (const base of [1, 49, 50, 99, 199, 240, 300, 499, 500, 750, 999, 1200, 15000, 95000]) {
  for (const qty of [1, 499, 500, 999, 1000, 5000]) {
    const price = getWholesaleUnitPrice(base, qty);
    assert.ok(price <= base, `${base}×${qty}: ${price} > ${base} — chegirma narxni oshirdi`);
    assert.ok(price >= 0, `${base}×${qty}: manfiy narx`);
  }
}

assert.equal(getQuantityToNextTier(120), 380);
assert.equal(getQuantityToNextTier(700), 300);
assert.equal(getQuantityToNextTier(1500), 0);

console.log(`✅ pricing smoke-test: ${cases.length} ta holat + invariantlar o'tdi`);
