import { InlineKeyboard } from 'grammy';
import { config } from '../config';

// ========== BOSH MENYU (Reply Keyboard) ==========
export const mainMenuKeyboard = {
    reply_markup: {
        keyboard: [
            [{ text: '🛒 Do\'kon (Sayt)' }, { text: '🔍 Qidirish' }],
            [{ text: '📂 Kategoriyalar' }, { text: '📦 Buyurtmalarim' }],
            [{ text: '🤖 AI Yordamchi' }, { text: '📞 Aloqa' }],
            [{ text: 'ℹ️ Yordam' }, { text: '📢 Kanalimiz' }],
        ],
        resize_keyboard: true,
        is_persistent: true,
    },
};

// ========== KATEGORIYALAR INLINE KEYBOARD ==========
export function categoriesKeyboard(categories: { id: string; name: string; slug: string }[]) {
    const kb = new InlineKeyboard();
    categories.forEach((cat, i) => {
        kb.text(cat.name, `cat:${cat.slug}`);
        if (i % 2 === 1) kb.row();
    });
    if (categories.length % 2 !== 0) kb.row();
    return kb;
}

// ========== MAHSULOT SAHIFALASH ==========
export function productPaginationKeyboard(
    currentPage: number,
    totalPages: number,
    prefix: string // "catpage:slug" or "searchpage:query"
) {
    const kb = new InlineKeyboard();
    if (currentPage > 0) {
        kb.text('◀️ Oldingi', `${prefix}:${currentPage - 1}`);
    }
    kb.text(`${currentPage + 1}/${totalPages}`, 'noop');
    if (currentPage < totalPages - 1) {
        kb.text('Keyingi ▶️', `${prefix}:${currentPage + 1}`);
    }
    kb.row();
    kb.text('🏠 Bosh menyu', 'home');
    return kb;
}

// ========== MAHSULOT DETAIL ==========
export function productDetailKeyboard(productId: number) {
    const kb = new InlineKeyboard();
    kb.text('🛒 Savatga', `addcart:${productId}`);
    kb.url('🌐 Saytda ko\'rish', `${config.SITE_URL}/#product/${productId}`);
    kb.row();
    kb.text('🔙 Orqaga', 'back_to_list');
    return kb;
}

// ========== SAVATCHA ==========
export function cartKeyboard() {
    const kb = new InlineKeyboard();
    kb.text('✅ Buyurtma berish', 'checkout');
    kb.text('🗑 Tozalash', 'clear_cart');
    kb.row();
    kb.text('🏠 Bosh menyu', 'home');
    return kb;
}

// ========== BUYURTMA HOLATI EMOJI ==========
export function statusEmoji(status: string): string {
    const map: Record<string, string> = {
        'Kutilmoqda': '🟡',
        'To\'landi': '🟢',
        'Yetkazilmoqda': '🚚',
        'Yakunlandi': '✅',
    };
    return map[status] || '⏳';
}
