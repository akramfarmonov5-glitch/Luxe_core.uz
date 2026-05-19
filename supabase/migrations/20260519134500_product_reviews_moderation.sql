begin;
set local lock_timeout = '5s';
set local statement_timeout = '60s';

alter table if exists public.product_reviews
  add column if not exists user_name text,
  add column if not exists is_approved boolean;

-- Existing reviews were already public before moderation existed, so preserve
-- their visibility. New reviews will use the default below and start pending.
update public.product_reviews
set is_approved = true
where is_approved is null;

alter table public.product_reviews
  alter column is_approved set default false,
  alter column is_approved set not null;

alter table public.product_reviews enable row level security;

drop policy if exists "Allow public read access" on public.product_reviews;
drop policy if exists "Allow public insert access" on public.product_reviews;
drop policy if exists "Public read approved reviews" on public.product_reviews;
drop policy if exists "Public create pending reviews" on public.product_reviews;
drop policy if exists "Admins manage reviews" on public.product_reviews;

create policy "Public read approved reviews"
  on public.product_reviews for select
  using (is_approved = true);

create policy "Public create pending reviews"
  on public.product_reviews for insert
  with check (is_approved = false);

create policy "Admins manage reviews"
  on public.product_reviews for all
  using (public.is_admin())
  with check (public.is_admin());

grant select, insert on table public.product_reviews to anon;
grant select, insert, update, delete on table public.product_reviews to authenticated;
grant all on table public.product_reviews to service_role;

commit;
