# Backend + Supabase setup

## Estructura creada
- sql/001_schema.sql
- sql/002_rls_policies.sql
- sql/003_seed.sql

## Orden de ejecucion en Supabase SQL Editor
1. Ejecutar sql/001_schema.sql
2. Ejecutar sql/002_rls_policies.sql
3. Ejecutar sql/003_seed.sql

## Variables de entorno backend
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- ADMIN_USERNAME
- ADMIN_PASSWORD
- ADMIN_SESSION_SECRET

ADMIN_SESSION_SECRET debe ser una cadena aleatoria propia del proyecto. Se usa para firmar la sesion interna del panel privado.

## Endpoints internos de backend (FastAPI)
- POST /internal/admin/login
- GET /health
- GET /internal/site-settings
- PUT /internal/site-settings
- GET /internal/menu-cards
- POST /internal/menu-cards
- PUT /internal/menu-cards/{id}
- DELETE /internal/menu-cards/{id}
- GET /internal/testimonials
- POST /internal/testimonials
- PUT /internal/testimonials/{id}
- DELETE /internal/testimonials/{id}
- GET /internal/business-hours
- POST /internal/business-hours
- PUT /internal/business-hours/{id}
- DELETE /internal/business-hours/{id}

Notas:
- Los endpoints internos requieren header x-admin-session con la sesion emitida por /internal/admin/login.
- El panel privado usa usuario y contraseña para iniciar sesion y luego guarda la sesion en sessionStorage.

## Panel privado
- Ruta: /admin
- Acceso: usuario y contraseña
- Persistencia de la sesion: sessionStorage del navegador
- Uso: gestionar site_settings, menu_cards, testimonials y business_hours
