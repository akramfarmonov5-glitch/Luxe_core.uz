-- ============================================================
-- LUXECORE: Admin panel saqlash xatosi + RLS tuzatish
-- Supabase Dashboard -> SQL Editor da TO'LIQ ishga tushiring
-- Sana: 2026-07-06
--
-- Muammo diagnozi:
--  1) products jadvali eski sxemada: slug, description,
--     itemsPerPackage, specifications, is_premium, is_bestseller
--     ustunlari YO'Q edi -> admin panel saqlay olmasdi
--     ("Could not find the 'description' column" xatosi)
--  2) formattedPrice NOT NULL, lekin admin panel uni yubormaydi
--  3) RLS amalda ochiq: istalgan odam anon kalit bilan
--     products/categories jadvaliga yozishi mumkin edi
-- ============================================================

-- ----------------------------------------
-- 1-QISM. Yetishmayotgan ustunlarni qo'shish
-- ----------------------------------------
alter table public.products
  add column if not exists slug text,
  add column if not exists description text,
  add column if not exists "itemsPerPackage" integer default 1,
  add column if not exists specifications jsonb default '[]'::jsonb,
  add column if not exists is_premium boolean default false,
  add column if not exists is_bestseller boolean default false;

-- Eski ustunlardagi ma'lumotni yangi ustunlarga ko'chirish
update public.products
  set description = "shortDescription"
  where description is null and "shortDescription" is not null;

-- formattedPrice endi majburiy emas (kod uni o'zi hisoblaydi)
alter table public.products alter column "formattedPrice" drop not null;

-- ----------------------------------------
-- 2-QISM. Hero'dagi "Local Test" ni tuzatish
-- ----------------------------------------
update public.hero_content
  set title = '{"uz":"Premium tanlovlar","ru":"Премиум подборки","en":"Premium picks"}'
  where id = 'main';

-- ----------------------------------------
-- 3-QISM. ADMIN FOYDALANUVCHI (RLS'dan OLDIN SHART!)
-- ----------------------------------------
-- Avval Authentication -> Users da admin user yarating (email+parol),
-- keyin UUID'sini quyiga qo'yib ishga tushiring:
--
-- insert into public.admin_users (user_id)
-- values ('BU_YERGA_USER_UUID')
-- on conflict do nothing;
--
-- Tekshirish: quyidagi so'rov kamida 1 qator qaytarishi kerak:
-- select * from public.admin_users;

-- ----------------------------------------
-- 4-QISM. RLS xavfsizlik teshigini yopish
-- DIQQAT: 3-qismdagi admin_users yozuvi bo'lmasa, admin panel
-- yozolmay qoladi. Avval 3-qismni bajaring!
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

alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.blog_posts enable row level security;
alter table public.hero_content enable row level security;
alter table public.navigation_settings enable row level security;

-- Eski ochiq policylarni olib tashlash
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

-- Hamma o'qiy oladi, faqat admin yoza oladi
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
-- 5-QISM. Tekshirish
-- ----------------------------------------
-- Quyidagilar xatosiz o'tsa, hammasi joyida:
select column_name from information_schema.columns
  where table_schema='public' and table_name='products'
  and column_name in ('slug','description','itemsPerPackage','specifications','is_premium','is_bestseller');
-- 6 qator chiqishi kerak
