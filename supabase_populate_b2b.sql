-- ========================================================
-- LUXECORE.UZ - 0 DAN TO'LDIRISH VA B2B ULQURJI STRATEGIYASI
-- Ushbu skript Supabase SQL Editor'da 1 marta ishga tushiriladi
-- ========================================================

-- 1. ESKI TEST TOVARLAR VA KATEGORIYALARNI TOZALASH
delete from public.products;
delete from public.categories;

-- Agar ID ketma-ketligi mavjud bo'lsa, uni 1 ga qaytarish
do $$
begin
  if exists (select 1 from pg_sequences where schemaname = 'public' and sequencename = 'products_id_seq') then
    alter sequence public.products_id_seq restart with 1;
  end if;
  if exists (select 1 from pg_sequences where schemaname = 'public' and sequencename = 'categories_id_seq') then
    alter sequence public.categories_id_seq restart with 1;
  end if;
end $$;

-- 2. 6 TA YANGI KATEGORIYANI KIRITISH
insert into public.categories (id, name, slug, image, description, "googleProductCategory")
values
(
  1,
  '{"uz":"Yangi Yil 2027 Qutilari","ru":"Новогодняя упаковка 2027","en":"New Year 2027 Boxes"}',
  '{"uz":"yangi-yil-2027","ru":"yangi-yil-2027","en":"yangi-yil-2027"}',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Yangi Yil 2027 bayram va bolalar shirinlik qutilari ulgurji narxlarda.","ru":"Новогодняя праздничная упаковка и детские коробки для сладостей по оптовым ценам.","en":"Holiday packaging and candy gift boxes for New Year 2027 at wholesale prices."}',
  'Home & Garden > Linens & Bedding > Holiday Ornaments'
),
(
  2,
  '{"uz":"To''y va Sarpo Qutilari","ru":"Свадебные коробки и сарпо","en":"Wedding & Sarpo Boxes"}',
  '{"uz":"toy-qutilari","ru":"toy-qutilari","en":"toy-qutilari"}',
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Kuyov-kelin sarpo to''plamlari, magnitli va atlas lentali premium qutilar.","ru":"Свадебные наборы для сарпо, премиальные коробки на магнитах и с атласными лентами.","en":"Wedding sarpo boxes, magnetic luxury gift boxes with satin ribbons."}',
  'Luggage & Bags > Boxes & Cases'
),
(
  3,
  '{"uz":"Bayram va Sovg''a Qutilari","ru":"Подарочные и крафт коробки","en":"Gift & Craft Boxes"}',
  '{"uz":"sovga-qutilari","ru":"sovga-qutilari","en":"sovga-qutilari"}',
  'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Atir, kosmetika, gullar va sovg''alar uchun oynali va qattiq karton qutilar.","ru":"Коробки для парфюмерии, косметики, цветов и сувениров.","en":"Gift boxes, craft packaging with clear window for perfumes and gifts."}',
  'Luggage & Bags > Gift Boxes'
),
(
  4,
  '{"uz":"Zip-Lock va Kraft Paketlar","ru":"Крафт и Zip-Lock пакеты","en":"Zip-Lock & Kraft Bags"}',
  '{"uz":"kraft-zip-paketlar","ru":"kraft-zip-paketlar","en":"kraft-zip-paketlar"}',
  'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Kiyim do''konlari va marketpleys sotuvchilari uchun matoviy zip-lock va tutqichli kraft paketlar.","ru":"Матовые пакеты Zip-Lock с клапаном и крафт-пакеты с ручками для одежды и маркетплейсов.","en":"Frosted Zip-Lock and paper kraft bags with handles for apparel and marketplaces."}',
  'Luggage & Bags > Shopping Totes & Paper Bags'
),
(
  5,
  '{"uz":"BOPP va Qadoqlash Paketlari","ru":"БОПП пакеты и упаковка","en":"BOPP & Packaging Materials"}',
  '{"uz":"bopp-paketlar","ru":"bopp-paketlar","en":"bopp-paketlar"}',
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Yelimli klapanli BOPP paketlar, qalin skotch va yuklar uchun strich-plyonkalar.","ru":"БОПП пакеты с клеевым клапаном, упаковочный скотч и стрейч-пленка.","en":"BOPP self-adhesive bags, packing tapes and stretch films."}',
  'Business & Industrial > Material Handling > Packaging Materials'
),
(
  6,
  '{"uz":"HoReCa va Xo''jalik Ulgurji","ru":"HoReCa и хозтовары оптом","en":"HoReCa & Wholesale Supplies"}',
  '{"uz":"horeca-xojalik","ru":"horeca-xojalik","en":"horeca-xojalik"}',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Kofe stakanlari, burger va fast-food qutilari, konteynerlar va xo''jalik mollari.","ru":"Двухслойные стаканы для кофе, крафт коробки для бургеров, контейнеры и хозтовары.","en":"Double wall coffee cups, burger boxes, food containers and kitchen essentials."}',
  'Home & Garden > Kitchen & Dining > Tableware'
);

-- Sequence ni to'g'rilash
select setval('categories_id_seq', coalesce((select max(id) from public.categories), 6));


-- 3. TOP-30 ULQURJI TOVARLARNI KIRITISH (STRATEGIYA BO'YICHA)

-- 3.1. 🎄 Yangi Yil 2027 Qutilari (5 ta)
insert into public.products (name, slug, price, category, "categoryId", image, description, stock, "itemsPerPackage", specifications, is_bestseller, is_premium)
values
(
  '{"uz":"Bolalar shirinlik qutisi \"Qor Bobo 2027\" (Tutqichli karton, 1 kg)","ru":"Детская новогодняя коробка \"Дед Мороз 2027\" (1 кг)","en":"Kids New Year Gift Box \"Santa 2027\" (1 kg)"}',
  '{"uz":"qor-bobo-2027","ru":"ded-moroz-2027","en":"santa-2027"}',
  2800,
  'yangi-yil-2027',
  1,
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Tutqichli baquvvat karton, 1 kg shirinlik sig''adi. O''rikzor omboridan 100 donadan boshlab ulgurji narxda.","ru":"Прочный картон с ручкой, вместимость 1 кг конфет. Оптом со склада от 100 шт.","en":"Sturdy carton with handle, holds 1 kg of sweets. Wholesale from 100 pcs."}',
  50000,
  100,
  '[{"label":"Material","value":"Qalin xrom-karton"},{"label":"Sig''imi","value":"1 kg shirinlik"},{"label":"Min. buyurtma","value":"100 dona"},{"label":"Yetkazib berish","value":"Toshkentda 2 soatda, viloyatga 1 kunda"}]'::jsonb,
  true,
  false
),
(
  '{"uz":"Bolalar shirinlik qutisi \"Archa\" (Katta hajm, 1.5 – 2 kg)","ru":"Детская новогодняя коробка \"Елочка\" (1.5 – 2 кг)","en":"Kids Gift Box \"Christmas Tree\" (1.5 - 2 kg)"}',
  '{"uz":"archa-qutisi-2027","ru":"elochka-2027","en":"tree-box-2027"}',
  4200,
  'yangi-yil-2027',
  1,
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Katta hajmli Yangi Yil archa shaklidagi shirinlik qutisi.","ru":"Объемная новогодняя коробка в форме елки.","en":"Large holiday box in tree shape."}',
  30000,
  100,
  '[{"label":"Material","value":"Laminatsiyali karton"},{"label":"Sig''imi","value":"1.5 - 2 kg"},{"label":"Min. buyurtma","value":"100 dona"}]'::jsonb,
  false,
  false
),
(
  '{"uz":"Korporativ VIP Yangi Yil qutisi (Qattiq karton, tilla lentali)","ru":"Корпоративная VIP новогодняя коробка с лентой","en":"Corporate VIP New Year Luxury Gift Box"}',
  '{"uz":"vip-yangi-yil-qutisi","ru":"vip-novogodnyaya-korobka","en":"vip-holiday-box"}',
  12000,
  'yangi-yil-2027',
  1,
  'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Qattiq muqovali, tilla lentali va maxsus folgali korporativ sovg''a qutisi.","ru":"Премиальная твердая коробка с золотистой лентой для подарков сотрудникам и партнерам.","en":"Hardcover luxury gift box with golden ribbon for corporate gifts."}',
  10000,
  50,
  '[{"label":"Material","value":"Qattiq pereplyot karton"},{"label":"O''lchami","value":"28x22x10 sm"},{"label":"Min. buyurtma","value":"50 dona"}]'::jsonb,
  true,
  true
),
(
  '{"uz":"Shaffof darchali Yangi Yil Kraft qutisi (Pishiriq va to''plamlar)","ru":"Крафт коробка с окошком для новогодних сладостей","en":"New Year Kraft Box with Clear Window"}',
  '{"uz":"darchali-yangi-yil-kraft","ru":"novogodniy-kraft-s-okoshkom","en":"new-year-kraft-window"}',
  4800,
  'yangi-yil-2027',
  1,
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Shaffof darchali eko kraft quti pirojniy, shirinlik va suvenirlar uchun.","ru":"Эко-крафт коробка с прозрачным окном для пряников и наборов.","en":"Eco craft box with window for pastries and gift sets."}',
  25000,
  100,
  '[{"label":"O''lchami","value":"20x20x8 sm"},{"label":"Darchasi","value":"Shaffof BOPP"},{"label":"Min. buyurtma","value":"100 dona"}]'::jsonb,
  false,
  false
),
(
  '{"uz":"Yangi Yil laminatsiyali sovg''a paketi (Ip tutqichli, M/L)","ru":"Ламинированный подарочный новогодний пакет","en":"Laminated New Year Gift Bag with Cord Handles"}',
  '{"uz":"yangi-yil-sovg-a-paketi","ru":"novogodniy-paket-laminat","en":"new-year-gift-bag"}',
  3200,
  'yangi-yil-2027',
  1,
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Mustahkam to''qilgan ipli, yorqin bayramona laminatsiyali paket.","ru":"Глянцевый ламинированный пакет с веревочными ручками.","en":"Glossy laminated gift bag with rope handles."}',
  40000,
  100,
  '[{"label":"O''lchami","value":"26x32x10 sm"},{"label":"Tutqichi","value":"Ipak ip"},{"label":"Min. buyurtma","value":"100 dona"}]'::jsonb,
  false,
  false
),

-- 3.2. 💍 To'y va Sarpo Qutilari (5 ta)
(
  '{"uz":"Magnitli Premium Oq Quti (Atlas lentali, 25x20x10 sm)","ru":"Премиальная белая коробка на магните с атласной лентой","en":"White Magnetic Luxury Gift Box with Satin Ribbon"}',
  '{"uz":"magnitli-oq-quti","ru":"belaya-korobka-magnit","en":"white-magnetic-box"}',
  14500,
  'toy-qutilari',
  2,
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"To''y va sarpo uchun atlas lentali, magnit qulfli premium sovg''a qutisi.","ru":"Свадебная премиум коробка на магнитной застежке.","en":"Luxury magnetic gift box with ribbon for weddings and sarpo."}',
  15000,
  50,
  '[{"label":"O''lchami","value":"25x20x10 sm"},{"label":"Xususiyati","value":"Magnit qulf, atlas lenta"},{"label":"Min. buyurtma","value":"50 dona"}]'::jsonb,
  true,
  true
),
(
  '{"uz":"Kuyov-Kelin Sarpo Qutilari 3 talik To''plami (S, M, L)","ru":"Набор коробок для сарпо из 3 шт (S, M, L)","en":"Set of 3 Sarpo Wedding Boxes (S, M, L)"}',
  '{"uz":"sarpo-qutilari-3-talik","ru":"nabor-sarpo-3sht","en":"sarpo-set-3pcs"}',
  32000,
  'toy-qutilari',
  2,
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Sarpo marosimlari uchun 3 xil o''lchamdagi qattiq karton qutilar to''plami.","ru":"Комплект из трех жестких коробок разного размера для свадебного сарпо.","en":"Set of 3 rigid nesting boxes for wedding gift sets."}',
  8000,
  30,
  '[{"label":"Tarkibi","value":"3 ta quti (S, M, L)"},{"label":"Material","value":"Qalin pereplyot karton"},{"label":"Min. buyurtma","value":"30 to''plam"}]'::jsonb,
  true,
  true
),
(
  '{"uz":"Milliy tilla naqshli To''y shirinlik/patir qutisi","ru":"Свадебная коробка с национальным золотым орнаментом","en":"Traditional Gold Ornament Wedding Sweets Box"}',
  '{"uz":"milliy-toy-qutisi","ru":"natsionalnaya-korobka-dlya-patira","en":"traditional-wedding-box"}',
  5500,
  'toy-qutilari',
  2,
  'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"To''y dasturxoni va sovchilarga patir, shirinlik solish uchun zar naqshli quti.","ru":"Коробка с золотым тиснением для восточных сладостей и патыра.","en":"Traditional gold embossed box for wedding breads and sweets."}',
  20000,
  100,
  '[{"label":"O''lchami","value":"28x28x7 sm"},{"label":"Bezagi","value":"Tilla folga naqsh"},{"label":"Min. buyurtma","value":"100 dona"}]'::jsonb,
  false,
  false
),
(
  '{"uz":"Qaymoqrang (Krem) qopqoqli qattiq sarpo qutisi (30x25x12 sm)","ru":"Кремовая жесткая коробка для сарпо с крышкой","en":"Cream Luxury Rigid Sarpo Box with Lid"}',
  '{"uz":"krem-sarpo-qutisi","ru":"kremovaya-korobka-sarpo","en":"cream-sarpo-box"}',
  16000,
  'toy-qutilari',
  2,
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Kiyim, matolar va qimmatbaho sarpo buyumlarini taxlash uchun baquvvat quti.","ru":"Вместительная презентабельная коробка для одежды и текстиля сарпо.","en":"Heavy duty presentation box for sarpo garments and fabrics."}',
  10000,
  50,
  '[{"label":"O''lchami","value":"30x25x12 sm"},{"label":"Rangi","value":"Krem / Qaymoqrang"},{"label":"Min. buyurtma","value":"50 dona"}]'::jsonb,
  false,
  true
),
(
  '{"uz":"To''y sovg''alari uchun tilla hoshiyali premium qog''oz paket","ru":"Свадебный подарочный пакет с золотой каймой","en":"Gold Border Luxury Wedding Paper Bag"}',
  '{"uz":"toy-tilla-hoshiyali-paket","ru":"svadebniy-paket-zolotaya-kayma","en":"gold-wedding-bag"}',
  3500,
  'toy-qutilari',
  2,
  'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"To''y va sarpo uchun nafis oq rangli, tilla hoshiyali qalin qog''oz paket.","ru":"Белый матовый пакет высокой плотности с золотой окантовкой.","en":"Elegant white bag with gold border and satin ribbon handles."}',
  30000,
  100,
  '[{"label":"O''lchami","value":"24x30x10 sm"},{"label":"Qog''oz","value":"210 gr qalin bo''r bo''yoqli"},{"label":"Min. buyurtma","value":"100 dona"}]'::jsonb,
  false,
  false
),

-- 3.3. 🎁 Bayram va Sovg'a Qutilari (5 ta)
(
  '{"uz":"Atir va kosmetika uchun vertikal lentali quti","ru":"Вертикальная коробка с лентой для духов и косметики","en":"Vertical Ribbon Box for Perfume & Cosmetics"}',
  '{"uz":"atir-uchun-vertikal-quti","ru":"korobka-dlya-dukhov","en":"perfume-box-ribbon"}',
  6500,
  'sovga-qutilari',
  3,
  'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Atirlar, kosmetika va aksessuarlar uchun mo''ljallangan vertikal sovg''a qutisi.","ru":"Компактная коробка для флаконов духов и косметических наборов.","en":"Vertical packaging box for perfume bottles and small gifts."}',
  25000,
  100,
  '[{"label":"O''lchami","value":"12x18x8 sm"},{"label":"Lenta","value":"Atlas lenta"},{"label":"Min. buyurtma","value":"100 dona"}]'::jsonb,
  true,
  false
),
(
  '{"uz":"Shaffof oynali Eko-Kraft quti (20x20x8 sm)","ru":"Эко-крафт коробка с прозрачным окном (20x20x8 см)","en":"Eco-Kraft Box with Clear Window (20x20x8 cm)"}',
  '{"uz":"eko-kraft-oynali-quti","ru":"eko-kraft-s-oknom","en":"eco-kraft-window-box"}',
  4500,
  'sovga-qutilari',
  3,
  'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Sovg''alar, gullar, shirinlik va kosmetika to''plamlari uchun ommabop darchali quti.","ru":"Универсальная коробка для сладостей, подарков и сувениров.","en":"Clear window box for gifts, pastries and soaps."}',
  40000,
  100,
  '[{"label":"O''lchami","value":"20x20x8 sm"},{"label":"Material","value":"Eko kraft 300 gr"},{"label":"Min. buyurtma","value":"100 dona"}]'::jsonb,
  true,
  false
),
(
  '{"uz":"Soat va taqinchoqlar uchun yostiqchali mini quti","ru":"Мини-коробка с подушечкой для часов и украшений","en":"Mini Jewelry & Watch Box with Pillow Cushion"}',
  '{"uz":"soat-yostiqchali-mini-quti","ru":"korobka-dlya-chasov-podushka","en":"jewelry-watch-box"}',
  5000,
  'sovga-qutilari',
  3,
  'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Qo''l soatlari, bilaguzuk va zargarlik buyumlari uchun yumshoq yostiqchali quti.","ru":"Жесткая коробочка с бархатной подушечкой внутри.","en":"Hard box with soft cushion for watches and bracelets."}',
  20000,
  100,
  '[{"label":"O''lchami","value":"9x9x6 sm"},{"label":"Ichki qismi","value":"Maxsus yumshoq yostiqcha"},{"label":"Min. buyurtma","value":"100 dona"}]'::jsonb,
  false,
  false
),
(
  '{"uz":"Dumaloq (Silindr) gul va sovg''a qutisi","ru":"Круглая коробка-тубус (шляпная) для цветов и подарков","en":"Round Hat Box Cylinder for Flowers and Gifts"}',
  '{"uz":"dumaloq-silindr-quti","ru":"kruglaya-korobka-shlyapnaya","en":"round-hat-box"}',
  18000,
  'sovga-qutilari',
  3,
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Gul do''konlari va eksklyuziv sovg''alar uchun qalin qopqoqli silindr quti.","ru":"Плотная цилиндрическая шляпная коробка для флористики.","en":"Rigid round cylinder box for luxury bouquets and items."}',
  6000,
  30,
  '[{"label":"Diametri","value":"20 sm"},{"label":"Balandligi","value":"22 sm"},{"label":"Min. buyurtma","value":"30 dona"}]'::jsonb,
  false,
  true
),
(
  '{"uz":"Quti ichiga solinadigan dekorativ qog''oz to''ldiruvchi (Tishyu/Strujka)","ru":"Бумажный наполнитель для коробок (стружка / тишью)","en":"Decorative Crinkled Paper Filler for Gift Boxes"}',
  '{"uz":"dekorativ-qog-oz-toldiruvchi","ru":"bumajniy-napolnitel-strujka","en":"paper-shred-filler"}',
  15000,
  'sovga-qutilari',
  3,
  'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Sovg''alarni quti ichida chiroyli saqlash va sinishdan himoya qilish uchun rangli qog''oz qirindisi (1 kg qadoq).","ru":"Цветная гофрированная стружка для заполнения подарочных коробок (пачка 1 кг).","en":"Crinkle paper shred filler for hampers and presentation (1 kg pack)."}',
  5000,
  1,
  '[{"label":"Vazni","value":"1 kg qadoqda"},{"label":"Ranglari","value":"Krem, Qora, Qizil, Jigarrang"},{"label":"Min. buyurtma","value":"1 qadoq"}]'::jsonb,
  false,
  false
),

-- 3.4. 🛍 Zip-Lock va Kraft Paketlar (5 ta)
(
  '{"uz":"Burama qog''oz tutqichli Qo''ng''ir Kraft paket (25x32x11 sm)","ru":"Бумажный крафт-пакет с кручеными ручками (25x32x11 см)","en":"Brown Kraft Paper Bag with Twisted Handles (25x32x11 cm)"}',
  '{"uz":"burama-tutqichli-kraft-paket","ru":"kraft-paket-kruchenie-ruchki","en":"twisted-handle-kraft-bag"}',
  1800,
  'kraft-zip-paketlar',
  4,
  'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Kiyim do''konlari, butiklar va yetkazib berish xizmatlari uchun baquvvat kraft paket.","ru":"Экологичный крафт-пакет с прочными витыми ручками.","en":"Eco-friendly kraft shopping bag with sturdy handles."}',
  100000,
  100,
  '[{"label":"O''lchami","value":"25x32x11 sm"},{"label":"Qalinligi","value":"80 gr/m2"},{"label":"Min. buyurtma","value":"100 dona (1 pachka)"}]'::jsonb,
  true,
  false
),
(
  '{"uz":"Oq Kraft paket (Butik va sovg''a do''konlari uchun, 25x32x11 sm)","ru":"Белый крафт-пакет с витыми ручками (25x32x11 см)","en":"White Kraft Paper Bag with Twisted Handles (25x32x11 cm)"}',
  '{"uz":"oq-kraft-paket","ru":"beliy-kraft-paket","en":"white-kraft-bag"}',
  2200,
  'kraft-zip-paketlar',
  4,
  'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Nafis oq rangli, brend logotipini bosish uchun ideal toza kraft qog''oz paket.","ru":"Презентабельный белый крафт-пакет под нанесение логотипа.","en":"Pure white paper kraft bag ideal for custom branding."}',
  80000,
  100,
  '[{"label":"O''lchami","value":"25x32x11 sm"},{"label":"Qog''oz","value":"Oqargan kraft 90 gr"},{"label":"Min. buyurtma","value":"100 dona"}]'::jsonb,
  false,
  false
),
(
  '{"uz":"Matoviy Zip-Lock paket havo klapani bilan (Kiyim uchun, 30x40 sm)","ru":"Матовый пакет Zip-Lock с клапаном для одежды (30x40 см)","en":"Frosted Matte Zip-Lock Bag with Air Valve (30x40 cm)"}',
  '{"uz":"matoviy-zip-lock-klapanli","ru":"matoviy-zip-lock-klapan","en":"matte-ziplock-valve"}',
  950,
  'kraft-zip-paketlar',
  4,
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Kiyim, trikotaj va marketpleys savdosi (Uzum, WB) uchun havo chiqaruvchi klapanli matoviy paket.","ru":"Премиум полупрозрачный матовый зип-пакет для текстиля.","en":"Frosted matte zip bag with air hole for clothing brands."}',
  150000,
  100,
  '[{"label":"O''lchami","value":"30x40 sm"},{"label":"Qalinligi","value":"140 mkm (ikki qavat)"},{"label":"Min. buyurtma","value":"100 dona (1 pachka)"}]'::jsonb,
  true,
  true
),
(
  '{"uz":"Shaffof yugurdakli (begunokli) Zip-Lock paket (25x35 sm)","ru":"Прозрачный пакет с бегунком Zip-Lock (25x35 см)","en":"Clear Slider Zip-Lock Bag (25x35 cm)"}',
  '{"uz":"begunokli-zip-lock-paket","ru":"paket-s-begunkom-zip","en":"slider-ziplock-bag"}',
  850,
  'kraft-zip-paketlar',
  4,
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Oson ochilib yopiladigan plastik begunokli qadoqlash paketi.","ru":"Пакет с замком-слайдером для обуви, белья и косметики.","en":"Clear packaging bag with smooth plastic zipper slider."}',
  100000,
  100,
  '[{"label":"O''lchami","value":"25x35 sm"},{"label":"Qulfi","value":"Plastik begunok"},{"label":"Min. buyurtma","value":"100 dona"}]'::jsonb,
  false,
  false
),
(
  '{"uz":"Yelimli kuryer paketi (Uzum/Wildberries uchun, 30x40 sm)","ru":"Курьерский пакет с клеевой лентой (30x40 см)","en":"Courier Poly Mailer Bag Self-Seal (30x40 cm)"}',
  '{"uz":"yelimli-kuryer-paketi","ru":"kuryerskiy-paket-30x40","en":"poly-mailer-courier-bag"}',
  650,
  'kraft-zip-paketlar',
  4,
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Ochilganda yirtiladigan xavfsiz yelimli, qora ichki qatlamli kuryer paketi.","ru":"Сейф-пакет для посылок с черным непрозрачным внутренним слоем.","en":"Tamper-evident poly mailer bag with permanent adhesive."}',
  200000,
  100,
  '[{"label":"O''lchami","value":"30x40 sm"},{"label":"Himoyasi","value":"Ko''rinmas qora ichki qatlam"},{"label":"Min. buyurtma","value":"100 dona"}]'::jsonb,
  true,
  false
),

-- 3.5. ✨ BOPP va Qadoqlash Paketlari (5 ta)
(
  '{"uz":"Yelimli klapanli BOPP paket (10x15 sm — suvenir/aksessuar)","ru":"БОПП пакет с клейкой лентой (10x15 см)","en":"BOPP Self-Adhesive Bag (10x15 cm)"}',
  '{"uz":"bopp-paket-10x15","ru":"bopp-paket-10x15","en":"bopp-bag-10x15"}',
  65,
  'bopp-paketlar',
  5,
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Taqinchoqlar, paypoqlar va kichik suvenirlar uchun yaltiroq yelimli BOPP paket.","ru":"Прозрачные полипропиленовые пакетики для бижутерии и аксессуаров.","en":"Glossy peel and seal BOPP bags for jewelry and small goods."}',
  500000,
  1000,
  '[{"label":"O''lchami","value":"10x15 sm"},{"label":"Qalinligi","value":"25 mkm"},{"label":"Min. buyurtma","value":"1000 dona (1 pachka)"}]'::jsonb,
  false,
  false
),
(
  '{"uz":"Yelimli BOPP paket (20x30 sm — shirinlik va trikotaj)","ru":"БОПП пакет с клейкой лентой (20x30 см)","en":"BOPP Self-Adhesive Bag (20x30 cm)"}',
  '{"uz":"bopp-paket-20x30","ru":"bopp-paket-20x30","en":"bopp-bag-20x30"}',
  180,
  'bopp-paketlar',
  5,
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Futbolkalar, shirinliklar va non mahsulotlarini qadoqlash uchun toza shaffof paket.","ru":"Упаковочные прозрачные пакеты для трикотажа и кондитерских изделий.","en":"High clarity poly bags for bakery and apparel."}',
  300000,
  500,
  '[{"label":"O''lchami","value":"20x30 sm"},{"label":"Qalinligi","value":"25 mkm"},{"label":"Min. buyurtma","value":"500 dona (1 pachka)"}]'::jsonb,
  true,
  false
),
(
  '{"uz":"Yelimli BOPP paket (30x40 sm — ko''ylak va tekstil)","ru":"БОПП пакет с клейкой лентой (30x40 см)","en":"BOPP Self-Adhesive Bag (30x40 cm)"}',
  '{"uz":"bopp-paket-30x40","ru":"bopp-paket-30x40","en":"bopp-bag-30x40"}',
  320,
  'bopp-paketlar',
  5,
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Ko''ylak, kostyum va kattaroq tekstil mahsulotlari uchun yaltiroq himoya paketi.","ru":"БОПП пакет большого размера для одежды и рубашек.","en":"Large clear apparel packaging bag."}',
  250000,
  500,
  '[{"label":"O''lchami","value":"30x40 sm"},{"label":"Qalinligi","value":"30 mkm"},{"label":"Min. buyurtma","value":"500 dona"}]'::jsonb,
  false,
  false
),
(
  '{"uz":"Qalin qadoqlash skotchi (Shaffof / Jigarrang, 45 mm x 100 m)","ru":"Скотч упаковочный усиленный (45 мм x 100 м)","en":"Heavy Duty Packing Tape (45 mm x 100 m)"}',
  '{"uz":"qadoqlash-skotchi","ru":"upakovochniy-skotch","en":"packing-tape"}',
  8500,
  'bopp-paketlar',
  5,
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Qutilarni mustahkam yopishtirish uchun yopishqoqligi yuqori qalin skotch.","ru":"Высококлейкая липкая лента для картонных коробок.","en":"Strong adhesive carton sealing tape."}',
  50000,
  6,
  '[{"label":"Kengligi","value":"45 mm"},{"label":"Uzunligi","value":"100 metr"},{"label":"Min. buyurtma","value":"6 dona (1 blok)"}]'::jsonb,
  false,
  false
),
(
  '{"uz":"Ombor va yuklar uchun Strich-plyonka (50 sm, 2 kg)","ru":"Стрейч-пленка для паллет и грузов (50 см, 2 кг)","en":"Warehouse Pallet Stretch Film Wrap (50 cm, 2 kg)"}',
  '{"uz":"strich-plyonka-2kg","ru":"streych-plenka-2kg","en":"stretch-film-wrap"}',
  42000,
  'bopp-paketlar',
  5,
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Yuklarni chang va namlikdan himoyalovchi, mustahkam cho''ziluvchan birlamchi strich.","ru":"Первичная эластичная пленка для упаковки и транспортировки грузов.","en":"Clear primary stretch film for cargo wrapping and pallets."}',
  10000,
  1,
  '[{"label":"Kengligi","value":"50 sm"},{"label":"Og''irligi","value":"2 kg (netto)"},{"label":"Min. buyurtma","value":"1 rulon"}]'::jsonb,
  false,
  false
),

-- 3.6. ☕ HoReCa va Xo'jalik Ulgurji (5 ta)
(
  '{"uz":"Ikki qavatli (Double Wall) kofe stakani (250 ml / 350 ml + qopqoq)","ru":"Двухслойный крафт стакан для кофе с крышкой","en":"Double Wall Kraft Coffee Cup with Lid"}',
  '{"uz":"double-wall-kofe-stakani","ru":"dvuhsloyniy-stakan-kofe","en":"double-wall-coffee-cup"}',
  750,
  'horeca-xojalik',
  6,
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Qo''lni kuydirmaydigan ikki qavatli kraft stakan + qora qopqog''i bilan.","ru":"Термостойкие двухслойные стаканчики для горячих напитков с крышкой.","en":"Heat-insulating double wall craft cup with lid."}',
  100000,
  500,
  '[{"label":"Hajmi","value":"250 ml va 350 ml"},{"label":"To''plam","value":"Stakan + Qopqoq"},{"label":"Min. buyurtma","value":"500 dona"}]'::jsonb,
  true,
  false
),
(
  '{"uz":"Burger va Fast-Food uchun yog'' o''tkazmaydigan kraft quti","ru":"Крафт-бокс для бургеров жиростойкий","en":"Greaseproof Kraft Burger Box"}',
  '{"uz":"kraft-burger-qutisi","ru":"kraft-boks-burger","en":"burger-box-kraft"}',
  850,
  'horeca-xojalik',
  6,
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Ichki qoplami yog'' o''tkazmaydigan ekologik toza burger va fast-food qutisi.","ru":"Жиростойкая самосборная упаковка для бургеров и закусок.","en":"Grease-resistant disposable kraft burger box."}',
  80000,
  500,
  '[{"label":"O''lchami","value":"12x12x10 sm"},{"label":"Qoplamasi","value":"Yog'' o''tkazmaydigan eko laminat"},{"label":"Min. buyurtma","value":"500 dona"}]'::jsonb,
  false,
  false
),
(
  '{"uz":"Issiq taomlar uchun qopqoqli qora konteyner (750 ml)","ru":"Черный одноразовый контейнер для горячих блюд (750 мл)","en":"Black Microwave Safe Food Container with Lid (750 ml)"}',
  '{"uz":"qora-ovqat-konteyneri-750ml","ru":"konteyner-dlya-edy-750ml","en":"black-food-container-750ml"}',
  1100,
  'horeca-xojalik',
  6,
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Yetkazib berish xizmatlari va oshxonalar uchun mikroto''lqinli pechga chidamli konteyner.","ru":"Герметичный ланч-бокс с прозрачной крышкой для доставки еды.","en":"Leakproof microwaveable meal prep food container with clear lid."}',
  60000,
  300,
  '[{"label":"Hajmi","value":"750 ml"},{"label":"Xususiyati","value":"Mikroto''lqinli pechga chidamli"},{"label":"Min. buyurtma","value":"300 dona"}]'::jsonb,
  false,
  false
),
(
  '{"uz":"Qora nitril qo''lqoplar (Oshxona va qandolatchilar uchun, M/L)","ru":"Черные нитриловые перчатки (100 шт)","en":"Black Disposable Nitrile Gloves (Box of 100)"}',
  '{"uz":"qora-nitril-qolqop","ru":"chernie-nitrilovie-perchatki","en":"black-nitrile-gloves"}',
  38000,
  'horeca-xojalik',
  6,
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Oshpazlar, barmenlar va go''zallik ustalari uchun yuqori sezuvchanlikka ega mustahkam qo''lqop.","ru":"Прочные неопудренные черные перчатки для общепита и клининга.","en":"Heavy duty powder-free black nitrile examination gloves."}',
  10000,
  1,
  '[{"label":"Qadoqda","value":"100 dona (50 juft)"},{"label":"O''lchami","value":"M va L"},{"label":"Min. buyurtma","value":"1 quti"}]'::jsonb,
  false,
  false
),
(
  '{"uz":"Mustahkam chiqindi (musor) paketlari (120 L / 200 L)","ru":"Пакеты для мусора особо прочные (120 л / 200 л)","en":"Heavy Duty Refuse Garbage Bags (120 L / 200 L)"}',
  '{"uz":"mustahkam-musor-paketi","ru":"paketi-dlya-musora-120l","en":"garbage-bags-120l"}',
  11500,
  'horeca-xojalik',
  6,
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1000&auto=format&fit=crop',
  '{"uz":"Restoran, kafe va omborlar uchun qalin, yirtilmaydigan yirik musor paketlari.","ru":"Плотные черные мешки для строительного и ресторанного мусора.","en":"Heavy duty black waste sack liners for restaurants and warehouses."}',
  20000,
  20,
  '[{"label":"Hajmi","value":"120 L (rulonda 10 dona)"},{"label":"Qalinligi","value":"40 mkm mustahkam"},{"label":"Min. buyurtma","value":"20 rulon (1 qadoq)"}]'::jsonb,
  false,
  false
);

-- 4. BOSH SAHIFA HERO CONTENTNI HAM YANGILASH
update public.hero_content
set
  badge = '{"uz":"Ulgurji Savdo","ru":"Оптовая торговля","en":"Wholesale"}',
  title = '{"uz":"Sovg''a qutilari, Paketlar va Qadoqlash — Ulgurji Narxda","ru":"Подарочные коробки, пакеты и упаковка — По оптовым ценам","en":"Gift Boxes, Bags and Packaging Supplies — Wholesale Prices"}',
  description = '{"uz":"To''y, Bayram va Yangi Yil 2027 qutilari, Zip-Lock, Kraft va BOPP paketlar. O''rikzor omboridan 100 donadan boshlab 1 kunda yetkazib beramiz.","ru":"Новогодняя упаковка 2027, свадебные коробки, Zip-Lock и крафт пакеты со склада Урикзор.","en":"New Year 2027 holiday boxes, wedding boxes, and packaging bags directly from warehouse."}',
  "buttonText" = '{"uz":"Katalogga o''tish","ru":"В каталог","en":"View Catalog"}'
where id = 'main';
