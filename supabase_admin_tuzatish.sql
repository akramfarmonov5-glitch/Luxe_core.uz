-- ============================================================
-- LUXECORE: Admin saqlash + RLS xavfsizlik tuzatishi
-- Supabase Dashboard -> SQL Editor -> pastdagini TO'LIQ nusxalab "Run"
-- Sana: 2026-07-06
--
-- MUAMMOLAR (2026-07-06 diagnoz):
--  A) products jadvali eski sxemada: description, slug, itemsPerPackage,
--     specifications, is_premium, is_bestseller ustunlari YO'Q edi
--     -> admin panel mahsulot saqlay olmasdi
--  B) formattedPrice NOT NULL, lekin admin uni yubormaydi
--  C) RLS amalda ochiq: istalgan odam anon kalit bilan mahsulotlarni
--     o'chira/o'zgartira olardi (real tekshirilgan xavfsizlik teshigi)
--
-- MUHIM: pastdagi 3-QISMDA o'z EMAILINGIZNI yozing, aks holda RLS
-- yopilgandan keyin admin panel ham yozolmay qoladi!
-- ============================================================

-- ----------------------------------------
-- 1-QISM. Yetishmayotgan ustunlar
-- ----------------------------------------
alter table public.products
  add column if not exists slug text,
  add column if not exists description text,
  add column if not exists "itemsPerPackage" integer default 1,
  add column if not exists specifications jsonb default '[]'::jsonb,
  add column if not exists is_premium boolean default false,
  add column if not exists is_bestseller boolean default false;

-- Eski shortDescription -> description ga ko'chirish
update public.products
  set description = "shortDescription"
  where description is null and "shortDescription" is not null;

-- formattedPrice endi majburiy emas (kod uni hisoblaydi)
alter table public.products alter column "formattedPrice" drop not null;

-- ----------------------------------------
-- 2-QISM. is_admin() funksiyasi
-- ----------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ----------------------------------------
-- 3-QISM.  <<< SHU YERNI TAHRIRLANG >>>
-- O'z admin emailingizni yozing (Supabase Authentication -> Users
-- da shu email bilan foydalanuvchi bo'lishi SHART).
-- Bu emailni auth.users dan topib, avtomatik admin qiladi.
-- ----------------------------------------
insert into public.admin_users (user_id)
select id from auth.users
where email = 'BU_YERGA_EMAILINGIZ@example.com'   -- <<< ALMASHTIRING
on conflict (user_id) do nothing;

-- Tekshirish: kamida 1 qator qaytishi SHART. Agar 0 qaytsa -
-- email xato yoki auth user yo'q. Bunday holda 4-QISMNI ISHGA TUSHIRMANG!
select count(*) as admin_soni from public.admin_users;

-- ----------------------------------------
-- 4-QISM. RLS xavfsizlik teshigini yopish
-- (faqat 3-QISM 1+ qaytargan bo'lsa bajaring)
-- ----------------------------------------
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.blog_posts enable row level security;
alter table public.hero_content enable row level security;
alter table public.navigation_settings enable row level security;

-- Barcha ochiq/eski policylarni tozalash
drop policy if exists "Allow all access products" on public.products;
drop policy if exists "Allow all access categories" on public.categories;
drop policy if exists "Allow all access blogs" on public.blog_posts;
drop policy if exists "Allow all access hero" on public.hero_content;
drop policy if exists "Allow all access nav" on public.navigation_settings;
drop policy if exists "Public products are viewable" on public.products;
drop policy if exists "Public categories are viewable" on public.categories;
drop policy if exists "Public blogs are viewable" on public.blog_posts;
drop policy if exists "Public hero viewable" on public.hero_content;
drop policy if exists "Public nav viewable" on public.navigation_settings;
drop policy if exists "Public read products" on public.products;
drop policy if exists "Public read categories" on public.categories;
drop policy if exists "Public read blog posts" on public.blog_posts;
drop policy if exists "Public read hero content" on public.hero_content;
drop policy if exists "Public read navigation settings" on public.navigation_settings;
drop policy if exists "Admins manage products" on public.products;
drop policy if exists "Admins manage categories" on public.categories;
drop policy if exists "Admins manage blog posts" on public.blog_posts;
drop policy if exists "Admins manage hero content" on public.hero_content;
drop policy if exists "Admins manage navigation settings" on public.navigation_settings;

-- Hamma O'QIY oladi, faqat ADMIN yoza oladi
create policy "Public read products" on public.products for select using (true);
create policy "Public read categories" on public.categories for select using (true);
create policy "Public read blog posts" on public.blog_posts for select using (true);
create policy "Public read hero content" on public.hero_content for select using (true);
create policy "Public read navigation settings" on public.navigation_settings for select using (true);

create policy "Admins manage products" on public.products for all
  using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage categories" on public.categories for all
  using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage blog posts" on public.blog_posts for all
  using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage hero content" on public.hero_content for all
  using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage navigation settings" on public.navigation_settings for all
  using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------
-- 5-QISM. Yakuniy tekshiruv
-- ----------------------------------------
-- (a) Ustunlar qo'shildimi? 6 qator chiqishi kerak:
select column_name from information_schema.columns
  where table_schema='public' and table_name='products'
  and column_name in ('slug','description','itemsPerPackage','specifications','is_premium','is_bestseller');

-- (b) RLS yoqilganmi? har biriga rowsecurity = true bo'lishi kerak:
select tablename, rowsecurity from pg_tables
  where schemaname='public'
  and tablename in ('products','categories','blog_posts','hero_content','navigation_settings');
