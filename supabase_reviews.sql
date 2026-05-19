-- Mahsulot izohlari va baholari (Reviews & Ratings) uchun jadval
create table public.product_reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  product_id bigint not null references public.products(id) on delete cascade,
  user_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  is_approved boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) sozlamalari
-- Izohlarni hamma o'qishi (read) va yaratishi (insert) mumkin bo'lishi kerak.
alter table public.product_reviews enable row level security;

create policy "Public read approved reviews"
  on public.product_reviews 
  for select using (is_approved = true);

create policy "Public create pending reviews"
  on public.product_reviews 
  for insert with check (is_approved = false);

create policy "Admins manage reviews"
  on public.product_reviews
  for all
  using (public.is_admin())
  with check (public.is_admin());

grant select, insert on table public.product_reviews to anon;
grant select, insert, update, delete on table public.product_reviews to authenticated;
grant all on table public.product_reviews to service_role;

-- (Ixtiyoriy) Test uchun dastlabki data:
/*
insert into public.product_reviews (product_id, user_name, rating, comment)
values 
  (1, 'Azizbek', 5, 'Juda ajoyib sifat, yetkazib berish ham tez bo''ldi!'),
  (1, 'Malika R.', 4, 'Yaxshi ekan, lekin rangi rasmdegidan sal farq qilar ekan o''ngida.');
*/
