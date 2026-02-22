import { createClient } from '@supabase/supabase-js';

const formatPrice = (value: number) =>
  `${new Intl.NumberFormat('uz-UZ').format(value)} UZS`;

const getEnv = (key: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return '';
};

const sendTelegram = async (text: string) => {
  const token = getEnv('TELEGRAM_BOT_TOKEN') || getEnv('VITE_TELEGRAM_BOT_TOKEN');
  const chatId = getEnv('TELEGRAM_CHAT_ID') || getEnv('VITE_TELEGRAM_CHAT_ID');
  if (!token || !chatId) return;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    }),
  });
};

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Parse body safely
    let body: any;
    if (typeof req.body === 'string') {
      try { body = JSON.parse(req.body); } catch { body = {}; }
    } else {
      body = req.body || {};
    }

    const orderId = body.orderId || `ORD-${Date.now()}`;
    const firstName = (body.firstName || '').trim();
    const lastName = (body.lastName || '').trim();
    const phone = (body.phone || '').trim();
    const city = (body.city || '').trim();
    const address = (body.address || '').trim();
    const paymentMethod = body.paymentMethod === 'paynet' ? 'Paynet' : 'Naqd';
    const total = Number(body.total || 0);
    const cart = Array.isArray(body.cart) ? body.cart : [];

    if (!firstName || !phone || total <= 0) {
      res.status(400).json({ error: 'Invalid order payload' });
      return;
    }

    // Create Supabase client inside the handler to catch errors properly
    const supabaseUrl = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL');
    const supabaseKey = getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase env vars. SUPABASE_URL:', !!supabaseUrl, 'KEY:', !!supabaseKey);
      res.status(500).json({ error: 'Server konfiguratsiya xatoligi. Iltimos, adminga murojaat qiling.' });
      return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const dateStr = new Date().toISOString().split('T')[0];

    const { error } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        customerName: `${firstName} ${lastName}`.trim(),
        phone,
        total,
        status: 'Kutilmoqda',
        date: dateStr,
        paymentMethod,
      });

    if (error) {
      console.error('Supabase insert error:', error);
      res.status(400).json({ error: error.message });
      return;
    }

    // Build Telegram message
    const cartLines = cart
      .map((item: any, index: number) => {
        const qty = Number(item.quantity || 0);
        const price = Number(item.price || 0);
        return `${index + 1}. ${item.name || 'Mahsulot'} (x${qty}) - ${formatPrice(price * qty)}`;
      })
      .join('\n');

    const telegramText = [
      '<b>YANGI BUYURTMA (LUXECORE)</b>',
      '',
      `<b>ID:</b> ${orderId}`,
      `<b>Mijoz:</b> ${firstName} ${lastName}`.trim(),
      `<b>Tel:</b> ${phone}`,
      `<b>Manzil:</b> ${city}, ${address}`.trim(),
      `<b>To'lov:</b> ${paymentMethod}`,
      '',
      '<b>Mahsulotlar:</b>',
      cartLines || '-',
      '',
      `<b>Jami:</b> ${formatPrice(total)}`,
    ].join('\n');

    try {
      await sendTelegram(telegramText);
    } catch (notifyError) {
      console.error('Telegram notify error:', notifyError);
    }

    res.status(200).json({ data: { orderId } });
  } catch (err: any) {
    console.error('Order create handler error:', err);
    res.status(500).json({ error: err?.message || 'Serverda xatolik yuz berdi.' });
  }
}
