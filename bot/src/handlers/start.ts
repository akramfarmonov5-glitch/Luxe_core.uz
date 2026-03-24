import { Context } from 'grammy';
import { mainMenuKeyboard } from '../keyboards';
import { t } from '../i18n';
import { ensureUser } from './profile';
import { supabase } from '../supabase';

export async function handleStart(ctx: Context) {
    const userId = ctx.from?.id || 0;
    const name = ctx.from?.first_name || 'Foydalanuvchi';

    // Register user in DB
    await ensureUser(userId, name);

    // Check if user has phone number
    const { data: user } = await supabase.from('bot_users').select('phone').eq('telegram_id', userId).single();

    if (!user?.phone) {
        // Request phone number
        await ctx.reply(
            `✨ *LUXECORE Premium Store*\n\n` +
            `Xush kelibsiz, ${name}!\nIltimos, botdan to'liq foydalanish va biz bilan bog'lanish uchun telefon raqamingizni yuboring.👇`,
            {
                parse_mode: 'Markdown',
                reply_markup: {
                    keyboard: [[{ text: '📱 Raqamni yuborish', request_contact: true }]],
                    resize_keyboard: true,
                    one_time_keyboard: true,
                }
            }
        );
        return;
    }

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

export async function handleContactMessage(ctx: Context) {
    const userId = ctx.from?.id || 0;
    const name = ctx.from?.first_name || 'Foydalanuvchi';
    const contact = ctx.message?.contact;

    if (contact) {
        let phone = contact.phone_number;
        if (!phone.startsWith('+')) phone = '+' + phone;

        // 1. Update bot profile
        await supabase.from('bot_users').upsert(
            { telegram_id: userId, phone },
            { onConflict: 'telegram_id' }
        );

        // 2. Add as Lead for CRM
        await supabase.from('leads').upsert(
            { id: String(userId), name, phone, last_message: 'Bot orqali ro\'yxatdan o\'tdi' },
            { onConflict: 'id' }
        );

        // 3. Send welcome menu
        await ctx.reply(
            `Rahmat! Raqamingiz qabul qilindi. ✅\n\n` +
            t(userId, 'welcome').split('\n').pop(),
            {
                parse_mode: 'Markdown',
                reply_markup: mainMenuKeyboard(userId),
            }
        );
    }
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
