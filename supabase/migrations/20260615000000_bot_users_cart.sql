-- ============================================================
-- LUXECORE: Telegram bot savatini bazada saqlash
--
-- MUAMMO:
--   Bot savati (`Map` xotirasida) Render restart, deploy yoki uyqu
--   (free plan) holatida yo'qolardi — mijoz savati "o'chib" ketardi.
--
-- YECHIM:
--   `bot_users.cart` (jsonb) ustuni. Bot har o'zgarishdan keyin savatni
--   shu ustunga yozadi va birinchi murojaatda bazadan tiklaydi.
--
-- QO'LLASH: Supabase SQL Editor -> paste -> Run.
-- Kod ustun bo'lmasa ham ishlaydi (xotiradagi savat bilan davom etadi).
-- ============================================================

begin;
set local lock_timeout = '5s';
set local statement_timeout = '60s';

alter table if exists public.bot_users
  add column if not exists cart jsonb not null default '[]'::jsonb;

comment on column public.bot_users.cart is
  'Telegram bot savati: [{ productId, name, price, quantity, image, itemsPerPackage }]';

commit;

-- Tekshirish:
-- select column_name, data_type, column_default
-- from information_schema.columns
-- where table_schema = 'public' and table_name = 'bot_users' and column_name = 'cart';
