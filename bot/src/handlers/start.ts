import { Context } from 'grammy';
import { mainMenuKeyboard } from '../keyboards';
import { t } from '../i18n';
import { ensureUser } from './profile';

export async function handleStart(ctx: Context) {
    const userId = ctx.from?.id || 0;
    const name = ctx.from?.first_name || 'Foydalanuvchi';

    // Register user in DB
    await ensureUser(userId, name);

    await ctx.reply(
        `✨ *LUXECORE Premium Store*\n\n` +
        `Xush kelibsiz, ${name}!\n` +
        t(userId, 'welcome').split('\n').pop(),
        {
            parse_mode: 'Markdown',
            reply_markup: mainMenuKeyboard(userId),
        }
    );
}

export async function handleHome(ctx: Context) {
    const userId = ctx.from?.id || 0;
    if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery();
        try {
            await ctx.editMessageText(
                t(userId, 'welcome'),
                {
                    parse_mode: 'Markdown',
                    reply_markup: mainMenuKeyboard(userId),
                }
            );
        } catch {
            await ctx.reply(
                t(userId, 'welcome'),
                {
                    parse_mode: 'Markdown',
                    reply_markup: mainMenuKeyboard(userId),
                }
            );
        }
    } else {
        await ctx.reply(
            t(userId, 'welcome'),
            {
                parse_mode: 'Markdown',
                reply_markup: mainMenuKeyboard(userId),
            }
        );
    }
}
