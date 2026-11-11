/**
 * Order tracking maskalash smoke-testi — `lib/orderMask.ts`.
 *
 * Ishlatish:
 *   node --experimental-strip-types scripts/check_order_mask.mjs
 */
import assert from 'node:assert/strict';
import { maskOrderId, hasSecondFactor } from '../lib/orderMask.ts';

const DOT = '\u2022';

assert.equal(maskOrderId(''), DOT.repeat(4), "bo'sh ID");
assert.equal(maskOrderId('12'), DOT.repeat(2), 'qisqa ID (4 dan kam)');
assert.equal(maskOrderId('1234'), DOT.repeat(4), 'aynan 4 belgi');

const longId = 'ORD-1730000000000-AB12CD34';
const masked = maskOrderId(longId);
const expectedDots = Math.min(longId.length - 4, 20);

assert.equal(masked.slice(-4), 'CD34', 'oxirgi 4 belgi saqlanadi');
assert.equal(masked, `${DOT.repeat(expectedDots)}CD34`, 'faqat oxirgi 4 belgi ko`rinadi');
assert.equal(masked.length, expectedDots + 4, 'maskalangan uzunlik to`g`ri');
assert.ok(!masked.includes('ORD'), 'prefiks oshkor bo`lmaydi');
assert.ok(!masked.includes('1730000000000'), 'raqam qismi oshkor bo`lmaydi');

assert.equal(hasSecondFactor(''), false);
assert.equal(hasSecondFactor(null), false);
assert.equal(hasSecondFactor('OR1'), false, '6 belgidan kam — ikkinchi omil emas');
assert.equal(hasSecondFactor('ORD-123'), true, '6 belgi — yetarli');
assert.equal(hasSecondFactor('  ORD-123  '), true, 'bo`sh joylar hisobga olinmaydi');

console.log('✅ order-mask smoke-test: barcha holatlar o`tdi');
