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
      .select('id, status, items, telegram_user_id, phone, total')
      .eq('id', orderId)
      .single();

    if (fetchErr || !existingOrder) {
      return NextResponse.json({ error: 'Buyurtma topilmadi' }, { status: 404 });
    }

    // Restore stock if transitioning to 'Bekor qilindi'
    if (status === 'Bekor qilindi' && existingOrder.status !== 'Bekor qilindi') {
      const items = Array.isArray(existingOrder.items) ? existingOrder.items : [];
      for (const item of items) {
        const productId = Number(item?.id ?? item?.productId);
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

    // Resolve customer's Telegram chat ID (direct or via phone lookup in bot_users)
    let targetTelegramId: number | null = existingOrder.telegram_user_id
      ? Number(existingOrder.telegram_user_id)
      : null;

    if (!targetTelegramId && existingOrder.phone) {
      const digits = String(existingOrder.phone).replace(/\D/g, '').slice(-9);
      if (digits.length === 9) {
        const { data: botUser } = await supabase
          .from('bot_users')
          .select('telegram_id')
          .ilike('phone', `%${digits}%`)
          .limit(1)
          .maybeSingle();
        if (botUser?.telegram_id) {
          targetTelegramId = Number(botUser.telegram_id);
        }
      }
    }

    let notifiedTelegram = false;
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (token && targetTelegramId && STATUS_MESSAGES[status]) {
      try {
        const text =
          `📦 <b>Buyurtma #${existingOrder.id}</b>\n\n` +
          `${STATUS_MESSAGES[status]}`;
        const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: targetTelegramId,
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
