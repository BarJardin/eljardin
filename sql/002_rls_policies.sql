-- 002_rls_policies.sql
-- Politicas RLS para lectura publica y escritura admin

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
      and au.role = 'admin'
  );
$$;

alter table public.site_settings enable row level security;
alter table public.menu_cards enable row level security;
alter table public.testimonials enable row level security;
alter table public.business_hours enable row level security;
alter table public.admin_users enable row level security;

-- site_settings: lectura publica (normalmente habra 1 fila)
drop policy if exists site_settings_public_read on public.site_settings;
create policy site_settings_public_read
on public.site_settings
for select
using (true);

drop policy if exists site_settings_admin_manage on public.site_settings;
create policy site_settings_admin_manage
on public.site_settings
for all
using (public.is_admin())
with check (public.is_admin());

-- menu_cards
drop policy if exists menu_cards_public_read on public.menu_cards;
create policy menu_cards_public_read
on public.menu_cards
for select
using (is_active = true);

drop policy if exists menu_cards_admin_manage on public.menu_cards;
create policy menu_cards_admin_manage
on public.menu_cards
for all
using (public.is_admin())
with check (public.is_admin());

-- testimonials
drop policy if exists testimonials_public_read on public.testimonials;
create policy testimonials_public_read
on public.testimonials
for select
using (is_active = true);

drop policy if exists testimonials_admin_manage on public.testimonials;
create policy testimonials_admin_manage
on public.testimonials
for all
using (public.is_admin())
with check (public.is_admin());

-- business_hours
drop policy if exists business_hours_public_read on public.business_hours;
create policy business_hours_public_read
on public.business_hours
for select
using (is_active = true);

drop policy if exists business_hours_admin_manage on public.business_hours;
create policy business_hours_admin_manage
on public.business_hours
for all
using (public.is_admin())
with check (public.is_admin());

-- admin_users: solo admins pueden leer/gestionar
drop policy if exists admin_users_admin_manage on public.admin_users;
create policy admin_users_admin_manage
on public.admin_users
for all
using (public.is_admin())
with check (public.is_admin());
