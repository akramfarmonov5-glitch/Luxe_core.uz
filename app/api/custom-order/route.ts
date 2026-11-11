import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIp } from '../../../lib/rateLimit';
import { getErrorMessage } from '../../../lib/errors';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(req: NextRequest) {
  const rateLimit = await checkRateLimit(`custom-order:${getClientIp(req)}`, 5, 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: 'Juda ko‘p urinish. Birozdan keyin qayta urinib ko‘ring.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const name = String(body.name || '').trim().slice(0, 120);
    const phone = String(body.phone || '').trim().slice(0, 40);
    const packageType = String(body.packageType || '').trim().slice(0, 120);
    const quantity = String(body.quantity || '1000+ dona').trim().slice(0, 60);
    const notes = String(body.notes || '').trim().slice(0, 500);

    if (!name || phone.replace(/\D/g, '').length < 7) {
      return NextResponse.json({ error: 'Ism va telefon raqamingizni to‘g‘ri kiriting.' }, { status: 400 });
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from('leads').insert([
        {
          id: `lead_${Date.now()}`,
          name: `${name} (Logotip B2B)`,
          phone,
          last_message: `Logotip tushirish: ${packageType} | Tiraj: ${quantity}${notes ? ` | Izoh: ${notes}` : ''}`,
          created_at: new Date().toISOString(),
        },
      ]);
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (token && chatId) {
      const msg =
        `🎨 <b>YANGI LOGOTIP / BREND BUYURTMA (B2B)</b>\n\n` +
        `👤 <b>Mijoz / Brend:</b> ${escapeHtml(name)}\n` +
        `📞 <b>Telefon:</b> ${escapeHtml(phone)}\n` +
        `📦 <b>Qadoq turi:</b> ${escapeHtml(packageType || 'Belgilanmagan')}\n` +
        `🔢 <b>Tiraj:</b> ${escapeHtml(quantity)}\n` +
        (notes ? `📝 <b>Izoh:</b> ${escapeHtml(notes)}\n` : '') +
        `\n⏰ <i>Manba: luxe-core.uz (Logotip buyurtma oynasi)</i>`;

      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: msg,
          parse_mode: 'HTML',
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ error: getErrorMessage(error, 'Server xatosi') }, { status: 500 });
  }
}
