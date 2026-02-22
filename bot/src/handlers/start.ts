import { Context } from 'grammy';
import { mainMenuKeyboard } from '../keyboards';
import { config } from '../config';

export async function handleStart(ctx: Context) {
    const name = ctx.from?.first_name || 'Foydalanuvchi';
    await ctx.reply(
        `✨ *LUXECORE Premium Store* ga xush kelibsiz, ${name}\\!\n\n` +
        `Quyidagi menyudan foydalaning yoki to'g'ridan\\-to'g'ri mahsulot nomini yozing qidirish uchun\\.`,
        {
            parse_mode: 'MarkdownV2',
            ...mainMenuKeyboard,
        }
    );
}

export async function handleHome(ctx: Context) {
    if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery();
    }
    const name = ctx.from?.first_name || 'Foydalanuvchi';
    await ctx.reply(
        `🏠 Bosh menyu`,
        mainMenuKeyboard
    );
}

export async function handleShop(ctx: Context) {
    await ctx.reply(
        `🛒 *LUXECORE Online Do'kon*\n\n` +
        `Saytimizda barcha premium mahsulotlarni ko'ring:`,
        {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🌐 Saytga o\'tish', url: config.SITE_URL }],
                ],
            },
        }
    );
}
