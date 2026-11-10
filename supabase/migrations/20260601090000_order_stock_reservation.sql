-- ============================================================
-- LUXECORE / Ombor qoldig'ini atomar yechish (stock reservation)
--
-- MUAMMO:
--   app/api/orders/route.ts faqat `orders` ga insert qilardi,
--   `products.stock` esa kamaymasdi. Bekor qilingan buyurtmada esa
--   qoldiq YANA qo'shilib ketardi (app/api/admin/order-status).
--   Natijada overselling va qoldiqning sun'iy o'sishi.
--
-- YECHIM:
--   1) `orders.stock_reserved` bayrog'i — qoldiq haqiqatan yechilganini bildiradi.
--   2) `create_order_with_stock(p_order, p_items)` — bitta tranzaksiyada
--      barcha qoldiqlarni tekshirib kamaytiradi, keyin buyurtmani yozadi.
--      Biror tovar yetmasa — `INSUFFICIENT_STOCK:<product_id>` xatosi bilan
--      butun tranzaksiya qaytariladi (qisman yechish bo'lmaydi).
--
-- XAVFSIZLIK:
--   Funksiya SECURITY DEFINER — faqat service_role bajara oladi.
--   anon/authenticated uchun execute huquqi olib tashlanadi.
--
-- QO'LLASH TARTIBI:
--   Supabase SQL Editor -> butun faylni paste -> Run.
--   Kod bu funksiya hali yo'q bo'lsa ham ishlashda davom etadi (fallback insert),
--   shuning uchun migratsiyani deploydan keyin ham qo'llash mumkin.
-- ============================================================

begin;
set local lock_timeout = '5s';
set local statement_timeout = '60s';

alter table if exists public.orders
  add column if not exists stock_reserved boolean not null default false;

comment on column public.orders.stock_reserved is
  'true = buyurtma yaratilganda products.stock atomar yechilgan. Bekor qilinganda faqat shu holatda qaytariladi.';

create or replace function public.create_order_with_stock(p_order jsonb, p_items jsonb)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  it  jsonb;
  pid bigint;
  qty integer;
  new_order public.orders;
begin
  if p_order is null or nullif(p_order->>'id', '') is null then
    raise exception 'ORDER_PAYLOAD_INVALID';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'ORDER_ITEMS_INVALID';
  end if;

  -- id bo'yicha tartiblash — bir vaqtda kelgan buyurtmalarda deadlock bo'lmasligi uchun
  for it in
    select value
    from jsonb_array_elements(p_items) as value
    order by (value->>'id')::bigint
  loop
    pid := (it->>'id')::bigint;
    qty := (it->>'quantity')::int;

    if pid is null or qty is null or qty <= 0 then
      raise exception 'ITEM_INVALID';
    end if;

    update public.products
       set stock = case when stock is null then null else stock - qty end
     where id = pid
       and (stock is null or stock >= qty);

    if not found then
      raise exception 'INSUFFICIENT_STOCK:%', pid;
    end if;
  end loop;

  insert into public.orders (
    id,
    "customerName",
    phone,
    total,
    status,
    "paymentMethod",
    date,
    user_id,
    items,
    shipping_address,
    city,
    telegram_user_id,
    stock_reserved
  ) values (
    p_order->>'id',
    p_order->>'customerName',
    p_order->>'phone',
    coalesce((p_order->>'total')::numeric, 0),
    coalesce(nullif(p_order->>'status', ''), 'Kutilmoqda'),
    p_order->>'paymentMethod',
    coalesce((p_order->>'date')::date, current_date),
    nullif(p_order->>'user_id', '')::uuid,
    coalesce(p_order->'items', '[]'::jsonb),
    nullif(p_order->>'shipping_address', ''),
    nullif(p_order->>'city', ''),
    nullif(p_order->>'telegram_user_id', '')::bigint,
    true
  )
  returning * into new_order;

  return new_order;
end;
$$;

revoke all on function public.create_order_with_stock(jsonb, jsonb) from public;
revoke all on function public.create_order_with_stock(jsonb, jsonb) from anon;
revoke all on function public.create_order_with_stock(jsonb, jsonb) from authenticated;
grant execute on function public.create_order_with_stock(jsonb, jsonb) to service_role;

commit;

-- Tekshirish:
-- select column_name from information_schema.columns
--  where table_schema='public' and table_name='orders' and column_name='stock_reserved';
-- select proname, proacl from pg_proc where proname = 'create_order_with_stock';
