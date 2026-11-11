/**
 * Optom (ulgurji) narx hisobi — YAGONA manba.
 *
 * Ilgari bu mantiq ikki joyda nusxalangan edi:
 *   - lib/checkout.server.ts (server: buyurtma va quote)
 *   - context/CartContext.tsx (klient: savat)
 * Natijada ular ajralib ketishi mumkin edi, shuning uchun bitta modulga yig'ildi.
 *
 * MUHIM: yaxlitlash HAR DOIM pastga (Math.floor).
 * Avval Math.round ishlatilgani uchun 240 dona narxi 500+ pog'onada 250 ga
 * ko'tarilib, "chegirma" narxni oshirib yuborardi.
 */

export const WHOLESALE_TIER_500 = 500;
export const WHOLESALE_TIER_1000 = 1000;
export const WHOLESALE_DISCOUNT_500 = 0.05;
export const WHOLESALE_DISCOUNT_1000 = 0.1;

/** Narx shu qadamgacha yaxlitlanadi (so'm). */
const PRICE_ROUNDING_STEP = 50;
/** Eng past ruxsat etilgan dona narxi (so'm). */
const MIN_UNIT_PRICE = 50;

export function getWholesaleDiscountRate(quantity: number): number {
  if (quantity >= WHOLESALE_TIER_1000) return WHOLESALE_DISCOUNT_1000;
  if (quantity >= WHOLESALE_TIER_500) return WHOLESALE_DISCOUNT_500;
  return 0;
}

export function getWholesaleUnitPrice(basePrice: number, quantity: number): number {
  const cleanBase = Number(basePrice || 0);
  if (!Number.isFinite(cleanBase) || cleanBase <= 0) return 0;

  const discountRate = getWholesaleDiscountRate(quantity);
  if (discountRate === 0) return cleanBase;

  const discounted = cleanBase * (1 - discountRate);
  const roundedDown =
    Math.floor(discounted / PRICE_ROUNDING_STEP) * PRICE_ROUNDING_STEP;

  // Hech qachon bazaviy narxdan oshmaydi va minimal chegaradan pastga tushmaydi.
  return Math.min(cleanBase, Math.max(MIN_UNIT_PRICE, roundedDown));
}

/** Keyingi chegirma pog'onasigacha qancha dona qolgani (motivatsion indikator uchun). */
export function getQuantityToNextTier(quantity: number): number {
  if (quantity < WHOLESALE_TIER_500) return WHOLESALE_TIER_500 - quantity;
  if (quantity < WHOLESALE_TIER_1000) return WHOLESALE_TIER_1000 - quantity;
  return 0;
}
