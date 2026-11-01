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
