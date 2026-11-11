-- ============================================================
-- LUXECORE: Qoldiqni ATOMAR qaytarish — `restore_order_stock`
--
-- MUAMMO:
--   Bekor qilingan buyurtmada qoldiq `stock = stock + qty` ko'rinishida
--   kodda (app/api/admin/order-status, bot/src/handlers/admin) qaytarilardi:
--   avval `stock` o'qiladi, keyin yoziladi — bir vaqtda ikki bekor qilish
--   yoki bir vaqtda sotuv bo'lsa qiymat yo'qolishi mumkin edi.
--
-- YECHIM:
--   1) `orders.stock_reserved` bayrog'i BITTA atomar `update ... returning`
--      ichida `false` ga tushiriladi — shu bilan qaytarish faqat bir marta
--      bajarilishi kafolatlanadi (idempotent).
--   2) Qoldiqlar bitta tranzaksiyada, id bo'yicha tartiblab qo'shiladi
--      (deadlock bo'lmasligi uchun).
--
-- QAYTARADI:
--   true  — qoldiq qaytarildi
--   false — buyurtma topilmadi, allaqachon qaytarilgan yoki stock yechilmagan
--
-- QO'LLASH: Supabase SQL Editor -> butun faylni paste -> Run.
-- Kod funksiya bo'lmasa ham ishlaydi (eski usulga fallback qiladi).
-- ============================================================

begin;
set local lock_timeout = '5s';
set local statement_timeout = '60s';

create or replace function public.restore_order_stock(p_order_id text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  it     jsonb;
  v_items jsonb;
  pid    bigint;
  qty    integer;
begin
  if p_order_id is null or length(btrim(p_order_id)) = 0 then
    raise exception 'ORDER_ID_INVALID';
  end if;

  -- Atomar "band qilish": bayroq faqat `true` bo'lsa `false` ga tushadi.
  -- Agar bu qator qaytmasa — demak hech narsa qaytarish kerak emas.
  update public.orders
     set stock_reserved = false
   where id = p_order_id
     and stock_reserved = true
  returning items into v_items;

  if not found then
    return false;
  end if;

  for it in
    select value
    from jsonb_array_elements(coalesce(v_items, '[]'::jsonb)) as value
    order by coalesce(nullif(value->>'id', ''), value->>'productId')::bigint
  loop
    pid := coalesce(nullif(it->>'id', ''), it->>'productId')::bigint;
    qty := (it->>'quantity')::int;

    if pid is null or qty is null or qty <= 0 then
      continue;
    end if;

    update public.products
       set stock = case when stock is null then null else stock + qty end
     where id = pid;
  end loop;

  return true;
end;
$$;

revoke all on function public.restore_order_stock(text) from public;
revoke all on function public.restore_order_stock(text) from anon;
revoke all on function public.restore_order_stock(text) from authenticated;
grant execute on function public.restore_order_stock(text) to service_role;

commit;

-- Tekshirish:
-- select proname, proacl from pg_proc where proname = 'restore_order_stock';
