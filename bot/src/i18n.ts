import { Lang } from './types';

const userLangs = new Map<number, Lang>();

export function setLang(userId: number, lang: Lang) {
    userLangs.set(userId, lang);
}

export function getLang(userId: number): Lang {
    return userLangs.get(userId) || 'uz';
}

// Translation dictionary
const translations: Record<string, Record<Lang, string>> = {
    welcome: {
        uz: '✨ *LUXECORE Premium Store*\n\nXush kelibsiz! Quyidagi tugmalardan birini tanlang:',
        ru: '✨ *LUXECORE Premium Store*\n\nДобро пожаловать! Выберите один из вариантов:',
    },
    choose_lang: {
        uz: '🌐 Tilni tanlang / Выберите язык:',
        ru: '🌐 Tilni tanlang / Выберите язык:',
    },
    lang_set: {
        uz: '✅ Til o\'zbek tiliga o\'zgartirildi!',
        ru: '✅ Язык изменён на русский!',
    },
    btn_shop: { uz: '🛒 Do\'kon', ru: '🛒 Магазин' },
    btn_search: { uz: '🔍 Qidirish', ru: '🔍 Поиск' },
    btn_categories: { uz: '📂 Kategoriyalar', ru: '📂 Категории' },
    btn_orders: { uz: '📦 Buyurtmalarim', ru: '📦 Мои заказы' },
    btn_ai: { uz: '🤖 AI Yordamchi', ru: '🤖 AI Помощник' },
    btn_contact: { uz: '📞 Aloqa', ru: '📞 Контакты' },
    btn_help: { uz: 'ℹ️ Yordam', ru: 'ℹ️ Помощь' },
    btn_channel: { uz: '📢 Kanalimiz', ru: '📢 Наш канал' },
    btn_lang: { uz: '🌐 Til', ru: '🌐 Язык' },
    btn_cart: { uz: '🛒 Savatcha', ru: '🛒 Корзина' },
    btn_home: { uz: '🏠 Bosh menyu', ru: '🏠 Главное меню' },
    btn_back: { uz: '🔙 Orqaga', ru: '🔙 Назад' },
    btn_add_cart: { uz: '🛒 Savatga', ru: '🛒 В корзину' },
    btn_checkout: { uz: '✅ Buyurtma berish', ru: '✅ Оформить заказ' },
    btn_clear_cart: { uz: '🗑 Tozalash', ru: '🗑 Очистить' },
    btn_view_site: { uz: '🌐 Saytda', ru: '🌐 На сайте' },

    // Categories
    categories_title: { uz: '📂 *Kategoriyalarni tanlang:*', ru: '📂 *Выберите категорию:*' },
    no_categories: { uz: '📂 Hozircha kategoriyalar mavjud emas.', ru: '📂 Категории пока недоступны.' },
    no_products: { uz: 'Bu kategoriyada mahsulotlar yo\'q.', ru: 'В этой категории нет товаров.' },

    // Search
    search_prompt: { uz: '🔍 Qidiruv so\'zini yozing:', ru: '🔍 Введите поисковый запрос:' },
    search_no_result: { uz: '😔 Hech narsa topilmadi.', ru: '😔 Ничего не найдено.' },

    // Cart
    cart_empty: { uz: '🛒 Savatingiz bo\'sh.', ru: '🛒 Ваша корзина пуста.' },
    cart_title: { uz: '🛒 *Savatingiz:*', ru: '🛒 *Ваша корзина:*' },
    cart_total: { uz: '💰 *Jami:', ru: '💰 *Итого:' },
    cart_added: { uz: 'savatga qo\'shildi!', ru: 'добавлен в корзину!' },
    cart_cleared: { uz: '🗑 Savat tozalandi.', ru: '🗑 Корзина очищена.' },

    // Checkout
    checkout_phone: { uz: '📱 Telefon raqamingizni yuboring:\n_(Masalan: +998901234567)_', ru: '📱 Отправьте ваш номер телефона:\n_(Например: +998901234567)_' },
    checkout_name: { uz: '👤 Ismingizni kiriting:', ru: '👤 Введите ваше имя:' },
    checkout_promo: { uz: '🎟 Promo-kod bor bo\'lsa kiriting yoki "yo\'q" deb yozing:', ru: '🎟 Введите промо-код или напишите "нет":' },
    checkout_success: { uz: '✅ *Buyurtma qabul qilindi!*', ru: '✅ *Заказ принят!*' },
    checkout_error: { uz: '❌ Buyurtma berishda xatolik.', ru: '❌ Ошибка при оформлении заказа.' },

    // Orders
    orders_prompt: { uz: '📱 Buyurtmalarni ko\'rish uchun telefon raqamingizni yuboring:', ru: '📱 Отправьте номер телефона для просмотра заказов:' },
    orders_empty: { uz: '📦 Buyurtmalar topilmadi.', ru: '📦 Заказы не найдены.' },
    orders_title: { uz: '📦 *Buyurtmalaringiz:*', ru: '📦 *Ваши заказы:*' },

    // AI
    ai_prompt: { uz: '🤖 *AI Yordamchi*\n\nLUXECORE mahsulotlari haqida savol bering!\n\n_Chiqish uchun /start bosing_', ru: '🤖 *AI Помощник*\n\nЗадайте вопрос о продуктах LUXECORE!\n\n_Нажмите /start для выхода_' },
    ai_error: { uz: '❌ AI xatolik yuz berdi.', ru: '❌ Ошибка AI.' },
    ai_exit: { uz: '🤖 AI suhbat yakunlandi.', ru: '🤖 AI чат завершён.' },

    // Contact
    contact_text: { uz: '📞 *Aloqa ma\'lumotlari:*', ru: '📞 *Контактная информация:*' },

    // Help
    help_text: {
        uz: 'ℹ️ *LUXECORE Bot yordam*\n\n' +
            '🛒 Do\'kon — saytni ochish\n' +
            '🔍 Qidirish — mahsulot qidirish\n' +
            '📂 Kategoriyalar — bo\'limlar\n' +
            '📦 Buyurtmalarim — buyurtma kuzatish\n' +
            '🤖 AI Yordamchi — savol-javob\n' +
            '📞 Aloqa — bog\'lanish\n' +
            '🌐 Til — tilni o\'zgartirish',
        ru: 'ℹ️ *Помощь LUXECORE Bot*\n\n' +
            '🛒 Магазин — открыть сайт\n' +
            '🔍 Поиск — поиск товаров\n' +
            '📂 Категории — разделы\n' +
            '📦 Мои заказы — отслеживание\n' +
            '🤖 AI Помощник — вопросы\n' +
            '📞 Контакты — связаться\n' +
            '🌐 Язык — сменить язык',
    },

    // Product
    product_price: { uz: '💰 Narxi:', ru: '💰 Цена:' },
    product_stock_yes: { uz: '✅ Mavjud', ru: '✅ В наличии' },
    product_stock_no: { uz: '❌ Tugagan', ru: '❌ Нет в наличии' },
    product_status: { uz: '📦 Holat:', ru: '📦 Статус:' },

    // Admin
    new_order: { uz: '🆕 Yangi buyurtma!', ru: '🆕 Новый заказ!' },

    // Promo
    promo_invalid: { uz: '❌ Noto\'g\'ri promo-kod.', ru: '❌ Неверный промо-код.' },
    promo_applied: { uz: '✅ Promo-kod qo\'llandi!', ru: '✅ Промо-код применён!' },
    promo_expired: { uz: '❌ Promo-kod muddati tugagan.', ru: '❌ Промо-код истёк.' },

    error: { uz: '❌ Xatolik yuz berdi.', ru: '❌ Произошла ошибка.' },
    continue_msg: { uz: 'Tez orada siz bilan bog\'lanamiz! 🚀', ru: 'Мы скоро с вами свяжемся! 🚀' },
};

export function t(userId: number, key: string): string {
    const lang = getLang(userId);
    return translations[key]?.[lang] || translations[key]?.['uz'] || key;
}
