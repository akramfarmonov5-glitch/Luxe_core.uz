# 📊 LUXECORE.UZ — To'liq Texnik, B2B va SEO Audit Xulosasi

**Sana:** 2026-yil  
**Domen:** [https://luxe-core.uz](https://luxe-core.uz)  
**Telegram Bot (Render):** `https://luxe-core-uzluxecore-bot.onrender.com/health` (`v2.3.1`, `status: ok`)  
**Yo'nalish:** Ulgurji (Optom / B2B) Sovg'a qutilari, Yangi Yil 2027 qadoqlari, To'y va Sarpo qutilari, Kraft / Zip-Lock / BOPP paketlar hamda Bir martalik idishlar (Toshkent, O'rikzor ombori).

---

## 1. Infratuzilma va Serverlar Holati (100% Faol)

| Tizim qismi | Manzil / Xizmat | Texnik holat | Natija |
| :--- | :--- | :--- | :--- |
| **Veb-sayt (Frontend & API)** | Vercel (`Next.js 16` + `React 18`) | `HTTP 200 OK` | `tsc --noEmit`: **0 xato** |
| **Telegram Bot** | Render (`Grammy` + `TypeScript`) | `HTTP 200 OK` (`v2.3.1`) | `tsc`: **0 xato** |
| **Ma'lumotlar bazasi** | Supabase (`PostgreSQL` + `RLS`) | Jonli ulangan | 6 ta B2B kategoriya, 30 ta ulgurji tovar |
| **Media Server** | Cloudinary | Faol | Admin paneldan rasm yuklash ulangan |
| **AI Maslahatchi** | Google Gemini API (`2.5-flash`) | Saytda va Botda faol | Bazadagi real tovar va narxlar bilan ishlaydi |

---

## 2. B2B (Ulgurji / Optom) Savdo Mexanizmi

1. **Pachka va Karrali Savdo (`itemsPerPackage`):**
   - Har bir mahsulot o'z qadog'i (`12, 30, 50, 100, 500 dona`) bo'yicha savatga qo'shiladi.
   - Tovar sahifasida va Tezkor xarid oynasida **`1x`, `2x`, `5x`, `10x` pachka** (masalan, `12, 24, 60, 120 dona`) tezkor tanlash tugmalari mavjud.
   - Telegram botda ham har bir mahsulot tagida **`🛒 +1x`**, **`📦 +5x`**, **`📦 +10x`** pachkalab savatga qo'shish tugmalari ishlaydi.
2. **3 Pog'onali Avtomatik Ulgurji Chegirma (`getWholesaleUnitPrice`):**
   - **`100–499 dona`** — bazaviy ulgurji narx;
   - **`500–999 dona`** — avtomatik **`-5%`** chegirma;
   - **`1000+ dona`** — avtomatik **`-10%` VIP ulgurji** chegirma.
   - Savatchada (`CartSidebar.tsx`) keyingi chegirma pog'onasigacha nechta dona qolganini ko'rsatuvchi motivatsion indikator va tejalgan summa (`🔥 Ulgurji chegirma`) ko'rsatiladi.
3. **1-Bosishda Excel Prays-list (`FeaturedProducts.tsx`):**
   - Katalog tepasidagi **`📥 Prays-list (Excel)`** tugmasi barcha tovarlarni 3 pog'onali narxlari va minimal pachka soni bilan `.csv` (Excel) formatda yuklab beradi.
4. **Doimiy Mijozlar uchun "🔄 Shu buyurtmani takrorlash" (`OrderTracker.tsx`):**
   - `/tracking` sahifasida mijoz avvalgi buyurtmasini 1 bosishda qayta savatga joylashi mumkin.

---

## 3. Admin Panel, Ombor va CRM Tizimi (`/uz/admin`)

1. **🖨 Yuk xati / Chek chiqarish (`AdminOrders.tsx`):**
   - Har bir buyurtma qatorida **`👁` (Ko'rish)** va **`🖨 Yuk xati`** tugmalari bor — 1 bosishda A4 formatdagi rasmiy **YUK XATI (НАКЛАДНАЯ) — LUXECORE.UZ** (ombor va mijoz imzo joylari bilan) chop etiladi yoki PDF saqlanadi.
2. **📢 1-Bosishda Telegram Kanalga Post (`AdminProducts.tsx`, `AdminBlog.tsx`):**
   - Mahsulotlar va Blog maqolalarini Admin paneldan chiqmasdan `@luxecoreuz` kanaliga rasm va xarid tugmalari bilan yuborish.
3. **Yagona CRM va Marketing (`AdminLeads.tsx`, `AdminPush.tsx`):**
   - Sayt va Bot mijozlari bitta jadvalda jamlangan + **📥 CSV (Excel) yuklab olish**.
   - Promo-kod yaratish va bir vaqtning o'zida Kanal + Bot mijozlari + Web Push obunachilariga xabarnoma yuborish.

---

## 4. SEO va Qidiruv Tizimlari Auditi (Google & Yandex)

1. **SEO-Friendly URL (`lib/slugify.ts`):**
   - Barcha mahsulot va maqola linklari kalit so'zli slug formatiga o'tkazilgan:
     - UZ: `/uz/product/archa-qutisi-2027-2`
     - RU: `/ru/product/elochka-2027-2`
   - Kirill harflari avtomatik lotinga transliteratsiya qilinadi, eski `/uz/product/2` linklar avtomatik SEO-slug'ga yo'naltiriladi.
2. **Semantik HTML va Ichki Linklar:**
   - `ProductCard`, `CategoryGrid`, `BlogGrid` komponentlarida haqiqiy `<Link href="...">` (`<a>`) teglar va kategoriya sahifalarida SSR mahsulot ro'yxati (`<nav class="sr-only">`) mavjud.
3. **Schema.org JSON-LD Mikrobelgilari:**
   - Bosh sahifada: `WebSite`, `Organization`, `WholesaleStore` (Toshkent, O'rikzor manzili), `FAQPage` (Ulgurji savol-javoblar).
   - Kategoriya sahifalarida: `CollectionPage`, `ItemList`, `BreadcrumbList`.
   - Mahsulot sahifalarida: `Product`, `Offer`, `AggregateRating`.
4. **Kalit so'zlar qamrovi (`uz` / `ru` / `en`):**
   - `optom`, `paketlar`, `qadoqlash`, `bir martalik idishlar`, `odnorazoviy idishlar`, `yangi yil uchun`, `2027 yil`, `sovg'a qutilari optom`, `to'y va sarpo qutilari`, `kraft paket`, `zip lock paket`, `O'rikzor optom` kalit so'zlari Meta teglar va sahifa matnlariga singdirilgan.
5. **Indeksatsiya fayllari:**
   - `https://luxe-core.uz/sitemap.xml` — `HTTP 200 OK`
   - `https://luxe-core.uz/catalog.xml` — `HTTP 200 OK`
   - `https://luxe-core.uz/robots.txt` — `HTTP 200 OK`
   - `https://luxe-core.uz/yandex_c60e9863ba102b04.html` — `HTTP 200 OK` (Yandex Webmaster tasdiqlangan).

---

## 5. Loyiha Egasi (Admin) Qiladigan Kundalik Amaliy Qadamlar

1. **Haqiqiy mahsulot rasmlarini yuklash:** `luxe-core.uz/uz/admin` → **Mahsulotlar** bo'limidan vaqtinchalik Unsplash rasmlarni ombordagi real mahsulot rasmlariga almashtirish.
2. **Kanalga chiqarish:** Rasmi yangilangan mahsulotlar yonidagi **`📢 Kanalga`** tugmasini bosib `@luxecoreuz` kanaliga chiqarish.
3. **Google Search Console & Yandex Webmaster:** Ikkala panelda `https://luxe-core.uz/sitemap.xml` faylini yuborib qo'yish.


---

## 6. Supabase B2B SEO Maqolalari (Jonli Bazaga Joylandi)

Supabase `blog_posts` jadvaliga Google va Yandex qidiruv tizimlaridan to'g'ridan-to'g'ri ulgurji xaridorlarni jalb qiluvchi **4 ta yangi sotuvchi B2B SEO-maqola** (O'zbek va Rus tillarida) to'liq kiritildi va avtomatlashtirildi:

| ID | Maqola Sarlavhasi | SEO-Slug | Asosiy Kalit So'zlar |
| :--- | :--- | :--- | :--- |
| **#26** | **Yangi yil 2027 sovg'a qutilari optom (ulgurji)** | `yangi-yil-2027-sovga-qutilari-optom-ulgurji-narxlar` | `yangi yil 2027`, `sovg'a qutilari optom`, `O'rikzor ulgurji narxlar` |
| **#27** | **Kraft, Zip-Lock va BOPP paketlar optom Toshkentda** | `kraft-zip-lock-va-bopp-paketlar-optom-toshkent` | `kraft paket optom`, `zip lock paket toshkent`, `uzum market qadoqlash` |
| **#28** | **Bir martalik idishlar va konteynerlar O'rikzor optom narxlarida** | `bir-martalik-odnorazoviy-idishlar-optom-orikzor-narxlari` | `bir martalik idishlar optom`, `odnorazoviy idishlar`, `kafe dostavka qadoqlari` |
| **#29** | **To'y va sarpo qutilari hamda premium Gift Box'lar ulgurji** | `toy-va-sarpo-qutilari-sovga-qutilari-optom` | `to'y qutilari optom`, `sarpo qutilari ulgurji`, `gift box toshkent` |

### Har bir maqola ichiga singdirilgan B2B Savdo Standartlari:
1. **3 Pog'onali Ulgurji Chegirma:** `100–499 dona` (bazaviy), `500–999 dona` (**-5%**), `1000+ dona` (**-10% VIP chegirma**).
2. **Pachkalab Tezkor Xarid:** `1x`, `2x`, `5x`, `10x` pachka tanlash imkoniyati.
3. **📥 Excel Prays-List:** Katalog tepasidagi tugma orqali 1-bosishda narxlarni yuklab olish.
4. **🖨 Rasmiy Yuk Xati (Накладная):** Yuridik shaxslar, korxona va do'konlar uchun muhr va imzo bilan rasmiy hujjat berilishi.
5. **🚚 2 Mln So'mdan Bepul Yetkazish:** Toshkentda 2 soat ichida bepul, viloyatlarga 24 soatda jo'natish.
6. **Ichki SEO Havolalar:** `/uz/catalog`, `/uz/tracking`, barcha 6 ta kategoriya va bazadagi real mahsulotlar (`/uz/product/bir-martalik-sous-idishi-75x42-mm-220-dona-28`, `/uz/product/premium-kraft-qogoz-stakanlari-250ml-qopqoq-29`) bilan bog'langan.
7. **Interaktiv Markdown Renderer:** `BlogPostDetail.tsx` komponentida sarlavhalar, ro'yxatlar va havolalar bosiladigan oltin rangli linklar sifatida chiroyli vizual ko'rinishga keltirildi.
