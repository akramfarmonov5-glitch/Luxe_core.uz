export type InfoTopic = 'delivery' | 'returns' | 'faq' | 'privacy' | 'terms';

export interface InfoSection {
  heading: string;
  body: string;
}

export interface InfoPageContent {
  title: string;
  description: string;
  intro: string;
  sections: InfoSection[];
}

type LocalizedInfo = Record<'uz' | 'ru' | 'en', InfoPageContent>;

export const INFO_CONTENT: Record<InfoTopic, LocalizedInfo> = {
  delivery: {
    uz: {
      title: 'Yetkazib berish (Ulgurji va Chakana)',
      description: "LUXECORE O'rikzor omboridan yetkazib berish: Toshkent bo'ylab 2 soat ichida, viloyatlarga 24 soat (1 kun) ichida. 2 mln so'mdan yuqori buyurtmalarga bepul.",
      intro: "O'rikzor omborimizdan buyurtmangizni Toshkent shahri va O'zbekistonning barcha viloyatlariga tezkor yetkazib beramiz.",
      sections: [
        { heading: 'Yetkazib berish muddati', body: "Toshkent shahri bo'ylab — 2 soat ichida (Yandex Delivery yoki kuryer orqali). Viloyatlarga — 24 soat (1 kun) ichida BTS / Fargo pochta yoki viloyat taksilari orqali jo'natiladi." },
        { heading: 'Yetkazib berish narxi', body: "2 000 000 so'mdan yuqori ulgurji buyurtmalar uchun Toshkent bo'ylab yetkazib berish BEPUL. Undan kam summadagi buyurtmalar uchun — 40 000 so'm. O'rikzor omborimizdan o'zingiz olib ketishingiz (samovivoz) ham mumkin." },
        { heading: 'Minimal buyurtma', body: "Minimal buyurtma summasi — 200 000 so'm (yoki mahsulot qadog'iga qarab 1 pachka: 12 / 50 / 100 dona)." },
        { heading: 'Buyurtmani kuzatish', body: "Buyurtma raqami yoki telefon raqamingiz orqali saytdagi \"Kuzatish\" sahifasida va Telegram botimizda buyurtma holatini jonli tekshirishingiz mumkin." },
      ],
    },
    ru: {
      title: 'Доставка (Оптом со склада Урикзор)',
      description: 'Условия доставки LUXECORE со склада Урикзор: по Ташкенту за 2 часа, в регионы за 24 часа (1 день). Бесплатно при заказе от 2 млн сум.',
      intro: 'Оперативно доставим ваш оптовый заказ со склада Урикзор по Ташкенту и во все регионы Узбекистана.',
      sections: [
        { heading: 'Сроки доставки', body: 'По Ташкенту — в течение 2 часов (Yandex Доставка или курьер). В регионы — в течение 24 часов (1 день) через почту BTS / Fargo или междугороднее такси.' },
        { heading: 'Стоимость доставки', body: 'Для заказов свыше 2 000 000 сум доставка по Ташкенту БЕСПЛАТНАЯ. Для заказов на меньшую сумму — 40 000 сум. Также доступен самовывоз со склада на рынке Урикзор.' },
        { heading: 'Минимальный заказ', body: 'Минимальная сумма заказа — 200 000 сум (или 1 упаковка товара: 12 / 50 / 100 шт).' },
        { heading: 'Отслеживание заказа', body: 'По номеру заказа или телефону вы можете в любой момент проверить статус на странице «Отслеживание» или в нашем Telegram-боте.' },
      ],
    },
    en: {
      title: 'Wholesale Delivery',
      description: 'LUXECORE delivery terms from Urikzor warehouse: within 2 hours in Tashkent, within 24 hours to regions. Free for orders over 2M UZS.',
      intro: 'We deliver wholesale orders from our Urikzor warehouse across Tashkent and all regions of Uzbekistan.',
      sections: [
        { heading: 'Delivery time', body: 'Tashkent city — within 2 hours. Regions — within 24 hours (1 day) via BTS / Fargo courier or intercity transport.' },
        { heading: 'Delivery cost', body: 'Delivery is free for orders over 2,000,000 UZS. For smaller orders the delivery fee is 40,000 UZS. Self-pickup from Urikzor warehouse is also available.' },
        { heading: 'Minimum order', body: 'The minimum order amount is 200,000 UZS (or 1 wholesale pack: 12 / 50 / 100 pcs).' },
        { heading: 'Order tracking', body: 'You can check your order status at any time on the "Tracking" page using your phone number or order ID.' },
      ],
    },
  },
  returns: {
    uz: {
      title: 'Qaytarish siyosati',
      description: "LUXECORE mahsulotlarini 14 kun ichida qaytarish shartlari va tartibi.",
      intro: 'Xaridingizdan qoniqmasangiz, mahsulotni qaytarishingiz mumkin.',
      sections: [
        { heading: 'Qaytarish muddati', body: "Mahsulotni qabul qilib olgan kundan boshlab 14 kun ichida qaytarishingiz mumkin." },
        { heading: 'Qaytarish shartlari', body: "Mahsulot ishlatilmagan, asl qadoqda va to'liq butlovchi qismlari bilan bo'lishi kerak. Sotib olganlikni tasdiqlovchi buyurtma raqami talab qilinadi." },
        { heading: 'Pulni qaytarish', body: "Mahsulot tekshirilgandan so'ng pul 3–5 ish kuni ichida to'lov qilingan usul orqali qaytariladi." },
        { heading: 'Qanday qaytarish kerak', body: "Telefon yoki Telegram orqali biz bilan bog'laning — operatorimiz qaytarish jarayonini yo'lga qo'yib beradi: +998 99 644 84 44." },
      ],
    },
    ru: {
      title: 'Политика возврата',
      description: 'Условия и порядок возврата товаров LUXECORE в течение 14 дней.',
      intro: 'Если покупка вас не устроила, вы можете вернуть товар.',
      sections: [
        { heading: 'Срок возврата', body: 'Вернуть товар можно в течение 14 дней с момента получения.' },
        { heading: 'Условия возврата', body: 'Товар должен быть неиспользованным, в оригинальной упаковке и в полной комплектации. Потребуется номер заказа, подтверждающий покупку.' },
        { heading: 'Возврат денег', body: 'После проверки товара деньги возвращаются в течение 3–5 рабочих дней тем же способом, которым была произведена оплата.' },
        { heading: 'Как оформить возврат', body: 'Свяжитесь с нами по телефону или в Telegram — наш оператор оформит возврат: +998 99 644 84 44.' },
      ],
    },
    en: {
      title: 'Return policy',
      description: 'LUXECORE return terms: return your purchase within 14 days.',
      intro: 'If you are not satisfied with your purchase, you can return it.',
      sections: [
        { heading: 'Return period', body: 'You can return an item within 14 days of receiving it.' },
        { heading: 'Return conditions', body: 'The item must be unused, in its original packaging and complete. Your order number is required as proof of purchase.' },
        { heading: 'Refund', body: 'After the item is inspected, the refund is issued within 3–5 business days via the original payment method.' },
        { heading: 'How to return', body: 'Contact us by phone or Telegram and our operator will arrange the return: +998 99 644 84 44.' },
      ],
    },
  },
  faq: {
    uz: {
      title: "Ko'p so'raladigan savollar — LUXECORE (luxe-core.uz)",
      description: "LUXECORE (luxe-core.uz) haqida ko'p so'raladigan savollar: ulgurji narxlar, minimal buyurtma, to'lov, yetkazib berish va qaytarish.",
      intro: "LUXECORE (luxe-core.uz) O'rikzor ulgurji omboridan xarid qilish bo'yicha eng ko'p beriladigan savollarga javoblar.",
      sections: [
        { heading: "LUXECORE (luxe-core.uz) da minimal buyurtma qancha?", body: "Minimal buyurtma summasi 200 000 so'm, mahsulotlar esa o'z qadog'iga qarab pachkalab (12, 50 yoki 100 donadan boshlab) sotiladi. 500+ donaga -5%, 1000+ donaga esa -10% VIP chegirma avtomatik hisoblanadi." },
        { heading: "Qanday to'lov usullari mavjud?", body: "Paynet, Click/Payme (kartadan kartaga), korxonalar uchun pul o'tkazish yoki mahsulotni qabul qilishda naqd pul bilan to'lash mumkin. Har bir buyurtmaga rasmiy Yuk xati (Nakladnoy) beriladi." },
        { heading: 'Buyurtma qancha vaqtda yetkaziladi?', body: "O'rikzor omborimizdan Toshkent bo'ylab 2 soat ichida (2 mln so'mdan yuqori buyurtmalarga bepul), barcha viloyatlarga 24 soat (1 kun) ichida BTS/Fargo pochta yoki taksi orqali yetkazib beriladi." },
        { heading: 'Buyurtmamni qanday kuzataman?', body: "Buyurtma rasmiylashtirilgach sizga buyurtma raqami beriladi. Uni luxe-core.uz saytidagi \"Kuzatish\" sahifasiga kiritib holatini ko'rishingiz va 1-bosishda qayta buyurtma berishingiz mumkin." },
        { heading: 'Mahsulotni qaytarsam bo\'ladimi?', body: "Ha, mahsulotni qabul qilib olgan kundan boshlab 14 kun ichida qaytarishingiz mumkin. Batafsil — \"Qaytarish siyosati\" sahifasida." },
        { heading: "Savollarim bo'lsa kimga murojaat qilaman?", body: "+998 99 644 84 44 raqamiga qo'ng'iroq qiling yoki Telegram orqali yozing: @luxecoreuz (sayt: https://luxe-core.uz). Ish vaqti: Dush–Shan, 09:00–20:00." },
      ],
    },
    ru: {
      title: 'Часто задаваемые вопросы — LUXECORE (luxe-core.uz)',
      description: 'Ответы на частые вопросы о LUXECORE (luxe-core.uz / ЛюксКор Ташкент): оптовые цены, минимальный заказ, оплата, доставка со склада Урикзор.',
      intro: 'Ответы на самые популярные вопросы об оптовых закупках на LUXECORE (luxe-core.uz).',
      sections: [
        { heading: 'Какой минимальный заказ на LUXECORE (luxe-core.uz)?', body: 'Минимальная сумма заказа — 200 000 сум, товары отпускаются пачками (по 12, 50 или 100 шт). При заказе от 500 шт действует скидка -5%, от 1000 шт — VIP скидка -10%.' },
        { heading: 'Какие способы оплаты доступны?', body: 'Оплата наличными, переводом на карту, через Paynet или безналичный расчет с предоставлением официальной накладной.' },
        { heading: 'Как быстро доставят заказ?', body: 'Со склада Урикзор по Ташкенту — за 2 часа (бесплатно от 2 млн сум), в регионы Узбекистана — за 24 часа через BTS/Fargo или такси.' },
        { heading: 'Как отследить или повторить заказ?', body: 'После оформления вы получите номер заказа. Введите его на странице «Отслеживание» на сайте luxe-core.uz, чтобы увидеть статус или повторить заказ в 1 клик.' },
        { heading: 'Можно ли вернуть товар?', body: 'Да, в течение 14 дней с момента получения. Подробнее — на странице «Политика возврата».' },
        { heading: 'Куда обращаться с вопросами?', body: 'Звоните по номеру +998 99 644 84 44 или пишите в Telegram: @luxecoreuz (сайт: https://luxe-core.uz). Время работы: Пн–Сб, 09:00–20:00.' },
      ],
    },
    en: {
      title: 'Frequently Asked Questions — LUXECORE (luxe-core.uz)',
      description: 'Answers to common questions about LUXECORE (luxe-core.uz): wholesale pricing, payment, delivery from Urikzor warehouse and order tracking.',
      intro: 'Answers to the most common wholesale ordering questions on LUXECORE (luxe-core.uz).',
      sections: [
        { heading: 'What is the minimum order on LUXECORE (luxe-core.uz)?', body: 'Minimum order is 200,000 UZS, sold in wholesale packs (12, 50, or 100 pcs). Automatic -5% discount on 500+ pcs and -10% VIP discount on 1000+ pcs.' },
        { heading: 'What payment methods are available?', body: 'Online payment via Paynet, card transfer, or cash on delivery with an official wholesale invoice.' },
        { heading: 'How fast is delivery?', body: 'Within 2 hours in Tashkent from Urikzor warehouse, within 24 hours to all regions of Uzbekistan.' },
        { heading: 'How do I track my order?', body: 'After checkout you receive an order number. Enter it on the "Tracking" page at luxe-core.uz to see the status or repeat your order.' },
        { heading: 'Can I return an item?', body: 'Yes, within 14 days of receiving it. See the "Return policy" page for details.' },
        { heading: 'How do I contact you?', body: 'Call +998 99 644 84 44 or write on Telegram: @luxecoreuz (website: https://luxe-core.uz). Working hours: Mon–Sat, 09:00–20:00.' },
      ],
    },
  },
  privacy: {
    uz: {
      title: 'Maxfiylik siyosati',
      description: "LUXECORE shaxsiy ma'lumotlaringizni qanday yig'ishi, ishlatishi va himoya qilishi haqida.",
      intro: "Sizning shaxsiy ma'lumotlaringiz biz uchun muhim. Ushbu sahifada ularni qanday ishlatishimiz tushuntirilgan.",
      sections: [
        { heading: "Qanday ma'lumotlar yig'iladi", body: "Buyurtma rasmiylashtirishda ism-familiya, telefon raqami va yetkazib berish manzili so'raladi. Bu ma'lumotlar faqat buyurtmani bajarish uchun kerak." },
        { heading: "Ma'lumotlardan foydalanish", body: "Ma'lumotlaringiz buyurtmani yetkazish, siz bilan bog'lanish va xizmat sifatini yaxshilash uchun ishlatiladi. Ma'lumotlaringiz hech qachon uchinchi shaxslarga sotilmaydi." },
        { heading: 'Cookie va analitika', body: "Sayt tajribasini yaxshilash uchun cookie fayllari hamda analitika vositalari (Google Analytics, Meta Pixel) ishlatiladi. Ular shaxsingizni aniqlamaydi, faqat saytdan foydalanish statistikasini yig'adi." },
        { heading: "Ma'lumotlarni himoya qilish", body: "Ma'lumotlaringiz zamonaviy xavfsizlik standartlariga mos server (Supabase) da saqlanadi va faqat vakolatli xodimlar uchun ochiq." },
        { heading: 'Huquqlaringiz', body: "Ma'lumotlaringizni ko'rish, o'zgartirish yoki o'chirishni so'rashingiz mumkin. Buning uchun +998 99 644 84 44 raqamiga murojaat qiling." },
      ],
    },
    ru: {
      title: 'Политика конфиденциальности',
      description: 'Как LUXECORE собирает, использует и защищает ваши персональные данные.',
      intro: 'Ваши персональные данные важны для нас. На этой странице описано, как мы их используем.',
      sections: [
        { heading: 'Какие данные собираются', body: 'При оформлении заказа запрашиваются имя, номер телефона и адрес доставки. Эти данные нужны только для выполнения заказа.' },
        { heading: 'Использование данных', body: 'Ваши данные используются для доставки заказа, связи с вами и улучшения качества сервиса. Данные никогда не продаются третьим лицам.' },
        { heading: 'Cookie и аналитика', body: 'Для улучшения работы сайта используются cookie и аналитические инструменты (Google Analytics, Meta Pixel). Они не идентифицируют вашу личность, а собирают только статистику использования сайта.' },
        { heading: 'Защита данных', body: 'Ваши данные хранятся на сервере, соответствующем современным стандартам безопасности (Supabase), и доступны только уполномоченным сотрудникам.' },
        { heading: 'Ваши права', body: 'Вы можете запросить просмотр, изменение или удаление своих данных. Для этого обратитесь по номеру +998 99 644 84 44.' },
      ],
    },
    en: {
      title: 'Privacy policy',
      description: 'How LUXECORE collects, uses and protects your personal data.',
      intro: 'Your personal data matters to us. This page explains how we use it.',
      sections: [
        { heading: 'What data we collect', body: 'When placing an order we ask for your name, phone number and delivery address. This data is needed only to fulfil your order.' },
        { heading: 'How we use it', body: 'Your data is used to deliver your order, contact you and improve our service. It is never sold to third parties.' },
        { heading: 'Cookies and analytics', body: 'We use cookies and analytics tools (Google Analytics, Meta Pixel) to improve the site experience. They do not identify you personally; they only collect usage statistics.' },
        { heading: 'Data protection', body: 'Your data is stored on infrastructure that meets modern security standards (Supabase) and is accessible only to authorized staff.' },
        { heading: 'Your rights', body: 'You may request to view, change or delete your data. Contact us at +998 99 644 84 44.' },
      ],
    },
  },
  terms: {
    uz: {
      title: 'Foydalanish shartlari',
      description: 'LUXECORE onlayn do\'konidan foydalanish shartlari: buyurtma, to\'lov, yetkazib berish va qaytarish tartibi.',
      intro: "Saytdan foydalanish va buyurtma berish orqali siz quyidagi shartlarga rozilik bildirasiz.",
      sections: [
        { heading: 'Umumiy qoidalar', body: "LUXECORE — premium mahsulotlar sotuvchi onlayn do'kon. Saytdagi barcha narxlar O'zbekiston so'mida ko'rsatilgan va qo'shimcha yashirin to'lovlar yo'q." },
        { heading: 'Buyurtma berish', body: "Buyurtma rasmiylashtirilgach, operatorimiz telefon orqali bog'lanib buyurtmani tasdiqlaydi. Minimal buyurtma summasi — 500 000 so'm." },
        { heading: "To'lov", body: "To'lov Paynet orqali onlayn yoki mahsulotni qabul qilishda naqd pul bilan amalga oshiriladi. Onlayn to'lov holati operator tomonidan tekshirib tasdiqlanadi." },
        { heading: 'Yetkazib berish va qaytarish', body: "Yetkazib berish shartlari \"Yetkazib berish\" sahifasida, qaytarish tartibi \"Qaytarish siyosati\" sahifasida batafsil yoritilgan." },
        { heading: 'Javobgarlik', body: "Mahsulot tavsiflari imkon qadar aniq berilgan; ekran sozlamalariga qarab rang biroz farq qilishi mumkin. Savollar bo'lsa: +998 99 644 84 44." },
      ],
    },
    ru: {
      title: 'Условия использования',
      description: 'Условия использования магазина LUXECORE: заказ, оплата, доставка и возврат.',
      intro: 'Используя сайт и оформляя заказ, вы соглашаетесь со следующими условиями.',
      sections: [
        { heading: 'Общие положения', body: 'LUXECORE — интернет-магазин премиальных товаров. Все цены на сайте указаны в узбекских сумах, скрытых платежей нет.' },
        { heading: 'Оформление заказа', body: 'После оформления заказа наш оператор свяжется с вами по телефону для подтверждения. Минимальная сумма заказа — 500 000 сум.' },
        { heading: 'Оплата', body: 'Оплата производится онлайн через Paynet или наличными при получении. Статус онлайн-оплаты проверяется и подтверждается оператором.' },
        { heading: 'Доставка и возврат', body: 'Условия доставки описаны на странице «Доставка», порядок возврата — на странице «Политика возврата».' },
        { heading: 'Ответственность', body: 'Описания товаров даны максимально точно; цвет может незначительно отличаться в зависимости от настроек экрана. Вопросы: +998 99 644 84 44.' },
      ],
    },
    en: {
      title: 'Terms of use',
      description: 'LUXECORE store terms of use: ordering, payment, delivery and returns.',
      intro: 'By using this site and placing an order you agree to the following terms.',
      sections: [
        { heading: 'General', body: 'LUXECORE is an online store for premium goods. All prices are listed in Uzbek soums with no hidden fees.' },
        { heading: 'Ordering', body: 'After you place an order, our operator will call you to confirm it. The minimum order amount is 500,000 UZS.' },
        { heading: 'Payment', body: 'Payment is made online via Paynet or in cash on delivery. Online payment status is verified and confirmed by our operator.' },
        { heading: 'Delivery and returns', body: 'Delivery terms are described on the "Delivery" page; the return procedure — on the "Return policy" page.' },
        { heading: 'Liability', body: 'Product descriptions are as accurate as possible; colors may differ slightly depending on your screen settings. Questions: +998 99 644 84 44.' },
      ],
    },
  },
};

export function getInfoContent(topic: InfoTopic, lang: string): InfoPageContent {
  const localized = INFO_CONTENT[topic];
  return localized[(lang as 'uz' | 'ru' | 'en')] || localized.uz;
}
