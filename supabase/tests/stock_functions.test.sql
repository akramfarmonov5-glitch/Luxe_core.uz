-- ============================================================
-- pgTAP testlari: `create_order_with_stock` va `restore_order_stock`
--
-- Ishlatish (Supabase CLI + Docker kerak):
--   supabase start
--   supabase test db
--
-- Testlar bitta tranzaksiya ichida ishlaydi va oxirida `rollback` bo'ladi —
-- haqiqiy ma'lumotlarga tegmaydi.
-- ============================================================

begin;

create extension if not exists pgtap;

select plan(7);

-- ---------- Fixture ----------
insert into public.products (id, name, price, image, category, stock, "itemsPerPackage")
values (900001, '{"uz":"Test quti","ru":"Тест","en":"Test"}', 1000, '/logo.jpg', 'sovga-qutilari', 100, 10)
on conflict (id) do update set stock = 100;

select is(
  (select count(*)::int from public.orders where id = 'TEST-ORDER-1'),
  0,
  'test buyurtmasi hali mavjud emas'
);

-- ---------- 1. Buyurtma yaratilganda qoldiq atomar kamayadi ----------
select lives_ok(
  $$ select public.create_order_with_stock(
       '{"id":"TEST-ORDER-1","customerName":"Test Mijoz","phone":"998901112233","total":10000,"status":"Kutilmoqda","paymentMethod":"Naqd","date":"2026-01-01","items":[{"id":900001,"quantity":10}]}'::jsonb,
       '[{"id":900001,"quantity":10}]'::jsonb
     ) $$,
  'create_order_with_stock xatosiz ishlaydi'
);

select is(
  (select stock from public.products where id = 900001),
  90,
  'qoldiq 10 dona kamaydi'
);

select is(
  (select stock_reserved from public.orders where id = 'TEST-ORDER-1'),
  true,
  'buyurtmada stock_reserved = true'
);

-- ---------- 2. Qoldiq yetmasa tranzaksiya qaytariladi ----------
select throws_ok(
  $$ select public.create_order_with_stock(
       '{"id":"TEST-ORDER-2","customerName":"Yetmagan","phone":"998901112244","total":999999,"paymentMethod":"Naqd","date":"2026-01-01","items":[{"id":900001,"quantity":1000}]}'::jsonb,
       '[{"id":900001,"quantity":1000}]'::jsonb
     ) $$,
  'P0001',
  'INSUFFICIENT_STOCK:900001',
  'qoldiq yetmasa INSUFFICIENT_STOCK xatosi'
);

-- ---------- 3. Bekor qilishda qoldiq qaytadi (faqat bir marta) ----------
select ok(
  public.restore_order_stock('TEST-ORDER-1'),
  'restore_order_stock true qaytaradi'
);

select is(
  (select stock from public.products where id = 900001),
  100,
  'qoldiq to`liq tiklandi'
);

-- Idempotentlik: ikkinchi chaqiruv hech narsa qilmaydi.
select is(
  public.restore_order_stock('TEST-ORDER-1'),
  false,
  'takroriy qaytarish rad etiladi (idempotent)'
);

select * from finish();

rollback;
