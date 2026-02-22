-- Harden RLS policies for production-like security.
-- Run after initial schema creation.

create or replace function public.is_admin_user()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

create table if not exists public.navigation_settings (
  id text primary key default 'main',
  "menuItems" jsonb default '[]'::jsonb,
  "socialLinks" jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.hero_content enable row level security;
alter table public.navigation_settings enable row level security;
alter table public.orders enable row level security;
alter table public.blog_posts enable row level security;
alter table public.leads enable row level security;

-- PRODUCTS
drop policy if exists "Allow public read access" on public.products;
drop policy if exists "Allow all access for now" on public.products;
create policy "products_public_read" on public.products
for select
using (true);
create policy "products_admin_write" on public.products
for all
using (public.is_admin_user())
with check (public.is_admin_user());

-- CATEGORIES
drop policy if exists "Allow public read access" on public.categories;
drop policy if exists "Allow all access for now" on public.categories;
create policy "categories_public_read" on public.categories
for select
using (true);
create policy "categories_admin_write" on public.categories
for all
using (public.is_admin_user())
with check (public.is_admin_user());

-- HERO
drop policy if exists "Allow all access" on public.hero_content;
create policy "hero_public_read" on public.hero_content
for select
using (true);
create policy "hero_admin_write" on public.hero_content
for all
using (public.is_admin_user())
with check (public.is_admin_user());

-- NAVIGATION
drop policy if exists "Allow all access" on public.navigation_settings;
create policy "navigation_public_read" on public.navigation_settings
for select
using (true);
create policy "navigation_admin_write" on public.navigation_settings
for all
using (public.is_admin_user())
with check (public.is_admin_user());

-- BLOG
drop policy if exists "Allow all access" on public.blog_posts;
create policy "blog_public_read" on public.blog_posts
for select
using (true);
create policy "blog_admin_write" on public.blog_posts
for all
using (public.is_admin_user())
with check (public.is_admin_user());

-- ORDERS
drop policy if exists "Allow all access" on public.orders;
create policy "orders_public_insert" on public.orders
for insert
with check (true);
create policy "orders_admin_read_write" on public.orders
for all
using (public.is_admin_user())
with check (public.is_admin_user());

-- LEADS
drop policy if exists "Allow all access" on public.leads;
create policy "leads_public_insert" on public.leads
for insert
with check (true);
create policy "leads_admin_read_write" on public.leads
for all
using (public.is_admin_user())
with check (public.is_admin_user());
