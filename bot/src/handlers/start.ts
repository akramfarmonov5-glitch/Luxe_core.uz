import { Context } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { mainMenuKeyboard } from '../keyboards';
import { t, setLang, loadLang } from '../i18n';
import { ensureUser } from './profile';
import { supabase } from '../supabase';

// Track users waiting for phone number (after lang selection)
const awaitingPhone = new Set<number>();

export async function handleStart(ctx: Context) {
    const userId = ctx.from?.id || 0;
    const name = ctx.from?.first_name || 'Foydalanuvchi';

    // Register user in DB
    await ensureUser(userId, name, ctx.from?.username);

    // Load user's language preference
    await loadLang(userId);

    // Check if user has phone number
    const { data: user } = await supabase.from('bot_users').select('phone, lang').eq('telegram_id', userId).single();

    if (!user?.phone) {
        // Step 1: Ask to choose language first
        await ctx.reply(
            `✨ *LUXECORE Premium Store*\n\n` +
            `Xush kelibsiz, ${name}! / Добро пожаловать, ${name}!\n\n` +
            `🌐 Tilni tanlang / Выберите язык:`,
            {
                parse_mode: 'Markdown',
                reply_markup: new InlineKeyboard()
                    .text('🇺🇿 O\'zbek', 'start_lang:uz')
                    .text('🇷🇺 Русский', 'start_lang:ru'),
            }
        );
        return;
    }

    await ctx.reply(
        t(userId, 'welcome'),
        {
            parse_mode: 'Markdown',
            reply_markup: mainMenuKeyboard(userId),
        }
    );
}

// Handle language selection during /start flow
export async function handleStartLangSelect(ctx: Context) {
    if (ctx.callbackQuery) await ctx.answerCallbackQuery();
    const userId = ctx.from?.id || 0;
    const data = ctx.callbackQuery?.data || '';
    const lang = data.replace('start_lang:', '') as 'uz' | 'ru';

    // Save language
    setLang(userId, lang);

    // Mark user as awaiting phone
    awaitingPhone.add(userId);

    // Step 2: Request phone number in chosen language
    const phoneMsg = lang === 'ru'
        ? `Отлично! Теперь, пожалуйста, отправьте ваш номер телефона для полного доступа к боту.👇`
        : `Ajoyib! Endi, iltimos, botdan to'liq foydalanish uchun telefon raqamingizni yuboring.👇`;

    const btnText = lang === 'ru' ? '📱 Отправить номер' : '📱 Raqamni yuborish';

    await ctx.reply(phoneMsg, {
        reply_markup: {
            keyboard: [[{ text: btnText, request_contact: true }]],
            resize_keyboard: true,
            one_time_keyboard: true,
        }
    });
}

export async function handleContactMessage(ctx: Context) {
    const userId = ctx.from?.id || 0;
    const name = ctx.from?.first_name || 'Foydalanuvchi';
    const contact = ctx.message?.contact;

    if (!contact) return;

    let phone = contact.phone_number;
    if (!phone.startsWith('+')) phone = '+' + phone;

    // Validate phone number (O'zbekiston: +998XXXXXXXXX, 12 raqam)
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (!/^\+998\d{9}$/.test(cleanPhone)) {
        const lang = t(userId, 'btn_home') === '🏠 Главное меню' ? 'ru' : 'uz';
        const errorMsg = lang === 'ru'
            ? '❌ Неверный номер. Пожалуйста, используйте узбекский номер (+998...). Попробуйте ещё раз.'
            : '❌ Noto\'g\'ri raqam. Iltimos, O\'zbekiston raqamini (+998...) yuboring. Qaytadan urinib ko\'ring.';

        const btnText = lang === 'ru' ? '📱 Отправить номер' : '📱 Raqamni yuborish';
        await ctx.reply(errorMsg, {
            reply_markup: {
                keyboard: [[{ text: btnText, request_contact: true }]],
                resize_keyboard: true,
                one_time_keyboard: true,
            }
        });
        return;
    }

    // 1. Update bot profile
    await supabase.from('bot_users').upsert(
        { telegram_id: userId, phone: cleanPhone },
        { onConflict: 'telegram_id' }
    );

    // 2. Add as Lead for CRM
    await supabase.from('leads').upsert(
        { id: String(userId), name, phone: cleanPhone, last_message: 'Bot orqali ro\'yxatdan o\'tdi' },
        { onConflict: 'id' }
    );

    // Remove from awaiting set
    awaitingPhone.delete(userId);

    // 3. Send welcome menu (remove custom keyboard, show inline)
    await ctx.reply(
        `✅ ${t(userId, 'phone_accepted')}\n\n` +
        t(userId, 'welcome'),
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
