import { Bot, Context } from 'grammy';
import { supabase } from '../supabase';
import { config } from '../config';
import { t } from '../i18n';

export async function handleNotifyAll(ctx: Context) {
    const userId = ctx.from?.id;
    if (userId !== config.ADMIN_ID) {
        await ctx.reply('⛔ Bu komanda faqat admin uchun.');
        return;
    }

    const text = ctx.message?.text?.replace(/^\/notifyall\s*/, '').trim();
    if (!text) {
        await ctx.reply('❌ Xabar matnini kiriting.\n\nMisol: `/notifyall Yangi mahsulotlar keldi!`', { parse_mode: 'Markdown' });
        return;
    }

    try {
        const { data: users } = await supabase.from('bot_users').select('telegram_id');
        if (!users || users.length === 0) {
            await ctx.reply('❌ Foydalanuvchilar topilmadi.');
            return;
        }

        let sent = 0;
        const bot = ctx.api;
        for (const user of users) {
            try {
                await bot.sendMessage(user.telegram_id, `📢 *LUXECORE xabar:*\n\n${text}`, { parse_mode: 'Markdown' });
                sent++;
                await new Promise(r => setTimeout(r, 100)); // Rate limit
            } catch {
                // User may have blocked bot
            }
        }

        await ctx.reply(t(userId, 'notify_sent').replace('{count}', String(sent)));
    } catch (err) {
        console.error('Notify error:', err);
        await ctx.reply('❌ Xabar yuborishda xatolik.');
    }
}
