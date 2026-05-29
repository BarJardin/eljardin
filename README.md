# Frontend Next.js con Supabase directo

Este proyecto usa solo frontend (Next.js) para consultar datos directamente desde Supabase y mostrarlos en la web.

## Arquitectura

- Frontend: Next.js (App Router)
- Datos: Supabase REST API con claves publicas de entorno

No hay backend Python ni capa intermedia `/api/*` en esta configuracion.

## Variables de entorno

Configura estas variables en `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_MENU_IMAGES_BUCKET=menu-images`
- `NEXT_PUBLIC_SUPABASE_MENU_ITEM_VIDEOS_BUCKET=menu-item-videos`

## Desarrollo local

```bash
npm install
npm run dev
```

Frontend: `http://localhost:3000`

## Capa de datos

El acceso de lectura esta en `src/lib/supabase-public.ts`.

La home social consume:

- `site_settings`
- `menu_cards`
- `menu_items`
- `testimonials`
- `business_hours`

Al hacer click en una categoria (`menu_cards.href`), la app resuelve una vista de detalle con los platos (`menu_items`) asociados a esa card.

## Idiomas (auto/manual)

- Selector de idioma en la esquina superior derecha de la home social.
- Modo `AUTO` (detecta idioma del navegador) y modos manuales `ES`, `US`, `GB`, `FR`, `IT`.
- La preferencia se persiste en `localStorage` y en query param `lang` para mantenerla en la navegacion.

Ejemplos:

- `/?lang=auto`
- `/?lang=es`
- `/?lang=fr`

## Esquema SQL para contenido multidioma

Para preparar traducciones de contenido dinamico en Supabase, ejecutar:

- `sql/006_i18n_content_schema.sql`

## Subcategorias de platos y videos

Para habilitar platos dentro de cada categoria y guardar videos verticales en Supabase, ejecutar tambien:

- `sql/007_menu_items_schema.sql`
- `sql/008_storage_menu_item_videos.sql`

En `/admin`, cada `Menu Card` incluye ahora una subseccion para crear un numero indeterminado de platos con:

- titulo
- descripcion
- video vertical
- orden
- estado activo
