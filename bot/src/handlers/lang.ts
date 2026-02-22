import { Context } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { setLang, t } from '../i18n';

export async function handleLangPrompt(ctx: Context) {
    const kb = new InlineKeyboard()
        .text('🇺🇿 O\'zbek', 'lang:uz')
        .text('🇷🇺 Русский', 'lang:ru');

    if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery();
        try {
            await ctx.editMessageText('🌐 Tilni tanlang / Выберите язык:', { reply_markup: kb });
        } catch {
            await ctx.reply('🌐 Tilni tanlang / Выберите язык:', { reply_markup: kb });
        }
    } else {
        await ctx.reply('🌐 Tilni tanlang / Выберите язык:', { reply_markup: kb });
    }
}

export async function handleLangSet(ctx: Context) {
    const userId = ctx.from?.id;
    if (!userId) return;

    await ctx.answerCallbackQuery();
    const data = ctx.callbackQuery?.data;
    if (!data) return;

    const lang = data.replace('lang:', '') as 'uz' | 'ru';
    setLang(userId, lang);

    await ctx.editMessageText(t(userId, 'lang_set'));
}
