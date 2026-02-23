import { InlineKeyboard } from 'grammy';
import { config } from '../config';
import { t } from '../i18n';

// ========== BOSH MENYU ==========
export function mainMenuKeyboard(userId: number) {
    return new InlineKeyboard()
        .webApp(t(userId, 'btn_shop'), config.SITE_URL)
        .text(t(userId, 'btn_search'), 'menu:search')
        .row()
        .text(t(userId, 'btn_categories'), 'menu:categories')
        .text(t(userId, 'btn_orders'), 'menu:orders')
        .row()
        .text(t(userId, 'btn_profile'), 'menu:profile')
        .text(t(userId, 'btn_ai'), 'menu:ai')
        .row()
        .text(t(userId, 'btn_contact'), 'menu:contact')
        .text(t(userId, 'btn_help'), 'menu:help')
        .row()
        .url(t(userId, 'btn_channel'), config.CHANNEL_URL)
        .text(t(userId, 'btn_lang'), 'menu:lang');
}

// ========== KATEGORIYALAR ==========
export function categoriesKeyboard(categories: { id: string; name: string; slug: string }[], userId: number) {
    const kb = new InlineKeyboard();
    categories.forEach((cat, i) => {
        kb.text(cat.name, `cat:${cat.slug}`);
        if (i % 2 === 1) kb.row();
    });
    if (categories.length % 2 !== 0) kb.row();
    kb.text(t(userId, 'btn_home'), 'home');
    return kb;
}

// ========== SAVATCHA ==========
export function cartKeyboard(userId: number) {
    return new InlineKeyboard()
        .text(t(userId, 'btn_checkout'), 'checkout')
        .text(t(userId, 'btn_clear_cart'), 'clear_cart')
        .row()
        .text(t(userId, 'btn_home'), 'home');
}

// ========== TO'LOV ==========
export function paymentKeyboard(userId: number) {
    const kb = new InlineKeyboard()
        .text('💳 Kartadan kartaga', 'pay:card')
        .row()
        .text('💵 Naqd to\'lov', 'pay:cash');
    if (config.PAYNET_LINK) {
        kb.row().url('🏦 Paynet orqali', config.PAYNET_LINK);
    }
    return kb;
}

// ========== STATUS EMOJI ==========
export function statusEmoji(status: string): string {
    const map: Record<string, string> = {
        'Kutilmoqda': '🟡',
        'To\'landi': '🟢',
        'Yetkazilmoqda': '🚚',
        'Yakunlandi': '✅',
        'Bekor qilindi': '❌',
    };
    return map[status] || '⏳';
}
