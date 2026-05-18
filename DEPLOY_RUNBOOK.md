# LUXECORE production rollout runbook

## Goal

Roll out the unified server-side checkout for the storefront and Telegram bot without breaking the currently deployed checkout during the release.

## Files

1. `supabase/migrations/20260518190000_bot_checkout_additive.sql`
2. `supabase/migrations/20260518191000_order_insert_lockdown.sql`

Run them in that order. Do **not** run phase 2 until the new web build and bot build are both live and smoke-tested.

---

## 0. One-time preflight

### 0.1 Back up first

Before touching production:

1. Open Supabase Dashboard.
2. Go to **Database -> Backups**.
3. Confirm there is a recent restore point available.
4. If your plan allows it, take/export an additional logical backup before the release.

### 0.2 Confirm the current production shape

Paste this into **Supabase SQL Editor**:

```sql
select
  to_regclass('public.orders') as orders_table,
  to_regclass('public.bot_users') as bot_users_table,
  to_regclass('public.promo_codes') as promo_codes_table,
  to_regclass('public.admin_users') as admin_users_table,
  to_regprocedure('public.is_admin()') as is_admin_function;

select
  column_name,
  data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'orders'
order by ordinal_position;

select count(*) as orders_count from public.orders;
select count(*) as bot_users_count from public.bot_users;
select count(*) as promo_codes_count from public.promo_codes;
select count(*) as products_count from public.products;
```

Expected before rollout in the current project:

- `orders.user_id` is still missing
- `bot_users` exists
- `promo_codes` exists
- `admin_users` exists
- `public.is_admin()` exists
- `products_count > 0` before bot smoke testing

If `public.is_admin()` or `public.admin_users` is missing, **stop** before phase 1 and fix the admin baseline first.

If `products_count = 0`, load/sync products before bot smoke testing. The storefront can temporarily render mock products, but the Telegram bot reads real products from Supabase.

---

## 1. Apply migration 1: additive preparation

### Option A - practical path for the current repo

The repo is not yet initialized for Supabase CLI migrations, so the quickest safe path today is:

1. Open Supabase Dashboard -> **SQL Editor**
2. Open `supabase/migrations/20260518190000_bot_checkout_additive.sql`
3. Paste the whole file
4. Run it once

### Option B - preferred future workflow

After the repo is set up with Supabase CLI and linked to the project, deploy migrations with:

```bash
supabase db push
```

### 1.1 Verify migration 1

Paste into Supabase SQL Editor:

```sql
select
  column_name,
  data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'orders'
  and column_name in ('user_id', 'shipping_address', 'city', 'telegram_user_id')
order by column_name;

select
  indexname,
  indexdef
from pg_indexes
where schemaname = 'public'
  and tablename = 'orders'
  and indexname = 'idx_orders_telegram_user_id';

select
  schemaname,
  tablename,
  policyname,
  cmd
from pg_policies
where schemaname = 'public'
  and tablename in ('bot_users', 'promo_codes')
order by tablename, policyname;
```

Expected:

- all 4 order columns are present
- `idx_orders_telegram_user_id` exists
- admin policies for `bot_users` and `promo_codes` exist

---

## 2. Configure production environment variables

## 2.1 Web / Vercel

Set or confirm:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
BOT_INTERNAL_SECRET=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
TELEGRAM_INTERNAL_SECRET=
```

Notes:

- `BOT_INTERNAL_SECRET` must be the **same exact value** in web and bot.
- `TELEGRAM_INTERNAL_SECRET` is only needed if `/api/telegram` relay is still used.

## 2.2 Bot / Render

Set or confirm:

```text
BOT_TOKEN=
ADMIN_ID=
BOT_INTERNAL_SECRET=
SUPABASE_URL=
SUPABASE_KEY=
SITE_URL=
```

Notes:

- `SUPABASE_KEY` in the bot must be the **service-role key**, not the anon key.
- `SITE_URL` must point to the deployed storefront URL.

---

## 3. Build verification before deploy

From the project root:

```powershell
npm run typecheck
npm run build
```

From `bot/`:

```powershell
npm run build
```

Expected: all 3 commands succeed.

---

## 4. Deploy order

### 4.1 Deploy the web app first

Deploy the storefront before the bot.

Reason: the new bot flow calls the storefront's internal order API.

### 4.2 Smoke-test the web app

Quote endpoint:

```powershell
$body = @{
  items = @(
    @{ id = 1; quantity = 1 }
  )
} | ConvertTo-Json -Depth 5

Invoke-RestMethod `
  -Uri 'https://YOUR-SITE-DOMAIN/api/checkout/quote' `
  -Method Post `
  -ContentType 'application/json' `
  -Body $body
```

Expected: a JSON quote with `subtotal`, `deliveryFee`, `total`, and `promoStatus`.

Then place **one real low-risk test order** through the UI and immediately mark it `Bekor qilindi` afterward if needed.

### 4.3 Deploy the Telegram bot second

Deploy the bot only after the storefront smoke test is clean.

### 4.4 Smoke-test the bot

In Telegram:

1. Add a product to cart
2. Start checkout
3. Try a valid promo code
4. Try card flow with a wrong confirmation word
5. Confirm that only `tayyor` / `готово` works
6. Complete one low-risk test order
7. Confirm:
   - admin notification arrived
   - order appears in `orders`
   - `telegram_user_id` is populated

---

## 5. Apply migration 2: order insert lockdown

Only continue if:

- the new web checkout works in production
- the Telegram bot checkout works in production
- at least one test order was successfully created through each flow

Then:

1. Open Supabase Dashboard -> **SQL Editor**
2. Open `supabase/migrations/20260518191000_order_insert_lockdown.sql`
3. Paste the whole file
4. Run it once

### 5.1 Verify migration 2

Paste:

```sql
select
  schemaname,
  tablename,
  policyname,
  cmd
from pg_policies
where schemaname = 'public'
  and tablename = 'orders'
order by policyname;
```

Expected:

- `Users view own orders`
- `Admins manage orders`
- no `Anyone can insert an order`
- no `Guests can create orders`

Optional live negative test using the anon key:

```powershell
$headers = @{
  apikey = 'YOUR_ANON_KEY'
  Authorization = 'Bearer YOUR_ANON_KEY'
  'Content-Type' = 'application/json'
}

$body = @{
  id = 'SHOULD-NOT-INSERT'
  customerName = 'Blocked Guest'
  phone = '901234567'
  total = 1
  status = 'Kutilmoqda'
  paymentMethod = 'Naqd'
  date = '2026-05-18'
} | ConvertTo-Json

Invoke-WebRequest `
  -Uri 'https://YOUR-PROJECT.supabase.co/rest/v1/orders' `
  -Method Post `
  -Headers $headers `
  -Body $body
```

Expected: the request is rejected.

---

## 6. Rollback plan

## 6.1 If something fails before migration 2

1. Roll back the web deploy
2. Roll back the bot deploy
3. Keep migration 1 in place

Migration 1 is additive and does not break the old flow.

## 6.2 If something fails after migration 2

Preferred:

1. Roll back the bad app deployment
2. Fix forward quickly

Emergency-only temporary restore of the old browser-side insert path:

```sql
create policy "Guests can create orders"
  on public.orders for insert
  with check (user_id is null or auth.uid() = user_id);
```

Use that only as a short-lived emergency measure, then remove it again once the server-side checkout is healthy.

---

## 7. Post-release follow-up

After the release is stable:

1. Install and initialize Supabase CLI for this repo
2. Baseline the current remote schema into proper migration history
3. Use migration files for all future remote schema changes
4. Review whether `public.is_admin()` should later move out of an exposed schema as a separate security hardening task
