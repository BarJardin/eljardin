-- 004_fix_admin_users_rls_recursion.sql
-- Corrige recursión RLS en public.admin_users al evaluar public.is_admin().
-- Ejecutar en Supabase SQL Editor despues de 001/002/003.

-- 1) Hacer is_admin() SECURITY DEFINER para evitar aplicar RLS de admin_users
--    durante la comprobación del rol.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
      and au.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

-- 2) Rehacer politicas de admin_users evitando ambiguedad.
drop policy if exists admin_users_admin_manage on public.admin_users;
drop policy if exists admin_users_select_self_or_admin on public.admin_users;

-- El usuario puede ver su propia fila (necesario para validar rol tras login).
create policy admin_users_select_self_or_admin
on public.admin_users
for select
using (user_id = auth.uid() or public.is_admin());

-- Solo admin puede insertar/actualizar/eliminar filas.
create policy admin_users_admin_manage
on public.admin_users
for all
using (public.is_admin())
with check (public.is_admin());
