import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIp } from '../../../lib/rateLimit';
import { normalizePhone } from '../../../lib/checkout.server';

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`order-tracking:${getClientIp(req)}`, 15, 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: 'Juda ko‘p urinish. Birozdan keyin qayta urinib ko‘ring.' }, { status: 429 });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Order tracking server credentials are missing' }, { status: 500 });
  }

  try {
    const { phone, orderId } = await req.json();
    const rawPhone = String(phone || '').trim();
    const normalizedPhone = normalizePhone(phone);
    const digits = rawPhone.replace(/\D/g, '').slice(-9);
    const normalizedOrderId = String(orderId || '').trim().replace(/^#/, '');

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
      query = query.ilike('id', `%${normalizedOrderId}%`);
    }

    const { data, error } = await query.limit(20);

    if (error) {
      throw error;
    }

    const orders = (data || []).map((order) => ({
      ...order,
      total: Number(order.total || 0),
      items: Array.isArray(order.items) ? order.items : [],
    }));

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Order tracking API error:', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
