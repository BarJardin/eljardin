# Deploy en Vercel: frontend-only con Supabase

Este proyecto se despliega como aplicacion Next.js sin backend Python.

## Como funciona

- Vercel publica solo el frontend Next.js.
- El frontend consulta directamente Supabase mediante `src/lib/supabase-public.ts`.

## Paso a paso

1. En Vercel, importa la carpeta `frontend-carta` como proyecto.
2. Configura variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Build command: autodetectado por Vercel (Next.js).
4. Deploy.

## Estructura relevante

- `src/` interfaz Next.js
- `src/lib/supabase-public.ts` acceso a datos de Supabase

## Desarrollo local

```bash
npm install
npm run dev
```
