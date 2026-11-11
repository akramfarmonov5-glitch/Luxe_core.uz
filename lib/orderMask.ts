/**
 * Buyurtma ID sini maskalash.
 *
 * Order tracking API'sida ikkinchi omil (buyurtma ID) tasdiqlanmaganda
 * buyurtma raqami to'liq ko'rsatilmaydi: oxirgi 4 belgi qoladi.
 * `ORD-1730000000000-AB12CD34` → `••••••••••••••CD34`
 */
export function maskOrderId(orderId: string): string {
  const value = String(orderId || '');
  if (!value) return '••••';
  if (value.length <= 4) return '•'.repeat(value.length);
  return `${'•'.repeat(Math.min(value.length - 4, 20))}${value.slice(-4)}`;
}

/** Ikkinchi omil (buyurtma ID) sifatida qabul qilish uchun minimal uzunlik. */
export const ORDER_ID_SECOND_FACTOR_MIN_LENGTH = 6;

export function hasSecondFactor(orderId: string | null | undefined): boolean {
  return String(orderId || '').trim().length >= ORDER_ID_SECOND_FACTOR_MIN_LENGTH;
}
