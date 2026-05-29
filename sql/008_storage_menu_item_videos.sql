-- 008_storage_menu_item_videos.sql
-- Bucket y policies para videos verticales de platos.
-- Ejecutar en Supabase SQL Editor despues de 002/004.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'menu-item-videos',
  'menu-item-videos',
  true,
  52428800,
  array['video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "menu_item_videos_public_read" on storage.objects;
create policy "menu_item_videos_public_read"
on storage.objects
for select
to public
using (bucket_id = 'menu-item-videos');

drop policy if exists "menu_item_videos_admin_insert" on storage.objects;
create policy "menu_item_videos_admin_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'menu-item-videos' and public.is_admin());

drop policy if exists "menu_item_videos_admin_update" on storage.objects;
create policy "menu_item_videos_admin_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'menu-item-videos' and public.is_admin())
with check (bucket_id = 'menu-item-videos' and public.is_admin());

drop policy if exists "menu_item_videos_admin_delete" on storage.objects;
create policy "menu_item_videos_admin_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'menu-item-videos' and public.is_admin());
