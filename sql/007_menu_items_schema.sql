-- 007_menu_items_schema.sql
-- Subitems de cada Menu Card: plato, descripcion y video vertical.
-- Ejecutar en Supabase SQL Editor despues de 001/002/004.

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  menu_card_id uuid not null references public.menu_cards(id) on delete cascade,
  title text not null,
  description text not null,
  video_url text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_menu_items_menu_card_id on public.menu_items(menu_card_id);
create index if not exists idx_menu_items_sort_order on public.menu_items(sort_order);

create trigger trg_menu_items_updated_at
before update on public.menu_items
for each row
execute function public.set_updated_at();

alter table public.menu_items enable row level security;

drop policy if exists menu_items_public_read on public.menu_items;
create policy menu_items_public_read
on public.menu_items
for select
using (is_active = true);

drop policy if exists menu_items_admin_manage on public.menu_items;
create policy menu_items_admin_manage
on public.menu_items
for all
using (public.is_admin())
with check (public.is_admin());
