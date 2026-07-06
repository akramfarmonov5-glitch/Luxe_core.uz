# Supabase'ga real mahsulot kiritish yo'riqnomasi

## Hozirgi holat (2026-07-06 tekshiruvi)

| Jadval | Holat |
|---|---|
| `products` | **0 ta yozuv — bo'sh!** Sayt shuning uchun mock ko'rsatyapti |
| `categories` | 1 ta: "Sovg'a qutilari (gift box)" |
| `hero_content` | Bor, lekin sarlavhada **"Local Test"** yozuvi qolgan |
| `blog_posts` | 1 ta |

## 1-qadam. Admin panelga kirish

Sayt: `https://luxe-core-uz-three.vercel.app/uz/admin`

Agar admin login yo'q bo'lsa:
1. Supabase Dashboard → **Authentication → Users → Add user** (email + parol)
2. **SQL Editor** da:
   ```sql
   insert into public.admin_users (user_id)
   values ('YARATILGAN_USER_UUID');
   ```

## 2-qadam. Kategoriyalarni to'ldirish

Admin → **Kategoriyalar**. Har biriga:
- Nom (uz/ru/en uchala tilda!)
- Slug (bo'sh qoldirsangiz avtomatik)
- Rasm — **Cloudinary yuklash tavsiya etiladi** (tezroq); istalgan https URL ham ishlaydi

## 3-qadam. Mahsulotlar qo'shish

Admin → **Mahsulotlar → Qo'shish**. Har mahsulotga:
- **Nom** — 3 tilda (SEO uchun muhim)
- **Narx** — faqat raqam, so'mda (masalan `750000`)
- **Kategoriya** — ro'yxatdan tanlang
- **Rasmlar** — kamida 1 ta sifatli rasm; birinchisi asosiy bo'ladi
- **Stock** — ombordagi soni (0 = "sotuvda yo'q" ko'rinadi)
- **Tavsif** — 3 tilda, 2-3 gap
- **Premium / Bestseller** belgilari — bosh sahifadagi nishonlar

Eslatma: minimal buyurtma 500 000 so'm bo'lgani uchun narxlar shunga mos bo'lsin
(yoki `lib/checkout.server.ts` dagi `MIN_ORDER_AMOUNT` ni o'zgartiring).

## 4-qadam. Hero'dagi "Local Test"ni tuzatish

Admin → **Hero** bo'limida sarlavhani tahrirlang, yoki SQL Editor'da:
```sql
update public.hero_content
set title = '{"uz":"Premium tanlovlar","ru":"Премиум подборки","en":"Premium picks"}'
where id = 'main';
```

## Agar mahsulot saqlashda xato chiqsa

Kategoriya ID'si bazada matn (`cat_...`) formatida — bu eski sxemadan qolgan.
Agar mahsulot saqlaganda `null value in column "id"` xatosi chiqsa, SQL Editor'da tekshiring:

```sql
select column_name, data_type, column_default
from information_schema.columns
where table_schema = 'public' and table_name = 'products' and column_name = 'id';
```

- Agar `data_type = bigint` va `column_default` bo'sh bo'lsa:
  ```sql
  create sequence if not exists products_id_seq owned by public.products.id;
  select setval('products_id_seq', coalesce((select max(id) from public.products), 1000));
  alter table public.products alter column id set default nextval('products_id_seq');
  ```
- Agar `data_type = text` bo'lsa — bu checkout'ni buzadi (ID raqam bo'lishi kerak), menga xabar bering.

## 5-qadam. Tekshirish

1. Saytni oching — real mahsulotlar ko'rinishi kerak
2. Bitta test-buyurtma bering (naqd usulda) va admin panelda ko'rinishini tekshiring
3. Hammasi joyida bo'lsa — yangi kodni deploy qilamiz (`feature/performance-and-trust` branch)

**Muhim tartib:** avval mahsulotlar kiritiladi → keyin yangi kod deploy qilinadi.
Yangi kodda mock fallback yo'q: bo'sh baza = bo'sh vitrina.
