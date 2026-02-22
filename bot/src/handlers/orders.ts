import { Context } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { supabase } from '../supabase';
import { statusEmoji } from '../keyboards';

const orderPhoneState = new Map<number, boolean>();

export function setOrderPhoneMode(userId: number) {
    orderPhoneState.set(userId, true);
}

export function isInOrderPhoneMode(userId: number): boolean {
    return orderPhoneState.has(userId);
}

export function clearOrderPhoneMode(userId: number) {
    orderPhoneState.delete(userId);
}

export async function handleOrdersPrompt(ctx: Context) {
    const userId = ctx.from?.id;
    if (!userId) return;

    setOrderPhoneMode(userId);
    await ctx.reply(
        '📦 *Buyurtmalarim*\n\n' +
        'Buyurtmalaringizni ko\'rish uchun telefon raqamingizni yuboring:\n' +
        '_(Masalan: +998901234567)_',
        { parse_mode: 'Markdown' }
    );
}

export async function handleOrderPhone(ctx: Context) {
    const userId = ctx.from?.id;
    if (!userId) return;

    clearOrderPhoneMode(userId);

    let phone = ctx.message?.text?.trim() || '';
    // Normalize phone
    phone = phone.replace(/[\s\-\(\)]/g, '');
    if (!phone.startsWith('+')) phone = '+' + phone;

    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('phone', phone)
            .order('created_at', { ascending: false });

        if (error || !orders || orders.length === 0) {
            // Try without + prefix
            const altPhone = phone.replace('+', '');
            const { data: orders2 } = await supabase
                .from('orders')
                .select('*')
                .eq('phone', altPhone)
                .order('created_at', { ascending: false });

            if (!orders2 || orders2.length === 0) {
                await ctx.reply(
                    `📦 ${phone} raqamiga tegishli buyurtmalar topilmadi.\n\n` +
                    `Boshqa raqam bilan urinib ko'ring yoki yangi buyurtma bering.`,
                    {
                        reply_markup: new InlineKeyboard()
                            .text('🏠 Bosh menyu', 'home'),
                    }
                );
                return;
            }

            await showOrders(ctx, orders2);
            return;
        }

        await showOrders(ctx, orders);
    } catch (err) {
        console.error('Orders error:', err);
        await ctx.reply('❌ Xatolik yuz berdi.');
    }
}

async function showOrders(ctx: Context, orders: any[]) {
    let text = `📦 *Sizning buyurtmalaringiz* (${orders.length} ta):\n\n`;

    for (const o of orders.slice(0, 10)) {
        const total = Number(o.total).toLocaleString('uz-UZ');
        const emoji = statusEmoji(o.status);
        text += `${emoji} *#${o.id.slice(0, 8)}*\n`;
        text += `   💰 ${total} UZS\n`;
        text += `   📅 ${o.date || 'N/A'}\n`;
        text += `   📋 Holat: *${o.status}*\n`;
        text += `   💳 To'lov: ${o.paymentMethod || 'N/A'}\n\n`;
    }

    if (orders.length > 10) {
        text += `_... va yana ${orders.length - 10} ta buyurtma_`;
    }

    await ctx.reply(text, {
        parse_mode: 'Markdown',
        reply_markup: new InlineKeyboard().text('🏠 Bosh menyu', 'home'),
    });
}
