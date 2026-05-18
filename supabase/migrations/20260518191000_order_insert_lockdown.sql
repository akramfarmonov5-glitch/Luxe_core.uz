-- ============================================================
-- LUXECORE / Telegram checkout rollout - phase 2 (lockdown)
-- Purpose:
--   Run only AFTER the new web checkout and Telegram bot have been
--   deployed and smoke-tested in production.
--
-- Effect:
--   - keeps authenticated users able to read only their own orders
--   - keeps admins able to manage orders
--   - removes legacy public/browser-side order insert paths
-- ============================================================

begin;
set local lock_timeout = '5s';
set local statement_timeout = '60s';

alter table if exists public.orders enable row level security;

-- Rebuild the order read/admin policies to a known safe state.
drop policy if exists "Users can view their own orders" on public.orders;
drop policy if exists "Users view own orders" on public.orders;
drop policy if exists "Admins manage orders" on public.orders;

create policy "Users view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Admins manage orders"
  on public.orders for all
  using (public.is_admin())
  with check (public.is_admin());

-- Remove the old browser-side insert paths only after the server-side flow
-- is already live and verified.
drop policy if exists "Anyone can insert an order" on public.orders;
drop policy if exists "Guests can create orders" on public.orders;

commit;
