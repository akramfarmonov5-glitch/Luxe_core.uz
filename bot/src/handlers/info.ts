import { Context } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { config } from '../config';
import { t } from '../i18n';

export async function handleContact(ctx: Context) {
    const userId = ctx.from?.id || 0;
    await ctx.reply(
        `${t(userId, 'contact_text')}\n\n` +
        `📱 Telefon: ${config.CONTACT_PHONE}\n` +
        `💬 Telegram: ${config.CONTACT_USERNAME}\n` +
        `🌐 Sayt: ${config.SITE_URL}`,
        {
            parse_mode: 'Markdown',
            reply_markup: new InlineKeyboard()
                .url('💬 Yozish', `https://t.me/${config.CONTACT_USERNAME.replace('@', '')}`)
                .row()
                .text(t(userId, 'btn_home'), 'home'),
        }
    );
}

export async function handleHelp(ctx: Context) {
    const userId = ctx.from?.id || 0;
    await ctx.reply(
        t(userId, 'help_text'),
        {
            parse_mode: 'Markdown',
            reply_markup: new InlineKeyboard()
                .text(t(userId, 'btn_home'), 'home'),
        }
    );
}

export async function handleChannel(ctx: Context) {
    const userId = ctx.from?.id || 0;
    await ctx.reply(
        '📢 LUXECORE kanaliga obuna bo\'ling!',
        {
            reply_markup: new InlineKeyboard()
                .url('📢 Kanalga o\'tish', config.CHANNEL_URL)
                .row()
                .text(t(userId, 'btn_home'), 'home'),
        }
    );
}
