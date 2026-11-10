import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIp } from '../../../lib/rateLimit';
import { normalizePhone } from '../../../lib/checkout.server';

const MAX_ORDERS_FULL = 3;
const MAX_ORDERS_LIMITED = 3;

// `ilike` da `%` va `_` — wildcard. Foydalanuvchi kiritgan qiymat ular bilan
// tozalanmasa, `%` yuborib telefon raqamiga tegishli BARCHA buyurtmalarni
// tanlab olish mumkin edi.
function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

function sanitizeOrderId(value: unknown): string {
  return String(value || '')
    .trim()
    .replace(/^#+/, '')
    .replace(/[^A-Za-z0-9-]/g, '')
    .slice(0, 40);
}

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`order-tracking:${getClientIp(req)}`, 10, 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: 'Juda ko‘p urinish. Birozdan keyin qayta urinib ko‘ring.' }, { status: 429 });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Order tracking server credentials are missing' }, { status: 500 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const rawPhone = String(body?.phone || '').trim();
    const normalizedPhone = normalizePhone(rawPhone);
    const digits = rawPhone.replace(/\D/g, '').slice(-9);
    const normalizedOrderId = sanitizeOrderId(body?.orderId);

    if (digits.length < 9) {
      return NextResponse.json({ error: 'Valid phone is required' }, { status: 400 });
    }

    const formattedWithSpaces = `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
    const compactPlus = `+998${digits}`;
    const compact998 = `998${digits}`;
    const phoneVariants = [...new Set([rawPhone, normalizedPhone, formattedWithSpaces, compactPlus, compact998, digits].filter(Boolean))];

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    let query = supabase
      .from('orders')
      .select('id, customerName, phone, total, status, date, paymentMethod, items, created_at')
      .in('phone', phoneVariants)
      .order('created_at', { ascending: false });

    if (normalizedOrderId) {
      query = query.ilike('id', `%${escapeLikePattern(normalizedOrderId)}%`);
    }

    const limit = normalizedOrderId ? MAX_ORDERS_FULL : MAX_ORDERS_LIMITED;
    const { data, error } = await query.limit(limit);

    if (error) {
      throw error;
    }

    const hasSecondFactor = normalizedOrderId.length >= 6;

    const orders = (data || []).map((order) => {
      const base = {
        id: order.id,
        total: Number(order.total || 0),
        status: order.status,
        date: order.date,
        paymentMethod: order.paymentMethod,
        items: Array.isArray(order.items) ? order.items : [],
        created_at: order.created_at,
      };

      // Ikkinchi omil (buyurtma ID) tasdiqlanmagan bo'lsa, shaxsiy
      // ma'lumotlar (ism, telefon) qaytarilmaydi.
      if (!hasSecondFactor) {
        return { ...base, customerName: null, phone: null };
      }

      return {
        ...base,
        customerName: order.customerName,
        phone: order.phone,
      };
    });

    return NextResponse.json({
      orders,
      limited: !hasSecondFactor,
      ...(hasSecondFactor ? {} : {
        hint: 'To‘liq ma’lumot uchun telefon raqam bilan birga buyurtma ID sini kiriting.',
      }),
    });
  } catch (error: any) {
    console.error('Order tracking API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
