import { Context } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { config } from '../config';

export async function handleContact(ctx: Context) {
    await ctx.reply(
        '📞 *Biz bilan bog\'laning:*\n\n' +
        `📱 Telefon: ${config.CONTACT_PHONE}\n` +
        `💬 Telegram: ${config.CONTACT_USERNAME}\n` +
        `🌐 Sayt: ${config.SITE_URL}\n\n` +
        `Ish vaqti: 09:00 - 21:00`,
        {
            parse_mode: 'Markdown',
            reply_markup: new InlineKeyboard()
                .url('💬 Yozish', `https://t.me/${config.CONTACT_USERNAME.replace('@', '')}`)
                .url('🌐 Sayt', config.SITE_URL),
        }
    );
}

export async function handleHelp(ctx: Context) {
    await ctx.reply(
        'ℹ️ *LUXECORE Bot Yordam*\n\n' +
        '🛒 *Do\'kon* — Saytga o\'tish\n' +
        '🔍 *Qidirish* — Mahsulot qidirish\n' +
        '📂 *Kategoriyalar* — Turkumlar bo\'yicha ko\'rish\n' +
        '📦 *Buyurtmalarim* — Buyurtma holati\n' +
        '🤖 *AI Yordamchi* — Sun\'iy intellekt bilan suhbat\n' +
        '📞 *Aloqa* — Biz bilan bog\'laning\n' +
        '📢 *Kanalimiz* — Yangiliklar va aksiyalar\n\n' +
        '_To\'g\'ridan-to\'g\'ri mahsulot nomini yozsangiz ham qidiradi!_',
        { parse_mode: 'Markdown' }
    );
}

export async function handleChannel(ctx: Context) {
    await ctx.reply(
        '📢 *LUXECORE rasmiy kanali*\n\n' +
        'Yangiliklar, aksiyalar va maxsus takliflar uchun obuna bo\'ling:',
        {
            parse_mode: 'Markdown',
            reply_markup: new InlineKeyboard()
                .url('📢 Kanalga o\'tish', config.CHANNEL_URL),
        }
    );
}
