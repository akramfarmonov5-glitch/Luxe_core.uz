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
      title: 'Yetkazib berish',
      description: "LUXECORE yetkazib berish shartlari: Toshkent bo'ylab 1–2 ish kuni, viloyatlarga 2–5 ish kuni. 2 mln so'mdan yuqori buyurtmalarga bepul.",
      intro: "Buyurtmangizni O'zbekistonning istalgan nuqtasiga yetkazib beramiz.",
      sections: [
        { heading: 'Yetkazib berish muddati', body: "Toshkent shahri bo'ylab — 1–2 ish kuni. Viloyatlarga — 2–5 ish kuni. Buyurtma tasdiqlangandan so'ng operatorimiz siz bilan bog'lanib, aniq vaqtni kelishib oladi." },
        { heading: 'Yetkazib berish narxi', body: "2 000 000 so'mdan yuqori buyurtmalar uchun yetkazib berish bepul. Undan kam summadagi buyurtmalar uchun yetkazib berish narxi — 40 000 so'm." },
        { heading: 'Minimal buyurtma', body: "Minimal buyurtma summasi — 500 000 so'm." },
        { heading: 'Buyurtmani kuzatish', body: "Buyurtma raqamingiz orqali saytdagi \"Kuzatish\" sahifasida buyurtma holatini istalgan vaqtda tekshirishingiz mumkin." },
      ],
    },
    ru: {
      title: 'Доставка',
      description: 'Условия доставки LUXECORE: по Ташкенту 1–2 рабочих дня, в регионы 2–5 рабочих дней. Бесплатно при заказе от 2 млн сум.',
      intro: 'Мы доставим ваш заказ в любую точку Узбекистана.',
      sections: [
        { heading: 'Сроки доставки', body: 'По Ташкенту — 1–2 рабочих дня. В регионы — 2–5 рабочих дней. После подтверждения заказа наш оператор свяжется с вами и согласует точное время.' },
        { heading: 'Стоимость доставки', body: 'Для заказов на сумму свыше 2 000 000 сум доставка бесплатная. Для заказов на меньшую сумму стоимость доставки — 40 000 сум.' },
        { heading: 'Минимальный заказ', body: 'Минимальная сумма заказа — 500 000 сум.' },
        { heading: 'Отслеживание заказа', body: 'По номеру заказа вы можете в любой момент проверить статус на странице «Отслеживание».' },
      ],
    },
    en: {
      title: 'Delivery',
      description: 'LUXECORE delivery terms: 1–2 business days in Tashkent, 2–5 business days to regions. Free for orders over 2M UZS.',
      intro: 'We deliver your order anywhere in Uzbekistan.',
      sections: [
        { heading: 'Delivery time', body: 'Tashkent city — 1–2 business days. Regions — 2–5 business days. After your order is confirmed, our operator will contact you to agree on the exact time.' },
        { heading: 'Delivery cost', body: 'Delivery is free for orders over 2,000,000 UZS. For smaller orders the delivery fee is 40,000 UZS.' },
        { heading: 'Minimum order', body: 'The minimum order amount is 500,000 UZS.' },
        { heading: 'Order tracking', body: 'You can check your order status at any time on the "Tracking" page using your order number.' },
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
      title: "Ko'p so'raladigan savollar",
      description: "LUXECORE haqida ko'p so'raladigan savollar: to'lov, yetkazib berish, buyurtmani kuzatish va qaytarish.",
      intro: 'Eng ko\'p beriladigan savollarga javoblar.',
      sections: [
        { heading: "Qanday to'lov usullari mavjud?", body: "Paynet orqali onlayn to'lov yoki mahsulotni qabul qilishda naqd pul bilan to'lash mumkin." },
        { heading: 'Buyurtma qancha vaqtda yetkaziladi?', body: "Toshkent bo'ylab 1–2 ish kuni, viloyatlarga 2–5 ish kuni ichida yetkazib beriladi." },
        { heading: 'Buyurtmamni qanday kuzataman?', body: "Buyurtma rasmiylashtirilgach sizga buyurtma raqami beriladi. Uni saytdagi \"Kuzatish\" sahifasiga kiritib, holatini ko'rishingiz mumkin." },
        { heading: 'Mahsulotni qaytarsam bo\'ladimi?', body: "Ha, mahsulotni qabul qilib olgan kundan boshlab 14 kun ichida qaytarishingiz mumkin. Batafsil — \"Qaytarish siyosati\" sahifasida." },
        { heading: 'Mahsulotlar originalmi?', body: "Barcha mahsulotlar sifat kafolati bilan sotiladi. Har bir buyurtma jo'natishdan oldin tekshiriladi." },
        { heading: "Savollarim bo'lsa kimga murojaat qilaman?", body: "+998 99 644 84 44 raqamiga qo'ng'iroq qiling yoki Telegram orqali yozing: @luxecoreuz. Ish vaqti: Dush–Shan, 09:00–20:00." },
      ],
    },
    ru: {
      title: 'Часто задаваемые вопросы',
      description: 'Ответы на частые вопросы о LUXECORE: оплата, доставка, отслеживание заказа и возврат.',
      intro: 'Ответы на самые популярные вопросы.',
      sections: [
        { heading: 'Какие способы оплаты доступны?', body: 'Онлайн-оплата через Paynet или наличными при получении товара.' },
        { heading: 'Как быстро доставят заказ?', body: 'По Ташкенту — 1–2 рабочих дня, в регионы — 2–5 рабочих дней.' },
        { heading: 'Как отследить заказ?', body: 'После оформления вы получите номер заказа. Введите его на странице «Отслеживание», чтобы увидеть статус.' },
        { heading: 'Можно ли вернуть товар?', body: 'Да, в течение 14 дней с момента получения. Подробнее — на странице «Политика возврата».' },
        { heading: 'Товары оригинальные?', body: 'Все товары продаются с гарантией качества. Каждый заказ проверяется перед отправкой.' },
        { heading: 'Куда обращаться с вопросами?', body: 'Звоните по номеру +998 99 644 84 44 или пишите в Telegram: @luxecoreuz. Время работы: Пн–Сб, 09:00–20:00.' },
      ],
    },
    en: {
      title: 'Frequently asked questions',
      description: 'Answers to common questions about LUXECORE: payment, delivery, order tracking and returns.',
      intro: 'Answers to the most common questions.',
      sections: [
        { heading: 'What payment methods are available?', body: 'Online payment via Paynet, or cash on delivery.' },
        { heading: 'How fast is delivery?', body: '1–2 business days in Tashkent, 2–5 business days to regions.' },
        { heading: 'How do I track my order?', body: 'After checkout you receive an order number. Enter it on the "Tracking" page to see the status.' },
        { heading: 'Can I return an item?', body: 'Yes, within 14 days of receiving it. See the "Return policy" page for details.' },
        { heading: 'Are the products original?', body: 'All products are sold with a quality guarantee. Every order is inspected before shipping.' },
        { heading: 'How do I contact you?', body: 'Call +998 99 644 84 44 or write on Telegram: @luxecoreuz. Working hours: Mon–Sat, 09:00–20:00.' },
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
