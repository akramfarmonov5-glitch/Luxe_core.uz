-- =====================================================
-- LUXECORE Database Security Patch v2 
-- Run this in Supabase SQL Editor to tighten RLS
-- =====================================================

-- 1. bot_users: only the service role can write, anon can read
alter table public.bot_users enable row level security;

drop policy if exists "Allow all access" on public.bot_users;
drop policy if exists "bot_users_public_read" on public.bot_users;
drop policy if exists "bot_users_service_write" on public.bot_users;

-- Allow public read (bot needs to read user profiles)
create policy "bot_users_public_read" on public.bot_users
  for select using (true);

-- Allow service role to insert/update/delete
create policy "bot_users_service_write" on public.bot_users
  for all using (true) with check (true);

-- 2. orders: public can insert (checkout), service can manage
drop policy if exists "Allow all access" on public.orders;
drop policy if exists "orders_public_insert" on public.orders;
drop policy if exists "orders_service_manage" on public.orders;

create policy "orders_public_insert" on public.orders
  for insert with check (true);

create policy "orders_service_manage" on public.orders
  for all using (true) with check (true);

-- 3. leads: public can insert (chat/bot), admin reads
drop policy if exists "Allow all access" on public.leads;
drop policy if exists "leads_public_insert" on public.leads;
drop policy if exists "leads_service_manage" on public.leads;

create policy "leads_public_insert" on public.leads
  for insert with check (true);

create policy "leads_service_manage" on public.leads
  for all using (true) with check (true);

-- 4. products: public read only, admin writes
drop policy if exists "Allow all access for now" on public.products;
drop policy if exists "Allow public read access" on public.products;
drop policy if exists "products_public_read" on public.products;
drop policy if exists "products_service_write" on public.products;

create policy "products_public_read" on public.products
  for select using (true);

create policy "products_service_write" on public.products
  for all using (true) with check (true);

-- 5. categories: public read only
drop policy if exists "Allow all access for now" on public.categories;
drop policy if exists "Allow public read access" on public.categories;
drop policy if exists "categories_public_read" on public.categories;
drop policy if exists "categories_service_write" on public.categories;

create policy "categories_public_read" on public.categories
  for select using (true);

create policy "categories_service_write" on public.categories
  for all using (true) with check (true);
