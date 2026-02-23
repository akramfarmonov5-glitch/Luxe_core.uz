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

const sendOrderEmail = async (orderData: any) => {
  const apiKey = getEnv('RESEND_API_KEY') || getEnv('VITE_RESEND_API_KEY');
  if (!apiKey) return;

  const { orderId, firstName, lastName, phone, city, address, total, cart, email } = orderData;

  const cartItemsHtml = cart.map((item: any) => `
        <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${formatPrice(item.price * item.quantity)}</td>
        </tr>
    `).join('');

  const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
            <h2 style="color: #333; text-align: center;">LUXECORE</h2>
            <p>Assalomu alaykum, <strong>${firstName} ${lastName}</strong>!</p>
            <p>Buyurtmangiz muvaffaqiyatli qabul qilindi. Tez orada operatorlarimiz siz bilan bog'lanishadi.</p>
            
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Buyurtma ID:</strong> ${orderId}</p>
                <p><strong>Sana:</strong> ${new Date().toLocaleDateString('uz-UZ')}</p>
                <p><strong>Telefon:</strong> ${phone}</p>
                <p><strong>Manzil:</strong> ${city}, ${address}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #333; color: #fff;">
                        <th style="padding: 10px; text-align: left;">Mahsulot</th>
                        <th style="padding: 10px; text-align: left;">Soni</th>
                        <th style="padding: 10px; text-align: left;">Narxi</th>
                    </tr>
                </thead>
                <tbody>
                    ${cartItemsHtml}
                </tbody>
            </table>

            <div style="text-align: right; margin-top: 20px;">
                <h3>Jami: ${formatPrice(total)}</h3>
            </div>

            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
            <p style="font-size: 12px; color: #666; text-align: center;">
                Savollaringiz bo'lsa, @luxecore_admin bilan bog'laning.<br/>
                Luxecore - Sifat va nafosat maskani.
            </p>
        </div>
    `;

  try {
    // Customer email
    if (email) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'LUXECORE <onboarding@resend.dev>',
          to: [email],
          subject: `Buyurtmangiz qabul qilindi! (#${orderId})`,
          html: html,
        }),
      });
    }

    // Admin notification email
    const adminEmail = getEnv('ADMIN_EMAIL') || 'akramfarmonov5@gmail.com';
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'LUXECORE <onboarding@resend.dev>',
        to: [adminEmail],
        subject: `Yangi Buyurtma! (#${orderId})`,
        html: html.replace('Assalomu alaykum', 'Yangi buyurtma tushdi'),
      }),
    });
  } catch (error) {
    console.error('Email sending failed:', error);
  }
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
    const paymentMethod = body.paymentMethod === 'paynet' ? 'Paynet' : body.paymentMethod === 'card' ? 'Kartadan kartaga' : 'Naqd';
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
        items: cart,
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
      await sendOrderEmail({
        orderId,
        firstName,
        lastName,
        phone,
        city,
        address,
        total,
        cart,
        email: body.email || '', // Client pass email in payload
      });
    } catch (notifyError) {
      console.error('Notification error:', notifyError);
    }

    res.status(200).json({ data: { orderId } });
  } catch (err: any) {
    console.error('Order create handler error:', err);
    res.status(500).json({ error: err?.message || 'Serverda xatolik yuz berdi.' });
  }
}
