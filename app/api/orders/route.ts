import { NextRequest, NextResponse } from 'next/server';
import {
  MIN_ORDER_AMOUNT,
  calculateCheckoutPricing,
  createOrderId,
  getAuthenticatedUserId,
  getServiceSupabaseClient,
  loadCheckoutProducts,
  normalizeCheckoutItems,
  normalizePhone,
  toOrderItems,
} from '../../../lib/checkout.server';
import { checkRateLimit, getClientIp } from '../../../lib/rateLimit';

type OrderSource = 'checkout' | 'quick-buy' | 'telegram-bot';
type PaymentMethod = 'paynet' | 'cash' | 'card';

export async function POST(req: NextRequest) {
  const supabase = getServiceSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Order server credentials are missing' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const source = body.source as OrderSource;
    const paymentMethod = body.paymentMethod as PaymentMethod;
    const telegramUserId = Number(body.telegramUserId);
    const firstName = String(body.firstName || '').trim();
    const lastName = String(body.lastName || '').trim();
    const address = String(body.address || '').trim();
    const city = String(body.city || '').trim();
    const phone = normalizePhone(body.phone);
    const promoCode = String(body.promoCode || '').trim();

    if (source !== 'checkout' && source !== 'quick-buy' && source !== 'telegram-bot') {
      return NextResponse.json({ error: 'Invalid order source' }, { status: 400 });
    }

    if (source === 'telegram-bot') {
      const expectedSecret = process.env.BOT_INTERNAL_SECRET;
      if (!expectedSecret || req.headers.get('x-bot-secret') !== expectedSecret) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }

      if (!Number.isSafeInteger(telegramUserId) || telegramUserId <= 0) {
        return NextResponse.json({ error: 'Invalid telegram user id' }, { status: 400 });
      }
    }

    const rateLimitKey = source === 'telegram-bot'
      ? `orders:telegram:${telegramUserId}`
      : `orders:${getClientIp(req)}`;
    const rateLimit = checkRateLimit(rateLimitKey, source === 'telegram-bot' ? 20 : 12, 5 * 60 * 1000);
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: 'Juda ko‘p buyurtma urinishlari. Birozdan keyin qayta urinib ko‘ring.' }, { status: 429 });
    }

    if (paymentMethod !== 'paynet' && paymentMethod !== 'cash' && paymentMethod !== 'card') {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
    }

    if (!firstName) {
      return NextResponse.json({ error: 'First name is required' }, { status: 400 });
    }

    if (phone.length < 9) {
      return NextResponse.json({ error: 'Valid phone number is required' }, { status: 400 });
    }

    if (source === 'checkout') {
      if (!lastName) {
        return NextResponse.json({ error: 'Last name is required' }, { status: 400 });
      }
      if (!address) {
        return NextResponse.json({ error: 'Address is required' }, { status: 400 });
      }
      if (!city) {
        return NextResponse.json({ error: 'City is required' }, { status: 400 });
      }
    }

    if (source === 'telegram-bot' && !address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const items = normalizeCheckoutItems(body.items);
    const products = await loadCheckoutProducts(items);
    const pricing = await calculateCheckoutPricing(items, products, promoCode);

    if (source !== 'quick-buy' && pricing.subtotal < MIN_ORDER_AMOUNT) {
      return NextResponse.json({ error: 'Minimal buyurtma summasi yetarli emas' }, { status: 400 });
    }

    const orderId = createOrderId(
      source === 'quick-buy'
        ? 'QORD'
        : source === 'telegram-bot'
          ? 'TORD'
          : 'ORD',
    );
    const orderItems = toOrderItems(items, products);
    const userId = await getAuthenticatedUserId(req.headers.get('authorization'));
    const customerName = `${firstName} ${lastName}`.trim();
    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase.from('orders').insert({
      id: orderId,
      customerName,
      phone,
      total: pricing.total,
      status: 'Kutilmoqda',
      paymentMethod: toStoredPaymentMethod(paymentMethod),
      date: today,
      user_id: userId,
      items: orderItems,
      shipping_address: address || null,
      city: city || null,
      telegram_user_id: source === 'telegram-bot' ? telegramUserId : null,
    });

    if (error) {
      throw error;
    }

    if (source !== 'telegram-bot') {
      await sendTelegramNotification({
        orderId,
        customerName,
        phone,
        address,
        city,
        paymentMethod,
        items: orderItems,
        pricing,
      });
    }

    return NextResponse.json({
      orderId,
      ...pricing,
      items: orderItems,
      paymentMethod: toStoredPaymentMethod(paymentMethod),
    });
  } catch (error: any) {
    console.error('Order creation API error:', error);
    const message = error?.message || 'Buyurtma yaratishda xatolik yuz berdi';
    return NextResponse.json(
      { error: message },
      { status: isClientOrderError(message) ? 400 : 500 },
    );
  }
}

async function sendTelegramNotification({
  orderId,
  customerName,
  phone,
  address,
  city,
  paymentMethod,
  items,
  pricing,
}: {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: PaymentMethod;
  items: Array<{ id: number; name: string; quantity: number; price: number }>;
  pricing: {
    discountAmount: number;
    deliveryFee: number;
    total: number;
    appliedPromo: string | null;
  };
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return;
  }

  const itemsList = items
    .map((item, index) =>
      `${index + 1}. ${item.name} (x${item.quantity}) - ${formatPrice(item.price * item.quantity)}`,
    )
    .join('\n');
  const discountInfo = pricing.appliedPromo
    ? `\n🏷 <b>Promo:</b> ${pricing.appliedPromo} (-${formatPrice(pricing.discountAmount)})`
    : '';
  const deliveryInfo = pricing.deliveryFee > 0
    ? `\n🚚 <b>Yetkazib berish:</b> ${formatPrice(pricing.deliveryFee)}`
    : '\n🚚 <b>Yetkazib berish:</b> Bepul';
  const paymentLabel =
    paymentMethod === 'paynet'
      ? '📲 Paynet (Onlayn)'
      : paymentMethod === 'card'
        ? '💳 Kartadan kartaga'
        : '💵 Naqd (Yetkazilganda)';
  const addressLine = address || city ? `\n📍 <b>Manzil:</b> ${[city, address].filter(Boolean).join(', ')}` : '';

  const message = `
📦 <b>YANGI BUYURTMA! (LUXECORE)</b>

🧾 <b>ID:</b> ${orderId}
👤 <b>Mijoz:</b> ${customerName}
☎️ <b>Tel:</b> ${phone}${addressLine}

💳 <b>To'lov turi:</b> ${paymentLabel}

🛒 <b>Mahsulotlar:</b>
${itemsList}

------------------${discountInfo}${deliveryInfo}
💰 <b>JAMI TO'LOV:</b> ${formatPrice(pricing.total)}
  `.trim();

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
    });

    if (!response.ok) {
      console.error('Telegram notification failed:', await response.text());
    }
  } catch (error) {
    console.error('Telegram notification error:', error);
  }
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('uz-UZ').format(value) + ' UZS';
}

function toStoredPaymentMethod(paymentMethod: PaymentMethod) {
  if (paymentMethod === 'paynet') return 'Paynet';
  if (paymentMethod === 'card') return 'Kartadan kartaga';
  return 'Naqd';
}

function isClientOrderError(message: string) {
  return [
    'Items must be an array',
    'Invalid product id',
    'Invalid product quantity',
    'At least one item is required',
    'One or more products were not found',
    'Product lookup failed',
  ].includes(message) || message.includes('uchun yetarli stock mavjud emas');
}
