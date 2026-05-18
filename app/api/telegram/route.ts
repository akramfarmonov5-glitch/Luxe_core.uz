import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '../../../lib/rateLimit';

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`telegram:${getClientIp(req)}`, 5, 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: 'Juda ko‘p urinish. Birozdan keyin qayta urinib ko‘ring.' }, { status: 429 });
  }

  const internalSecret = process.env.TELEGRAM_INTERNAL_SECRET;
  if (!internalSecret || req.headers.get('x-telegram-secret') !== internalSecret) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json({ error: 'Telegram credentials missing on server' }, { status: 500 });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    if (typeof message !== 'string' || message.length > 4_000) {
      return NextResponse.json({ error: 'Message is too long' }, { status: 400 });
    }

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.description || 'Telegram API error');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed to send Telegram message', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}
