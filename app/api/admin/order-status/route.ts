import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserId, getServiceSupabaseClient } from '@/lib/checkout.server';
import { isAdminUser } from '@/lib/admin';

const STATUS_MESSAGES: Record<string, string> = {
  "To'landi": "✅ Buyurtmangiz tasdiqlandi va qabul qilindi! Tez orada yetkazib beramiz.",
  Yetkazilmoqda: "🚚 Buyurtmangiz yo'lga chiqdi! Kuryer tez orada siz bilan bog'lanadi.",
  Yakunlandi: "🎉 Buyurtmangiz muvaffaqiyatli yetkazib berildi! Xaridingiz uchun rahmat, yana kutib qolamiz!",
  'Bekor qilindi': "❌ Buyurtmangiz bekor qilindi. Savollar bo'lsa biz bilan bog'laning: +998996448444",
};

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const userId = await getAuthenticatedUserId(authHeader);
    const isAdmin = await isAdminUser(userId);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admins only' }, { status: 403 });
    }

    const { orderId, status } = await req.json();
    if (!orderId || !status) {
      return NextResponse.json({ error: 'orderId va status majburiy' }, { status: 400 });
    }

    const supabase = getServiceSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase service client topilmadi' }, { status: 500 });
    }

    const { data: existingOrder, error: fetchErr } = await supabase
      .from('orders')
      .select('id, status, items, telegram_id, total')
      .eq('id', orderId)
      .single();

    if (fetchErr || !existingOrder) {
      return NextResponse.json({ error: 'Buyurtma topilmadi' }, { status: 404 });
    }

    // Restore stock if transitioning to 'Bekor qilindi'
    if (status === 'Bekor qilindi' && existingOrder.status !== 'Bekor qilindi') {
      const items = Array.isArray(existingOrder.items) ? existingOrder.items : [];
      for (const item of items) {
        const productId = Number(item?.id);
        const qty = Number(item?.quantity);
        if (productId && qty > 0) {
          const { data: prod } = await supabase
            .from('products')
            .select('stock')
            .eq('id', productId)
            .single();
          if (prod && typeof prod.stock === 'number') {
            await supabase
              .from('products')
              .update({ stock: prod.stock + qty })
              .eq('id', productId);
          }
        }
      }
    }

    const { error: updateErr } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (updateErr) {
      throw updateErr;
    }

    // Notify customer on Telegram if telegram_id exists
    let notifiedTelegram = false;
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (token && existingOrder.telegram_id && STATUS_MESSAGES[status]) {
      try {
        const text =
          `📦 <b>Buyurtma #${existingOrder.id}</b>\n\n` +
          `${STATUS_MESSAGES[status]}`;
        const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: existingOrder.telegram_id,
            text,
            parse_mode: 'HTML',
          }),
        });
        notifiedTelegram = tgRes.ok;
      } catch {
        // ignore telegram error
      }
    }

    return NextResponse.json({
      success: true,
      notifiedTelegram,
    });
  } catch (err: any) {
    console.error('Order status API error:', err);
    return NextResponse.json({ error: err?.message || 'Server xatoligi' }, { status: 500 });
  }
}
