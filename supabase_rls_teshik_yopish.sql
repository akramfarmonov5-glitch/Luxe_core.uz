-- ============================================================
-- LUXECORE: RLS teshigini TO'LIQ yopish
-- Supabase SQL Editor -> hammasini nusxalab "Run"
-- Sana: 2026-07-06
--
-- SABAB: RLS yoqilgan (rowsecurity=true), lekin eski RUXSAT BERUVCHI
-- policy qolib ketgan -> anonim odam hali ham DELETE/INSERT qila oladi
-- (real tekshirilgan: anon kalit bilan mahsulot o'chirildi).
--
-- Bu skript har bir jadvaldagi BARCHA eski policy'ni dinamik o'chirib,
-- keyin faqat to'g'ri policy'larni qayta yaratadi.
-- ============================================================

-- is_admin() bor deb hisoblanadi (oldingi skriptdan). Kafolat uchun qayta:
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- 1) Har bir jadvaldagi HAMMA policy'ni dinamik o'chirish
do $$
declare
  r record;
  tbls text[] := array['products','categories','blog_posts','hero_content','navigation_settings'];
  t text;
begin
  foreach t in array tbls loop
    for r in
      select policyname from pg_policies
      where schemaname = 'public' and tablename = t
    loop
      execute format('drop policy if exists %I on public.%I', r.policyname, t);
    end loop;
  end loop;
end $$;

-- 2) RLS yoqilganiga kafolat
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.blog_posts enable row level security;
alter table public.hero_content enable row level security;
alter table public.navigation_settings enable row level security;

-- 3) To'g'ri policy'lar: hamma O'QIY oladi, faqat ADMIN yoza oladi
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

-- 4) Tekshirish: har jadvalda AYNAN 2 tadan policy bo'lishi kerak
--    (1 read + 1 admin-manage)
select tablename, count(*) as policy_soni
from pg_policies
where schemaname='public'
  and tablename in ('products','categories','blog_posts','hero_content','navigation_settings')
group by tablename
order by tablename;
