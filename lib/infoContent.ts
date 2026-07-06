export type InfoTopic = 'delivery' | 'returns' | 'faq';

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
};

export function getInfoContent(topic: InfoTopic, lang: string): InfoPageContent {
  const localized = INFO_CONTENT[topic];
  return localized[(lang as 'uz' | 'ru' | 'en')] || localized.uz;
}
