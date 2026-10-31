import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUserId, getServiceSupabaseClient } from '@/lib/checkout.server';
import { isAdminUser } from '@/lib/admin';
import { getLocalizedText } from '@/lib/i18nUtils';

const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || process.env.CHANNEL_ID || '-1003605314914';
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://luxe-core.uz').replace(/\/+$/, '');

function escapeHtml(value: string): string {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function getBotUsername(token: string): Promise<string> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await res.json();
    if (data?.ok && data?.result?.username) {
      return data.result.username;
    }
  } catch {
    // ignore
  }
  return 'luxecore_bot';
}

async function sendProductPostToChannel(token: string, botUsername: string, product: any): Promise<void> {
  const nameUz = getLocalizedText(product.name, 'uz') || 'LUXECORE';
  const descUz = getLocalizedText(product.description || product.shortDescription, 'uz') || '';
  const formattedPrice =
    product.formattedPrice || `${Number(product.price || 0).toLocaleString('uz-UZ')} UZS`;
  const stockText = product.stock && Number(product.stock) > 0 ? '✅ Mavjud' : '❌ Tugagan';

  const caption =
    `🏷 <b>${escapeHtml(nameUz)}</b>\n\n` +
    `💰 Narxi: <b>${escapeHtml(formattedPrice)}</b>\n` +
    `📦 Holati: ${stockText}\n` +
    (descUz ? `\n📝 ${escapeHtml(descUz)}\n` : '') +
    `\n🛒 <i>Buyurtma berish uchun quyidagi tugmalardan foydalaning:</i>`;

  const productSiteUrl = `${SITE_URL}/uz/product/${product.id}`;
  const productBotUrl = `https://t.me/${botUsername}?start=product_${product.id}`;

  const replyMarkup = {
    inline_keyboard: [
      [
        { text: '🛒 Saytda xarid', url: productSiteUrl },
        { text: '🤖 Botda xarid', url: productBotUrl },
      ],
    ],
  };

  const images: string[] = Array.isArray(product.images)
    ? product.images.filter((u: any) => typeof u === 'string' && u.trim().startsWith('http'))
    : [];
  const mainImage =
    images[0] ||
    (typeof product.image === 'string' && product.image.trim().startsWith('http')
      ? product.image.trim()
      : '');

  if (mainImage) {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHANNEL_ID,
        photo: mainImage,
        caption,
        parse_mode: 'HTML',
        reply_markup: replyMarkup,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data?.description || 'Telegram sendPhoto error');
    }
  } else {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHANNEL_ID,
        text: caption,
        parse_mode: 'HTML',
        reply_markup: replyMarkup,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data?.description || 'Telegram sendMessage error');
    }
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const userId = await getAuthenticatedUserId(authHeader);
    const isAdmin = await isAdminUser(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const supabase = getServiceSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ botUsersCount: 0, promos: [] });
    }

    const [{ count: botUsersCount, data: botUsers }, { data: promos }] = await Promise.all([
      supabase
        .from('bot_users')
        .select('telegram_id, name, phone, address, lang, created_at', { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(500),
      supabase.from('promo_codes').select('*').order('created_at', { ascending: false }),
    ]);

    return NextResponse.json({
      botUsersCount: botUsersCount || 0,
      botUsers: botUsers || [],
      promos: promos || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const userId = await getAuthenticatedUserId(authHeader);
    const isAdmin = await isAdminUser(userId);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized: Admins only' }, { status: 403 });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: 'TELEGRAM_BOT_TOKEN serverda sozlanmagan' },
        { status: 500 }
      );
    }

    const supabase = getServiceSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase service client topilmadi' }, { status: 500 });
    }

    const payload = await req.json();
    const { mode } = payload;

    const botUsername = await getBotUsername(token);

    if (mode === 'product') {
      const productId = Number(payload.productId);
      if (!productId) {
        return NextResponse.json({ error: 'productId majburiy' }, { status: 400 });
      }

      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error || !product) {
        return NextResponse.json({ error: 'Mahsulot topilmadi' }, { status: 404 });
      }

      await sendProductPostToChannel(token, botUsername, product);
      return NextResponse.json({
        success: true,
        message: 'Mahsulot Telegram kanalga muvaffaqiyatli joylandi!',
      });
    }

    if (mode === 'all_products') {
      const limit = Math.min(Number(payload.limit) || 10, 20);
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false })
        .limit(limit);

      if (error || !products || products.length === 0) {
        return NextResponse.json({ error: 'Mahsulotlar topilmadi' }, { status: 404 });
      }

      let sentCount = 0;
      for (const product of products) {
        try {
          await sendProductPostToChannel(token, botUsername, product);
          sentCount++;
          await new Promise((r) => setTimeout(r, 700));
        } catch (err) {
          console.error(`Failed to broadcast product ${product.id}:`, err);
        }
      }

      return NextResponse.json({
        success: true,
        sentCount,
        total: products.length,
      });
    }

    if (mode === 'custom_message') {
      const { title, body, imageUrl, clickUrl, sendToChannel, sendToBotUsers } = payload;
      if (!title || !body) {
        return NextResponse.json({ error: 'Sarlavha va matn majburiy' }, { status: 400 });
      }

      const targetUrl = clickUrl
        ? clickUrl.startsWith('http')
          ? clickUrl
          : `${SITE_URL}${clickUrl.startsWith('/') ? '' : '/'}${clickUrl}`
        : `${SITE_URL}/uz`;

      const textHtml =
        `🔔 <b>${escapeHtml(title)}</b>\n\n` +
        `${escapeHtml(body)}\n\n` +
        `🛍 <a href="${escapeHtml(targetUrl)}">LUXECORE.UZ — Do'konga o'tish</a>`;

      const replyMarkup = {
        inline_keyboard: [
          [
            { text: '🛍 Saytga o\'tish', url: targetUrl },
            { text: '🤖 Botga kirish', url: `https://t.me/${botUsername}` },
          ],
        ],
      };

      let channelSent = false;
      let botSentCount = 0;

      if (sendToChannel) {
        const endpoint = imageUrl ? 'sendPhoto' : 'sendMessage';
        const reqBody: Record<string, any> = {
          chat_id: CHANNEL_ID,
          parse_mode: 'HTML',
          reply_markup: replyMarkup,
        };
        if (imageUrl) {
          reqBody.photo = imageUrl;
          reqBody.caption = textHtml;
        } else {
          reqBody.text = textHtml;
        }
        const res = await fetch(`https://api.telegram.org/bot${token}/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reqBody),
        });
        if (res.ok) {
          channelSent = true;
        }
      }

      if (sendToBotUsers) {
        const { data: users } = await supabase.from('bot_users').select('telegram_id');
        if (users && users.length > 0) {
          for (const u of users) {
            try {
              const endpoint = imageUrl ? 'sendPhoto' : 'sendMessage';
              const reqBody: Record<string, any> = {
                chat_id: u.telegram_id,
                parse_mode: 'HTML',
                reply_markup: {
                  inline_keyboard: [[{ text: '🛍 Saytda ko\'rish', url: targetUrl }]],
                },
              };
              if (imageUrl) {
                reqBody.photo = imageUrl;
                reqBody.caption = textHtml;
              } else {
                reqBody.text = textHtml;
              }
              const res = await fetch(`https://api.telegram.org/bot${token}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reqBody),
              });
              if (res.ok) botSentCount++;
              await new Promise((r) => setTimeout(r, 60));
            } catch {
              // ignore blocked user
            }
          }
        }
      }

      return NextResponse.json({
        success: true,
        channelSent,
        botSentCount,
      });
    }

    if (mode === 'add_promo') {
      const code = String(payload.code || '').trim().toUpperCase();
      const discountPercent = Number(payload.discountPercent);
      if (!code || isNaN(discountPercent) || discountPercent < 1 || discountPercent > 90) {
        return NextResponse.json(
          { error: 'Promo-kod va chegirma foizi (1-90%) to\'g\'ri kiritilishi kerak' },
          { status: 400 }
        );
      }

      const { data, error } = await supabase
        .from('promo_codes')
        .upsert({ code, discount_percent: discountPercent, is_active: true }, { onConflict: 'code' })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, promo: data });
    }

    if (mode === 'delete_promo') {
      const code = String(payload.code || '').trim().toUpperCase();
      const { error } = await supabase.from('promo_codes').delete().eq('code', code);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Noto\'g\'ri mode' }, { status: 400 });
  } catch (err: any) {
    console.error('Telegram broadcast API error:', err);
    return NextResponse.json({ error: err?.message || 'Server xatoligi' }, { status: 500 });
  }
}
