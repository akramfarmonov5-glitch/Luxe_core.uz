import { Lang } from './types';
import { supabase } from './supabase';

const userLangs = new Map<number, Lang>();

export function setLang(userId: number, lang: Lang) {
    userLangs.set(userId, lang);
    supabase.from('bot_users').upsert({ telegram_id: userId, lang }, { onConflict: 'telegram_id' }).then();
}

export function getLang(userId: number): Lang {
    return userLangs.get(userId) || 'uz';
}

export async function loadLang(userId: number): Promise<Lang> {
    const cached = userLangs.get(userId);
    if (cached) return cached;
    const { data } = await supabase.from('bot_users').select('lang').eq('telegram_id', userId).single();
    const lang = (data?.lang as Lang) || 'uz';
    userLangs.set(userId, lang);
    return lang;
}

const translations: Record<string, Record<Lang, string>> = {
    welcome: {
        uz: '✨ *LUXECORE Premium Store*\n\nXush kelibsiz! Quyidagi tugmalardan birini tanlang:',
        ru: '✨ *LUXECORE Premium Store*\n\nДобро пожаловать! Выберите один из вариантов:',
    },
    choose_lang: { uz: '🌐 Tilni tanlang / Выберите язык:', ru: '🌐 Tilni tanlang / Выберите язык:' },
    lang_set: { uz: '✅ Til o\'zbek tiliga o\'zgartirildi!', ru: '✅ Язык изменён на русский!' },
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
    btn_profile: { uz: '👤 Profil', ru: '👤 Профиль' },

    categories_title: { uz: '📂 *Kategoriyalarni tanlang:*', ru: '📂 *Выберите категорию:*' },
    no_categories: { uz: '📂 Hozircha kategoriyalar mavjud emas.', ru: '📂 Категории пока недоступны.' },
    no_products: { uz: 'Bu kategoriyada mahsulotlar yo\'q.', ru: 'В этой категории нет товаров.' },

    search_prompt: { uz: '🔍 Qidiruv so\'zini yozing:', ru: '🔍 Введите поисковый запрос:' },
    search_no_result: { uz: '😔 Hech narsa topilmadi.', ru: '😔 Ничего не найдено.' },

    cart_empty: { uz: '🛒 Savatingiz bo\'sh.', ru: '🛒 Ваша корзина пуста.' },
    cart_title: { uz: '🛒 *Savatingiz:*', ru: '🛒 *Ваша корзина:*' },
    cart_total: { uz: '💰 *Jami:', ru: '💰 *Итого:' },
    cart_added: { uz: 'savatga qo\'shildi!', ru: 'добавлен в корзину!' },
    cart_cleared: { uz: '🗑 Savat tozalandi.', ru: '🗑 Корзина очищена.' },
    cart_updated: { uz: '✅ Savat yangilandi.', ru: '✅ Корзина обновлена.' },
    cart_removed: { uz: '🗑 Mahsulot olib tashlandi.', ru: '🗑 Товар удалён.' },

    checkout_phone: { uz: '📱 Telefon raqamingizni yuboring:\n_(Masalan: +998901234567)_', ru: '📱 Отправьте ваш номер телефона:\n_(Например: +998901234567)_' },
    checkout_name: { uz: '👤 Ismingizni kiriting:', ru: '👤 Введите ваше имя:' },
    checkout_promo: { uz: '🎟 Promo-kod bor bo\'lsa kiriting yoki "yo\'q" deb yozing:', ru: '🎟 Введите промо-код или напишите "нет":' },
    checkout_payment: {
        uz: '💳 *To\'lov usulini tanlang:*',
        ru: '💳 *Выберите способ оплаты:*',
    },
    checkout_card_info: {
        uz: '💳 *Kartadan kartaga to\'lov*\n\nKarta raqam: `{card}`\nEgasi: *{holder}*\n\n✅ To\'lov qilgandan keyin "tayyor" deb yozing.',
        ru: '💳 *Оплата картой*\n\nНомер карты: `{card}`\nВладелец: *{holder}*\n\n✅ После оплаты напишите "готово".',
    },
    checkout_card_confirm_again: {
        uz: 'To‘lov qilgan bo‘lsangiz, tasdiqlash uchun *tayyor* deb yozing.',
        ru: 'Если оплата выполнена, напишите *готово* для подтверждения.',
    },
    checkout_success: { uz: '✅ *Buyurtma qabul qilindi!*', ru: '✅ *Заказ принят!*' },
    checkout_error: { uz: '❌ Buyurtma berishda xatolik.', ru: '❌ Ошибка при оформлении заказа.' },
    checkout_address: { uz: '📍 Yetkazib berish manzilini kiriting:', ru: '📍 Введите адрес доставки:' },
    checkout_minimum: {
        uz: 'Minimal buyurtma summasi *{amount}* bo‘lishi kerak.',
        ru: 'Минимальная сумма заказа — *{amount}*.',
    },
    checkout_subtotal: { uz: 'Oraliq summa:', ru: 'Промежуточная сумма:' },
    checkout_discount: { uz: 'Chegirma:', ru: 'Скидка:' },
    checkout_delivery_fee: { uz: 'Yetkazib berish:', ru: 'Доставка:' },
    checkout_delivery_free: { uz: 'Bepul', ru: 'Бесплатно' },
    checkout_confirmed_total: { uz: 'Tasdiqlangan jami:', ru: 'Подтвержденный итог:' },

    orders_prompt: { uz: '📦 Buyurtmalaringizni ko\'rsataman...', ru: '📦 Показываю ваши заказы...' },
    orders_empty: { uz: '📦 Buyurtmalar topilmadi.', ru: '📦 Заказы не найдены.' },
    orders_title: { uz: '📦 *Buyurtmalaringiz:*', ru: '📦 *Ваши заказы:*' },

    order_status_changed: {
        uz: '📦 *Buyurtma #{id} holati o\'zgardi!*\n\n{emoji} Yangi holat: *{status}*',
        ru: '📦 *Статус заказа #{id} изменён!*\n\n{emoji} Новый статус: *{status}*',
    },

    profile_title: { uz: '👤 *Sizning profilingiz:*', ru: '👤 *Ваш профиль:*' },
    profile_enter_name: { uz: '✏️ Yangi ismingizni kiriting:', ru: '✏️ Введите ваше новое имя:' },
    profile_enter_phone: { uz: '📱 Yangi telefon raqamni kiriting:', ru: '📱 Введите новый номер телефона:' },
    profile_enter_address: { uz: '📍 Yangi manzilingizni kiriting:', ru: '📍 Введите ваш новый адрес:' },
    profile_saved: { uz: '✅ Ma\'lumotlar saqlandi!', ru: '✅ Данные сохранены!' },
    profile_no_data: { uz: 'Ko\'rsatilmagan', ru: 'Не указано' },

    ai_prompt: { uz: '🤖 *AI Yordamchi*\n\nLUXECORE mahsulotlari haqida savol bering!\n\n_Chiqish uchun /start bosing_', ru: '🤖 *AI Помощник*\n\nЗадайте вопрос о продуктах LUXECORE!\n\n_Нажмите /start для выхода_' },
    ai_error: { uz: '❌ AI xatolik yuz berdi.', ru: '❌ Ошибка AI.' },
    ai_exit: { uz: '🤖 AI suhbat yakunlandi.', ru: '🤖 AI чат завершён.' },

    contact_text: { uz: '📞 *Aloqa ma\'lumotlari:*', ru: '📞 *Контактная информация:*' },

    help_text: {
        uz: 'ℹ️ *LUXECORE Bot yordam*\n\n' +
            '🛒 Do\'kon — saytni ochish\n' +
            '🔍 Qidirish — mahsulot qidirish\n' +
            '📂 Kategoriyalar — bo\'limlar\n' +
            '📦 Buyurtmalarim — buyurtma kuzatish\n' +
            '👤 Profil — shaxsiy ma\'lumotlar\n' +
            '🤖 AI Yordamchi — savol-javob\n' +
            '📞 Aloqa — bog\'lanish\n' +
            '🌐 Til — tilni o\'zgartirish',
        ru: 'ℹ️ *Помощь LUXECORE Bot*\n\n' +
            '🛒 Магазин — открыть сайт\n' +
            '🔍 Поиск — поиск товаров\n' +
            '📂 Категории — разделы\n' +
            '📦 Мои заказы — отслеживание\n' +
            '👤 Профиль — личные данные\n' +
            '🤖 AI Помощник — вопросы\n' +
            '📞 Контакты — связаться\n' +
            '🌐 Язык — сменить язык',
    },

    product_price: { uz: '💰 Narxi:', ru: '💰 Цена:' },
    product_stock_yes: { uz: '✅ Mavjud', ru: '✅ В наличии' },
    product_stock_no: { uz: '❌ Tugagan', ru: '❌ Нет в наличии' },
    product_status: { uz: '📦 Holat:', ru: '📦 Статус:' },

    new_order: { uz: '🆕 Yangi buyurtma!', ru: '🆕 Новый заказ!' },

    promo_invalid: { uz: '❌ Noto\'g\'ri promo-kod.', ru: '❌ Неверный промо-код.' },
    promo_applied: { uz: '✅ Promo-kod qo\'llandi!', ru: '✅ Промо-код применён!' },
    promo_expired: { uz: '❌ Promo-kod muddati tugagan.', ru: '❌ Промо-код истёк.' },

    notify_sent: { uz: '✅ Xabar {count} ta foydalanuvchiga yuborildi.', ru: '✅ Сообщение отправлено {count} пользователям.' },

    phone_accepted: { uz: 'Rahmat! Raqamingiz qabul qilindi.', ru: 'Спасибо! Ваш номер принят.' },
    phone_invalid: { uz: '❌ Noto\'g\'ri raqam. O\'zbekiston raqamini (+998...) yuboring.', ru: '❌ Неверный номер. Используйте узбекский номер (+998...).' },

    error: { uz: '❌ Xatolik yuz berdi.', ru: '❌ Произошла ошибка.' },
    continue_msg: { uz: 'Tez orada siz bilan bog\'lanamiz! 🚀', ru: 'Мы скоро с вами свяжемся! 🚀' },
};

export function t(userId: number, key: string): string {
    const lang = getLang(userId);
    return translations[key]?.[lang] || translations[key]?.['uz'] || key;
}
