import { NextRequest, NextResponse } from 'next/server';
import {
  calculateCheckoutPricing,
  loadCheckoutProducts,
  normalizeCheckoutItems,
} from '../../../../lib/checkout.server';
import { checkRateLimit, getClientIp } from '../../../../lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const { items, promoCode, source, telegramUserId } = await req.json();
    const isTelegramBot = source === 'telegram-bot';

    if (isTelegramBot) {
      const expectedSecret = process.env.BOT_INTERNAL_SECRET;
      if (!expectedSecret || req.headers.get('x-bot-secret') !== expectedSecret) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }

      if (!Number.isSafeInteger(Number(telegramUserId)) || Number(telegramUserId) <= 0) {
        return NextResponse.json({ error: 'Invalid telegram user id' }, { status: 400 });
      }
    }

    const rateLimitKey = isTelegramBot
      ? `checkout-quote:telegram:${Number(telegramUserId)}`
      : `checkout-quote:${getClientIp(req)}`;
    const rateLimit = checkRateLimit(rateLimitKey, isTelegramBot ? 60 : 30, 5 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Juda ko‘p urinish. Birozdan keyin qayta urinib ko‘ring.' }, { status: 429 });
    }

    const normalizedItems = normalizeCheckoutItems(items);
    const products = await loadCheckoutProducts(normalizedItems);
    const pricing = await calculateCheckoutPricing(normalizedItems, products, promoCode);

    return NextResponse.json(pricing);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Narxni hisoblashda xatolik yuz berdi' }, { status: 400 });
  }
}
