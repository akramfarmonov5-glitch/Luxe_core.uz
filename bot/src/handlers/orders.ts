import { Context } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { supabase } from '../supabase';
import { statusEmoji } from '../keyboards';
import { t, getSitePageUrl } from '../i18n';
import { config } from '../config';
import { ensureUser } from './profile';

export async function handleOrdersPrompt(ctx: Context) {
    if (ctx.callbackQuery) await ctx.answerCallbackQuery().catch(() => {});
    const userId = ctx.from?.id || 0;

    await ensureUser(userId, ctx.from?.first_name);

    try {
        // Now look up by telegram_user_id directly — no phone needed!
        const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('telegram_user_id', userId)
            .order('created_at', { ascending: false })
            .limit(10);

        const shopUrl = getSitePageUrl(config.SITE_URL, '', userId);
        const trackingUrl = getSitePageUrl(config.SITE_URL, '/tracking', userId);

        if (error || !orders || orders.length === 0) {
            await ctx.reply(t(userId, 'orders_empty'), {
                reply_markup: new InlineKeyboard()
                    .webApp(t(userId, 'btn_shop'), shopUrl)
                    .row()
                    .webApp(t(userId, 'btn_track_on_site'), trackingUrl)
                    .row()
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
            text += `   💳 ${o.paymentMethod || '-'}\n`;
            text += `   📅 ${o.date}\n\n`;
        });

        await ctx.reply(text, {
            parse_mode: 'Markdown',
            reply_markup: new InlineKeyboard()
                .webApp(t(userId, 'btn_track_on_site'), trackingUrl)
                .webApp(t(userId, 'btn_shop'), shopUrl)
                .row()
                .text(t(userId, 'btn_home'), 'home'),
        });
    } catch (err) {
        console.error('Orders error:', err);
        await ctx.reply(t(userId, 'error'));
    }
}
