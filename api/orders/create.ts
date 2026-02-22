import { parseBody, serverSupabase } from '../admin/_utils';

const formatPrice = (value: number) =>
  `${new Intl.NumberFormat('uz-UZ').format(value)} UZS`;

const sendTelegram = async (text: string) => {
  const token = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || process.env.VITE_TELEGRAM_CHAT_ID;
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
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = parseBody(req);
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

  const dateStr = new Date().toISOString().split('T')[0];

  const { error } = await serverSupabase
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
    res.status(400).json({ error: error.message });
    return;
  }

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
    // eslint-disable-next-line no-console
    console.error('Telegram notify error:', notifyError);
  }

  res.status(200).json({ data: { orderId } });
}
