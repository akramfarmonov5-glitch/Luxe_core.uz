import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'uz' | 'ru';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, defaultValue?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem('language');
        return (saved as Language) || 'uz';
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    // Translations implementation
    const t = (key: string, defaultValue?: string): string => {
        const keys = key.split('.');
        let result: any = translations[language];

        for (const k of keys) {
            if (result && result[k]) {
                result = result[k];
            } else {
                return defaultValue || key; // Fallback to defaultValue or key if not found
            }
        }

        return result as string;
    };



    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

// Internal translations object (to be moved to separate file if it gets too large)
const translations: Record<Language, any> = {
    uz: {
        nav: {
            home: 'Home',
            shop: 'Do\'kon',
            tracking: 'Kuzatish',
            wishlist: 'Saralanganlar',
            blog: 'Blog',
            cart: 'Savat',
            profile: 'Profil'
        },
        hero: {
            subtitle: 'Premium Sifat va Eksklyuziv Dizayn',
            title: 'STILINGIZNI YANGI DARAJAGA KO\'TARING',
            cta: 'Xarid qilish',
            more: 'Batafsil'
        },
        categories: {
            title: 'Kategoriyalar',
            subtitle: 'O\'z uslubingizni tanlang'
        },
        featured: {
            title: 'Saralangan Mahsulotlar',
            subtitle: 'Siz uchun eng yaxshilari',
            all: 'Barchasi',
            no_products: 'So\'rovingiz bo\'yicha mahsulotlar topilmadi.',
            reset: 'Barchasini ko\'rish'
        },
        product: {
            stock: 'dona',
            in_stock: 'Mavjud',
            out_of_stock: 'Tugagan',
            add_to_cart: 'Savatga',
            buy_now: 'Hozir olish',
            specs: 'Texnik Xususiyatlar',
            related: 'O\'xshash Mahsulotlar',
            video_review: 'VIDEO SHARH',
            ai_analysis: 'GEMINI AI TAHLILI',
            guarantee: 'Premium Kafolat',
            delivery: 'Bepul Yetkazish',
            eco: 'Eko-qadoq',
            new: 'Yangi',
            bestseller: 'Bestseller',
            wishlist_added: 'sevimlilarga qo\'shildi',
            wishlist_removed: 'sevimlilardan olib tashlandi',
            cart_added: 'savatchaga qo\'shildi'
        },
        reviews: {
            title: 'Mijozlar fikrlari',
            add: 'Izoh qoldirish',
            name: 'Ismingiz',
            rating: 'Baho',
            comment: 'Fikringiz',
            submit: 'Yuborish',
            success: 'Rahmat! Fikringiz qabul qilindi.',
            avg_rating: 'O\'rtacha baho',
            comment_placeholder: 'haqida fikringiz...',
            submitting: 'Yuborilmoqda...',
            no_reviews: 'Hali izoh yo\'q. Birinchi bo\'lib izoh qoldiring!',
            rating_label: 'Baho:'
        },
        cart: {
            items_count: 'ta mahsulot',
            empty: 'Savatchangiz bo\'sh',
            continue_shopping: 'Xaridni davom ettirish',
            subtotal: 'Mahsulotlar summasi',
            delivery: 'Yetkazib berish',
            total: 'Jami',
            checkout_btn: 'Buyurtma berish'
        },
        checkout: {
            empty_desc: 'Buyurtma berish uchun avval mahsulot tanlang.',
            back_to_shop: 'Do\'konga qaytish',
            title: 'Buyurtmani rasmiylashtirish',
            last_name: 'Familiya',
            phone: 'Telefon raqamingiz',
            city: 'Shahar',
            address: 'To\'liq manzil (ko\'cha, uy, xonadon)',
            email: 'Email pochta (xabarnoma uchun)',
            promo_code: 'Promo kod',
            apply: 'Qo\'llash',
            payment_method: 'To\'lov usuli',
            paynet: 'Paynet',
            card: 'Karta',
            cash: 'Naqd',
            pay: 'To\'lash',
            secure_payment: 'Xavfsiz to\'lov va ma\'lumotlar himoyasi',
            order_summary: 'Buyurtma tafsilotlari',
            discount: 'Chegirma',
            fast_delivery: 'Tezkor yetkazish',
            easy_payment: 'Qulay to\'lov',
            pay_done: 'To\'lov qildim',
            success_title: 'Buyurtmangiz qabul qilindi!',
            thanks: 'Rahmat',
            processing: 'Jarayonda...',
            copy_card: 'Raqamni nusxalash',
            card_copied: 'Karta raqam nusxalandi!',
            back_home: 'Bosh sahifaga qaytish'
        },
        instagram: {
            title: 'Instagram @luxecore_uz',
            subtitle: 'Bizni ijtimoiy tarmoqlarda kuzatib boring va yangi kolleksiyalardan xabardor bo\'ling',
            follow: 'Obuna bo\'lish',
        },
        push: {
            title: 'Xabarnomalar',
            subtitle: 'Yangi chegirmalar va aksiyalar haqida birinchilardan bo\'lib xabardor bo\'lishni xohlaysizmi?',
            allow: 'Ruxsat berish',
            later: 'Keyinroq',
            follow: 'Подписаться',
        },
        wishlist: {
            empty: 'Ro\'yxat bo\'sh',
            empty_desc: 'Siz hali hech qanday mahsulotni yoqtirganlarga qo\'shmadingiz. Do\'konga qaytib, o\'zingizga yoqqanini tanlang.',
            go_shop: 'Do\'konga o\'tish'
        },
        chat: {
            welcome: 'Assalomu alaykum! Men LUXECORE shaxsiy stilistingizman. Sizga qanday yordam bera olaman? Masalan, \'sovg\'a uchun soat\' yoki \'yozgi sumka\' so\'rashingiz mumkin.',
            error_server: 'AI server xatosi',
            error_understanding: 'Uzr, tushunmadim. Qayta so\'ray olasizmi?',
            error_generic: 'Kechirasiz, tizimda xatolik yuz berdi. Iltimos, keyinroq urinib ko\'ring.',
            voice_test_only: '⚠️ Ovozli muloqot funksiyasi xavfsizlik maqsadida vaqtincha faqat test rejimida ishlaydi. Iltimos, matnli chatdan foydalaning, men sizga yordam berishga tayyorman! 😊',
            online_gemini: 'Onlayn | Gemini AI',
            voice_live: 'Ovozli efir',
            end_chat: 'Tugatish',
            voice_chat: 'Ovozli suhbat',
            welcome_title: 'Xush kelibsiz!',
            welcome_desc: 'Shaxsiy yordamchingizdan foydalanish uchun ma\'lumotlaringizni kiriting.',
            name_label: 'Ismingiz',
            name_placeholder: 'Ismingizni kiriting',
            phone_label: 'Telefon raqam',
            start_btn: 'Boshlash',
            security_note: 'Ma\'lumotlaringiz xavfsizligi kafolatlangan.',
            listening: 'Tinglanmoqda...',
            input_placeholder: 'Masalan: Menga soat kerak...',
            ai_role: 'Siz LUXECORE premium do\'konining professional sotuvchi-konsultanti va stilistisiz.'
        },
        tracking: {
            title: 'Buyurtmani Kuzatish',
            subtitle: 'Buyurtma ID yoki telefon raqamingiz orqali buyurtmangiz holatini tekshiring.',
            phone: '📱 Telefon',
            order_id: '📋 Buyurtma ID',
            track_btn: 'Kuzatish',
            found_orders: 'Topilgan Buyurtmalar',
            date: 'Sana',
            items: 'Mahsulotlar',
            no_orders: 'Buyurtmalar topilmadi',
            no_orders_phone: 'Ushbu raqamga rasmiylashtirilgan buyurtmalar mavjud emas.',
            no_orders_id: 'Bunday ID bilan buyurtma topilmadi. ID ni to\'g\'ri kiritganingizni tekshiring.',
            status: {
                pending: 'Kutilmoqda',
                paid: 'To\'landi',
                shipping: 'Yetkazilmoqda',
                completed: 'Yakunlandi',
                cancelled: 'Bekor qilindi'
            }
        },
        telegram: {
            title: 'Telegram kanalimizga qo\'shiling!',
            desc: 'Yangi mahsulotlar, maxsus chegirmalar va eksklyuziv takliflardan birinchi bo\'lib xabardor bo\'ling!',
            feature_1: 'Chegirmalar',
            feature_2: 'Yangiliklar',
            feature_3: 'Jamiyat',
            cta: 'Kanalga qo\'shilish',
            later: 'Keyinroq'
        },
        search: {
            //...
        },
        sale: {
            badge: 'Cheklangan vaqt!',
            prefix: 'Barcha mahsulotlarga',
            discount: '20% chegirma',
            desc: 'Fursatni qo\'ldan boy bermang!',
            days: 'Kun',
            hours: 'Soat',
            minutes: 'Daq',
            seconds: 'Son'
        },
        footer: {
            about: 'LUXECORE - O\'zbekistondagi premium onlayn do\'kon. Soatlar, sumkalar va aksessuarlar.',
            quick_links: 'Tezkor havolalar',
            contact: 'Aloqa',
            rights: 'Barcha huquqlar himoyalangan',
            follow_us: 'Bizni kuzating',
            shipping: 'Yetkazib berish',
            payment: 'To\'lov usullari',
            returns: 'Qaytarish siyosati',
            faq: 'FAQ',
            privacy: 'Maxfiylik siyosati',
            terms: 'Foydalanish shartlari',
            categories: 'Kategoriyalar',
            help: 'Yordam'
        },
        common: {
            loading: 'Yuklanmoqda...',
            error: 'Xatolik yuz berdi',
            search: 'Qidirish...',
            checkout: 'Rasmiylashtirish',
            view: 'Ko\'rish',
            collection: 'Kolleksiya',
            order: 'Buyurtma',
            back: 'Ortga qaytish',
            checking: 'Tekshirilmoqda...',
        },
        blog: {
            badge: 'Blog & Yangiliklar',
            title_prefix: 'Moda Olamidan',
            title_suffix: 'Xabarlar',
            all: 'Barcha maqolalar',
            read: 'O\'qish',
            author: 'LUXECORE Admin',
            thanks_for_reading: 'O\'qiganingiz uchun rahmat.',
            share: 'Ulashish'
        }
    },
    ru: {
        nav: {
            home: 'Главная',
            shop: 'Магазин',
            tracking: 'Отслеживание',
            wishlist: 'Избранное',
            blog: 'Блог',
            cart: 'Корзина',
            profile: 'Профиль'
        },
        hero: {
            subtitle: 'Премиальное Качество и Эксклюзивный Дизайн',
            title: 'ПОДНИМИТЕ ВАШ СТИЛЬ НА НОВЫЙ УРОВЕНЬ',
            cta: 'Перейти к покупкам',
            more: 'Подробнее'
        },
        categories: {
            title: 'Категории',
            subtitle: 'Выберите свой стиль'
        },
        featured: {
            title: 'Популярные Товары',
            subtitle: 'Лучшее для вас',
            all: 'Все',
            no_products: 'Товары по вашему запросу не найдены.',
            reset: 'Показать все'
        },
        product: {
            stock: 'шт',
            in_stock: 'В наличии',
            out_of_stock: 'Нет в наличии',
            add_to_cart: 'В корзину',
            buy_now: 'Купить сейчас',
            specs: 'Технические Характеристики',
            related: 'Похожие Товары',
            video_review: 'ВИДЕО ОБЗОР',
            ai_analysis: 'АНАЛИЗ GEMINI AI',
            guarantee: 'Премиум Гарантия',
            delivery: 'Бесплатная Доставка',
            eco: 'Эко-упаковка',
            new: 'Новинка',
            bestseller: 'Бестселлер',
            wishlist_added: 'добавлено в избранное',
            wishlist_removed: 'удалено из избранного',
            cart_added: 'добавлено в корзину'
        },
        reviews: {
            title: 'Отзывы клиентов',
            add: 'Оставить отзыв',
            name: 'Ваше имя',
            rating: 'Оценка',
            comment: 'Ваш отзыв',
            submit: 'Отправить',
            success: 'Спасибо за ваш отзыв!',
            avg_rating: 'Средняя оценка',
            comment_placeholder: 'ваш отзыв о...',
            submitting: 'Отправка...',
            no_reviews: 'Отзывов пока нет. Будьте первым!',
            rating_label: 'Оценка:'
        },
        cart: {
            items_count: 'товара(ов)',
            empty: 'Ваша корзина пуста',
            continue_shopping: 'Продолжить покупки',
            subtotal: 'Сумма товаров',
            delivery: 'Доставка',
            total: 'Итого',
            checkout_btn: 'Оформить заказ'
        },
        checkout: {
            empty_desc: 'Для оформления заказа сначала выберите товар.',
            back_to_shop: 'Вернуться в магазин',
            title: 'Оформление заказа',
            last_name: 'Фамилия',
            phone: 'Номер телефона',
            city: 'Город',
            address: 'Полный адрес (улица, дом, квартира)',
            email: 'Email почта (для уведомлений)',
            promo_code: 'Промокод',
            apply: 'Применить',
            payment_method: 'Способ оплаты',
            paynet: 'Paynet',
            card: 'Карта',
            cash: 'Наличные',
            pay: 'Оплатить',
            secure_payment: 'Безопасная оплата и защита данных',
            order_summary: 'Детали заказа',
            discount: 'Скидка',
            fast_delivery: 'Быстрая доставка',
            easy_payment: 'Удобная оплата',
            pay_done: 'Я оплатил',
            success_title: 'Ваш заказ принят!',
            thanks: 'Спасибо',
            processing: 'В процессе...',
            copy_card: 'Копировать номер',
            card_copied: 'Номер карты скопирован!',
            back_home: 'Вернуться на главную'
        },
        wishlist: {
            empty: 'Список пуст',
            empty_desc: 'Вы еще не добавили ни одного товара в избранное. Вернитесь в магазин и выберите то, что вам нравится.',
            go_shop: 'Перейти в магазин'
        },
        chat: {
            welcome: 'Здравствуйте! Я ваш персональный стилист LUXECORE. Чем могу вам помочь? Вы можете спросить, например, "часы в подарок" или "летняя сумка".',
            error_server: 'Ошибка сервера ИИ',
            error_understanding: 'Извините, я не понял. Можете повторить?',
            error_generic: 'Извините, произошла системная ошибка. Пожалуйста, попробуйте позже.',
            voice_test_only: '⚠️ Функция голосового общения временно работает только в тестовом режиме в целях безопасности. Пожалуйста, используйте текстовый чат, я готов помочь! 😊',
            online_gemini: 'Онлайн | Gemini AI',
            voice_live: 'Голос в эфире',
            end_chat: 'Завершить',
            voice_chat: 'Голосовой чат',
            welcome_title: 'Добро пожаловать!',
            welcome_desc: 'Для использования персонального помощника введите свои данные.',
            name_label: 'Ваше имя',
            name_placeholder: 'Введите ваше имя',
            phone_label: 'Номер телефона',
            start_btn: 'Начать',
            security_note: 'Безопасность ваших данных гарантирована.',
            listening: 'Слушаю...',
            input_placeholder: 'Например: Мне нужны часы...',
            ai_role: 'Вы - профессиональный продавец-консультант и стилист премиального магазина LUXECORE.'
        },
        tracking: {
            title: 'Отслеживание Заказа',
            subtitle: 'Проверьте статус вашего заказа по ID или номеру телефона.',
            phone: '📱 Телефон',
            order_id: '📋 ID Заказа',
            track_btn: 'Отследить',
            found_orders: 'Найденные Заказы',
            date: 'Дата',
            items: 'Товары',
            no_orders: 'Заказы не найдены',
            no_orders_phone: 'Заказов на этот номер телефона не найдено.',
            no_orders_id: 'Заказ с таким ID не найден. Проверьте правильность ввода.',
            status: {
                pending: 'Ожидается',
                paid: 'Оплачено',
                shipping: 'Доставляется',
                completed: 'Завершен',
                cancelled: 'Отменен'
            }
        },
        telegram: {
            title: 'Присоединяйтесь к нашему Telegram!',
            desc: 'Узнавайте первыми о новинках, специальных скидках и эксклюзивных предложениях!',
            feature_1: 'Скидки',
            feature_2: 'Новости',
            feature_3: 'Сообщество',
            cta: 'Подписаться',
            later: 'Позже'
        },
        search: {
            //...
        },
        sale: {
            badge: 'Ограниченное время!',
            prefix: 'На все товары',
            discount: 'скидка 20%',
            desc: 'Не упустите свой шанс!',
            days: 'Дн',
            hours: 'Час',
            minutes: 'Мин',
            seconds: 'Сек'
        },
        footer: {
            about: 'LUXECORE - премиальный онлайн-магазин в Узбекистане. Часы, сумки и аксессуары.',
            quick_links: 'Быстрые ссылки',
            contact: 'Контакты',
            rights: 'Все права защищены',
            follow_us: 'Следите за нами',
            shipping: 'Доставка',
            payment: 'Способы оплаты',
            returns: 'Политика возврата',
            faq: 'FAQ',
            privacy: 'Политика конфиденциальности',
            terms: 'Условия использования',
            categories: 'Категории',
            help: 'Помощь'
        },
        common: {
            loading: 'Загрузка...',
            error: 'Произошла ошибка',
            search: 'Поиск...',
            checkout: 'Оформление',
            view: 'Посмотреть',
            collection: 'Коллекция',
            order: 'Заказ',
            back: 'Назад',
            checking: 'Проверка...',
            whatsapp_message: 'Здравствуйте! Я хочу сделать заказ в магазине LUXECORE.',
            whatsapp_tooltip: 'Пишите, мы ответим! 💬'
        },
        blog: {
            badge: 'Блог и Новости',
            title_prefix: 'Новости из мира',
            title_suffix: 'моды',
            all: 'Все статьи',
            read: 'Читать',
            author: 'LUXECORE Админ',
            thanks_for_reading: 'Спасибо за прочтение.',
            share: 'Поделиться'
        },
        admin: {
            login_error: 'Ошибка при входе.',
            no_access: 'У этого пользователя нет прав администратора.',
            login_title: 'Вход в админ-панель',
            login_subtitle: 'Войдите для управления системой',
            password: 'Пароль',
            login_btn: 'Войти',
            logging_in: 'Вход...',
            stats: 'Статистика',
            orders: 'Заказы (CRM)',
            leads: 'Клиенты (Чат)',
            products: 'Товары',
            categories: 'Категории',
            blog_ai: 'SEO Блог & AI',
            hero_banner: 'Баннер (Hero)',
            navigation: 'Навигация',
            logout: 'Выход',
            console: 'Консоль управления'
        }
    }
};
