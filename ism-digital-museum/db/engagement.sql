-- =====================================================================
-- ISM Digital Museum: likes + view counts ("engagement")
-- Run once in Supabase -> SQL Editor. ADDITIVE ONLY: creates new tables/functions,
-- never drops or changes existing tables or rows. Safe to run again.
-- The app works without this file; likes/views/"popular" just stay hidden.
-- =====================================================================

-- 1. Likes: one row per (exhibit, user)
create table if not exists public.exhibit_likes (
  exhibit_id uuid not null references public.exhibits(id) on delete cascade,
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (exhibit_id, user_id)
);
alter table public.exhibit_likes enable row level security;

-- Users only see their OWN like rows (who liked what stays private);
-- public totals come from exhibit_popularity() below.
drop policy if exists "likes: read own"   on public.exhibit_likes;
drop policy if exists "likes: add own"    on public.exhibit_likes;
drop policy if exists "likes: remove own" on public.exhibit_likes;
create policy "likes: read own"   on public.exhibit_likes for select to authenticated using (user_id = auth.uid());
create policy "likes: add own"    on public.exhibit_likes for insert to authenticated
  with check (user_id = auth.uid()
              and exists (select 1 from public.exhibits e where e.id = exhibit_id and e.status = 'approved'));
create policy "likes: remove own" on public.exhibit_likes for delete to authenticated using (user_id = auth.uid());

-- 2. View counter: no client write policy; only record_exhibit_view() can change it
create table if not exists public.exhibit_views (
  exhibit_id uuid primary key references public.exhibits(id) on delete cascade,
  views      bigint not null default 0
);
alter table public.exhibit_views enable row level security;
drop policy if exists "views: public read" on public.exhibit_views;
create policy "views: public read" on public.exhibit_views for select using (true);

create or replace function public.record_exhibit_view(p_exhibit uuid)
returns void language sql security definer set search_path = public as $$
  insert into public.exhibit_views (exhibit_id, views)
  select id, 1 from public.exhibits where id = p_exhibit and status = 'approved'
  on conflict (exhibit_id) do update set views = public.exhibit_views.views + 1;
$$;

-- 3. Public totals for approved exhibits only (aggregates, no personal data)
create or replace function public.exhibit_popularity()
returns table (exhibit_id uuid, views bigint, likes bigint)
language sql stable security definer set search_path = public as $$
  select e.id,
         coalesce(v.views, 0),
         (select count(*) from public.exhibit_likes l where l.exhibit_id = e.id)
  from public.exhibits e
  left join public.exhibit_views v on v.exhibit_id = e.id
  where e.status = 'approved';
$$;

revoke execute on function public.record_exhibit_view(uuid) from public;
revoke execute on function public.exhibit_popularity()      from public;
grant  execute on function public.record_exhibit_view(uuid) to anon, authenticated;
grant  execute on function public.exhibit_popularity()      to anon, authenticated;

-- Make the new functions visible to the API immediately
notify pgrst, 'reload schema';
