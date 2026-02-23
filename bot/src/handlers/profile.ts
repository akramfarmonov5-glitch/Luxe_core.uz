import { Context } from 'grammy';
import { InlineKeyboard } from 'grammy';
import { supabase } from '../supabase';
import { t } from '../i18n';

const profileEditState = new Map<number, string>();

export function isInProfileMode(userId: number): boolean { return profileEditState.has(userId); }
export function clearProfileMode(userId: number) { profileEditState.delete(userId); }

export async function ensureUser(userId: number, name?: string) {
    await supabase.from('bot_users').upsert(
        { telegram_id: userId, name: name || undefined },
        { onConflict: 'telegram_id' }
    );
}

export async function getUserProfile(userId: number) {
    const { data } = await supabase.from('bot_users').select('*').eq('telegram_id', userId).single();
    return data;
}

export async function handleProfile(ctx: Context) {
    if (ctx.callbackQuery) await ctx.answerCallbackQuery();
    const userId = ctx.from?.id || 0;

    await ensureUser(userId, ctx.from?.first_name);
    const profile = await getUserProfile(userId);
    const noData = t(userId, 'profile_no_data');

    const text =
        `${t(userId, 'profile_title')}\n\n` +
        `👤 Ism: *${profile?.name || noData}*\n` +
        `📱 Telefon: *${profile?.phone || noData}*\n` +
        `📍 Manzil: *${profile?.address || noData}*\n` +
        `🌐 Til: *${profile?.lang === 'ru' ? 'Русский' : 'O\'zbekcha'}*`;

    await ctx.reply(text, {
        parse_mode: 'Markdown',
        reply_markup: new InlineKeyboard()
            .text('✏️ Ism', 'profile:edit_name')
            .text('📱 Telefon', 'profile:edit_phone')
            .text('📍 Manzil', 'profile:edit_address')
            .row()
            .text(t(userId, 'btn_home'), 'home'),
    });
}

export async function handleProfileEdit(ctx: Context) {
    if (ctx.callbackQuery) await ctx.answerCallbackQuery();
    const userId = ctx.from?.id || 0;
    const data = ctx.callbackQuery?.data || '';

    if (data === 'profile:edit_name') {
        profileEditState.set(userId, 'name');
        await ctx.reply(t(userId, 'profile_enter_name'));
    } else if (data === 'profile:edit_phone') {
        profileEditState.set(userId, 'phone');
        await ctx.reply(t(userId, 'profile_enter_phone'));
    } else if (data === 'profile:edit_address') {
        profileEditState.set(userId, 'address');
        await ctx.reply(t(userId, 'profile_enter_address'));
    }
}

export async function handleProfileInput(ctx: Context) {
    const userId = ctx.from?.id || 0;
    const field = profileEditState.get(userId);
    if (!field) return;

    const text = ctx.message?.text?.trim() || '';
    if (!text) return;

    clearProfileMode(userId);

    const update: Record<string, string> = {};
    update[field] = text;

    await supabase.from('bot_users').upsert(
        { telegram_id: userId, ...update },
        { onConflict: 'telegram_id' }
    );

    await ctx.reply(t(userId, 'profile_saved'), {
        reply_markup: new InlineKeyboard()
            .text(t(userId, 'btn_profile'), 'menu:profile')
            .text(t(userId, 'btn_home'), 'home'),
    });
}
