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
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop',
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
    id: 1,
    name: "Bolalar shirinlik qutisi \"Qor Bobo 2027\"",
    price: 2800,
    formattedPrice: "2 800 UZS",
    category: "yangi-yil-2027",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop",
    shortDescription: "Tutqichli baquvvat karton, 1 kg shirinlik sig'adi. O'rikzor omboridan 100 donadan boshlab ulgurji narxda.",
    itemsPerPackage: 100,
    stock: 50000,
    is_bestseller: true,
    specs: [
      { label: "Material", value: "Qalin xrom-karton" },
      { label: "Sig'imi", value: "1 kg shirinlik" },
      { label: "Min. buyurtma", value: "100 dona (1 pachka)" },
      { label: "Yetkazib berish", value: "Toshkentda 2 soat, viloyatga 1 kun" }
    ]
  },
  {
    id: 2,
    name: "Bolalar shirinlik qutisi \"Archa\"",
    price: 4200,
    formattedPrice: "4 200 UZS",
    category: "yangi-yil-2027",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop",
    shortDescription: "Katta hajmli Yangi Yil archa shaklidagi shirinlik qutisi (1.5 – 2 kg sig'im).",
    itemsPerPackage: 100,
    stock: 30000,
    specs: [
      { label: "Material", value: "Laminatsiyali karton" },
      { label: "Sig'imi", value: "1.5 - 2 kg" },
      { label: "Min. buyurtma", value: "100 dona" }
    ]
  },
  {
    id: 3,
    name: "Korporativ VIP Yangi Yil qutisi",
    price: 12000,
    formattedPrice: "12 000 UZS",
    category: "yangi-yil-2027",
    image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1000&auto=format&fit=crop",
    shortDescription: "Qattiq muqovali, tilla lentali va maxsus folgali korporativ sovg'a qutisi.",
    itemsPerPackage: 50,
    stock: 10000,
    is_premium: true,
    specs: [
      { label: "Material", value: "Qattiq muqovali pereplyot karton" },
      { label: "O'lchami", value: "28x22x10 sm" },
      { label: "Min. buyurtma", value: "50 dona" }
    ]
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
      "uz": "Yangi Yil 2027 mavsumi yaqinlashishi bilan shirinlik ishlab chiqaruvchilar, qandolatchilik sexlari, maktab-bog'chalar ta'minotchilari va yirik korporativ kompaniyalar oldida bitta asosiy vazifa turadi: sifatli, mustahkam va bayramona sovg'a qutilarini eng arzon ulgurji narxda xarid qilish.\n\nToshkentdagi [LUXECORE (luxe-core.uz)](https://luxe-core.uz/uz) B2B ulgurji platformasi O'rikzor ulgurji omboridan to'g'ridan-to'g'ri birinchi qo'l narxlarida yetkazib berishni yo'lga qo'ydi. Biz vositachilarsiz ishlaymiz, shu sababli siz bozor narxidan 15–25% arzonroqqa ega bo'lasiz.\n\n### 1. 3 Pog'onali Avtomatik Ulgurji Chegirma Tizimi\n\nBiznes mijozlarimiz harajatlarini maksimal darajada optimallashtirish uchun LUXECORE platformasida 3 pog'onali shaffof chegirma tizimi amal qiladi:\n- **100 – 499 dona:** Bazaviy birinchi qo'l ulgurji narxi (barcha qandolatchilar va kichik do'konlar uchun minimal qulay kirish).\n- **500 – 999 dona:** Avtomatik **-5% chegirma** (o'rtacha korxona va tadbirlar uchun qo'shimcha tejamkorlik).\n- **1 000+ dona:** Avtomatik **-10% VIP ulgurji chegirma** (yirik qandolat fabrikalari, tarmoq supermarketlar va korporativ gigantlar uchun eng arzon narx kafolati).\n\nBuyurtma hajmi oshishi bilan chegirma savatda real vaqt rejimida hisoblanadi va tejab qolingan summa darhol ko'rsatiladi.\n\n### 2. Qulay Pachkalab Xarid (1x, 2x, 5x, 10x)\n\nOmborimizdagi barcha Yangi Yil qutilari zavod qadog'ida (masalan, 50 yoki 100 donalik pachkalarda) saralangan. Saytimizda siz mahsulotlarni donalab sanab o'tirmaysiz — qulay tezkor tugmalar orqali xarid qilasiz:\n- **1x pachka** — boshlang'ich sinov partiyasi (50 yoki 100 dona);\n- **2x pachka** — ixcham savdo nuqtalari uchun (100–200 dona);\n- **5x pachka** — qizg'in bayram savdosi uchun (250–500 dona);\n- **10x pachka** — yirik ulgurji partiya (500–1000 dona).\n\n### 3. 📥 Excel Prays-Listni 1-Bosishda Yuklab Olish\n\nKatta korxonalar, ta'minot bo'limlari (snabjenetslar) va buxgalterlar uchun platformamizning [Ulgurji Katalog](/uz/catalog) sahifasida maxsus **\"📥 Prays-list (Excel)\"** tugmasi joriy etilgan. 1 bosish orqali barcha qutilar o'lchami, fotosurati, minimal pachka soni va 100+, 500+, 1000+ narxlari Excel (.csv) jadval ko'rinishida yuklanadi.\n\n### 4. 🖨 Rasmiy Yuk Xati (Накладная) — 100% Qonuniy va Shaffof\n\nBarcha yuridik shaxslar, MChJ va YaTT lar uchun omborimizdan chiqadigan har bir buyurtmaga to'liq rasmiy **YUK XATI (НАКЛАДНАЯ) — LUXECORE (luxe-core.uz)** ilova qilinadi. Unda tovar nomi, partiya raqami, aniq dona soni, muhr va mas'ul shaxs imzosi joylari mavjud. Buxgalteriya hisoboti uchun 100% tayyor hujjat.\n\n### 5. 🚚 2 Mln So'mdan Bepul Yetkazib Berish\n\n- **Toshkent shahri bo'ylab:** 2 000 000 so'mdan yuqori har qanday buyurtma sizning do'koningiz, sexingiz yoki omboringiz eshigigacha **mutlaqo bepul va 2 soat ichida tezkor** yetkaziladi!\n- **Viloyatlar (Samarqand, Buxoro, Andijon, Farg'ona, Namangan, Xorazm va barcha hududlar):** Buyurtmalar 24 soat ichida ishonchli yuk mashinalari yoki BTS/furgon orqali yetkaziladi.\n- Doimiy buyurtmalarni esa [Buyurtmani Kuzatish va Takrorlash](/uz/tracking) sahifasida bir bosishda qayta faollashtirishingiz mumkin.\n\n### 6. Do'koningiz Uchun Eng Ommabop Modellarni Hozirdan Tanlang:\n\nMavsumda narxlar ko'tarilmasdan oldin buyurtma bering:\n- [Yangi Yil 2027 Qutilari Bo'limi](/uz/category/yangi-yil-2027) — bolalar uchun \"Qor Bobo\" va \"Archa\" shaklidagi shirinlik qutilari;\n- [Bayram va Sovg'a Qutilari Bo'limi](/uz/category/sovga-qutilari) — qattiq pereplyot kartondan VIP sovg'a qutilari;\n- Bayram dasturxonlari va kafe servisida kerak bo'ladigan [Bir martalik sous idishi (75x42 mm)](/uz/product/bir-martalik-sous-idishi-75x42-mm-220-dona-28) hamda qopqoqli [Premium Kraft Qog'oz Stakanlari To'plami (250ml)](/uz/product/premium-kraft-qogoz-stakanlari-250ml-qopqoq-29) ni ham to'g'ridan-to'g'ri ombordan qo'shib olishingiz mumkin.\n\nHoziroq [LUXECORE Ulgurji Katalogiga](/uz/catalog) o'ting, Excel prays-listni yuklab oling va Yangi Yil 2027 partiyasini maksimal foyda bilan band qiling!",
      "ru": "С приближением новогоднего сезона 2027 кондитерские фабрики, частные цеха, поставщики школ и детских садов, а также корпоративные компании сталкиваются с главной задачей: купить качественные, прочные и презентабельные новогодние коробки для подарков по минимальной оптовой цене.\n\nB2B оптовая платформа [LUXECORE (luxe-core.uz)](https://luxe-core.uz/uz) обеспечивает прямые поставки со склада рынка Урикзор в Ташкенте по ценам первого поставщика без посредников и лишних переплат.\n\n### 1. 3-Уровневая Автоматическая Система Оптовых Скидок\n\nЧтобы бизнес-клиенты получали максимальную маржу, на платформе LUXECORE действует прогрессивная шкала оптовых цен:\n- **100 – 499 шт:** Базовая оптовая цена со склада (доступный минимальный порог для розничных магазинов и кондитерских).\n- **500 – 999 шт:** Автоматическая скидка **-5%** (выгодные условия для средних партий и подарков сотрудникам).\n- **1 000+ шт:** Автоматическая **VIP-скидка -10%** (максимальная экономия для крупных оптовиков, сетей и фабрик).\n\nСкидка рассчитывается моментально в корзине при достижении нужного количества, а сумма экономии отображается прозрачно.\n\n### 2. Удобный Заказ Пачками (1x, 2x, 5x, 10x)\n\nВся продукция расфасована в заводские упаковки (по 50 или 100 шт). Вам не нужно вводить количество вручную — используйте удобные кнопки быстрой фасовки:\n- **1x пачка** — пробная партия (50 или 100 шт);\n- **2x пачки** — для небольших точек продаж (100–200 шт);\n- **5x пачек** — оптимальный объем для праздничного спроса (250–500 шт);\n- **10x пачек** — крупный опт (500–1000 шт и более).\n\n### 3. 📥 Скачивание Excel Прайс-Листа в 1 Клик\n\nДля менеджеров по закупкам и бухгалтеров в шапке раздела [Оптовый Каталог](/ru/catalog) доступна кнопка **\"📥 Прайс-лист (Excel)\"**. В один клик скачивается готовая таблица со всеми размерами, вместимостью, фото и 3 уровнями оптовых цен (100+, 500+, 1000+).\n\n### 4. 🖨 Официальная Накладная со Штампом\n\nДля юридических лиц и индивидуальных предпринимателей на каждый заказ со склада распечатывается официальная **НАКЛАДНАЯ — LUXECORE (luxe-core.uz)** формата А4 со штампом, реквизитами и местом подписи. Полная бухгалтерская прозрачность гарантирована.\n\n### 5. 🚚 Бесплатная Доставка от 2 Млн Сум\n\n- **По Ташкенту:** Заказы на сумму от 2 000 000 сум доставляются до вашего склада или магазина **абсолютно бесплатно и за 2 часа**!\n- **По регионам Узбекистана:** Отправка в Самарканд, Бухару, Фергану, Андижан, Наманган и другие области в течение 24 часов.\n- Повторить прошлый успешный заказ можно в 1 клик на странице [Отслеживание и Повтор Заказа](/ru/tracking).\n\n### 6. Заказывайте Популярные Позиции:\n\n- [Раздел Новогодняя Упаковка 2027](/ru/category/yangi-yil-2027) — детские коробки «Дед Мороз» и «Елочка» из плотного хром-эрзац картона;\n- [Раздел Подарочные Коробки](/ru/category/sovga-qutilari) — элитные твердые переплетные коробки с лентами;\n- Для кейтеринга и новогодних банкетов: [Одноразовый контейнер для соуса (75x42 мм)](/ru/product/konteyner-dlya-sousa-odnorazovyy-75x42-mm-28) и [Крафт стаканы для горячих напитков 250 мл](/ru/product/nabor-kraft-stakanov-250ml-kryshka-29).\n\nПереходите в [Каталог LUXECORE](/ru/catalog), скачивайте оптовый прайс-лист и бронируйте новогодние коробки 2027 по самым выгодным ценам!",
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
      "uz": "Elektron tijorat rivojlanishi bilan Uzum Market, Wildberries va Instagram-do'konlar uchun qadoqlash sifati sotuv hajmi va mijozlar reytingini belgilovchi eng muhim omilga aylandi. Yirtilgan paket, yomon yopishgan klapan yoki tovar ko'rinmaydigan qadoq mijozlarning salbiy fikrlariga va tovar qaytarilishiga (vozvrat) sabab bo'ladi.\n\nToshkentdagi [LUXECORE (luxe-core.uz)](https://luxe-core.uz/uz) B2B ulgurji ombori kiyim-kechak, kosmetika, aksessuarlar va savdo nuqtalari uchun sertifikatlangan Kraft, Zip-Lock va BOPP paketlarini to'g'ridan-to'g'ri O'rikzor narxlarida taqdim etadi.\n\n### 1. Marketpleyslar Uchun Eng Xaridorgir Qadoq Turlari\n\n- **Matoviy Zip-Lock Paketlar (Havo klapanli):** Qalinligi 70–80 mkr bo'lib, kiyimlar, futbolkalar, ichki kiyimlar va to'qimachilik uchun ideal. Havo klapani qadoqni ixchamlashtiradi, logistika xarajatlarini tejaydi.\n- **Yelimli Klapanli BOPP Shaffof Paketlar:** O'ta tiniq, yaltiroq va mustahkam yelimli plyonka. Paypoqlar, bijuteriya, pishiriqlar va kitoblar uchun eng mashhur tanlov (1 pachkada 500 dona).\n- **Tutqichli Eko-Kraft Paketlar:** Qalin xom-ashyodan tayyorlangan, burama yoki yassi tutqichli kraft paketlar butiklar va yetkazib berish xizmatlarining nufuzini bir necha barobar oshiradi.\n\n### 2. 10% Gacha Qanday Tejab Qolish Mumkin? (3 Pog'onali Chegirma)\n\nHar oy minglab paket ishlatadigan sellerlar uchun LUXECORE avtomatik chegirma tizimini taklif etadi:\n- **100 – 499 dona:** Kichik partiyalar uchun qulay bazaviy ulgurji narx;\n- **500 – 999 dona:** Avtomatik **-5% chegirma**;\n- **1 000+ dona:** Avtomatik **-10% VIP chegirma**.\n\nAgar siz oyiga 3 000 dona Zip-Lock va BOPP paket ishlatsangiz, har oylik qadoqlash byudjetingizdan 10% to'g'ridan-to'g'ri sof foyda sifatida cho'ntagingizda qoladi.\n\n### 3. Pachkalab Tezkor Xarid (1x, 2x, 5x, 10x)\n\nBozorga borib vaqt sarflash shart emas. Saytimizda har bir mahsulot sahifasida aniq pachka soni ko'rsatilgan:\n- **1x pachka** (50 yoki 100 dona) — haftalik zaxira;\n- **2x pachka** (100–200 dona);\n- **5x pachka** (250–500 dona);\n- **10x pachka** (500–1000 dona va undan ortiq).\n\n### 4. 📥 Excel Prays-List va 🖨 Rasmiy Yuk Xati (Накладная)\n\n- [Katalog Sahifasida](/uz/catalog) barcha paket turlari va o'lchamlarini bitta **\"📥 Prays-list (Excel)\"** tugmasi orqali yuklab olib, o'z tannarxingizni rejalashtirishingiz mumkin.\n- Har bir buyurtmaga buxgalteriya hisoboti uchun muhrlangan rasmiy **YUK XATI (НАКЛАДНАЯ) — LUXECORE (luxe-core.uz)** beriladi.\n\n### 5. 🚚 Toshkentda 2 Mln So'mdan Bepul Yetkazish\n\n- 2 000 000 so'mdan oshgan barcha buyurtmalar Toshkent shahri ichida **2 soatda tekinga** do'koningiz yoki omboringizgacha yetkaziladi.\n- Viloyatlarga tezkor furgonlar orqali 24 soat ichida yetkaziladi.\n- Har gal paketlaringiz tugaganda qidirib o'tirmasdan, [Buyurtmani Kuzatish va Qayta Buyurtma Qilish](/uz/tracking) sahifasida bitta tugma bilan buyurtmani takrorlashingiz mumkin.\n\n### 6. Aloqador Mahsulotlar:\n\n- [Kraft va Zip-Lock Paketlar Bo'limi](/uz/category/kraft-zip-paketlar)\n- [BOPP Paketlar Bo'limi](/uz/category/bopp-paketlar)\n- Do'kon mijozlariga kofe yoki choy taklif qiluvchi butiklar uchun [Premium Kraft Qog'oz Stakanlari (250ml)](/uz/product/premium-kraft-qogoz-stakanlari-250ml-qopqoq-29) hamda [Bir martalik sous idishi (75x42 mm)](/uz/product/bir-martalik-sous-idishi-75x42-mm-220-dona-28).\n\nHoziroq [Katalogga o'ting](/uz/catalog) va qadoqlash xarajatlaringizdan 10% tejab, mahsulotlaringiz sifatini yuqori darajaga ko'taring!",
      "ru": "С бурным развитием e-commerce в Узбекистане (Uzum Market, Wildberries, Zoodmall) качество упаковки напрямую влияет на процент выкупа товара и рейтинг продавца. Некачественный полиэтилен или слабый замок Zip-Lock приводят к повреждению товара при доставке и негативным отзывам.\n\nОптовая база [LUXECORE (luxe-core.uz)](https://luxe-core.uz/uz) поставляет полный спектр упаковочных материалов со склада Урикзор по оптовым ценам напрямую от производителя.\n\n### 1. Топовые Виды Упаковки для Маркетплейсов и Магазинов\n\n- **Матовые Zip-Lock пакеты с воздушным клапаном:** Плотность 70–80 мкм, приятные на ощупь, идеальны для одежды, трикотажа и белья. Воздушный клапан сжимает объем, экономя место при транспортировке.\n- **Прозрачные БОПП пакеты с клеевым клапаном:** Глянцевые пакеты повышенной прозрачности со сверхпрочной липкой лентой. Идеальны для носков, аксессуаров, текстиля и полиграфии (по 500 шт в пачке).\n- **Крафт-пакеты с кручеными ручками:** Прочные эко-пакеты бурого и белого цвета для бутиков одежды, обуви и доставки.\n\n### 2. Как Сэкономить до 10% на Упаковке?\n\nДля постоянных клиентов действует прогрессивная система скидок:\n- **100 – 499 шт:** Базовая оптовая цена склада;\n- **500 – 999 шт:** Автоматическая скидка **-5%**;\n- **1 000+ шт:** Автоматическая **VIP-скидка -10%**.\n\nПокупая упаковку оптом, средний магазин экономит сотни тысяч сумов ежемесячно.\n\n### 3. Заказ Пачками (1x, 2x, 5x, 10x)\n\nВ карточке каждого товара доступны быстрые кнопки выбора:\n- **1x пачка** — стартовый запас;\n- **2x пачки** — для регулярных отгрузок;\n- **5x пачек** — оптимальный объем на неделю;\n- **10x пачек** — крупный опт с максимальной выгодой.\n\n### 4. 📥 Прайс-Лист в Excel и 🖨 Официальная Накладная\n\n- В шапке [Каталога Продукции](/ru/catalog) скачивайте актуальный **Excel прайс-лист** со всеми ценами и размерами в один клик.\n- На каждую отгрузку предоставляется официальная **НАКЛАДНАЯ — LUXECORE (luxe-core.uz)** со штампом для вашей бухгалтерии.\n\n### 5. 🚚 Бесплатная Доставка от 2 Млн Сум\n\n- При заказе от 2 000 000 сум доставка по Ташкенту осуществляется **за 2 часа совершенно бесплатно**!\n- В регионы Узбекистана — доставка за 24 часа.\n- Повторить заказ регулярных расходников можно за пару секунд на странице [Отслеживание и Повтор Заказов](/ru/tracking).\n\n### 6. Рекомендуемые Разделы:\n\n- [Крафт и Zip-Lock Пакеты](/ru/category/kraft-zip-paketlar)\n- [БОПП Пакеты и Упаковка](/ru/category/bopp-paketlar)\n- Сопутствующие товары: [Крафт стаканы 250 мл с крышкой](/ru/product/nabor-kraft-stakanov-250ml-kryshka-29) и [Одноразовый соусник 75x42 мм](/ru/product/konteyner-dlya-sousa-odnorazovyy-75x42-mm-28).\n\nПереходите в [Каталог LUXECORE](/ru/catalog) и заказывайте упаковку для маркетплейсов с выгодой до 10%!",
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
      "uz": "Restoran, kafe, kofexona va tezkor ovqat yetkazib berish (fast-food delivery) xizmatlarining daromadliligi to'g'ridan-to'g'ri bir martalik idishlarning tannarxiga va sifatiga bog'liq. Taom yetib borguncha sovuq qolmasligi, souslar oqib ketmasligi va qog'oz stakan qo'lni kuydirmasligi mijozning sizga ikkinchi bor buyurtma berishini ta'minlaydi.\n\n[LUXECORE (luxe-core.uz)](https://luxe-core.uz/uz) O'rikzor ulgurji bozoridagi eng yirik ombordan umumiy ovqatlanish korxonalari (HoReCa) uchun sifatli bir martalik idish-tovoqlar va qadoqlarni ulgurji narxda taklif etadi.\n\n### 1. Kafe va Dostavka Uchun Zaruriy Asosiy Mahsulotlar\n\n- **Germetik Bir Martalik Sous Idishlari:** [Bir martalik sous idishi (75x42 mm) – 220 dona](/uz/product/bir-martalik-sous-idishi-75x42-mm-220-dona-28) qalin plastikdan tayyorlangan, qopqog'i mahkam yopiladi, sous, ketchup va mayonezlarning to'kilib ketishidan 100% kafolat beradi.\n- **Ikki Qavatli Kraft Kofe Stakanlari:** [Premium Kraft Qog'oz Stakanlari To'plami (250ml + Qopqoq)](/uz/product/premium-kraft-qogoz-stakanlari-250ml-qopqoq-29) — qo'lni kuydirmaydigan ikki qavatli (Double Wall) devorga ega, qopqog'i zich yopiladi, taom yetkazish va take-away uchun ideal.\n- **Issiq Taomlar Uchun Qora Polipropilen Konteynerlar:** Mikroto'lqinli pechda qizdirishga chidamli, deformatsiyalanmaydigan 500, 750 va 1000 ml sig'imdagi lanch-bokslar.\n- **Fast-Food Qutilari va Qog'oz Kraft Paketlar:** Burger, lavash, fri kartoshkalari uchun yog' o'tkazmaydigan ekologik qutilar.\n\n### 2. 3 Pog'onali Ulgurji Chegirma Tizimi\n\nDoimiy iste'mol qilinadigan bir martalik idishlarda har bir so'm katta mablag'ga aylanadi:\n- **100 – 499 dona:** Kichik kafelar uchun hamyonbop bazaviy ulgurji narx;\n- **500 – 999 dona:** Avtomatik **-5% chegirma**;\n- **1 000+ dona:** Avtomatik **-10% VIP chegirma**.\n\nYirik tarmoq kafelar har oy qadoqlashga sarflanadigan byudjetidan millionlab so'mni tejab qolmoqda.\n\n### 3. Pachkalab Qulay Xarid (1x, 2x, 5x, 10x)\n\nOshxona xodimlari soni adashmasligi uchun barcha mahsulotlar qat'iy standartdagi korobka va pachkalarda jo'natiladi:\n- **1x pachka** (masalan, 220 dona sous idishi yoki 50 dona stakan);\n- **2x pachka** (440 dona);\n- **5x pachka** (1 100 dona);\n- **10x pachka** (2 200 dona va undan yuqori).\n\n### 4. 📥 Excel Prays-List va 🖨 Rasmiy Yuk Xati (Накладная)\n\n- [Katalog Sahifasida](/uz/catalog) barcha HoReCa tovarlarining to'liq ro'yxati va ulgurji narxlarini **\"📥 Prays-list (Excel)\"** tugmasi orqali yuklab olish mumkin.\n- Barcha buyurtmalarga buxgalteriya hisoboti uchun muhr va imzo qo'yilgan rasmiy **YUK XATI (НАКЛАДНАЯ) — LUXECORE (luxe-core.uz)** ilova qilinadi.\n\n### 5. 🚚 Toshkentda 2 Mln So'mdan Bepul va 2 Soatda Yetkazish\n\n- Kafe va restoranlarda idish-tovoq kutilmaganda tugab qolishini yaxshi bilamiz. Toshkent shahri ichida 2 000 000 so'mdan yuqori buyurtmalar **2 soat ichida eshigingizgacha mutlaqo bepul** yetkaziladi!\n- Har hafta tugaydigan buyurtmalarni qayta qidirib o'tirmasdan, [Buyurtmani Kuzatish va Takrorlash](/uz/tracking) sahifasida 1 ta tugma orqali darhol savatga qaytarishingiz mumkin.\n\n### 6. HoReCa Bo'limi Bilan Tanishing:\n\n- [HoReCa va Xo'jalik Ulgurji Bo'limi](/uz/category/horeca-xojalik)\n- [Bir martalik sous idishi (75x42 mm)](/uz/product/bir-martalik-sous-idishi-75x42-mm-220-dona-28)\n- [Premium Kraft Qog'oz Stakanlari To'plami (250ml + Qopqoq)](/uz/product/premium-kraft-qogoz-stakanlari-250ml-qopqoq-29)\n\nHoziroq [LUXECORE Ulgurji Katalogiga](/uz/catalog) kiring va kafengiz uchun bir martalik idishlarni O'rikzor narxlarida xarid qiling!",
      "ru": "В ресторанном бизнесе, кофейнях и службах доставки еды качество одноразовой посуды играет ключевую роль: герметичность соусников, термостойкость крафт-стаканов и прочность ланч-боксов напрямую определяют лояльность клиентов.\n\nОптовая платформа [LUXECORE (luxe-core.uz)](https://luxe-core.uz/uz) поставляет полный ассортимент одноразовой посуды и упаковки для HoReCa со склада рынка Урикзор в Ташкенте по прямым оптовым ценам.\n\n### 1. Базовые Позиции для Кафе и Доставки Еды\n\n- **Герметичные Соусники:** [Одноразовый контейнер для соуса (75x42 мм) – 220 шт](/ru/product/konteyner-dlya-sousa-odnorazovyy-75x42-mm-28) из прочного полипропилена с плотной крышкой, исключающей протекание соусов, кетчупа и майонеза.\n- **Двухслойные Крафт-Стаканы:** [Набор премиальных крафт-стаканов (250 мл + крышка)](/ru/product/nabor-kraft-stakanov-250ml-kryshka-29) с двойной стенкой (Double Wall) защищает руки от ожогов и сохраняет напиток горячим.\n- **Контейнеры для Горячих Блюд:** Черные ланч-боксы для микроволновой печи на 500, 750 и 1000 мл.\n- **Крафт-коробки для фастфуда:** Жиростойкие эко-боксы для бургеров, снеков и картофеля фри.\n\n### 2. 3 Уровня Оптовых Скидок\n\n- **100 – 499 шт:** Базовая оптовая цена для небольших кофеен;\n- **500 – 999 шт:** Автоматическая скидка **-5%**;\n- **1 000+ шт:** Автоматическая **VIP-скидка -10%**.\n\n### 3. Быстрая Фасовка Пачками (1x, 2x, 5x, 10x)\n\nУдобные кнопки выбора количества прямо в каталоге:\n- **1x пачка** — стартовый объем (например, 220 соусников или 50 стаканов);\n- **2x пачки** — 440 шт;\n- **5x пачек** — 1100 шт;\n- **10x пачек** — от 2200 шт со скидкой.\n\n### 4. 📥 Excel Прайс-Лист и 🖨 Официальная Накладная\n\n- Скачивайте полный прайс-лист в шапке [Каталога](/ru/catalog) кнопкой **\"📥 Прайс-лист (Excel)\"**.\n- К каждому заказу прилагается официальная **НАКЛАДНАЯ — LUXECORE (luxe-core.uz)** со штампом и реквизитами для бухгалтерии.\n\n### 5. 🚚 Бесплатная Доставка от 2 Млн Сум за 2 Часа\n\n- Заказы от 2 000 000 сум по Ташкенту доставляются **бесплатно в течение 2 часов**.\n- Доставка по всем регионам Узбекистана за 24 часа.\n- Повторить заказ регулярных расходников можно за 1 клик на странице [Отслеживание Заказов](/ru/tracking).\n\n### 6. Популярные Товары:\n\n- [Категория HoReCa и Хозтовары](/ru/category/horeca-xojalik)\n- [Одноразовый соусник 75x42 мм (220 шт)](/ru/product/konteyner-dlya-sousa-odnorazovyy-75x42-mm-28)\n- [Крафт стаканы для кофе 250 мл с крышкой](/ru/product/nabor-kraft-stakanov-250ml-kryshka-29)\n\nПереходите в [Каталог LUXECORE](/ru/catalog) и заказывайте одноразовую посуду для кафе по лучшим оптовым ценам!",
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
      "uz": "O'zbekistonda to'y marosimlari, fotiha, kelin-kuyov sarpolari va bayramona sovg'alar yuksak ehtirom bilan o'tkaziladi. Har bir to'y mavsumida sarpo qutilari, magnitli qulfli lyuks qutilar va zar hoshiyali milliy sovg'a qutilariga bo'lgan talab 200–300% gacha oshadi. Sovg'a do'konlari, gullar salonlari, kelinlik butiklari va qandolatchilar uchun bu eng katta daromad manbaidir.\n\nToshkentdagi [LUXECORE (luxe-core.uz)](https://luxe-core.uz/uz) B2B ulgurji ombori O'rikzordan to'g'ridan-to'g'ri ishlab chiqaruvchi narxlarida eng sara sarpo va sovg'a qutilarini taqdim etadi.\n\n### 1. Savdoda Eng Tez Sotiladigan Top-Modellar\n\n- **Magnitli Premium Oq Quti (Atlas lentali):** Qalin qattiq pereplyot kartondan ishlangan, qopqog'iga yashirin neodim magnit o'rnatilgan. Atlas lenta bilan bog'lanadigan bu quti atir-upa, qimmatbaho tilla taqinchoqlar va sarpo buyumlari uchun eng xaridorgir model.\n- **Kuyov-Kelin Sarpo Qutilari 3 talik To'plami (S, M, L):** Bir-birining ichiga kiruvchi 3 xil o'lchamdagi to'plam. Matolar, poyabzal va liboslarni tartibli va hashamatli joylashtirish imkonini beradi.\n- **Milliy Tilla Naqshli Patir va Shirinlik Qutilari:** Zarbof folga bilan bosilgan an'anaviy sharqona naqshlar sovchilik va to'y dasturxonlari uchun ayni muddao.\n- **Shaffof Darchali Eko-Kraft Qutilar:** Ichidagi mahsulot go'zalligini ko'rsatib turuvchi, shirinlik va suvenirlar uchun qulay qutilar.\n\n### 2. 3 Pog'onali Ulgurji Chegirma Tizimi (Do'konlar Uchun 50–70% Gacha Marja)\n\nLUXECORE ulgurji narxlarida xarid qilganingizda chakana savdoda 50% dan 70% gacha ustama qo'yib sotish imkoniyatiga ega bo'lasiz.\n- **100 – 499 dona:** Kichik do'konlar va gullar salonlari uchun bazaviy ulgurji narx;\n- **500 – 999 dona:** Avtomatik **-5% chegirma**;\n- **1 000+ dona:** Avtomatik **-10% VIP chegirma**.\n\n### 3. Pachkalab Xarid Qilish Afzalligi (1x, 2x, 5x, 10x)\n\nQattiq sovg'a qutilari tashish jarayonida shikastlanmasligi uchun zavodning maxsus mustahkam transport qutilarida joylangan:\n- **1x pachka** (30 yoki 50 dona to'plam);\n- **2x pachka** (60–100 dona);\n- **5x pachka** (150–250 dona);\n- **10x pachka** (300–500 dona va undan yuqori).\n\n### 4. 📥 Excel Prays-List va 🖨 Rasmiy Yuk Xati (Накладная)\n\n- [Katalog Sahifasidagi](/uz/catalog) **\"📥 Prays-list (Excel)\"** tugmasi orqali barcha qutilarning aniq o'lchamlari (sm), ichki balandligi va ulgurji narxlarini bir lahzada yuklab oling.\n- Barcha do'konlar va yuridik shaxslarga buxgalteriya hisoboti uchun muhrlangan rasmiy **YUK XATI (НАКЛАДНАЯ) — LUXECORE (luxe-core.uz)** beriladi.\n\n### 5. 🚚 Toshkentda 2 Mln So'mdan Bepul Yetkazish\n\n- Toshkent shahri bo'ylab 2 000 000 so'mdan yuqori buyurtmalar **2 soat ichida eshigingizgacha mutlaqo bepul** yetkaziladi.\n- Viloyatlarga xavfsiz qadoqlangan holda 24 soatda jo'natiladi.\n- [Buyurtmani Kuzatish va Qayta Buyurtma Qilish](/uz/tracking) sahifasi orqali oldingi xaridlaringizni 1 tugma bilan takrorlashingiz mumkin.\n\n### 6. Foydali Bo'limlar:\n\n- [To'y va Sarpo Qutilari Bo'limi](/uz/category/toy-qutilari)\n- [Bayram va Sovg'a Qutilari Bo'limi](/uz/category/sovga-qutilari)\n- Sovg'a savdosi va marosimlarga hamroh bo'luvchi [Premium Kraft Qog'oz Stakanlari (250ml)](/uz/product/premium-kraft-qogoz-stakanlari-250ml-qopqoq-29) hamda [Bir martalik sous idishi (75x42 mm)](/uz/product/bir-martalik-sous-idishi-75x42-mm-220-dona-28).\n\nHoziroq [LUXECORE Ulgurji Katalogiga](/uz/catalog) kiring, Excel narxnomani yuklab oling va to'y mavsumi uchun eng xaridorgir qutilarni eng arzon narxda zaxiralang!",
      "ru": "В Узбекистане свадебные церемонии, помолвка, обряды сарпо и вручение подарков занимают особое место. В разгар свадебного сезона спрос на жесткие подарочные коробки на магнитах, наборы для сарпо из 3 штук и традиционные коробки с золотым тиснением возрастает многократно.\n\nОптовая база [LUXECORE (luxe-core.uz)](https://luxe-core.uz/uz) предлагает свадебные коробки для сарпо и подарочные Gift Box напрямую со склада рынка Урикзор в Ташкенте.\n\n### 1. Самые Ходовые Модели для Магазинов и Бутиков\n\n- **Премиальная Белая Коробка на Магните с Атласной Лентой:** Изготовлена из переплетного картона высокой плотности, крышка закрывается на неодимовый скрытый магнит. Идеальна для парфюмерии, ювелирных изделий, часов и сарпо.\n- **Свадебный Набор Коробок для Сарпо из 3 шт (S, M, L):** Три вложенные друг в друга коробки для одежды, тканей и обуви жениха и невесты.\n- **Коробка с Национальным Золотым Орнаментом:** Тиснение золотой фольгой, идеально подходит для свадебных патыров и восточных сладостей.\n- **Эко-крафт коробка с прозрачным окном:** Демонстрирует красоту вложенного подарка или набора.\n\n### 2. 3-Уровневая Система Оптовых Скидок (Маржинальность до 70%)\n\nПокупая оптом на LUXECORE по ценам первого поставщика, магазины получают наценку 50–70% в рознице.\n- **100 – 499 шт:** Базовая оптовая цена склада;\n- **500 – 999 шт:** Автоматическая скидка **-5%**;\n- **1 000+ шт:** Автоматическая **VIP-скидка -10%**.\n\n### 3. Удобная Фасовка Пачками (1x, 2x, 5x, 10x)\n\nКаждая партия защищена от замятий в транспортной заводской таре:\n- **1x пачка** — стартовый объем (30 или 50 шт);\n- **2x пачки** — 60–100 шт;\n- **5x пачек** — 150–250 шт;\n- **10x пачек** — от 300 шт по VIP-цене.\n\n### 4. 📥 Excel Прайс-Лист и 🖨 Официальная Накладная\n\n- В шапке [Каталога](/ru/catalog) скачивайте **Excel прайс-лист** со всеми размерами и фото в один клик.\n- Для юрлиц и ИП предоставляется официальная **НАКЛАДНАЯ — LUXECORE (luxe-core.uz)** со штампом.\n\n### 5. 🚚 Бесплатная Доставка от 2 Млн Сум за 2 Часа\n\n- Доставка заказов от 2 000 000 сум по Ташкенту — **бесплатно за 2 часа**.\n- По регионам Узбекистана — надежная доставка за 24 часа.\n- Повторить заказ можно в 1 клик на странице [Отслеживание Заказов](/ru/tracking).\n\n### 6. Популярные Разделы:\n\n- [Свадебные Коробки и Сарпо](/ru/category/toy-qutilari)\n- [Подарочные и Крафт Коробки](/ru/category/sovga-qutilari)\n- [Крафт стаканы 250 мл](/ru/product/nabor-kraft-stakanov-250ml-kryshka-29) и [Одноразовый соусник 75x42 мм](/ru/product/konteyner-dlya-sousa-odnorazovyy-75x42-mm-28).\n\nПереходите в [Каталог LUXECORE](/ru/catalog), скачивайте прайс-лист и заказывайте свадебные коробки для сарпо с максимальной выгодой!",
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

