import { Product, Category, HeroContent, NavigationSettings, BlogPost } from './types';

export const DEFAULT_HERO_CONTENT: HeroContent = {
  badge: "Ulgurji Savdo",
  title: "Sovg'a qutilari, Paketlar va Qadoqlash — Ulgurji Narxda",
  description: "To'y, Bayram va Yangi Yil 2027 qutilari, shuningdek Zip-Lock, Kraft va BOPP paketlar. O'rikzor omboridan 100 donadan boshlab 1 kunda yetkazib beramiz.",
  buttonText: "Katalogga o'tish",
  images: [
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop", // Gift boxes / holiday packaging
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop", // Wrapped gifts
    "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1000&auto=format&fit=crop"  // Packaging / craft
  ]
};

export const DEFAULT_NAVIGATION: NavigationSettings = {
  menuItems: [
    { id: 'nav_1', label: "🎄 Yangi Yil 2027", href: "/category/yangi-yil-2027" },
    { id: 'nav_2', label: "💍 To'y va Sarpo", href: "/category/toy-qutilari" },
    { id: 'nav_3', label: "🎁 Sovg'a Qutilari", href: "/category/sovga-qutilari" },
    { id: 'nav_4', label: "🛍 Kraft va Zip Paketlar", href: "/category/kraft-zip-paketlar" },
    { id: 'nav_5', label: "✨ BOPP Paketlar", href: "/category/bopp-paketlar" },
    { id: 'nav_6', label: "☕ HoReCa va Xo'jalik", href: "/category/horeca-xojalik" }
  ],
  socialLinks: [
    { id: 'soc_1', platform: 'instagram', url: 'https://instagram.com/luxe_core_uz' },
    { id: 'soc_2', platform: 'telegram', url: 'https://t.me/Luxecoreuzbot' }
  ]
};

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat_1',
    name: 'Yangi Yil 2027 Qutilari',
    slug: 'yangi-yil-2027',
    image: '/products/yangi-yil/yangi-yil-karobkalar-optom-1.png',
    description: 'Yangi Yil 2027 bayram va bolalar shirinlik qutilari ulgurji narxlarda.',
    googleProductCategory: 'Home & Garden > Linens & Bedding > Holiday Ornaments'
  },
  {
    id: 'cat_2',
    name: 'To\'y va Sarpo Qutilari',
    slug: 'toy-qutilari',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop',
    description: 'Kuyov-kelin sarpo to\'plamlari, magnitli va atlas lentali premium qutilar.',
    googleProductCategory: 'Luggage & Bags > Boxes & Cases'
  },
  {
    id: 'cat_3',
    name: 'Bayram va Sovg\'a Qutilari',
    slug: 'sovga-qutilari',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1000&auto=format&fit=crop',
    description: 'Atir, kosmetika, sovg\'a va dekorativ shaffof darchali kraft qutilar.',
    googleProductCategory: 'Luggage & Bags > Gift Boxes'
  },
  {
    id: 'cat_4',
    name: 'Zip-Lock va Kraft Paketlar',
    slug: 'kraft-zip-paketlar',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=1000&auto=format&fit=crop',
    description: 'Kiyim-kechak, butik va marketpleys sotuvchilari uchun matoviy zip-lock va kraft paketlar.',
    googleProductCategory: 'Luggage & Bags > Shopping Totes & Paper Bags'
  },
  {
    id: 'cat_5',
    name: 'BOPP va Qadoqlash Paketlari',
    slug: 'bopp-paketlar',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
    description: 'Yelimli klapanli BOPP paketlar, qalin skotch va strich-plyonkalar.',
    googleProductCategory: 'Business & Industrial > Material Handling > Packaging Materials'
  },
  {
    id: 'cat_6',
    name: 'HoReCa va Xo\'jalik Ulgurji',
    slug: 'horeca-xojalik',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop',
    description: 'Kofe stakanlari, fast-food kraft qutilari va qopqoqli bir martalik idishlar.',
    googleProductCategory: 'Home & Garden > Kitchen & Dining > Tableware'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 101,
    name: {"uz":"Yangi yil 2027 sovg‘a paketi - \"Qishki ertak va archa\" (o‘rta)","ru":"Новогодний подарочный пакет 2027 - \"Зимняя сказка и елка\" (средний)","en":"New Year 2027 Gift Bag - \"Winter Tale & Tree\" (Medium)"},
    slug: {"uz":"yangi-yil-2027-sovga-paketi-qishki-ertak-va-archa-orta","ru":"yangi-yil-2027-sovga-paketi-qishki-ertak-va-archa-orta","en":"yangi-yil-2027-sovga-paketi-qishki-ertak-va-archa-orta"},
    price: 1800,
    formattedPrice: "1 800 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-1.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-1.png","/products/yangi-yil/yangi-yil-karobkalar-optom-31.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/d9257b19-10b2-49df-bfc5-377a8b5cd578.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/480480d2-5466-4c58-baaf-76db74f10637-600.webp"],
    shortDescription: {"uz":"Bayramona dizayndagi \"Qishki ertak va archa\" nomli o‘lchamdagi yangi yil 2027 sovg‘a paketi. Yaqinlaringiz va hamkasblaringiz uchun sovg‘alarni chiroyli qadoqlashga juda mos keladi. Ulgurji va chakana savdo uchun qulay. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодний подарочный пакет 2027 - \"Зимняя сказка и елка\" (средний) оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"New Year 2027 Gift Bag - \"Winter Tale & Tree\" (Medium) wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 100,
    stock: 30000,
    is_bestseller: true,
    is_premium: false,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 102,
    name: {"uz":"Yangi yil 2027 sovg‘a paketi - \"Qorbobo va bolalar\" (28.5x21.5x8 sm)","ru":"Новогодний подарочный пакет 2027 - \"Дед Мороз и дети\" (28.5x21.5x8 sm)","en":"New Year 2027 Gift Bag - \"Santa & Kids\" (28.5x21.5x8 sm)"},
    slug: {"uz":"yangi-yil-2027-sovga-paketi-qorbobo-va-bolalar-28-5x21-5x8-sm","ru":"yangi-yil-2027-sovga-paketi-qorbobo-va-bolalar-28-5x21-5x8-sm","en":"yangi-yil-2027-sovga-paketi-qorbobo-va-bolalar-28-5x21-5x8-sm"},
    price: 1800,
    formattedPrice: "1 800 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-2.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-2.png","/products/yangi-yil/yangi-yil-karobkalar-optom-32.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/480480d2-5466-4c58-baaf-76db74f10637.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/d9257b19-10b2-49df-bfc5-377a8b5cd578-600.webp"],
    shortDescription: {"uz":"O'lchami 28.5x21.5x8 sm bo'lgan bayramona dizayndagi \"Qorbobo va bolalar\" Yangi yil 2027 sovg‘a paketi. Sovg'alarni joylash uchun qulay va chiroyli tanlov. Ulgurji va chakana savdo uchun. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодний подарочный пакет 2027 - \"Дед Мороз и дети\" (28.5x21.5x8 sm) оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"New Year 2027 Gift Bag - \"Santa & Kids\" (28.5x21.5x8 sm) wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 100,
    stock: 30000,
    is_bestseller: true,
    is_premium: false,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 103,
    name: {"uz":"Yangi yil sovg'a qutisi (karton paket) \"Qorbobo\", 28.5x21.5x8 sm","ru":"Новогодняя подарочная коробка (картонный пакет) \"Дед Мороз\", 28.5x21.5x8 sm","en":"Holiday Cardboard Gift Bag \"Santa\", 28.5x21.5x8 sm"},
    slug: {"uz":"yangi-yil-sovga-qutisi-karton-paket-qorbobo-28-5x21-5x8-sm","ru":"yangi-yil-sovga-qutisi-karton-paket-qorbobo-28-5x21-5x8-sm","en":"yangi-yil-sovga-qutisi-karton-paket-qorbobo-28-5x21-5x8-sm"},
    price: 1800,
    formattedPrice: "1 800 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-3.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-3.png","/products/yangi-yil/yangi-yil-karobkalar-optom-33.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/6bcb9aef-81f3-4296-8629-24e7ffe5365a.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/d9257b19-10b2-49df-bfc5-377a8b5cd578-600.webp"],
    shortDescription: {"uz":"Yangi 2027-yil bayrami uchun yorqin va sifatli sovg'a qutisi (karton paket). Shirinliklar, bolalar sovg'alari va korporativ tuhfalarni qadoqlash uchun ajoyib tanlov.   Afzalliklari va xususiyatlari:O'lchami: Bo'yi — 28.5 sm, eni — 21.5 sm, tubi (chuqurligi) — 8 sm.   Qulay shakl: Yuqori qismida tayyor kesilgan tutqichi va qulf vazifasini bajaruvchi qopqog'i bor (qo'shimcha skotch yoki yelim shart emas).   Material: Mustahkam, sifatli qalin karton (sovg'a og'irligini bemalol ko'taradi).Dizayn: Qorbobo va bolajonlar tasvirlangan bayramona yorqin bosma, ustida \"С Новым Годом\" yozuvi mavjud.   Qadoqda: 100 dona (optom narxda). Bog'cha, maktab, tashkilotlar va do'konlar uchun juda qulay. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодняя подарочная коробка (картонный пакет) \"Дед Мороз\", 28.5x21.5x8 sm оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"Holiday Cardboard Gift Bag \"Santa\", 28.5x21.5x8 sm wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 100,
    stock: 30000,
    is_bestseller: true,
    is_premium: false,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 104,
    name: {"uz":"Yangi yil sovg'a qutisi (karton karobka) \"Qorbobo va Qorbola\"","ru":"Новогодняя коробка для конфет (картон) \"Дед Мороз и снеговик\"","en":"New Year Candy Box (Carton) \"Santa & Snowman\""},
    slug: {"uz":"yangi-yil-sovga-qutisi-karton-karobka-qorbobo-va-qorbola","ru":"yangi-yil-sovga-qutisi-karton-karobka-qorbobo-va-qorbola","en":"yangi-yil-sovga-qutisi-karton-karobka-qorbobo-va-qorbola"},
    price: 2400,
    formattedPrice: "2 400 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-4.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-4.png","/products/yangi-yil/yangi-yil-karobkalar-optom-34.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/3705e8dd-dda2-4905-89ea-f165c3289c99.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/c446bb38-9a82-47f0-a2ed-8cb1d7997dd9.webp"],
    shortDescription: {"uz":"Yangi 2027-yil bayrami uchun \"sandiqcha\" (sunduchok) shaklidagi yorqin va mustahkam karton sovg'a qutisi. Bolalar shirinliklari, konfetlar va bayramona sovg'alarni qadoqlash uchun eng ommabop va qulay variant.   Afzalliklari va xususiyatlari:Ikki tomonlama yorqin dizayn: Qutining bir tomonida bezatilgan archa, bug'u, qishki uycha va sovg'alar qopi, ikkinchi tomonida esa quvnoq qorbolalar (снеговики) tasvirlangan. Yon tomonida \"С Новым Годом\" tabrik yozuvi mavjud.   Qulay konstruksiya: Yuqori qismida qo'lda ko'tarib yurish uchun qulay kesilgan tutqichi bor. Yelim va skotchsiz tez hamda oson yig'iladi.   Material: Yuqori sifatli qalin karton — shaklini yaxshi ushlaydi va shirinliklar og'irligiga chidamli.\r\nUlgurji xarid: Bog'chalar, maktablar, korporativ mijozlar va do'konlar uchun ulgurji (optom) narxlarda sotiladi. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодняя коробка для конфет (картон) \"Дед Мороз и снеговик\" оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"New Year Candy Box (Carton) \"Santa & Snowman\" wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 100,
    stock: 30000,
    is_bestseller: true,
    is_premium: false,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 105,
    name: {"uz":"Yangi yil sovg'a qutisi (karton karobka) \"Qorbobo va Uycha\"","ru":"Новогодняя коробка для конфет (картон) \"Дед Мороз и домик\"","en":"New Year Candy Box (Carton) \"Santa & Cottage\""},
    slug: {"uz":"yangi-yil-sovga-qutisi-karton-karobka-qorbobo-va-uycha","ru":"yangi-yil-sovga-qutisi-karton-karobka-qorbobo-va-uycha","en":"yangi-yil-sovga-qutisi-karton-karobka-qorbobo-va-uycha"},
    price: 2500,
    formattedPrice: "2 500 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-5.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-5.png","/products/yangi-yil/yangi-yil-karobkalar-optom-35.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/9d28ca54-5d95-4b44-b338-a89c6260e0ca.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/e36e812b-d27d-4c30-b274-3b4550605565.webp"],
    shortDescription: {"uz":"Yangi 2027-yil bayrami uchun ertaknamo yog'och uycha ko'rinishidagi yorqin va mustahkam karton sovg'a qutisi (sunduchok). Bolalar shirinliklari, konfetlar va bayram sovg'alarini qadoqlash uchun ajoyib tanlov.\r\n\r\nAfzalliklari va xususiyatlari:\r\n• Ikki tomonlama bayramona dizayn: Bir tomonida sovg'a ulashayotgan Qorbobo va qizaloq, ikkinchi tomonida esa bezatilgan Yangi yil archasi hamda kuchukchali bolakay tasvirlangan. Tom qismida chiroyli chiroqlar (girlyanda) va mo'ri rasmi bor.\r\n• Ikki tilda tabrik: Qutining yuqori qismida \"Yangi yilingiz bilan!\" va \"С Новым Годом!\" yozuvlari mavjud.\r\n• Qulay konstruksiya: Yuqori qismida qo'lda ushlash uchun qulay kesilgan tutqichi bor. Yelim va skotchsiz tez hamda oson yig'iladi.\r\n• Material: Sifatli qalin karton — shaklini yaxshi ushlaydi va shirinliklar og'irligini bemalol ko'taradi.\r\n• Ulgurji xarid: Bog'cha, maktab, tashkilotlar va do'konlar uchun eng arzon ulgurji (optom) narxlarda sotiladi. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодняя коробка для конфет (картон) \"Дед Мороз и домик\" оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"New Year Candy Box (Carton) \"Santa & Cottage\" wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 100,
    stock: 30000,
    is_bestseller: true,
    is_premium: false,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 106,
    name: {"uz":"Yangi yil sovg'a qutisi (karton karobka) \"Masha va Ayiq\"","ru":"Новогодняя коробка для конфет (картон) \"Маша и медведь\"","en":"New Year Candy Box (Carton) \"Masha & The Bear\""},
    slug: {"uz":"yangi-yil-sovga-qutisi-karton-karobka-masha-va-ayiq","ru":"yangi-yil-sovga-qutisi-karton-karobka-masha-va-ayiq","en":"yangi-yil-sovga-qutisi-karton-karobka-masha-va-ayiq"},
    price: 1800,
    formattedPrice: "1 800 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-6.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-6.png","/products/yangi-yil/yangi-yil-karobkalar-optom-36.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/73d6e19b-3770-4b28-8c3f-1241ad3ea6b5.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/d979040f-b48c-44b0-b1ed-a6e1ad4d18e8.webp"],
    shortDescription: {"uz":"Yangi 2027-yil bayrami uchun bolajonlarning sevimli \"Masha va Ayiq\" (Маша и Медведь) multfilmi qahramonlari tasvirlangan yorqin va sifatli karton sovg'a qutisi. Bog'cha va maktab bolalari uchun shirinliklar, konfetlar hamda bayram sovg'alarini qadoqlashda eng xaridorgir tanlov.\r\n\r\nAfzalliklari va xususiyatlari:\r\n• Ikki tomonlama sevimli dizayn: Qutining bir tomonida Qorqiz kiyimidagi Masha, Ayiq va bezatilgan Yangi yil archasi, ikkinchi tomonida esa Masha, quyonchalar, olmaxonlar va sovg'alar tasvirlangan. Ustida yorqin \"С Новым Годом!\" tabrik yozuvi bor.\r\n• Qulay shakl: Yuqori qismida bolalar qo'lda ko'tarib yurishi uchun qulay kesilgan tutqichi mavjud. Yelim va skotchsiz tez hamda oson yig'iladi.\r\n• Material: Mustahkam, yaltiroq (glyanseviy) qalin karton — shaklini yaxshi ushlaydi va shirinliklar og'irligini bemalol ko'taradi.\r\n• Ulgurji xarid: Bog'chalar, maktablar, do'konlar va ulgurji savdogarlar uchun eng arzon optom narxlarda sotiladi. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодняя коробка для конфет (картон) \"Маша и медведь\" оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"New Year Candy Box (Carton) \"Masha & The Bear\" wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 100,
    stock: 30000,
    is_bestseller: true,
    is_premium: false,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 107,
    name: {"uz":"Yangi yil sovg'a qutisi (derazali uycha) \"Qishki uycha\"","ru":"Новогодняя коробка с окошком «Домик» \"Зимний домик\"","en":"New Year Window House Box \"Winter House\""},
    slug: {"uz":"yangi-yil-sovga-qutisi-derazali-uycha-qishki-uycha","ru":"yangi-yil-sovga-qutisi-derazali-uycha-qishki-uycha","en":"yangi-yil-sovga-qutisi-derazali-uycha-qishki-uycha"},
    price: 3000,
    formattedPrice: "3 000 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-7.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-7.png","/products/yangi-yil/yangi-yil-karobkalar-optom-37.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/ad6af1b4-180a-449d-be50-1e3be0c9d792.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/d9257b19-10b2-49df-bfc5-377a8b5cd578-600.webp"],
    shortDescription: {"uz":"Yangi 2027-yil bayrami uchun shaffof derazali va mo'rili ertaknamo uycha ko'rinishidagi original karton sovg'a qutisi. Bolalar shirinliklari, konfetlar va Yangi yil sovg'alarini chiroyli qadoqlash uchun eng xaridorgir va noodatiy tanlov.\r\n\r\nAfzalliklari va xususiyatlari:\r\n• Shaffof derazacha: Uycha oldidagi deraza orqali quti ichidagi shirinliklar va sovg'alar ko'rinib turadi — bu sovg'ani yanada jozibador qiladi.\r\n• Ertaknamo 3D dizayn: Quti haqiqiy qorli uycha shaklida bo'lib, tom qismida muzqaymoq ushlagan oq ayiqcha, pastki qismida esa quvnoq qorbola, pingvin va \"С Новым Годом\" tabrik yozuvi tasvirlangan.\r\n• Qulay tutqich: Uycha mo'risi (trubasi) qo'lda ko'tarib yurish uchun qulay va mustahkam tutqich vazifasini bajaradi.\r\n• Material: Yuqori sifatli yaltiroq (glyanseviy) qalin karton — shaklini a'lo darajada ushlaydi, yelim va skotchsiz oson yig'iladi.\r\n• Ulgurji xarid: Bog'chalar, maktablar, do'konlar va korporativ mijozlar uchun eng arzon ulgurji (optom) narxlarda sotiladi. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодняя коробка с окошком «Домик» \"Зимний домик\" оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"New Year Window House Box \"Winter House\" wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 100,
    stock: 30000,
    is_bestseller: true,
    is_premium: false,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 108,
    name: {"uz":"Yangi yil sovg'a qutisi (derazali karobka) \"Qishki o'yinlar\"","ru":"Новогодняя коробка с окошком \"Зимние забавы\"","en":"New Year Clear Window Box \"Winter Games\""},
    slug: {"uz":"yangi-yil-sovga-qutisi-derazali-karobka-qishki-oyinlar","ru":"yangi-yil-sovga-qutisi-derazali-karobka-qishki-oyinlar","en":"yangi-yil-sovga-qutisi-derazali-karobka-qishki-oyinlar"},
    price: 3500,
    formattedPrice: "3 500 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-8.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-8.png","/products/yangi-yil/yangi-yil-karobkalar-optom-38.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/5cb4dea9-5772-40d5-acec-cc76c3849a67.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/d9257b19-10b2-49df-bfc5-377a8b5cd578-600.webp"],
    shortDescription: {"uz":"Yangi 2027-yil bayrami uchun shaffof derazali va tutqichli yorqin karton sovg'a qutisi (sunduchok). Bolalar shirinliklari, konfetlar va bayram sovg'alarini chiroyli qadoqlash uchun eng xaridorgir va qulay tanlov.\r\n\r\nAfzalliklari va xususiyatlari:\r\n• Shaffof derazacha: Qutining old qismida maxsus shaffof darcha mavjud bo'lib, uning ichidagi shirinliklar va sovg'alar tashqaridan chiroyli ko'rinib turadi.\r\n• Milliy bayramona dizayn: Qutida qorda chana, vatrushka va chang'i uchayotgan quvnoq bolajonlar, bayram mushaklari hamda \"Yangi yilingiz bilan!\" tabrik yozuvi tasvirlangan. Yon tomonida Qorbobo rasmi bor.\r\n• Qulay konstruksiya: Yuqori qismida qo'lda ko'tarib yurish uchun mustahkam kesilgan tutqichi mavjud. Yelim va skotchsiz tez hamda oson yig'iladi.\r\n• Material: Yuqori sifatli yaltiroq (glyanseviy) qalin karton — shaklini yaxshi ushlaydi va shirinliklar og'irligiga chidamli.\r\n• Ulgurji xarid: Bog'chalar, maktablar, do'konlar va korporativ mijozlar uchun eng arzon ulgurji (optom) narxlarda sotiladi. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодняя коробка с окошком \"Зимние забавы\" оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"New Year Clear Window Box \"Winter Games\" wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 100,
    stock: 30000,
    is_bestseller: true,
    is_premium: false,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 109,
    name: {"uz":"Yangi yil sovg'a qutisi (sandiqcha-karobka) \"Sehrli oqshom va Qorbola\"","ru":"Новогодняя коробка «Сундучок» \"Волшебная ночь и снеговик\"","en":"New Year Treasure Chest Box \"Magical Night & Snowman\""},
    slug: {"uz":"yangi-yil-sovga-qutisi-sandiqcha-karobka-sehrli-oqshom-va-qorbola","ru":"yangi-yil-sovga-qutisi-sandiqcha-karobka-sehrli-oqshom-va-qorbola","en":"yangi-yil-sovga-qutisi-sandiqcha-karobka-sehrli-oqshom-va-qorbola"},
    price: 3200,
    formattedPrice: "3 200 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-9.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-9.png","/products/yangi-yil/yangi-yil-karobkalar-optom-39.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/76085dee-683a-4eaa-829a-19c227853182.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/d9257b19-10b2-49df-bfc5-377a8b5cd578-600.webp"],
    shortDescription: {"uz":"Yangi 2027-yil bayrami uchun nafis sandiqcha (larets) ko'rinishidagi yorqin va mustahkam karton sovg'a qutisi. Bolalar shirinliklari, konfetlar va korporativ bayram sovg'alarini chiroyli qadoqlash uchun juda qulay va xaridorgir tanlov.\r\n\r\nAfzalliklari va xususiyatlari:\r\n• Ertaknamo qishki dizayn: Qutida moviy qishki tun, to'lin oy fonida bug'ularda uchayotgan Qorbobo, sovg'a ushlagan quvnoq Qorbola va qorli uychalar tasvirlangan. Ustida chiroyli \"Счастливого Нового Года!\" tabrik yozuvi mavjud.\r\n• Ishonchli va chiroyli qulf: Yuqori qismida naqshinkor kesilgan qopqoq-qulfi hamda qo'lda ko'tarib yurish uchun qulay yumaloq tutqichi bor. Yelim va skotchsiz tez hamda oson yig'iladi.\r\n• Material: Yuqori sifatli yaltiroq (glyanseviy) qalin karton — shaklini a'lo darajada ushlaydi va shirinliklar og'irligini bemalol ko'taradi.\r\n• Ulgurji xarid: Bog'chalar, maktablar, do'konlar va tashkilotlar uchun eng arzon ulgurji (optom) narxlarda sotiladi. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодняя коробка «Сундучок» \"Волшебная ночь и снеговик\" оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"New Year Treasure Chest Box \"Magical Night & Snowman\" wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 100,
    stock: 30000,
    is_bestseller: false,
    is_premium: false,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 110,
    name: {"uz":"Yangi yil sovg'a qutisi (sandiqcha-karobka) \"Mikki va Minni\"","ru":"Новогодняя коробка «Сундучок» \"Микки и Минни Маус\"","en":"New Year Treasure Chest Box \"Mickey & Minnie\""},
    slug: {"uz":"yangi-yil-sovga-qutisi-sandiqcha-karobka-mikki-va-minni","ru":"yangi-yil-sovga-qutisi-sandiqcha-karobka-mikki-va-minni","en":"yangi-yil-sovga-qutisi-sandiqcha-karobka-mikki-va-minni"},
    price: 3200,
    formattedPrice: "3 200 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-10.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-10.png","/products/yangi-yil/yangi-yil-karobkalar-optom-4.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/74e5c9d2-9f8a-46db-89bc-685b1373dd79.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/d9257b19-10b2-49df-bfc5-377a8b5cd578-600.webp"],
    shortDescription: {"uz":"Yangi 2027-yil bayrami uchun bolajonlarning sevimli multfilm qahramonlari — Mikki va Minni Maus tasvirlangan yorqin qizil rangli karton sovg'a qutisi (sandiqcha). Bog'cha va maktab bolalari uchun shirinliklar, konfetlar hamda bayram sovg'alarini qadoqlashda eng xaridorgir tanlov.\r\n\r\nAfzalliklari va xususiyatlari:\r\n• Yorqin bayramona dizayn: Qizil sahna pardalari va oltin qo'ng'iroqchalar fonida Yangi yil qalpog'ini kiygan Mikki va Minni Maus hamda shirinliklar gulchambari tasvirlangan.\r\n• O'zbek tilida tabrik: Qutining yumaloq tutqich qismida yorqin harflar bilan \"YANGI YILINGIZ BILAN!\" tabrik yozuvi mavjud.\r\n• Ishonchli qulf va tutqich: Yuqori qismida naqshinkor qopqoq-qulfi va qo'lda ko'tarib yurish uchun qulay tutqichi bor. Yelim va skotchsiz tez hamda oson yig'iladi.\r\n• Material: Yuqori sifatli yaltiroq (glyanseviy) qalin karton — shaklini a'lo darajada ushlaydi va shirinliklar og'irligini bemalol ko'taradi.\r\n• Ulgurji xarid: Bog'chalar, maktablar, do'konlar va tashkilotlar uchun eng arzon ulgurji (optom) narxlarda sotiladi. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодняя коробка «Сундучок» \"Микки и Минни Маус\" оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"New Year Treasure Chest Box \"Mickey & Minnie\" wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 100,
    stock: 30000,
    is_bestseller: false,
    is_premium: false,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 111,
    name: {"uz":"Yangi yil sovg'a qutisi (derazali karobka) \"Qorbobo va Oltin naqsh\"","ru":"Новогодняя коробка с окошком \"Дед Мороз и золотой орнамент\"","en":"New Year Clear Window Box \"Santa & Gold Ornament\""},
    slug: {"uz":"yangi-yil-sovga-qutisi-derazali-karobka-qorbobo-va-oltin-naqsh","ru":"yangi-yil-sovga-qutisi-derazali-karobka-qorbobo-va-oltin-naqsh","en":"yangi-yil-sovga-qutisi-derazali-karobka-qorbobo-va-oltin-naqsh"},
    price: 7500,
    formattedPrice: "7 500 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-11.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-11.png","/products/yangi-yil/yangi-yil-karobkalar-optom-41.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/856f97a5-503e-43eb-aa2f-bc1cef382246.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/d9257b19-10b2-49df-bfc5-377a8b5cd578-600.webp"],
    shortDescription: {"uz":"Yangi 2027-yil bayrami uchun shaffof derazali, qizil va oltin rang uyg'unligidagi klassik karton sovg'a qutisi (sunduchok). Bolalar shirinliklari, konfetlar hamda korporativ bayram sovg'alarini chiroyli qadoqlash uchun eng xaridorgir va universal tanlov.\r\n\r\nAfzalliklari va xususiyatlari:\r\n• Shaffof derazacha: Qutining old qismida chiroyli hoshiyali shaffof darcha mavjud bo'lib, ichidagi shirinliklar va sovg'a to'plami tashqaridan ko'rinib turadi.\r\n• Boy klassik dizayn: Qizil-tilla fonda zarhal naqshlar, sehrli hassa ushlagan Qorbobo, archa shoxlari, bayram shamlari va \"Счастливого Нового Года!\" tabrik yozuvi tasvirlangan.\r\n• Qulay konstruksiya: Yuqori qismida naqshlar bilan bezatilgan mustahkam kesilgan tutqichi bor. Yelim va skotchsiz tez hamda oson yig'iladi.\r\n• Material: Yuqori sifatli yaltiroq (glyanseviy) qalin karton — shaklini a'lo darajada ushlaydi va shirinliklar og'irligini bemalol ko'taradi.\r\n• Ulgurji xarid: Bog'chalar, maktablar, do'konlar va korporativ mijozlar uchun eng arzon ulgurji (optom) narxlarda sotiladi. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодняя коробка с окошком \"Дед Мороз и золотой орнамент\" оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"New Year Clear Window Box \"Santa & Gold Ornament\" wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 100,
    stock: 30000,
    is_bestseller: false,
    is_premium: true,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 112,
    name: {"uz":"Yangi yil sovg'a qutisi (milliy dizayn) \"Yangi yilingiz bilan!\"","ru":"Новогодняя коробка с национальным узором \"С Новым Годом!\"","en":"Traditional Gold Ornament Gift Box \"Happy New Year!\""},
    slug: {"uz":"yangi-yil-sovga-qutisi-milliy-dizayn-yangi-yilingiz-bilan","ru":"yangi-yil-sovga-qutisi-milliy-dizayn-yangi-yilingiz-bilan","en":"yangi-yil-sovga-qutisi-milliy-dizayn-yangi-yilingiz-bilan"},
    price: 2500,
    formattedPrice: "2 500 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-12.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-12.png","/products/yangi-yil/yangi-yil-karobkalar-optom-42.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/aee78ea6-aac2-4a28-a230-a93188c2d7ce.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/d9257b19-10b2-49df-bfc5-377a8b5cd578-600.webp"],
    shortDescription: {"uz":"Yangi 2027-yil bayrami uchun o'zbek milliy naqshlari (xonatlas, adras va sharqona bezaklar) uyg'unligida ishlangan betakror va mustahkam karton sovg'a qutisi. Bolalar shirinliklari, konfetlar hamda korporativ bayram sovg'alarini chiroyli qadoqlash uchun eng xaridorgir va original tanlov.\r\n\r\nAfzalliklari va xususiyatlari:\r\n• Milliy va bayramona dizayn: Qutida o'zbek milliy matolari (atlas va adras) naqshlari, sharqona bezakli archa o'yinchoqlari, quvnoq bolakay, sovg'alar hamda \"Yangi yilingiz bilan!\" tabrik yozuvi aks ettirilgan.\r\n• Yon tomonda shaffof derazacha: Qutining yon qismida archa shaklidagi maxsus shaffof darcha mavjud bo'lib, uning ichidagi shirinliklar ko'rinib turadi.\r\n• Qulay shakl: Yuqori qismida qo'lda ko'tarib yurish uchun qulay kesilgan tutqichi bor. Yelim va skotchsiz tez hamda oson yig'iladi.\r\n• Material: Yuqori sifatli yaltiroq (glyanseviy) qalin karton — shaklini a'lo darajada ushlaydi va shirinliklar og'irligini bemalol ko'taradi.\r\n• Ulgurji xarid: Bog'chalar, maktablar, tashkilotlar va do'konlar uchun eng arzon ulgurji (optom) narxlarda sotiladi. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодняя коробка с национальным узором \"С Новым Годом!\" оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"Traditional Gold Ornament Gift Box \"Happy New Year!\" wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 100,
    stock: 30000,
    is_bestseller: false,
    is_premium: false,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 113,
    name: {"uz":"Yangi yil sovg'a qutisi (karton karobka) \"Qorbobo va Archa\"","ru":"Новогодняя коробка для конфет (картон) \"Дед Мороз и новогодняя елка\"","en":"New Year Candy Box (Carton) \"Santa & Tree\""},
    slug: {"uz":"yangi-yil-sovga-qutisi-karton-karobka-qorbobo-va-archa","ru":"yangi-yil-sovga-qutisi-karton-karobka-qorbobo-va-archa","en":"yangi-yil-sovga-qutisi-karton-karobka-qorbobo-va-archa"},
    price: 2500,
    formattedPrice: "2 500 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-13.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-13.png","/products/yangi-yil/yangi-yil-karobkalar-optom-43.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/4086c100-bd1c-48fd-9f45-f3dd427b42dd.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/d9257b19-10b2-49df-bfc5-377a8b5cd578-600.webp"],
    shortDescription: {"uz":"Yangi 2027-yil bayrami uchun klassik va yorqin dizayndagi tutqichli karton sovg'a qutisi. Bolalar shirinliklari, konfetlar hamda korporativ bayram sovg'alarini chiroyli qadoqlash uchun eng xaridorgir va universal tanlov.\r\n\r\nAfzalliklari va xususiyatlari:\r\n• Klassik bayramona dizayn: Qutida sovg'alarga to'la qop va bayram maktubini ushlab turgan mehribon Qorbobo, o'yinchoqlar bilan bezatilgan Yangi yil archasi hamda chiroyli \"С Новым Годом!\" tabrik yozuvi tasvirlangan. Yon tomonlari bayram shamlari rasmi bilan boyitilgan.\r\n• Qulay konstruksiya: Yuqori qismida qo'lda ko'tarib yurish uchun qulay kesilgan tutqichi va yon tomonlarida ishonchli qulflari bor. Yelim va skotchsiz tez hamda oson yig'iladi.\r\n• Material: Yuqori sifatli yaltiroq (glyanseviy) qalin karton — shaklini a'lo darajada ushlaydi va shirinliklar og'irligini bemalol ko'taradi.\r\n• Ulgurji xarid: Bog'chalar, maktablar, do'konlar va tashkilotlar uchun eng arzon ulgurji (optom) narxlarda sotiladi. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодняя коробка для конфет (картон) \"Дед Мороз и новогодняя елка\" оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"New Year Candy Box (Carton) \"Santa & Tree\" wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 100,
    stock: 30000,
    is_bestseller: false,
    is_premium: false,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 114,
    name: {"uz":"Yangi yil sovg'a qutisi (karton karobka) \"Qorbobo chanada\"","ru":"Новогодняя коробка для конфет (картон) \"Дед Мороз на санях\"","en":"New Year Candy Box (Carton) \"Santa on Sleigh\""},
    slug: {"uz":"yangi-yil-sovga-qutisi-karton-karobka-qorbobo-chanada","ru":"yangi-yil-sovga-qutisi-karton-karobka-qorbobo-chanada","en":"yangi-yil-sovga-qutisi-karton-karobka-qorbobo-chanada"},
    price: 2500,
    formattedPrice: "2 500 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-14.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-14.png","/products/yangi-yil/yangi-yil-karobkalar-optom-44.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/f6177eb8-9491-44e6-8810-add2485f9c50.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/107535e7-79d3-42c5-945b-8b44eca35f4c.webp"],
    shortDescription: {"uz":"Yangi 2027-yil bayrami uchun uchta oq ot qo'shilgan chanada sovg'alar bilan yeldek uchib kelayotgan Qorbobo tasvirlangan yorqin karton sovg'a qutisi. Bolalar shirinliklari, konfetlar va bayram sovg'alarini chiroyli qadoqlash uchun eng xaridorgir tanlov.\r\n\r\nAfzalliklari va xususiyatlari:\r\n• O'zbek tilida tabrik va ertaknamo dizayn: Qutida qorli archalar, uch otli chanadagi Qorbobo hamda \"Yangi yilingiz bilan!\" tabrik yozuvi tasvirlangan. Yon tomonlari bayram shamlari rasmi bilan bezatilgan.\r\n• Qulay konstruksiya: Yuqori qismida qo'lda ko'tarib yurish uchun qulay kesilgan tutqichi va yon tomonlarida ishonchli qulflari bor. Yelim va skotchsiz tez hamda oson yig'iladi.\r\n• Material: Yuqori sifatli yaltiroq (glyanseviy) qalin karton — shaklini a'lo darajada ushlaydi va shirinliklar og'irligini bemalol ko'taradi.\r\n• Ulgurji xarid: Bog'chalar, maktablar, do'konlar va tashkilotlar uchun eng arzon ulgurji (optom) narxlarda sotiladi. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодняя коробка для конфет (картон) \"Дед Мороз на санях\" оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"New Year Candy Box (Carton) \"Santa on Sleigh\" wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 100,
    stock: 30000,
    is_bestseller: false,
    is_premium: false,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 115,
    name: {"uz":"Yangi yil sovg'a qutisi (karton karobka) \"Quvnoq sichqonchalar\"","ru":"Новогодняя коробка для конфет (картон) \"Веселые мышата\"","en":"New Year Candy Box (Carton) \"Merry Mice\""},
    slug: {"uz":"yangi-yil-sovga-qutisi-karton-karobka-quvnoq-sichqonchalar","ru":"yangi-yil-sovga-qutisi-karton-karobka-quvnoq-sichqonchalar","en":"yangi-yil-sovga-qutisi-karton-karobka-quvnoq-sichqonchalar"},
    price: 1800,
    formattedPrice: "1 800 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-15.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-15.png","/products/yangi-yil/yangi-yil-karobkalar-optom-45.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/b8994b8c-8f4b-47ae-9e5f-d7b55f9a12fa.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/486a0d00-34cb-48a3-8ae3-26274d4385c2.webp"],
    shortDescription: {"uz":"Yangi 2027-yil bayrami uchun yoqimtoy va quvnoq sichqonchalar hamda rang-barang sovg'alar tasvirlangan yorqin karton sovg'a qutisi. Bog'cha va maktab bolalari uchun shirinliklar, konfetlar va Yangi yil sovg'alarini chiroyli qadoqlashda ajoyib tanlov.\r\n\r\nAfzalliklari va xususiyatlari:\r\n• Yoqimli bolajonlar dizayni: Qutida archa shoxlari, katta qizil shar o'yinchog'i, rang-barang sovg'a qutilari ichidagi yoqimtoy sichqonchalar hamda zarhal \"С Новым Годом!\" tabrik yozuvi aks ettirilgan.\r\n• Qulay konstruksiya: Yuqori qismida naqshinkor hoshiyali va qo'lda ko'tarib yurish uchun qulay kesilgan tutqichi bor. Yelim va skotchsiz tez hamda oson yig'iladi.\r\n• Material: Yuqori sifatli yaltiroq (glyanseviy) qalin karton — shaklini a'lo darajada ushlaydi va shirinliklar og'irligini bemalol ko'taradi.\r\n• Ulgurji xarid: Bog'chalar, maktablar, do'konlar va ulgurji xaridorlar uchun eng arzon optom narxlarda sotiladi. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодняя коробка для конфет (картон) \"Веселые мышата\" оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"New Year Candy Box (Carton) \"Merry Mice\" wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 100,
    stock: 30000,
    is_bestseller: false,
    is_premium: false,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 116,
    name: {"uz":"Yangi yil sovg'a qutisi (karton karobka) \"Qorbobo va Qorqiz\"","ru":"Новогодняя коробка для конфет (картон) \"Дед Мороз и Снегурочка\"","en":"New Year Candy Box (Carton) \"Santa & Snow Maiden\""},
    slug: {"uz":"yangi-yil-sovga-qutisi-karton-karobka-qorbobo-va-qorqiz","ru":"yangi-yil-sovga-qutisi-karton-karobka-qorbobo-va-qorqiz","en":"yangi-yil-sovga-qutisi-karton-karobka-qorbobo-va-qorqiz"},
    price: 5500,
    formattedPrice: "5 500 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-16.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-16.png","/products/yangi-yil/yangi-yil-karobkalar-optom-46.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/b898bbd1-143e-46c5-9fdb-038001ed1933.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/c23b48eb-0e65-42d0-8d7c-0ec770c561ca.webp"],
    shortDescription: {"uz":"Yangi 2027-yil bayrami uchun klassik ertaknamo uslubda bezatilgan yorqin qizil va oltin naqshli karton sovg'a qutisi (sunduchok). Bolalar shirinliklari, konfetlar va korporativ bayram sovg'alarini chiroyli qadoqlash uchun eng xaridorgir va universal tanlov.\r\n\r\nAfzalliklari va xususiyatlari:\r\n• Ikki tomonlama boy dizayn: Qutining bir tomonida qorli o'rmondagi Qorbobo va Qorqiz, ikkinchi tomonida esa Yangi yil archasini bezatayotgan bolajonlar hamda sovg'alar tasvirlangan. Yuqori qismida zarhal naqshlar ichida \"С Новым Годом!\" tabrik yozuvi mavjud.\r\n• Qulay va baland shakl: Baland \"sunduchok\" konstruksiyasi ko'proq shirinlik sig'dirish imkonini beradi. Tepasida mustahkam kesilgan tutqichi bor, yelim va skotchsiz oson yig'iladi.\r\n• Material: Yuqori sifatli yaltiroq (glyanseviy) qalin karton — shaklini a'lo darajada ushlaydi va sovg'a og'irligini bemalol ko'taradi.\r\n• Ulgurji xarid: Bog'chalar, maktablar, do'konlar va tashkilotlar uchun eng arzon ulgurji (optom) narxlarda sotiladi. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодняя коробка для конфет (картон) \"Дед Мороз и Снегурочка\" оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"New Year Candy Box (Carton) \"Santa & Snow Maiden\" wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 100,
    stock: 30000,
    is_bestseller: false,
    is_premium: true,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 117,
    name: {"uz":"Yangi yil qopqoqli sovg'a qutisi (kub-karobka) \"Baxt ostonada\"","ru":"Новогодняя коробка куб с крышкой \"Счастье на пороге\"","en":"New Year Cube Box with Lid \"Joy on the Threshold\""},
    slug: {"uz":"yangi-yil-qopqoqli-sovga-qutisi-kub-karobka-baxt-ostonada","ru":"yangi-yil-qopqoqli-sovga-qutisi-kub-karobka-baxt-ostonada","en":"yangi-yil-qopqoqli-sovga-qutisi-kub-karobka-baxt-ostonada"},
    price: 15000,
    formattedPrice: "15 000 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-17.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-17.png","/products/yangi-yil/yangi-yil-karobkalar-optom-47.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/f185e336-b81c-45c1-87c2-8d7472572e51.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/d9257b19-10b2-49df-bfc5-377a8b5cd578-600.webp"],
    shortDescription: {"uz":"Yangi 2027-yil bayrami va qishki tantanalar uchun alohida qopqoqli, nafis dizayndagi kvadrat (kub) sovg'a qutisi. Korporativ sovg'alar, shirinlik to'plamlari, kosmetika, parfyumeriya, krujka va suvenirlarni zamonaviy hamda chiroyli qadoqlash uchun eng xaridorgir tanlov.\r\n\r\nAfzalliklari va xususiyatlari:\r\n• Zamonaviy va nafis dizayn: Qopqoq qismida sham yoqilgan bayram fonusi, qishki gullar hamda \"Счастье на пороге, все мечты сбудутся!\" (Baxt ostonada, barcha orzular ushaladi!) tilaklari, pastki qismida esa qo'ng'iroqchalar, apelsin bo'laklari va archa shoxlari tasvirlangan.\r\n• Qulay shakl (qopqoq-tub): Klassik kvadrat quti va ustidan yopiladigan alohida qopqoqdan iborat. Har qanday yoshdagi insonlar — ham kattalar, ham bolalar uchun sovg'a berishga mos keladi.\r\n• Material: Yuqori sifatli qalin va mustahkam karton — shaklini a'lo darajada ushlaydi va sovg'ani shikastlanishdan himoya qiladi.\r\n• Ulgurji xarid: Sovg'a do'konlari, korporativ mijozlar, tashkilotlar va ulgurji savdogarlar uchun eng arzon optom narxlarda sotiladi. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодняя коробка куб с крышкой \"Счастье на пороге\" оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"New Year Cube Box with Lid \"Joy on the Threshold\" wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 50,
    stock: 30000,
    is_bestseller: false,
    is_premium: true,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 118,
    name: {"uz":"Yangi yil sovg'a qutisi (qasr-karobka) \"Qorbobo qasri\"","ru":"Новогодняя коробка «Замок» \"Дворец Деда Мороза\"","en":"New Year Castle Box \"Santa Castle\""},
    slug: {"uz":"yangi-yil-sovga-qutisi-qasr-karobka-qorbobo-qasri","ru":"yangi-yil-sovga-qutisi-qasr-karobka-qorbobo-qasri","en":"yangi-yil-sovga-qutisi-qasr-karobka-qorbobo-qasri"},
    price: 2500,
    formattedPrice: "2 500 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-18.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-18.png","/products/yangi-yil/yangi-yil-karobkalar-optom-48.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/ed1a6109-1122-4783-a217-f61542cb4e05.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/d9257b19-10b2-49df-bfc5-377a8b5cd578-600.webp"],
    shortDescription: {"uz":"Yangi 2027-yil bayrami uchun ertaknamo qasr (minora) ko'rinishidagi baland va yorqin karton sovg'a qutisi. Bog'cha va maktab bolalari uchun shirinliklar, konfetlar hamda bayram sovg'alarini chiroyli qadoqlashda juda ko'rkam va xaridorgir tanlov.\r\n\r\nAfzalliklari va xususiyatlari:\r\n• Ertaknamo qasr dizayni: Qutining pastki qismida saroy ustunlari oldida sehrli hassa ushlagan Qorbobo hamda sovg'alar va quyonchaga to'la qop, yuqori tom qismida esa balkondagi quyoncha va \"С Новым Годом!\" tabrik lentasi tasvirlangan.\r\n• Baland va qulay shakl: Uchburchak tomli baland konstruksiya sovg'ani hajmli va salobatli ko'rsatadi. Tepasida qo'lda ko'tarib yurish uchun qulay kesilgan tutqichi bor, yelim va skotchsiz oson yig'iladi.\r\n• Material: Yuqori sifatli yaltiroq (glyanseviy) qalin karton — shaklini a'lo darajada ushlaydi va shirinliklar og'irligini bemalol ko'taradi.\r\n• Ulgurji xarid: Bog'chalar, maktablar, do'konlar va tashkilotlar uchun eng arzon ulgurji (optom) narxlarda sotiladi. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодняя коробка «Замок» \"Дворец Деда Мороза\" оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"New Year Castle Box \"Santa Castle\" wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 100,
    stock: 30000,
    is_bestseller: false,
    is_premium: false,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 119,
    name: {"uz":"Yangi yil sovg'a qutisi (uycha-karobka) \"Vinni Pux va do'stlari\"","ru":"Новогодняя коробка «Избушка» \"Винни Пух и друзья\"","en":"New Year Cottage Gift Box \"Winnie the Pooh & Friends\""},
    slug: {"uz":"yangi-yil-sovga-qutisi-uycha-karobka-vinni-pux-va-dostlari","ru":"yangi-yil-sovga-qutisi-uycha-karobka-vinni-pux-va-dostlari","en":"yangi-yil-sovga-qutisi-uycha-karobka-vinni-pux-va-dostlari"},
    price: 2500,
    formattedPrice: "2 500 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-19.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-19.png","/products/yangi-yil/yangi-yil-karobkalar-optom-49.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/630c2a5c-1bf4-462d-9528-168eae5973a4.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/d9257b19-10b2-49df-bfc5-377a8b5cd578-600.webp"],
    shortDescription: {"uz":"Yangi 2027-yil bayrami uchun bolajonlarning sevimli \"Vinni Pux va uning do'stlari\" multfilmi qahramonlari tasvirlangan ertaknamo qasr (uycha) ko'rinishidagi yorqin karton sovg'a qutisi. Bog'cha va maktab bolalari uchun shirinliklar, konfetlar hamda bayram sovg'alarini chiroyli qadoqlashda eng xaridorgir tanlov.\r\n\r\nAfzalliklari va xususiyatlari:\r\n• Sevimli qahramonlar dizayni: Qorli g'ishtin saroy va archa gulchambari fonida Yangi yil qalpog'ini kiygan Vinni Pux (qo'lida asal ko'zachasi bilan), quvnoq Yo'lbarscha (Tigra), Xo'tikcha Ia, Kenguru Rux hamda bayram sovg'alari tasvirlangan.\r\n• Noodatiy va baland shakl: Gumbaz tomli saroy konstruksiyasi sovg'ani hajmli va chiroyli ko'rsatadi. Tepasida qo'lda ko'tarib yurish uchun qulay tutqichi bor, yelim va skotchsiz oson yig'iladi.\r\n• Material: Yuqori sifatli yaltiroq (glyanseviy) qalin karton — shaklini a'lo darajada ushlaydi va shirinliklar og'irligini bemalol ko'taradi.\r\n• Ulgurji xarid: Bog'chalar, maktablar, do'konlar va tashkilotlar uchun eng arzon ulgurji (optom) narxlarda sotiladi. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодняя коробка «Избушка» \"Винни Пух и друзья\" оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"New Year Cottage Gift Box \"Winnie the Pooh & Friends\" wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 100,
    stock: 30000,
    is_bestseller: false,
    is_premium: false,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 120,
    name: {"uz":"Yangi yil sovg'a qutisi (tutqichli karobka) \"Masha va Ayiq va Uycha\"","ru":"Новогодняя коробка с ручкой \"Маша и медведь с домиком\"","en":"New Year Handle Candy Box \"Masha & The Bear va Uycha\""},
    slug: {"uz":"yangi-yil-sovga-qutisi-tutqichli-karobka-masha-va-ayiq-va-uycha","ru":"yangi-yil-sovga-qutisi-tutqichli-karobka-masha-va-ayiq-va-uycha","en":"yangi-yil-sovga-qutisi-tutqichli-karobka-masha-va-ayiq-va-uycha"},
    price: 2500,
    formattedPrice: "2 500 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-20.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-20.png","/products/yangi-yil/yangi-yil-karobkalar-optom-5.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/b1aeb5c9-fd81-447d-981e-7a8ceb901e04.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/1510979c-0a38-4d8c-b1ac-0fc5459a3c1e.webp"],
    shortDescription: {"uz":"Yangi 2027-yil bayrami uchun o'ymakor yog'och tutqichli va ikki tildagi tabriklar bilan bezatilgan yorqin karton sovg'a qutisi (sunduchok). Bolalar shirinliklari, konfetlar va Yangi yil sovg'alarini chiroyli qadoqlash uchun eng xaridorgir tanlov.\r\n\r\nAfzalliklari va xususiyatlari:\r\n• Ikki tomonlama qiziqarli dizayn: Bir tomonida o'zbek tilida \"Yangi yilingiz bilan!\", bayram bayroqchalari, quvnoq bolakay va sovg'a ochayotgan kuchukcha; ikkinchi tomonida esa rus tilida \"С НОВЫМ ГОДОМ!\", qorli tom ostidagi uycha va sevimli multfilm qahramonlari — Masha va Ayiq tasvirlangan.\r\n• O'ymakor tutqich: Qutining yuqori qismidagi tutqich sharqona yog'och o'ymakorligi uslubida naqshinkor bezatilgan bo'lib, qo'lda ko'tarib yurish uchun juda qulay va mustahkam. Yelim va skotchsiz oson yig'iladi.\r\n• Material: Yuqori sifatli yaltiroq (glyanseviy) qalin karton — shaklini a'lo darajada ushlaydi va shirinliklar og'irligini bemalol ko'taradi.\r\n• Ulgurji xarid: Bog'chalar, maktablar, do'konlar va tashkilotlar uchun eng arzon ulgurji (optom) narxlarda sotiladi. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодняя коробка с ручкой \"Маша и медведь с домиком\" оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"New Year Handle Candy Box \"Masha & The Bear va Uycha\" wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 100,
    stock: 30000,
    is_bestseller: false,
    is_premium: false,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 121,
    name: {"uz":"Yangi yil sovg'a qutisi (tutqichli karobka) \"Yangi yil archasi\"","ru":"Новогодняя коробка с ручкой \"Новогодняя елочка\"","en":"New Year Handle Candy Box \"Holiday Tree\""},
    slug: {"uz":"yangi-yil-sovga-qutisi-tutqichli-karobka-yangi-yil-archasi","ru":"yangi-yil-sovga-qutisi-tutqichli-karobka-yangi-yil-archasi","en":"yangi-yil-sovga-qutisi-tutqichli-karobka-yangi-yil-archasi"},
    price: 1800,
    formattedPrice: "1 800 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-21.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-21.png","/products/yangi-yil/yangi-yil-karobkalar-optom-50.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/987c29f9-b610-4cf4-9511-0940f3b7b794.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/d9257b19-10b2-49df-bfc5-377a8b5cd578-600.webp"],
    shortDescription: {"uz":"Yangi 2027-yil bayrami uchun yorqin qizil rangdagi, sumkacha shaklida ishlangan tutqichli karton sovg'a qutisi. Bog'cha va maktab bolalari, shuningdek korporativ mijozlar uchun shirinliklar, konfetlar va bayram sovg'alarini chiroyli qadoqlashda juda qulay hamda xaridorgir tanlov.\r\n\r\nAfzalliklari va xususiyatlari:\r\n- Bayramona klassik dizayn: Qizil fonda bayram mushaklari, archa shoxlari va tilla qo'ng'iroqchalar, pastki qismida sovg'alarga to'la go'zal Yangi yil archasi hamda markazda yirik «С Новым годом!» tabrik yozuvi tasvirlangan.\r\n- Qulay sumkacha shakli: Yuqori qismida qo'lda ko'tarib yurish uchun oval tutqichi va ishonchli yopiladigan yarim oy shaklidagi qopqoq-klapani mavjud. Yelim va skotchsiz tez yig'iladi.\r\n- Material: Yuqori sifatli yaltiroq (glyanseviy) qalin karton — shaklini yaxshi ushlaydi va shirinliklar og'irligini bemalol ko'taradi.\r\n- Ulgurji xarid: Bog'chalar, maktablar, do'konlar va tashkilotlar uchun eng arzon ulgurji (optom) narxlarda sotiladi. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодняя коробка с ручкой \"Новогодняя елочка\" оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"New Year Handle Candy Box \"Holiday Tree\" wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 100,
    stock: 30000,
    is_bestseller: false,
    is_premium: false,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 122,
    name: {"uz":"Yangi yil sovg'a qutisi (tutqichli karobka) \"Bolalar va Qorbola\"","ru":"Новогодняя коробка с ручкой \"Дети и снеговик\"","en":"New Year Handle Candy Box \"Kids & Snowman\""},
    slug: {"uz":"yangi-yil-sovga-qutisi-tutqichli-karobka-bolalar-va-qorbola","ru":"yangi-yil-sovga-qutisi-tutqichli-karobka-bolalar-va-qorbola","en":"yangi-yil-sovga-qutisi-tutqichli-karobka-bolalar-va-qorbola"},
    price: 1800,
    formattedPrice: "1 800 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-22.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-22.png","/products/yangi-yil/yangi-yil-karobkalar-optom-51.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/af477b54-b973-4268-a4fc-29410f3ad7f9.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/d9257b19-10b2-49df-bfc5-377a8b5cd578-600.webp"],
    shortDescription: {"uz":"Yangi 2027-yil bayrami uchun qishki ertak uslubida ishlangan, tutqichli uycha-sandiqcha shaklidagi yorqin karton sovg'a qutisi. Bog'cha va maktab bolalari uchun shirinliklar, konfetlar hamda bayram sovg'alarini chiroyli qadoqlashda juda ko'rkam va xaridorgir tanlov.\r\n\r\nAfzalliklari va xususiyatlari:\r\n- Samimiy qishki dizayn: Qutining old qismida qor bilan qoplangan shinam uycha va ko'cha chiroqlari fonida quвноq bolajonlar Qorbola yasayotgani, yuqori tutqich qismida esa qizil fonda oltin rangli Yangi yil bezaklari tasvirlangan.\r\n- Qulay uycha-sandiqcha shakli: Tepasida qo'lda ko'tarib yurish uchun qulay kesilgan tutqichi mavjud, yelim va skotchsiz oson hamda tez yig'iladi.\r\n- Material: Yuqori sifatli yaltiroq (glyanseviy) qalin karton — shaklini a'lo darajada ushlaydi va shirinliklar og'irligini bemalol ko'taradi.\r\n- Ulgurji xarid: Bog'chalar, maktablar, do'konlar va tashkilotlar uchun eng arzon ulgurji (optom) narxlarda sotiladi. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодняя коробка с ручкой \"Дети и снеговик\" оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"New Year Handle Candy Box \"Kids & Snowman\" wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 100,
    stock: 30000,
    is_bestseller: false,
    is_premium: false,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 123,
    name: {"uz":"Yangi yil sovg'a qutisi (tutqichli karobka) \"Quvnoq pingvincha\"","ru":"Новогодняя коробка с ручкой \"Веселый пингвин\"","en":"New Year Handle Candy Box \"Cheerful Penguin\""},
    slug: {"uz":"yangi-yil-sovga-qutisi-tutqichli-karobka-quvnoq-pingvincha","ru":"yangi-yil-sovga-qutisi-tutqichli-karobka-quvnoq-pingvincha","en":"yangi-yil-sovga-qutisi-tutqichli-karobka-quvnoq-pingvincha"},
    price: 3500,
    formattedPrice: "3 500 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-23.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-23.png","/products/yangi-yil/yangi-yil-karobkalar-optom-52.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/28d5d16e-989f-4d4d-a466-fd9126dff005.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/d9257b19-10b2-49df-bfc5-377a8b5cd578-600.webp"],
    shortDescription: {"uz":"Yangi 2027-yil bayrami uchun yorqin malina-qizil rangda ishlangan, yoqimtoy pingvincha tasvirli tutqichli karton sovg'a qutisi. Bog'cha va maktab bolalari uchun shirinliklar, konfetlar hamda bayram sovg'alarini chiroyli qadoqlashda juda quvnoq va xaridorgir tanlov.\r\n\r\nAfzalliklari va xususiyatlari:\r\n- Yoqimtoy bolalarbop dizayn: Qor parchalari bilan bezatilgan yorqin fonda issiq qalpoq va sharf kiyib, rangli bayram konfetlarini (ledenes) ushlab turgan shirin pingvincha, yirik «С Новым Годом!» tabrik yozuvi hamda tepa qismida Qorbola va kichik pingvin tasvirlangan.\r\n- Qulay uycha-sandiqcha shakli: Tepasida qo'lda ko'tarib yurish uchun qulay kesilgan tutqichi mavjud, yelim va skotchsiz oson hamda tez yig'iladi.\r\n- Material: Yuqori sifatli yaltiroq (glyanseviy) qalin karton — shaklini a'lo darajada ushlaydi va shirinliklar og'irligini bemalol ko'taradi.\r\n- Ulgurji xarid: Bog'chalar, maktablar, do'konlar va tashkilotlar uchun eng arzon ulgurji (optom) narxlarda sotiladi. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодняя коробка с ручкой \"Веселый пингвин\" оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"New Year Handle Candy Box \"Cheerful Penguin\" wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 100,
    stock: 30000,
    is_bestseller: false,
    is_premium: false,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 124,
    name: {"uz":"Yangi yil sovg'a qutisi (tutqichli karobka) \"Qorbobo va o'rmon hayvonlari\"","ru":"Новогодняя коробка с ручкой \"Дед Мороз и лесные звери\"","en":"New Year Handle Candy Box \"Santa & Woodland Animals\""},
    slug: {"uz":"yangi-yil-sovga-qutisi-tutqichli-karobka-qorbobo-va-ormon-hayvonlari","ru":"yangi-yil-sovga-qutisi-tutqichli-karobka-qorbobo-va-ormon-hayvonlari","en":"yangi-yil-sovga-qutisi-tutqichli-karobka-qorbobo-va-ormon-hayvonlari"},
    price: 1800,
    formattedPrice: "1 800 UZS",
    category: "yangi-yil-2027",
    image: "/products/yangi-yil/yangi-yil-karobkalar-optom-24.png",
    images: ["/products/yangi-yil/yangi-yil-karobkalar-optom-24.png","/products/yangi-yil/yangi-yil-karobkalar-optom-53.png","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/27a7e520-36c5-487d-958a-23dc6e6cdf7f.webp","https://pub-b8343d3293a0400ab1ff285dacadb658.r2.dev/products/d9257b19-10b2-49df-bfc5-377a8b5cd578-600.webp"],
    shortDescription: {"uz":"Yangi 2027-yil bayrami uchun klassik ertak uslubida ishlangan, tutqichli sumkacha shaklidagi yorqin karton sovg'a qutisi. Bog'cha va maktab bolalari uchun shirinliklar, konfetlar hamda bayram sovg'alarini chiroyli qadoqlashda juda ko'rkam va xaridorgir tanlov.\r\n\r\nAfzalliklari va xususiyatlari:\r\n- Ertaknamo qishki dizayn: Qor parchalari bilan bezatilgan ko'k fonda sovg'alarga to'la qop va archa bilan kelayotgan mehribon Qorbobo hamda uning sodiq do'stlari — quyoncha, olmaxon, kuchukcha va ayiqcha tasvirlangan.\r\n- Noodatiy va qulay shakl: Yon tomonlari nafis egilgan hajmli konstruksiya hamda tilla naqshli tepa qismidagi kesilgan tutqich qutiga o'zgacha chiroy beradi. Yelim va skotchsiz oson yig'iladi.\r\n- Material: Yuqori sifatli yaltiroq (glyanseviy) qalin karton — shaklini a'lo darajada ushlaydi va shirinliklar og'irligini bemalol ko'taradi.\r\n- Ulgurji xarid: Bog'chalar, maktablar, do'konlar va tashkilotlar uchun eng arzon ulgurji (optom) narxlarda sotiladi. Toshkent O'rikzor omboridan 100 donadan boshlab ulgurji narxda yetkazib beriladi. 500+ donadan -5%, 1000+ donadan -10% VIP chegirma mavjud.","ru":"Новогодняя коробка с ручкой \"Дед Мороз и лесные звери\" оптом со склада Урикзор в Ташкенте. Прочный картон, яркая праздничная полиграфия. Скидки от 500 шт (-5%), от 1000 шт (-10% VIP). Доставка за 2 часа по Ташкенту.","en":"New Year Handle Candy Box \"Santa & Woodland Animals\" wholesale from Tashkent Urikzor warehouse. Sturdy cardboard, premium holiday printing. Bulk discounts up to 10%, fast delivery."},
    itemsPerPackage: 100,
    stock: 30000,
    is_bestseller: false,
    is_premium: false,
    specs: [{"label":{"uz":"Material","ru":"Материал","en":"Material"},"value":{"uz":"Qalin xrom-karton (300 g/m²)","ru":"Плотный хром-эрзац картон (300 г/м²)","en":"Rigid chromo board (300 gsm)"}},{"label":{"uz":"Sig'imi","ru":"Вместимость","en":"Capacity"},"value":{"uz":"1 – 1.5 kg shirinlik va sovg'alar","ru":"1 – 1.5 кг сладостей и подарков","en":"1 - 1.5 kg candies and gifts"}},{"label":{"uz":"Min. buyurtma","ru":"Мин. заказ","en":"Min. Order"},"value":{"uz":"100 dona (1 pachka)","ru":"100 шт (1 пачка)","en":"100 pcs (1 pack)"}},{"label":{"uz":"Ulgurji chegirma","ru":"Оптовая скидка","en":"Wholesale Discount"},"value":{"uz":"500+ (-5%), 1000+ (-10% VIP)","ru":"500+ (-5%), 1000+ (-10% VIP)","en":"500+ (-5%), 1000+ (-10% VIP)"}},{"label":{"uz":"Yetkazib berish","ru":"Доставка","en":"Delivery"},"value":{"uz":"Toshkentda 2 soatda, viloyatga 1 kunda","ru":"По Ташкенту за 2 часа, в области за 1 день","en":"Tashkent in 2 hrs, regions in 1 day"}}],
  },
  {
    id: 4,
    name: "Magnitli Premium Oq Quti",
    price: 14500,
    formattedPrice: "14 500 UZS",
    category: "toy-qutilari",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop",
    shortDescription: "To'y va sarpo uchun atlas lentali, magnit qulfli premium sovg'a qutisi.",
    itemsPerPackage: 50,
    stock: 8000,
    is_premium: true,
    is_bestseller: true,
    specs: [
      { label: "O'lchami", value: "25x20x10 sm" },
      { label: "Xususiyati", value: "Magnitli qulf, atlas lenta" },
      { label: "Min. buyurtma", value: "50 dona" }
    ]
  },
  {
    id: 5,
    name: "Kuyov-Kelin Sarpo Qutilari 3 talik To'plami",
    price: 32000,
    formattedPrice: "32 000 UZS",
    category: "toy-qutilari",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop",
    shortDescription: "Sarpo marosimlari uchun 3 xil o'lchamdagi (S, M, L) qattiq karton qutilar komplekti.",
    itemsPerPackage: 30,
    stock: 5000,
    specs: [
      { label: "Tarkibi", value: "3 ta quti (S, M, L)" },
      { label: "Material", value: "Qalin naqshli karton" },
      { label: "Min. buyurtma", value: "30 to'plam" }
    ]
  },
  {
    id: 6,
    name: "Shaffof oynali Eko-Kraft quti",
    price: 4500,
    formattedPrice: "4 500 UZS",
    category: "sovga-qutilari",
    image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1000&auto=format&fit=crop",
    shortDescription: "Tepasi shaffof oynali, pishiriqlar, shirinlik va suvenirlar uchun qulay kraft quti.",
    itemsPerPackage: 100,
    stock: 25000,
    specs: [
      { label: "O'lchami", value: "20x20x8 sm" },
      { label: "Darchasi", value: "Shaffof BOPP oyna" },
      { label: "Min. buyurtma", value: "100 dona" }
    ]
  },
  {
    id: 7,
    name: "Burama tutqichli Qo'ng'ir Kraft paket",
    price: 1800,
    formattedPrice: "1 800 UZS",
    category: "kraft-zip-paketlar",
    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=1000&auto=format&fit=crop",
    shortDescription: "Kiyim-kechak, kosmetika va sovg'a do'konlari uchun baquvvat burama tutqichli kraft paket.",
    itemsPerPackage: 100,
    stock: 100000,
    is_bestseller: true,
    specs: [
      { label: "O'lchami", value: "25x32x11 sm" },
      { label: "Yuk ko'tarishi", value: "3-5 kg gacha" },
      { label: "Min. buyurtma", value: "100 dona (1 pachka)" }
    ]
  },
  {
    id: 8,
    name: "Matoviy Zip-Lock paket klapanli",
    price: 950,
    formattedPrice: "950 UZS",
    category: "kraft-zip-paketlar",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop",
    shortDescription: "Kiyim-kechak brendlari va marketpleyslar uchun havo klapanli premium matoviy paket.",
    itemsPerPackage: 100,
    stock: 150000,
    is_bestseller: true,
    specs: [
      { label: "O'lchami", value: "30x40 sm" },
      { label: "Turi", value: "Matoviy Zip-Lock klapanli" },
      { label: "Min. buyurtma", value: "100 dona (1 pachka)" }
    ]
  },
  {
    id: 9,
    name: "Yelimli kuryer paketi (Uzum/WB)",
    price: 650,
    formattedPrice: "650 UZS",
    category: "kraft-zip-paketlar",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop",
    shortDescription: "O'chmas yelimli, qora ichki qatlamli, xavfsiz jo'natish kuryer paketi.",
    itemsPerPackage: 100,
    stock: 200000,
    specs: [
      { label: "O'lchami", value: "30x40 sm" },
      { label: "Xususiyati", value: "Qora himoya qatlami, ochilmas yelim" },
      { label: "Min. buyurtma", value: "100 dona (1 pachka)" }
    ]
  },
  {
    id: 10,
    name: "Yelimli klapanli BOPP paket",
    price: 180,
    formattedPrice: "180 UZS",
    category: "bopp-paketlar",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop",
    shortDescription: "Trikotaj, shirinlik va non mahsulotlari uchun yaltiroq, toza BOPP paket.",
    itemsPerPackage: 500,
    stock: 500000,
    specs: [
      { label: "O'lchami", value: "20x30 sm" },
      { label: "Qalinligi", value: "25 mkm" },
      { label: "Min. buyurtma", value: "500 dona (1 pachka)" }
    ]
  },
  {
    id: 11,
    name: "Double Wall kofe stakani (250 ml + qopqoq)",
    price: 750,
    formattedPrice: "750 UZS",
    category: "horeca-xojalik",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop",
    shortDescription: "Issiqlikni ushlab turuvchi ikki qavatli kraft stakan kofexona va restoranlar uchun.",
    itemsPerPackage: 500,
    stock: 100000,
    specs: [
      { label: "Hajmi", value: "250 ml" },
      { label: "To'plam", value: "Stakan + Qora qopqoq" },
      { label: "Min. buyurtma", value: "500 dona" }
    ]
  },
  {
    id: 12,
    name: "Fast-Food kraft burger qutisi",
    price: 850,
    formattedPrice: "850 UZS",
    category: "horeca-xojalik",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop",
    shortDescription: "Yog' o'tkazmaydigan eko-kraft karton quti burger va tezpishar taomlar uchun.",
    itemsPerPackage: 500,
    stock: 80000,
    specs: [
      { label: "Material", value: "Yog' o'tkazmaydigan kraft karton" },
      { label: "Min. buyurtma", value: "500 dona" }
    ]
  }
];

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    "id": 26,
    "slug": {
      "uz": "yangi-yil-2027-sovga-qutilari-optom-ulgurji-narxlar",
      "ru": "novogodnie-korobki-2027-podarki-optom-urikzor",
      "en": "new-year-2027-gift-boxes-wholesale-urikzor"
    },
    "title": {
      "uz": "Yangi yil 2027 sovg'a qutilari optom (ulgurji): Qandolatchilar, do'konlar va korporativ mijozlar uchun O'rikzor narxlari",
      "ru": "Новогодние коробки для подарков 2027 оптом: Цены рынка Урикзор для кондитеров, магазинов и корпоративных клиентов",
      "en": "New Year 2027 Gift Boxes Wholesale: Urikzor Prices for Confectioners, Stores, and Corporate Clients"
    },
    "image": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1200&auto=format&fit=crop",
    "date": "2026-11-02",
    "content": {
      "uz": "Yangi Yil 2027 mavsumi yaqinlashishi bilan shirinlik ishlab chiqaruvchilar, qandolatchilik sexlari, maktab-bog'chalar ta'minotchilari va yirik korporativ kompaniyalar oldida bitta asosiy vazifa turadi: sifatli, mustahkam va bayramona sovg'a qutilarini eng arzon ulgurji narxda xarid qilish.\n\nToshkentdagi [LUXECORE (luxe-core.uz)](https://luxe-core.uz/uz) B2B ulgurji platformasi O'rikzor ulgurji omboridan to'g'ridan-to'g'ri birinchi qo'l narxlarida yetkazib berishni yo'lga qo'ydi. Biz vositachilarsiz ishlaymiz, shu sababli siz bozor narxidan 15–25% arzonroqqa ega bo'lasiz.\n\n### 1. 3 Pog'onali Avtomatik Ulgurji Chegirma Tizimi\n\nBiznes mijozlarimiz harajatlarini maksimal darajada optimallashtirish uchun LUXECORE platformasida 3 pog'onali shaffof chegirma tizimi amal qiladi:\n- **100 – 499 dona:** Bazaviy birinchi qo'l ulgurji narxi (barcha qandolatchilar va kichik do'konlar uchun minimal qulay kirish).\n- **500 – 999 dona:** Avtomatik **-5% chegirma** (o'rtacha korxona va tadbirlar uchun qo'shimcha tejamkorlik).\n- **1 000+ dona:** Avtomatik **-10% VIP ulgurji chegirma** (yirik qandolat fabrikalari, tarmoq supermarketlar va korporativ gigantlar uchun eng arzon narx kafolati).\n\nBuyurtma hajmi oshishi bilan chegirma savatda real vaqt rejimida hisoblanadi va tejab qolingan summa darhol ko'rsatiladi.\n\n### 2. Qulay Pachkalab Xarid (1x, 2x, 5x, 10x)\n\nOmborimizdagi barcha Yangi Yil qutilari zavod qadog'ida (masalan, 50 yoki 100 donalik pachkalarda) saralangan. Saytimizda siz mahsulotlarni donalab sanab o'tirmaysiz — qulay tezkor tugmalar orqali xarid qilasiz:\n- **1x pachka** — boshlang'ich sinov partiyasi (50 yoki 100 dona);\n- **2x pachka** — ixcham savdo nuqtalari uchun (100–200 dona);\n- **5x pachka** — qizg'in bayram savdosi uchun (250–500 dona);\n- **10x pachka** — yirik ulgurji partiya (500–1000 dona).\n\n### 3. 📥 Excel Prays-Listni 1-Bosishda Yuklab Olish\n\nKatta korxonalar, ta'minot bo'limlari (snabjenetslar) va buxgalterlar uchun platformamizning [Ulgurji Katalog](/uz/catalog) sahifasida maxsus **\"📥 Prays-list (Excel)\"** tugmasi joriy etilgan. 1 bosish orqali barcha qutilar o'lchami, fotosurati, minimal pachka soni va 100+, 500+, 1000+ narxlari Excel (.csv) jadval ko'rinishida yuklanadi.\n\n### 4. 🖨 Rasmiy Yuk Xati (Накладная) — 100% Qonuniy va Shaffof\n\nBarcha yuridik shaxslar, MChJ va YaTT lar uchun omborimizdan chiqadigan har bir buyurtmaga to'liq rasmiy **YUK XATI (НАКЛАДНАЯ) — LUXECORE (luxe-core.uz)** ilova qilinadi. Unda tovar nomi, partiya raqami, aniq dona soni, muhr va mas'ul shaxs imzosi joylari mavjud. Buxgalteriya hisoboti uchun 100% tayyor hujjat.\n\n### 5. 🚚 2 Mln So'mdan Bepul Yetkazib Berish\n\n- **Toshkent shahri bo'ylab:** 2 000 000 so'mdan yuqori har qanday buyurtma sizning do'koningiz, sexingiz yoki omboringiz eshigigacha **mutlaqo bepul va 2 soat ichida tezkor** yetkaziladi!\n- **Viloyatlar (Samarqand, Buxoro, Andijon, Farg'ona, Namangan, Xorazm va barcha hududlar):** Buyurtmalar 24 soat ichida ishonchli yuk mashinalari yoki BTS/furgon orqali yetkaziladi.\n- Doimiy buyurtmalarni esa [Buyurtmani Kuzatish va Takrorlash](/uz/tracking) sahifasida bir bosishda qayta faollashtirishingiz mumkin.\n\n### 6. Do'koningiz Uchun Eng Ommabop Modellarni Hozirdan Tanlang:\n\nMavsumda narxlar ko'tarilmasdan oldin buyurtma bering:\n- [Yangi Yil 2027 Qutilari Bo'limi](/uz/category/yangi-yil-2027) — bolalar uchun \"Qor Bobo\" va \"Archa\" shaklidagi shirinlik qutilari;\n- [Bayram va Sovg'a Qutilari Bo'limi](/uz/category/sovga-qutilari) — qattiq pereplyot kartondan VIP sovg'a qutilari;\n- Bayram dasturxonlari va kafe servisida kerak bo'ladigan [Issiq taomlar uchun qopqoqli konteynerlar](/uz/category/horeca-xojalik) hamda qopqoqli [Ikki qavatli (Double Wall) kofe stakani (250 ml)](/uz/product/26) ni ham to'g'ridan-to'g'ri ombordan qo'shib olishingiz mumkin.\n\nHoziroq [LUXECORE Ulgurji Katalogiga](/uz/catalog) o'ting, Excel prays-listni yuklab oling va Yangi Yil 2027 partiyasini maksimal foyda bilan band qiling!",
      "ru": "С приближением новогоднего сезона 2027 кондитерские фабрики, частные цеха, поставщики школ и детских садов, а также корпоративные компании сталкиваются с главной задачей: купить качественные, прочные и презентабельные новогодние коробки для подарков по минимальной оптовой цене.\n\nB2B оптовая платформа [LUXECORE (luxe-core.uz)](https://luxe-core.uz/uz) обеспечивает прямые поставки со склада рынка Урикзор в Ташкенте по ценам первого поставщика без посредников и лишних переплат.\n\n### 1. 3-Уровневая Автоматическая Система Оптовых Скидок\n\nЧтобы бизнес-клиенты получали максимальную маржу, на платформе LUXECORE действует прогрессивная шкала оптовых цен:\n- **100 – 499 шт:** Базовая оптовая цена со склада (доступный минимальный порог для розничных магазинов и кондитерских).\n- **500 – 999 шт:** Автоматическая скидка **-5%** (выгодные условия для средних партий и подарков сотрудникам).\n- **1 000+ шт:** Автоматическая **VIP-скидка -10%** (максимальная экономия для крупных оптовиков, сетей и фабрик).\n\nСкидка рассчитывается моментально в корзине при достижении нужного количества, а сумма экономии отображается прозрачно.\n\n### 2. Удобный Заказ Пачками (1x, 2x, 5x, 10x)\n\nВся продукция расфасована в заводские упаковки (по 50 или 100 шт). Вам не нужно вводить количество вручную — используйте удобные кнопки быстрой фасовки:\n- **1x пачка** — пробная партия (50 или 100 шт);\n- **2x пачки** — для небольших точек продаж (100–200 шт);\n- **5x пачек** — оптимальный объем для праздничного спроса (250–500 шт);\n- **10x пачек** — крупный опт (500–1000 шт и более).\n\n### 3. 📥 Скачивание Excel Прайс-Листа в 1 Клик\n\nДля менеджеров по закупкам и бухгалтеров в шапке раздела [Оптовый Каталог](/ru/catalog) доступна кнопка **\"📥 Прайс-лист (Excel)\"**. В один клик скачивается готовая таблица со всеми размерами, вместимостью, фото и 3 уровнями оптовых цен (100+, 500+, 1000+).\n\n### 4. 🖨 Официальная Накладная со Штампом\n\nДля юридических лиц и индивидуальных предпринимателей на каждый заказ со склада распечатывается официальная **НАКЛАДНАЯ — LUXECORE (luxe-core.uz)** формата А4 со штампом, реквизитами и местом подписи. Полная бухгалтерская прозрачность гарантирована.\n\n### 5. 🚚 Бесплатная Доставка от 2 Млн Сум\n\n- **По Ташкенту:** Заказы на сумму от 2 000 000 сум доставляются до вашего склада или магазина **абсолютно бесплатно и за 2 часа**!\n- **По регионам Узбекистана:** Отправка в Самарканд, Бухару, Фергану, Андижан, Наманган и другие области в течение 24 часов.\n- Повторить прошлый успешный заказ можно в 1 клик на странице [Отслеживание и Повтор Заказа](/ru/tracking).\n\n### 6. Заказывайте Популярные Позиции:\n\n- [Раздел Новогодняя Упаковка 2027](/ru/category/yangi-yil-2027) — детские коробки «Дед Мороз» и «Елочка» из плотного хром-эрзац картона;\n- [Раздел Подарочные Коробки](/ru/category/sovga-qutilari) — элитные твердые переплетные коробки с лентами;\n- Для кейтеринга и новогодних банкетов: [Контейнеры для горячих блюд (750 мл)](/ru/product/28) и [Двухслойный крафт-стакан Double Wall (250 мл)](/ru/product/26).\n\nПереходите в [Каталог LUXECORE](/ru/catalog), скачивайте оптовый прайс-лист и бронируйте новогодние коробки 2027 по самым выгодным ценам!",
      "en": "Order New Year 2027 gift and candy boxes wholesale from Urikzor warehouse in Tashkent. Benefit from 3-tier wholesale pricing (up to -10% VIP discount on 1000+ pcs), package selection (1x, 2x, 5x, 10x), 1-click Excel price list download, official invoices, and free delivery in Tashkent for orders over 2,000,000 UZS. Explore our [Wholesale Catalog](/en/catalog) today!"
    },
    "seo": {
      "title": {
        "uz": "Yangi yil 2027 sovg'a qutilari optom — O'rikzor ulgurji narxlarida | LUXECORE",
        "ru": "Новогодние коробки 2027 оптом в Ташкенте — Цены Урикзор | LUXECORE",
        "en": "New Year 2027 Gift Boxes Wholesale in Tashkent — Urikzor Prices | LUXECORE"
      },
      "description": {
        "uz": "Yangi yil 2027 bolalar shirinlik va korporativ sovg'a qutilari optom O'rikzor narxida. 3 pog'onali chegirma (1000+ -10%), pachkalab xarid (1x/2x/5x/10x), Excel prays-list, rasmiy Yuk xati (Накладная), 2 mln so'mdan bepul yetkazish.",
        "ru": "Новогодние коробки 2027 для конфет и подарков оптом со склада Урикзор. Скидки до -10%, покупка пачками, прайс-лист в Excel, официальная накладная и бесплатная доставка от 2 млн сум по Ташкенту.",
        "en": "Wholesale New Year 2027 candy boxes and corporate gift packaging from Tashkent Urikzor warehouse. Tiered discounts up to -10%, official invoices, free delivery over 2M UZS."
      },
      "keywords": {
        "uz": "yangi yil 2027 sovg'a qutilari optom, bolalar shirinlik qutilari ulgurji, yangi yil qadoqlari orikzor, novogodnie korobki optom toshkent, b2b sovg'a qutilari, optom narxlar quti 2027",
        "ru": "новогодние коробки 2027 оптом, детские новогодние коробки урикзор, упаковка для подарков оптом ташкент, купить новогодние коробки оптом, накладная оптом коробки",
        "en": "new year 2027 gift boxes wholesale, candy gift boxes wholesale tashkent, holiday packaging urikzor"
      }
    }
  },
  {
    "id": 27,
    "slug": {
      "uz": "kraft-zip-lock-va-bopp-paketlar-optom-toshkent",
      "ru": "kraft-zip-lock-bopp-pakety-optom-tashkent",
      "en": "kraft-zip-lock-bopp-bags-wholesale-tashkent"
    },
    "title": {
      "uz": "Kraft, Zip-Lock va BOPP paketlar optom Toshkentda: Do'konlar va Uzum Market sotuvchilari qadoqlashdan qanday 10% gacha tejaydi?",
      "ru": "Крафт, Zip-Lock и БОПП пакеты оптом в Ташкенте: Как магазины и продавцы Uzum Market экономят до 10% на упаковке?",
      "en": "Kraft, Zip-Lock, and BOPP Bags Wholesale in Tashkent: How Stores and Uzum Market Sellers Save up to 10% on Packaging"
    },
    "image": "https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=1200&auto=format&fit=crop",
    "date": "2026-11-02",
    "content": {
      "uz": "Elektron tijorat rivojlanishi bilan Uzum Market, Wildberries va Instagram-do'konlar uchun qadoqlash sifati sotuv hajmi va mijozlar reytingini belgilovchi eng muhim omilga aylandi. Yirtilgan paket, yomon yopishgan klapan yoki tovar ko'rinmaydigan qadoq mijozlarning salbiy fikrlariga va tovar qaytarilishiga (vozvrat) sabab bo'ladi.\n\nToshkentdagi [LUXECORE (luxe-core.uz)](https://luxe-core.uz/uz) B2B ulgurji ombori kiyim-kechak, kosmetika, aksessuarlar va savdo nuqtalari uchun sertifikatlangan Kraft, Zip-Lock va BOPP paketlarini to'g'ridan-to'g'ri O'rikzor narxlarida taqdim etadi.\n\n### 1. Marketpleyslar Uchun Eng Xaridorgir Qadoq Turlari\n\n- **Matoviy Zip-Lock Paketlar (Havo klapanli):** Qalinligi 70–80 mkr bo'lib, kiyimlar, futbolkalar, ichki kiyimlar va to'qimachilik uchun ideal. Havo klapani qadoqni ixchamlashtiradi, logistika xarajatlarini tejaydi.\n- **Yelimli Klapanli BOPP Shaffof Paketlar:** O'ta tiniq, yaltiroq va mustahkam yelimli plyonka. Paypoqlar, bijuteriya, pishiriqlar va kitoblar uchun eng mashhur tanlov (1 pachkada 500 dona).\n- **Tutqichli Eko-Kraft Paketlar:** Qalin xom-ashyodan tayyorlangan, burama yoki yassi tutqichli kraft paketlar butiklar va yetkazib berish xizmatlarining nufuzini bir necha barobar oshiradi.\n\n### 2. 10% Gacha Qanday Tejab Qolish Mumkin? (3 Pog'onali Chegirma)\n\nHar oy minglab paket ishlatadigan sellerlar uchun LUXECORE avtomatik chegirma tizimini taklif etadi:\n- **100 – 499 dona:** Kichik partiyalar uchun qulay bazaviy ulgurji narx;\n- **500 – 999 dona:** Avtomatik **-5% chegirma**;\n- **1 000+ dona:** Avtomatik **-10% VIP chegirma**.\n\nAgar siz oyiga 3 000 dona Zip-Lock va BOPP paket ishlatsangiz, har oylik qadoqlash byudjetingizdan 10% to'g'ridan-to'g'ri sof foyda sifatida cho'ntagingizda qoladi.\n\n### 3. Pachkalab Tezkor Xarid (1x, 2x, 5x, 10x)\n\nBozorga borib vaqt sarflash shart emas. Saytimizda har bir mahsulot sahifasida aniq pachka soni ko'rsatilgan:\n- **1x pachka** (50 yoki 100 dona) — haftalik zaxira;\n- **2x pachka** (100–200 dona);\n- **5x pachka** (250–500 dona);\n- **10x pachka** (500–1000 dona va undan ortiq).\n\n### 4. 📥 Excel Prays-List va 🖨 Rasmiy Yuk Xati (Накладная)\n\n- [Katalog Sahifasida](/uz/catalog) barcha paket turlari va o'lchamlarini bitta **\"📥 Prays-list (Excel)\"** tugmasi orqali yuklab olib, o'z tannarxingizni rejalashtirishingiz mumkin.\n- Har bir buyurtmaga buxgalteriya hisoboti uchun muhrlangan rasmiy **YUK XATI (НАКЛАДНАЯ) — LUXECORE (luxe-core.uz)** beriladi.\n\n### 5. 🚚 Toshkentda 2 Mln So'mdan Bepul Yetkazish\n\n- 2 000 000 so'mdan oshgan barcha buyurtmalar Toshkent shahri ichida **2 soatda tekinga** do'koningiz yoki omboringizgacha yetkaziladi.\n- Viloyatlarga tezkor furgonlar orqali 24 soat ichida yetkaziladi.\n- Har gal paketlaringiz tugaganda qidirib o'tirmasdan, [Buyurtmani Kuzatish va Qayta Buyurtma Qilish](/uz/tracking) sahifasida bitta tugma bilan buyurtmani takrorlashingiz mumkin.\n\n### 6. Aloqador Mahsulotlar:\n\n- [Kraft va Zip-Lock Paketlar Bo'limi](/uz/category/kraft-zip-paketlar)\n- [BOPP Paketlar Bo'limi](/uz/category/bopp-paketlar)\n- Do'kon mijozlariga kofe yoki choy taklif qiluvchi butiklar uchun [Ikki qavatli (Double Wall) kofe stakani (250 ml)](/uz/product/26) hamda [Issiq taomlar uchun qopqoqli konteynerlar](/uz/category/horeca-xojalik).\n\nHoziroq [Katalogga o'ting](/uz/catalog) va qadoqlash xarajatlaringizdan 10% tejab, mahsulotlaringiz sifatini yuqori darajaga ko'taring!",
      "ru": "С бурным развитием e-commerce в Узбекистане (Uzum Market, Wildberries, Zoodmall) качество упаковки напрямую влияет на процент выкупа товара и рейтинг продавца. Некачественный полиэтилен или слабый замок Zip-Lock приводят к повреждению товара при доставке и негативным отзывам.\n\nОптовая база [LUXECORE (luxe-core.uz)](https://luxe-core.uz/uz) поставляет полный спектр упаковочных материалов со склада Урикзор по оптовым ценам напрямую от производителя.\n\n### 1. Топовые Виды Упаковки для Маркетплейсов и Магазинов\n\n- **Матовые Zip-Lock пакеты с воздушным клапаном:** Плотность 70–80 мкм, приятные на ощупь, идеальны для одежды, трикотажа и белья. Воздушный клапан сжимает объем, экономя место при транспортировке.\n- **Прозрачные БОПП пакеты с клеевым клапаном:** Глянцевые пакеты повышенной прозрачности со сверхпрочной липкой лентой. Идеальны для носков, аксессуаров, текстиля и полиграфии (по 500 шт в пачке).\n- **Крафт-пакеты с кручеными ручками:** Прочные эко-пакеты бурого и белого цвета для бутиков одежды, обуви и доставки.\n\n### 2. Как Сэкономить до 10% на Упаковке?\n\nДля постоянных клиентов действует прогрессивная система скидок:\n- **100 – 499 шт:** Базовая оптовая цена склада;\n- **500 – 999 шт:** Автоматическая скидка **-5%**;\n- **1 000+ шт:** Автоматическая **VIP-скидка -10%**.\n\nПокупая упаковку оптом, средний магазин экономит сотни тысяч сумов ежемесячно.\n\n### 3. Заказ Пачками (1x, 2x, 5x, 10x)\n\nВ карточке каждого товара доступны быстрые кнопки выбора:\n- **1x пачка** — стартовый запас;\n- **2x пачки** — для регулярных отгрузок;\n- **5x пачек** — оптимальный объем на неделю;\n- **10x пачек** — крупный опт с максимальной выгодой.\n\n### 4. 📥 Прайс-Лист в Excel и 🖨 Официальная Накладная\n\n- В шапке [Каталога Продукции](/ru/catalog) скачивайте актуальный **Excel прайс-лист** со всеми ценами и размерами в один клик.\n- На каждую отгрузку предоставляется официальная **НАКЛАДНАЯ — LUXECORE (luxe-core.uz)** со штампом для вашей бухгалтерии.\n\n### 5. 🚚 Бесплатная Доставка от 2 Млн Сум\n\n- При заказе от 2 000 000 сум доставка по Ташкенту осуществляется **за 2 часа совершенно бесплатно**!\n- В регионы Узбекистана — доставка за 24 часа.\n- Повторить заказ регулярных расходников можно за пару секунд на странице [Отслеживание и Повтор Заказов](/ru/tracking).\n\n### 6. Рекомендуемые Разделы:\n\n- [Крафт и Zip-Lock Пакеты](/ru/category/kraft-zip-paketlar)\n- [БОПП Пакеты и Упаковка](/ru/category/bopp-paketlar)\n- Сопутствующие товары: [Двухслойный крафт-стакан Double Wall (250 мл + крышка)](/ru/product/26) и [Контейнеры HoReCa (750 мл)](/ru/category/horeca-xojalik).\n\nПереходите в [Каталог LUXECORE](/ru/catalog) и заказывайте упаковку для маркетплейсов с выгодой до 10%!",
      "en": "Wholesale Kraft, frosted Zip-Lock, and BOPP bags in Tashkent for retail stores and Uzum Market sellers. Save up to 10% with 3-tier bulk discounts, easy 1x-10x package ordering, Excel price list downloads, official invoices, and free delivery from 2M UZS. Visit our [Wholesale Catalog](/en/catalog)!"
    },
    "seo": {
      "title": {
        "uz": "Kraft, Zip-Lock va BOPP paketlar optom Toshkent — Uzum Market sotuvchilariga | LUXECORE",
        "ru": "Крафт, Zip-Lock и БОПП пакеты оптом в Ташкенте — Для продавцов Uzum | LUXECORE",
        "en": "Kraft, Zip-Lock and BOPP Bags Wholesale Tashkent — For Marketplace Sellers | LUXECORE"
      },
      "description": {
        "uz": "Uzum Market va do'konlar uchun matoviy Zip-Lock klapanli paketlar, yelimli BOPP va tutqichli kraft paketlar optom narxda. 3 pog'onali ulgurji chegirma (-10%), pachkalab xarid, Excel prays-list, rasmiy Yuk xati (Накладная), 2 mln so'mdan bepul yetkazish.",
        "ru": "Матовые пакеты Zip-Lock с клапаном, БОПП пакеты и крафт-пакеты с ручками оптом в Ташкенте со склада Урикзор. Скидки до 10%, покупка пачками, накладная для бухгалтерии, бесплатная доставка от 2 млн сум.",
        "en": "Frosted Zip-Lock bags, clear BOPP bags, and kraft paper shopping bags wholesale in Tashkent for boutiques and marketplace sellers. Save up to 10% on bulk packaging."
      },
      "keywords": {
        "uz": "kraft paketlar optom, zip lock paket optom toshkent, bopp paketlar ulgurji, uzum market qadoqlash, matoviy zip paket, qadoqlash materiallari orikzor, b2b paketlar ulgurji",
        "ru": "зип лок пакеты оптом ташкент, крафт пакеты оптом урикзор, бопп пакеты оптом, упаковка для узум маркет, матовые zip lock пакеты с клапаном, купить пакеты оптом",
        "en": "zip lock bags wholesale tashkent, kraft bags wholesale, bopp bags wholesale, marketplace packaging supplies"
      }
    }
  },
  {
    "id": 28,
    "slug": {
      "uz": "bir-martalik-odnorazoviy-idishlar-optom-orikzor-narxlari",
      "ru": "odnorazovaya-posuda-i-konteynery-optom-urikzor",
      "en": "disposable-tableware-containers-wholesale-urikzor"
    },
    "title": {
      "uz": "Bir martalik (odnorazoviy) idishlar va konteynerlar O'rikzor optom narxlarida: Kafe va Dostavka xizmatlari uchun",
      "ru": "Одноразовая посуда и контейнеры по оптовым ценам Урикзор: Для кафе, фастфуда и служб доставки",
      "en": "Disposable Tableware and Food Containers at Urikzor Wholesale Prices: For Cafes, Fast Food, and Delivery Services"
    },
    "image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop",
    "date": "2026-11-02",
    "content": {
      "uz": "Restoran, kafe, kofexona va tezkor ovqat yetkazib berish (fast-food delivery) xizmatlarining daromadliligi to'g'ridan-to'g'ri bir martalik idishlarning tannarxiga va sifatiga bog'liq. Taom yetib borguncha sovuq qolmasligi, souslar oqib ketmasligi va qog'oz stakan qo'lni kuydirmasligi mijozning sizga ikkinchi bor buyurtma berishini ta'minlaydi.\n\n[LUXECORE (luxe-core.uz)](https://luxe-core.uz/uz) O'rikzor ulgurji bozoridagi eng yirik ombordan umumiy ovqatlanish korxonalari (HoReCa) uchun sifatli bir martalik idish-tovoqlar va qadoqlarni ulgurji narxda taklif etadi.\n\n### 1. Kafe va Dostavka Uchun Zaruriy Asosiy Mahsulotlar\n\n- **Germetik Bir Martalik Sous Idishlari:** [Issiq taomlar uchun qopqoqli qora konteyner (750 ml)](/uz/product/28) qalin plastikdan tayyorlangan, qopqog'i mahkam yopiladi, sous, ketchup va mayonezlarning to'kilib ketishidan 100% kafolat beradi.\n- **Ikki Qavatli Kraft Kofe Stakanlari:** [Ikki qavatli (Double Wall) kofe stakani (250 ml + qopqoq)](/uz/product/26) — qo'lni kuydirmaydigan ikki qavatli (Double Wall) devorga ega, qopqog'i zich yopiladi, taom yetkazish va take-away uchun ideal.\n- **Issiq Taomlar Uchun Qora Polipropilen Konteynerlar:** Mikroto'lqinli pechda qizdirishga chidamli, deformatsiyalanmaydigan 500, 750 va 1000 ml sig'imdagi lanch-bokslar.\n- **Fast-Food Qutilari va Qog'oz Kraft Paketlar:** Burger, lavash, fri kartoshkalari uchun yog' o'tkazmaydigan ekologik qutilar.\n\n### 2. 3 Pog'onali Ulgurji Chegirma Tizimi\n\nDoimiy iste'mol qilinadigan bir martalik idishlarda har bir so'm katta mablag'ga aylanadi:\n- **100 – 499 dona:** Kichik kafelar uchun hamyonbop bazaviy ulgurji narx;\n- **500 – 999 dona:** Avtomatik **-5% chegirma**;\n- **1 000+ dona:** Avtomatik **-10% VIP chegirma**.\n\nYirik tarmoq kafelar har oy qadoqlashga sarflanadigan byudjetidan millionlab so'mni tejab qolmoqda.\n\n### 3. Pachkalab Qulay Xarid (1x, 2x, 5x, 10x)\n\nOshxona xodimlari soni adashmasligi uchun barcha mahsulotlar qat'iy standartdagi korobka va pachkalarda jo'natiladi:\n- **1x pachka** (masalan, 220 dona sous idishi yoki 50 dona stakan);\n- **2x pachka** (440 dona);\n- **5x pachka** (1 100 dona);\n- **10x pachka** (2 200 dona va undan yuqori).\n\n### 4. 📥 Excel Prays-List va 🖨 Rasmiy Yuk Xati (Накладная)\n\n- [Katalog Sahifasida](/uz/catalog) barcha HoReCa tovarlarining to'liq ro'yxati va ulgurji narxlarini **\"📥 Prays-list (Excel)\"** tugmasi orqali yuklab olish mumkin.\n- Barcha buyurtmalarga buxgalteriya hisoboti uchun muhr va imzo qo'yilgan rasmiy **YUK XATI (НАКЛАДНАЯ) — LUXECORE (luxe-core.uz)** ilova qilinadi.\n\n### 5. 🚚 Toshkentda 2 Mln So'mdan Bepul va 2 Soatda Yetkazish\n\n- Kafe va restoranlarda idish-tovoq kutilmaganda tugab qolishini yaxshi bilamiz. Toshkent shahri ichida 2 000 000 so'mdan yuqori buyurtmalar **2 soat ichida eshigingizgacha mutlaqo bepul** yetkaziladi!\n- Har hafta tugaydigan buyurtmalarni qayta qidirib o'tirmasdan, [Buyurtmani Kuzatish va Takrorlash](/uz/tracking) sahifasida 1 ta tugma orqali darhol savatga qaytarishingiz mumkin.\n\n### 6. HoReCa Bo'limi Bilan Tanishing:\n\n- [HoReCa va Xo'jalik Ulgurji Bo'limi](/uz/category/horeca-xojalik)\n- [Issiq taomlar uchun qopqoqli konteynerlar](/uz/category/horeca-xojalik)\n- [Ikki qavatli (Double Wall) kofe stakani (250 ml + qopqoq)](/uz/product/26)\n\nHoziroq [LUXECORE Ulgurji Katalogiga](/uz/catalog) kiring va kafengiz uchun bir martalik idishlarni O'rikzor narxlarida xarid qiling!",
      "ru": "В ресторанном бизнесе, кофейнях и службах доставки еды качество одноразовой посуды играет ключевую роль: герметичность соусников, термостойкость крафт-стаканов и прочность ланч-боксов напрямую определяют лояльность клиентов.\n\nОптовая платформа [LUXECORE (luxe-core.uz)](https://luxe-core.uz/uz) поставляет полный ассортимент одноразовой посуды и упаковки для HoReCa со склада рынка Урикзор в Ташкенте по прямым оптовым ценам.\n\n### 1. Базовые Позиции для Кафе и Доставки Еды\n\n- **Герметичные Соусники:** [Контейнер с крышкой для горячих блюд (750 мл)](/ru/product/28) из прочного полипропилена с плотной крышкой, исключающей протекание соусов, кетчупа и майонеза.\n- **Двухслойные Крафт-Стаканы:** [Двухслойный крафт-стакан Double Wall (250 мл + крышка)](/ru/product/26) с двойной стенкой (Double Wall) защищает руки от ожогов и сохраняет напиток горячим.\n- **Контейнеры для Горячих Блюд:** Черные ланч-боксы для микроволновой печи на 500, 750 и 1000 мл.\n- **Крафт-коробки для фастфуда:** Жиростойкие эко-боксы для бургеров, снеков и картофеля фри.\n\n### 2. 3 Уровня Оптовых Скидок\n\n- **100 – 499 шт:** Базовая оптовая цена для небольших кофеен;\n- **500 – 999 шт:** Автоматическая скидка **-5%**;\n- **1 000+ шт:** Автоматическая **VIP-скидка -10%**.\n\n### 3. Быстрая Фасовка Пачками (1x, 2x, 5x, 10x)\n\nУдобные кнопки выбора количества прямо в каталоге:\n- **1x пачка** — стартовый объем (например, 220 соусников или 50 стаканов);\n- **2x пачки** — 440 шт;\n- **5x пачек** — 1100 шт;\n- **10x пачек** — от 2200 шт со скидкой.\n\n### 4. 📥 Excel Прайс-Лист и 🖨 Официальная Накладная\n\n- Скачивайте полный прайс-лист в шапке [Каталога](/ru/catalog) кнопкой **\"📥 Прайс-лист (Excel)\"**.\n- К каждому заказу прилагается официальная **НАКЛАДНАЯ — LUXECORE (luxe-core.uz)** со штампом и реквизитами для бухгалтерии.\n\n### 5. 🚚 Бесплатная Доставка от 2 Млн Сум за 2 Часа\n\n- Заказы от 2 000 000 сум по Ташкенту доставляются **бесплатно в течение 2 часов**.\n- Доставка по всем регионам Узбекистана за 24 часа.\n- Повторить заказ регулярных расходников можно за 1 клик на странице [Отслеживание Заказов](/ru/tracking).\n\n### 6. Популярные Товары:\n\n- [Категория HoReCa и Хозтовары](/ru/category/horeca-xojalik)\n- [Контейнер для горячих блюд (750 мл)](/ru/product/28)\n- [Двухслойный крафт-стакан Double Wall (250 мл + крышка)](/ru/product/26)\n\nПереходите в [Каталог LUXECORE](/ru/catalog) и заказывайте одноразовую посуду для кафе по лучшим оптовым ценам!",
      "en": "Wholesale disposable tableware and food containers at Urikzor wholesale prices in Tashkent. Sauce containers, Double Wall kraft paper cups, food boxes for restaurants and delivery services. 3-tier discounts up to 10%, official invoices, and free delivery from 2M UZS. Visit [LUXECORE Catalog](/en/catalog)!"
    },
    "seo": {
      "title": {
        "uz": "Bir martalik idishlar optom Toshkent — Kafe va dostavka uchun O'rikzor narxlari | LUXECORE",
        "ru": "Одноразовая посуда оптом в Ташкенте — Цены Урикзор для кафе и доставки | LUXECORE",
        "en": "Disposable Tableware Wholesale Tashkent — Urikzor Prices for Delivery | LUXECORE"
      },
      "description": {
        "uz": "Kafe, restoran va dostavka uchun bir martalik sous idishlari, kraft stakanlar, konteynerlar O'rikzor optom narxlarida. 3 pog'onali chegirma (1000+ -10%), pachkalab xarid, Excel prays-list, rasmiy Yuk xati (Накладная), 2 mln so'mdan bepul yetkazish.",
        "ru": "Одноразовая посуда, соусники, двухслойные крафт-стаканы с крышкой и пищевые контейнеры оптом со склада Урикзор. Скидки до 10%, накладная для бухгалтерии, бесплатная доставка от 2 млн сум по Ташкенту.",
        "en": "Wholesale disposable tableware, food containers, sauce cups, and paper coffee cups in Tashkent. Bulk discounts up to 10%, delivery over 2M UZS."
      },
      "keywords": {
        "uz": "bir martalik idishlar optom, odnorazoviy idishlar toshkent, sous idishi optom, kofe stakanlari ulgurji, horeca qadoqlash orikzor, kafe uchun idishlar optom, yetkazib berish idishlari",
        "ru": "одноразовая посуда оптом ташкент, соусники оптом урикзор, крафт стаканы оптом, одноразовые контейнеры для еды, посуда для кафе оптом, упаковка для доставки еды",
        "en": "disposable tableware wholesale tashkent, food containers wholesale, coffee paper cups bulk, horeca packaging urikzor"
      }
    }
  },
  {
    "id": 29,
    "slug": {
      "uz": "toy-va-sarpo-qutilari-sovga-qutilari-optom",
      "ru": "svadebnye-korobki-sarpo-gift-box-optom",
      "en": "wedding-sarpo-gift-boxes-wholesale-models"
    },
    "title": {
      "uz": "To'y va sarpo qutilari hamda premium Gift Box'lar ulgurji (Optom): Do'konlar uchun eng xaridorgir modellar",
      "ru": "Свадебные коробки для сарпо и премиальные Gift Box оптом: Самые ходовые модели для магазинов и бутиков",
      "en": "Wedding & Sarpo Boxes and Premium Gift Boxes Wholesale: Best-Selling Models for Retailers"
    },
    "image": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200&auto=format&fit=crop",
    "date": "2026-11-02",
    "content": {
      "uz": "O'zbekistonda to'y marosimlari, fotiha, kelin-kuyov sarpolari va bayramona sovg'alar yuksak ehtirom bilan o'tkaziladi. Har bir to'y mavsumida sarpo qutilari, magnitli qulfli lyuks qutilar va zar hoshiyali milliy sovg'a qutilariga bo'lgan talab 200–300% gacha oshadi. Sovg'a do'konlari, gullar salonlari, kelinlik butiklari va qandolatchilar uchun bu eng katta daromad manbaidir.\n\nToshkentdagi [LUXECORE (luxe-core.uz)](https://luxe-core.uz/uz) B2B ulgurji ombori O'rikzordan to'g'ridan-to'g'ri ishlab chiqaruvchi narxlarida eng sara sarpo va sovg'a qutilarini taqdim etadi.\n\n### 1. Savdoda Eng Tez Sotiladigan Top-Modellar\n\n- **Magnitli Premium Oq Quti (Atlas lentali):** Qalin qattiq pereplyot kartondan ishlangan, qopqog'iga yashirin neodim magnit o'rnatilgan. Atlas lenta bilan bog'lanadigan bu quti atir-upa, qimmatbaho tilla taqinchoqlar va sarpo buyumlari uchun eng xaridorgir model.\n- **Kuyov-Kelin Sarpo Qutilari 3 talik To'plami (S, M, L):** Bir-birining ichiga kiruvchi 3 xil o'lchamdagi to'plam. Matolar, poyabzal va liboslarni tartibli va hashamatli joylashtirish imkonini beradi.\n- **Milliy Tilla Naqshli Patir va Shirinlik Qutilari:** Zarbof folga bilan bosilgan an'anaviy sharqona naqshlar sovchilik va to'y dasturxonlari uchun ayni muddao.\n- **Shaffof Darchali Eko-Kraft Qutilar:** Ichidagi mahsulot go'zalligini ko'rsatib turuvchi, shirinlik va suvenirlar uchun qulay qutilar.\n\n### 2. 3 Pog'onali Ulgurji Chegirma Tizimi (Do'konlar Uchun 50–70% Gacha Marja)\n\nLUXECORE ulgurji narxlarida xarid qilganingizda chakana savdoda 50% dan 70% gacha ustama qo'yib sotish imkoniyatiga ega bo'lasiz.\n- **100 – 499 dona:** Kichik do'konlar va gullar salonlari uchun bazaviy ulgurji narx;\n- **500 – 999 dona:** Avtomatik **-5% chegirma**;\n- **1 000+ dona:** Avtomatik **-10% VIP chegirma**.\n\n### 3. Pachkalab Xarid Qilish Afzalligi (1x, 2x, 5x, 10x)\n\nQattiq sovg'a qutilari tashish jarayonida shikastlanmasligi uchun zavodning maxsus mustahkam transport qutilarida joylangan:\n- **1x pachka** (30 yoki 50 dona to'plam);\n- **2x pachka** (60–100 dona);\n- **5x pachka** (150–250 dona);\n- **10x pachka** (300–500 dona va undan yuqori).\n\n### 4. 📥 Excel Prays-List va 🖨 Rasmiy Yuk Xati (Накладная)\n\n- [Katalog Sahifasidagi](/uz/catalog) **\"📥 Prays-list (Excel)\"** tugmasi orqali barcha qutilarning aniq o'lchamlari (sm), ichki balandligi va ulgurji narxlarini bir lahzada yuklab oling.\n- Barcha do'konlar va yuridik shaxslarga buxgalteriya hisoboti uchun muhrlangan rasmiy **YUK XATI (НАКЛАДНАЯ) — LUXECORE (luxe-core.uz)** beriladi.\n\n### 5. 🚚 Toshkentda 2 Mln So'mdan Bepul Yetkazish\n\n- Toshkent shahri bo'ylab 2 000 000 so'mdan yuqori buyurtmalar **2 soat ichida eshigingizgacha mutlaqo bepul** yetkaziladi.\n- Viloyatlarga xavfsiz qadoqlangan holda 24 soatda jo'natiladi.\n- [Buyurtmani Kuzatish va Qayta Buyurtma Qilish](/uz/tracking) sahifasi orqali oldingi xaridlaringizni 1 tugma bilan takrorlashingiz mumkin.\n\n### 6. Foydali Bo'limlar:\n\n- [To'y va Sarpo Qutilari Bo'limi](/uz/category/toy-qutilari)\n- [Bayram va Sovg'a Qutilari Bo'limi](/uz/category/sovga-qutilari)\n- Sovg'a savdosi va marosimlarga hamroh bo'luvchi [Ikki qavatli (Double Wall) kofe stakani (250 ml)](/uz/product/26) hamda [Issiq taomlar uchun qopqoqli konteynerlar](/uz/category/horeca-xojalik).\n\nHoziroq [LUXECORE Ulgurji Katalogiga](/uz/catalog) kiring, Excel narxnomani yuklab oling va to'y mavsumi uchun eng xaridorgir qutilarni eng arzon narxda zaxiralang!",
      "ru": "В Узбекистане свадебные церемонии, помолвка, обряды сарпо и вручение подарков занимают особое место. В разгар свадебного сезона спрос на жесткие подарочные коробки на магнитах, наборы для сарпо из 3 штук и традиционные коробки с золотым тиснением возрастает многократно.\n\nОптовая база [LUXECORE (luxe-core.uz)](https://luxe-core.uz/uz) предлагает свадебные коробки для сарпо и подарочные Gift Box напрямую со склада рынка Урикзор в Ташкенте.\n\n### 1. Самые Ходовые Модели для Магазинов и Бутиков\n\n- **Премиальная Белая Коробка на Магните с Атласной Лентой:** Изготовлена из переплетного картона высокой плотности, крышка закрывается на неодимовый скрытый магнит. Идеальна для парфюмерии, ювелирных изделий, часов и сарпо.\n- **Свадебный Набор Коробок для Сарпо из 3 шт (S, M, L):** Три вложенные друг в друга коробки для одежды, тканей и обуви жениха и невесты.\n- **Коробка с Национальным Золотым Орнаментом:** Тиснение золотой фольгой, идеально подходит для свадебных патыров и восточных сладостей.\n- **Эко-крафт коробка с прозрачным окном:** Демонстрирует красоту вложенного подарка или набора.\n\n### 2. 3-Уровневая Система Оптовых Скидок (Маржинальность до 70%)\n\nПокупая оптом на LUXECORE по ценам первого поставщика, магазины получают наценку 50–70% в рознице.\n- **100 – 499 шт:** Базовая оптовая цена склада;\n- **500 – 999 шт:** Автоматическая скидка **-5%**;\n- **1 000+ шт:** Автоматическая **VIP-скидка -10%**.\n\n### 3. Удобная Фасовка Пачками (1x, 2x, 5x, 10x)\n\nКаждая партия защищена от замятий в транспортной заводской таре:\n- **1x пачка** — стартовый объем (30 или 50 шт);\n- **2x пачки** — 60–100 шт;\n- **5x пачек** — 150–250 шт;\n- **10x пачек** — от 300 шт по VIP-цене.\n\n### 4. 📥 Excel Прайс-Лист и 🖨 Официальная Накладная\n\n- В шапке [Каталога](/ru/catalog) скачивайте **Excel прайс-лист** со всеми размерами и фото в один клик.\n- Для юрлиц и ИП предоставляется официальная **НАКЛАДНАЯ — LUXECORE (luxe-core.uz)** со штампом.\n\n### 5. 🚚 Бесплатная Доставка от 2 Млн Сум за 2 Часа\n\n- Доставка заказов от 2 000 000 сум по Ташкенту — **бесплатно за 2 часа**.\n- По регионам Узбекистана — надежная доставка за 24 часа.\n- Повторить заказ можно в 1 клик на странице [Отслеживание Заказов](/ru/tracking).\n\n### 6. Популярные Разделы:\n\n- [Свадебные Коробки и Сарпо](/ru/category/toy-qutilari)\n- [Подарочные и Крафт Коробки](/ru/category/sovga-qutilari)\n- [Двухслойный крафт-стакан (250 мл)](/ru/product/26) и [Контейнеры HoReCa (750 мл)](/ru/category/horeca-xojalik).\n\nПереходите в [Каталог LUXECORE](/ru/catalog), скачивайте прайс-лист и заказывайте свадебные коробки для сарпо с максимальной выгодой!",
      "en": "Wedding sarpo gift boxes and luxury magnetic Gift Boxes wholesale in Tashkent at Urikzor warehouse prices. 3-tier bulk discounts up to -10%, package orders, official invoices, and free delivery in Tashkent for orders over 2M UZS. Visit [LUXECORE Catalog](/en/catalog)!"
    },
    "seo": {
      "title": {
        "uz": "To'y va sarpo qutilari optom — Premium Gift Box ulgurji narxda | LUXECORE",
        "ru": "Свадебные коробки для сарпо и Gift Box оптом в Ташкенте — Цены Урикзор | LUXECORE",
        "en": "Wedding & Sarpo Boxes and Premium Gift Boxes Wholesale | LUXECORE"
      },
      "description": {
        "uz": "Kelin-kuyov sarpo to'plamlari, magnitli qattiq qutilar va premium sovg'a qutilari optom O'rikzor narxida. 3 pog'onali ulgurji chegirma (1000+ -10%), pachkalab xarid (1x/2x/5x/10x), Excel prays-list, rasmiy Yuk xati (Накладная), 2 mln so'mdan bepul yetkazish.",
        "ru": "Коробки для свадебного сарпо, жесткие коробки на магните с атласной лентой и подарочные Gift Box оптом со склада Урикзор. Скидки до 10%, покупка пачками, накладная для бухгалтерии, бесплатная доставка от 2 млн сум.",
        "en": "Luxury wedding sarpo sets, magnetic gift boxes, and holiday boxes wholesale in Tashkent. Tiered discounts up to -10%, official invoices, fast delivery."
      },
      "keywords": {
        "uz": "to'y qutilari optom, sarpo qutilari ulgurji toshkent, gift box optom, magnitli quti optom orikzor, kelin sarpo to'plami ulgurji, premium sovga qutisi, to'y uchun qutilar narxlari",
        "ru": "свадебные коробки оптом ташкент, коробки для сарпо оптом урикзор, подарочные коробки на магните оптом, наборы для сарпо оптом, подарочные боксы оптом, купить коробки оптом",
        "en": "wedding boxes wholesale tashkent, sarpo gift boxes bulk, luxury magnetic boxes wholesale, gift packaging supplies"
      }
    }
  }
];

