import { Context } from 'grammy';
import { mainMenuKeyboard } from '../keyboards';

export async function handleStart(ctx: Context) {
    const name = ctx.from?.first_name || 'Foydalanuvchi';
    await ctx.reply(
        `✨ *LUXECORE Premium Store*\n\n` +
        `Xush kelibsiz, ${name}!\n` +
        `Quyidagi tugmalardan birini tanlang:`,
        {
            parse_mode: 'Markdown',
            reply_markup: mainMenuKeyboard(),
        }
    );
}

export async function handleHome(ctx: Context) {
    if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery();
        try {
            await ctx.editMessageText(
                `🏠 *LUXECORE Premium Store*\n\nQuyidagi tugmalardan birini tanlang:`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: mainMenuKeyboard(),
                }
            );
        } catch {
            await ctx.reply(
                `🏠 *LUXECORE Premium Store*\n\nQuyidagi tugmalardan birini tanlang:`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: mainMenuKeyboard(),
                }
            );
        }
    } else {
        await ctx.reply(
            `🏠 *LUXECORE Premium Store*\n\nQuyidagi tugmalardan birini tanlang:`,
            {
                parse_mode: 'Markdown',
                reply_markup: mainMenuKeyboard(),
            }
        );
    }
}
