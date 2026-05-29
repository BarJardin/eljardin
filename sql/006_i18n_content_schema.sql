-- 006_i18n_content_schema.sql
-- Esquema base para contenido multidioma en Supabase.
-- Ejecutar en SQL Editor despues de 001/002/003/004.

create table if not exists public.site_settings_i18n (
  id uuid primary key default gen_random_uuid(),
  site_settings_id uuid not null references public.site_settings(id) on delete cascade,
  lang_code text not null check (lang_code in ('es','us','gb','fr','it')),
  business_name text,
  address_line_1 text,
  address_line_2 text,
  updated_at timestamptz not null default timezone('utc', now()),
  unique (site_settings_id, lang_code)
);

create table if not exists public.menu_cards_i18n (
  id uuid primary key default gen_random_uuid(),
  menu_card_id uuid not null references public.menu_cards(id) on delete cascade,
  lang_code text not null check (lang_code in ('es','us','gb','fr','it')),
  title text,
  route_label text,
  updated_at timestamptz not null default timezone('utc', now()),
  unique (menu_card_id, lang_code)
);

create table if not exists public.testimonials_i18n (
  id uuid primary key default gen_random_uuid(),
  testimonial_id uuid not null references public.testimonials(id) on delete cascade,
  lang_code text not null check (lang_code in ('es','us','gb','fr','it')),
  quote text,
  author text,
  updated_at timestamptz not null default timezone('utc', now()),
  unique (testimonial_id, lang_code)
);

create table if not exists public.business_hours_i18n (
  id uuid primary key default gen_random_uuid(),
  business_hour_id uuid not null references public.business_hours(id) on delete cascade,
  lang_code text not null check (lang_code in ('es','us','gb','fr','it')),
  day_label text,
  hours_text text,
  updated_at timestamptz not null default timezone('utc', now()),
  unique (business_hour_id, lang_code)
);

alter table public.site_settings_i18n enable row level security;
alter table public.menu_cards_i18n enable row level security;
alter table public.testimonials_i18n enable row level security;
alter table public.business_hours_i18n enable row level security;

drop policy if exists site_settings_i18n_public_read on public.site_settings_i18n;
create policy site_settings_i18n_public_read
on public.site_settings_i18n
for select
using (true);

drop policy if exists menu_cards_i18n_public_read on public.menu_cards_i18n;
create policy menu_cards_i18n_public_read
on public.menu_cards_i18n
for select
using (true);

drop policy if exists testimonials_i18n_public_read on public.testimonials_i18n;
create policy testimonials_i18n_public_read
on public.testimonials_i18n
for select
using (true);

drop policy if exists business_hours_i18n_public_read on public.business_hours_i18n;
create policy business_hours_i18n_public_read
on public.business_hours_i18n
for select
using (true);

drop policy if exists site_settings_i18n_admin_manage on public.site_settings_i18n;
create policy site_settings_i18n_admin_manage
on public.site_settings_i18n
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists menu_cards_i18n_admin_manage on public.menu_cards_i18n;
create policy menu_cards_i18n_admin_manage
on public.menu_cards_i18n
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists testimonials_i18n_admin_manage on public.testimonials_i18n;
create policy testimonials_i18n_admin_manage
on public.testimonials_i18n
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists business_hours_i18n_admin_manage on public.business_hours_i18n;
create policy business_hours_i18n_admin_manage
on public.business_hours_i18n
for all
using (public.is_admin())
with check (public.is_admin());
