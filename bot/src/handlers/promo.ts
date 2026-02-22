import { Context } from 'grammy';
import { supabase } from '../supabase';
import { t } from '../i18n';

export async function handlePromoCheck(code: string): Promise<{ valid: boolean; discount: number; message: string }> {
    try {
        const { data, error } = await supabase
            .from('promo_codes')
            .select('*')
            .eq('code', code.toUpperCase())
            .eq('active', true)
            .single();

        if (error || !data) {
            return { valid: false, discount: 0, message: 'invalid' };
        }

        // Check expiration
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
            return { valid: false, discount: 0, message: 'expired' };
        }

        return { valid: true, discount: data.discount_percent, message: 'applied' };
    } catch {
        return { valid: false, discount: 0, message: 'invalid' };
    }
}

// Admin command: /addpromo CODE PERCENT
export async function handleAddPromo(ctx: Context) {
    const userId = ctx.from?.id;
    const { config } = require('../config');
    if (userId !== config.ADMIN_ID) {
        await ctx.reply('⛔ Bu komanda faqat admin uchun.');
        return;
    }

    const text = ctx.message?.text || '';
    const parts = text.split(' ');

    if (parts.length < 3) {
        await ctx.reply(
            '📝 *Promo-kod yaratish:*\n\n' +
            '`/addpromo CODE PERCENT`\n\n' +
            'Masalan: `/addpromo LUXE20 20`\n' +
            '_(20% chegirma beruvchi LUXE20 kodi)_',
            { parse_mode: 'Markdown' }
        );
        return;
    }

    const code = parts[1].toUpperCase();
    const percent = parseInt(parts[2]);

    if (isNaN(percent) || percent < 1 || percent > 90) {
        await ctx.reply('❌ Chegirma foizi 1-90 orasida bo\'lishi kerak.');
        return;
    }

    try {
        const { error } = await supabase
            .from('promo_codes')
            .insert({
                code,
                discount_percent: percent,
                active: true,
            });

        if (error) {
            if (error.code === '23505') {
                await ctx.reply(`❌ "${code}" kodi allaqachon mavjud.`);
            } else {
                throw error;
            }
            return;
        }

        await ctx.reply(
            `✅ *Promo-kod yaratildi!*\n\n` +
            `🎟 Kod: *${code}*\n` +
            `💰 Chegirma: *${percent}%*`,
            { parse_mode: 'Markdown' }
        );
    } catch (err) {
        console.error('Add promo error:', err);
        await ctx.reply('❌ Promo-kod yaratishda xatolik.');
    }
}

// Admin: /delpromo CODE
export async function handleDelPromo(ctx: Context) {
    const userId = ctx.from?.id;
    const { config } = require('../config');
    if (userId !== config.ADMIN_ID) return;

    const text = ctx.message?.text || '';
    const code = text.split(' ')[1]?.toUpperCase();

    if (!code) {
        await ctx.reply('📝 `/delpromo CODE` — promo-kodni o\'chirish', { parse_mode: 'Markdown' });
        return;
    }

    await supabase
        .from('promo_codes')
        .update({ active: false })
        .eq('code', code);

    await ctx.reply(`🗑 "*${code}*" promo-kod o'chirildi.`, { parse_mode: 'Markdown' });
}
