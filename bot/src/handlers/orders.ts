import { Context } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { supabase } from '../supabase';
import { statusEmoji } from '../keyboards';
import { t } from '../i18n';

const orderPhoneState = new Map<number, boolean>();

export function setOrderPhoneMode(userId: number) { orderPhoneState.set(userId, true); }
export function isInOrderPhoneMode(userId: number): boolean { return orderPhoneState.has(userId); }
export function clearOrderPhoneMode(userId: number) { orderPhoneState.delete(userId); }

export async function handleOrdersPrompt(ctx: Context) {
    const userId = ctx.from?.id || 0;
    setOrderPhoneMode(userId);
    await ctx.reply(t(userId, 'orders_prompt'), { parse_mode: 'Markdown' });
}

export async function handleOrderPhone(ctx: Context) {
    const userId = ctx.from?.id || 0;
    let phone = ctx.message?.text?.trim() || '';
    phone = phone.replace(/[\s\-\(\)]/g, '');
    if (!phone.startsWith('+')) phone = '+' + phone;

    clearOrderPhoneMode(userId);

    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('phone', phone)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error || !orders || orders.length === 0) {
            await ctx.reply(t(userId, 'orders_empty'), {
                reply_markup: new InlineKeyboard()
                    .text(t(userId, 'btn_home'), 'home'),
            });
            return;
        }

        let text = t(userId, 'orders_title') + '\n\n';
        orders.forEach((o: any, i: number) => {
            const emoji = statusEmoji(o.status);
            text += `${i + 1}. *#${o.id}*\n`;
            text += `   ${emoji} ${o.status}\n`;
            text += `   💰 ${Number(o.total).toLocaleString('uz-UZ')} UZS\n`;
            text += `   📅 ${o.date}\n\n`;
        });

        await ctx.reply(text, {
            parse_mode: 'Markdown',
            reply_markup: new InlineKeyboard()
                .text(t(userId, 'btn_home'), 'home'),
        });
    } catch (err) {
        console.error('Orders error:', err);
        await ctx.reply(t(userId, 'error'));
    }
}
