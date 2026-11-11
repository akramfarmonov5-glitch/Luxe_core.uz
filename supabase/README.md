# Supabase sxemasi — yagona manba qoidasi

## Muammo (hozirgi holat)

Loyiha ildizida bir nechta SQL fayl bor va ularning mazmuni bir-birini takrorlaydi:

| Fayl | Vazifasi | Holati |
|---|---|---|
| `supabase_schema.sql` | Boshlang'ich to'liq sxema + RLS | **Tarixiy** (endi o'zgartirilmaydi) |
| `supabase_fix_tables.sql` | Sxemani tuzatish skripti | **Tarixiy** |
| `supabase_rls_teshik_yopish.sql` | RLS teshiklarini yopish | **Tarixiy** |
| `supabase_admin_tuzatish.sql` | Admin + RLS tuzatish | **Tarixiy** |
| `supabase_populate_b2b.sql`, `supabase_sync_production_b2b.sql`, `supabase_reviews.sql` | Ma'lumot/seed skriptlari | Bir martalik |
| `supabase/migrations/*.sql` | **Kanonik** migratsiyalar | Faqat shu yerga yangi o'zgarish yoziladi |

Muammo: bir xil jadval/policy bir necha faylda turlicha ta'riflangan, shuning uchun
"hozirgi haqiqiy sxema" ni faqat jonli bazadan bilib bo'ladi.

## Qoidalar (yangi o'zgarishlar uchun)

1. **Yangi SQL faqat `supabase/migrations/` ga qo'shiladi**, fayl nomi:
   `YYYYMMDDHHMMSS_qisqa_tavsif.sql` (masalan `20260614000000_restore_order_stock_rpc.sql`).
2. Har bir migratsiya **idempotent** bo'lishi kerak: `if not exists`, `drop policy if exists`,
   `create or replace function`.
3. Ildizdagi eski `supabase_*.sql` fayllar **o'zgartirilmaydi** (yangi muhitni tiklash uchun
   tarixiy ma'lumot sifatida qoladi).
4. Migratsiya oxirida tekshiruv so'rovi (`select ... from pg_policies` / `pg_proc`) bo'lishi tavsiya etiladi.
5. Joriy kanonik tartib:
   1. `20260518190000_bot_checkout_additive.sql`
   2. `20260518191000_order_insert_lockdown.sql`
   3. `20260519132000_product_reviews_author_name.sql`
   4. `20260519134500_product_reviews_moderation.sql`
   5. `20260519235800_firebase_user_devices.sql`
   6. `20260520000000_create_wishlists.sql`
   7. `20260601090000_order_stock_reservation.sql`
   8. `20260613000000_rls_devices_leads_hardening.sql`
   9. `20260614000000_restore_order_stock_rpc.sql`
   10. `20260615000000_bot_users_cart.sql`

## Qo'llash tartibi

Hozircha Supabase CLI ulanmagan, shuning uchun:

1. Supabase Dashboard → **SQL Editor**.
2. Migratsiya faylini to'liq paste qilib **Run**.
3. Fayl oxiridagi tekshiruv so'rovlarini bajarib natijani ko'rish.

Kelajakda (tavsiya): repo'ni `supabase init` + `supabase link` bilan ulab,
`supabase db push` orqali qo'llash — shunda `supabase_migrations.schema_migrations`
jadvali tarixni o'zi yuritadi.

## Kodning migratsiyaga bog'liqligi

Kod migratsiya hali qo'llanmagan holatda ham ishlashga mo'ljallangan (graceful fallback):

| RPC | Fallback |
|---|---|
| `create_order_with_stock` | oddiy `insert` ([`app/api/orders`](../app/api/orders/route.ts:180)) |
| `restore_order_stock` | eski `stock = stock + qty` sikli ([`app/api/admin/order-status`](../app/api/admin/order-status/route.ts:126)) |
| `bot_users.cart` ustuni | bot xotiradagi savat bilan ishlaydi ([`bot/src/cartStore.ts`](../bot/src/cartStore.ts:1)) |
