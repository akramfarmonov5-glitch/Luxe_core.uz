import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Order tracking server credentials are missing' }, { status: 500 });
  }

  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone is required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { data, error } = await supabase
      .from('orders')
      .select('id, customerName, phone, total, status, date, paymentMethod, items, created_at')
      .eq('phone', phone)
      .order('created_at', { ascending: false })
      .limit(20);

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
