-- ============================================================
-- LUXECORE: RLS qattiqlashtirish — `user_devices` va `leads`
--
-- MUAMMOLAR:
--   1) user_devices: update siyosati `using (true)` edi — anon kalit bilan
--      istalgan qurilma qatorini (fcm_token, lead_id) o'zgartirish mumkin edi.
--   2) leads: insert siyosati `with check (true)` edi — CRM'ga cheklovsiz
--      spam yozish mumkin edi.
--
-- YECHIM:
--   - user_devices: faqat o'z qurilmasini ko'rish (select) + admin uchun to'liq
--     boshqaruv. Insert/update faqat service_role orqali (u RLS'ni chetlab o'tadi),
--      chunki qurilma tokeni `/api/devices` orqali yoziladi.
--   - leads: insert ochiq qoladi (chat/bot/lead formalari uchun), lekin qat'iy
--     validatsiya bilan (ism uzunligi, telefon formati, xabar uzunligi).
--
-- QO'LLASH: Supabase SQL Editor -> butun faylni paste -> Run.
-- ============================================================

begin;
set local lock_timeout = '5s';
set local statement_timeout = '60s';

-- ------------------------------------------------------------
-- 1) user_devices
-- ------------------------------------------------------------
alter table if exists public.user_devices enable row level security;

drop policy if exists "Har kim o'z qurilmasi tokenini qo'sha oladi" on public.user_devices;
drop policy if exists "Har kim o'z qurilmasi tokenini yangilay oladi" on public.user_devices;
drop policy if exists "Adminlar barcha tokenlarni boshqara oladilar" on public.user_devices;
drop policy if exists "Foydalanuvchi o'z qurilmasini ko'radi" on public.user_devices;

-- Login qilgan foydalanuvchi faqat o'z qurilmalarini ko'radi.
create policy "Foydalanuvchi o'z qurilmasini ko'radi"
  on public.user_devices for select
  using (auth.uid() = user_id);

-- Adminlar hammasini boshqaradi (admin panel statistikasi uchun).
create policy "Adminlar barcha tokenlarni boshqara oladilar"
  on public.user_devices for all
  using (public.is_admin())
  with check (public.is_admin());

-- Eslatma: insert/update siyosatlari ataylab yaratilmaydi.
-- Qurilma tokeni serverdagi `/api/devices` (service_role) orqali yoziladi.

-- ------------------------------------------------------------
-- 2) leads
-- ------------------------------------------------------------
alter table if exists public.leads enable row level security;

drop policy if exists "Public create leads" on public.leads;
drop policy if exists "Admins manage leads" on public.leads;

-- Ochiq insert — lekin faqat to'g'ri shakldagi ma'lumot uchun.
create policy "Public create leads"
  on public.leads for insert
  with check (
    length(btrim(coalesce(name, ''))) between 1 and 120
    and phone ~ '^[0-9+()[:space:]-]{7,20}$'
    and length(coalesce(last_message, '')) <= 500
  );

create policy "Admins manage leads"
  on public.leads for all
  using (public.is_admin())
  with check (public.is_admin());

commit;

-- ------------------------------------------------------------
-- Tekshirish (0 qator qaytishi kerak — "teshik" qolmagan):
-- ------------------------------------------------------------
-- select tablename, policyname, cmd, qual, with_check
-- from pg_policies
-- where schemaname = 'public'
--   and tablename in ('user_devices', 'leads')
-- order by tablename, policyname;
--
-- select count(*) as ochiq_update_siyosatlar
-- from pg_policies
-- where schemaname = 'public'
--   and tablename = 'user_devices'
--   and cmd = 'UPDATE'
--   and qual = 'true';
