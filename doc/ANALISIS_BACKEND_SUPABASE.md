# Analisis tecnico: area privada en backend + Supabase

## Objetivo
Crear un area privada para gestionar el contenido que se muestra en el frontend.
El frontend publico no debe tener datos hardcodeados: debe leer informacion directamente desde Supabase.

## Estado actual (base del proyecto)
Hoy el frontend tiene contenido estatico en componentes:
- Tarjetas de menu social en src/app/social/page.tsx
- Testimonios en src/app/social/TestimonialsSection.tsx
- Contacto/ubicacion/horarios en src/app/social/FindUsSection.tsx
- Datos de footer en src/app/social/FooterSection.tsx

El backend actual (api/index.py) solo expone:
- GET /health
- GET /v1/menu (respuesta fija)

## Arquitectura propuesta

### 1) Fuente unica de verdad
Supabase Postgres como storage principal de contenido.

### 2) Sin endpoint entre frontend y backend
No habra capa API intermedia para el frontend publico.

- Frontend: consume Supabase directamente con cliente JS
- Backend: consume Supabase para procesos internos, tareas privadas, integraciones o automatizaciones

Con este enfoque, frontend y backend comparten la misma fuente de datos, pero sin comunicarse entre si por endpoints propios.

### 3) Autenticacion para area privada
Usar Supabase Auth para login de administradores.
Flujo recomendado:
- Admin inicia sesion y obtiene JWT de Supabase
- Frontend admin opera contra Supabase segun politicas RLS
- El rol admin se valida en politicas RLS y/o en metadata del usuario

## Modelo de datos recomendado (Supabase)

### Tabla site_settings
Configuracion global del negocio.
Campos sugeridos:
- id (uuid, pk)
- business_name (text)
- address_line_1 (text)
- address_line_2 (text)
- phone (text)
- maps_link (text)
- maps_embed_url (text)
- updated_at (timestamptz)

### Tabla menu_cards
Tarjetas del carrusel principal.
Campos sugeridos:
- id (uuid, pk)
- title (text)
- route_label (text)
- href (text)
- image_url (text)
- sort_order (int)
- is_active (boolean)
- updated_at (timestamptz)

### Tabla testimonials
Opiniones visibles en frontend.
Campos sugeridos:
- id (uuid, pk)
- quote (text)
- author (text)
- rating (int check 1..5)
- sort_order (int)
- is_active (boolean)
- updated_at (timestamptz)

### Tabla business_hours
Horarios de apertura.
Campos sugeridos:
- id (uuid, pk)
- day_label (text)
- hours_text (text)
- sort_order (int)
- is_active (boolean)

### Tabla admin_users
Control simple de usuarios admin.
Campos sugeridos:
- user_id (uuid, pk) debe coincidir con auth.users.id
- role (text) por ejemplo: admin
- created_at (timestamptz)

## Politicas de seguridad (RLS)

### Lectura publica
Permitir select de tablas de contenido solo sobre filas is_active = true (cuando aplique).

### Escritura privada
Permitir insert/update/delete solo a usuarios autenticados con rol admin.

Recomendacion:
- Activar RLS en todas las tablas
- No exponer service key en frontend
- Usar service key solo en backend protegido (si hay procesos de sistema)

## Contrato de acceso a datos (sin API intermedia)

### Frontend publico
- Lectura directa desde Supabase de:
  - site_settings
  - menu_cards
  - testimonials
  - business_hours

### Area privada (admin)
- CRUD directo en Supabase para:
  - menu_cards
  - testimonials
  - site_settings
  - business_hours

Todas las operaciones quedan controladas por Supabase Auth + RLS.

## Cambios necesarios en frontend

### Frontend publico
Reemplazar datos estaticos por consultas directas a Supabase:
- SocialPage -> cargar menu_cards
- TestimonialsSection -> cargar testimonials
- FindUsSection y FooterSection -> cargar site_settings y business_hours

### Area privada (nueva)
Crear una ruta protegida tipo /admin para gestionar:
- Tarjetas del carrusel (alta/edicion/baja)
- Testimonios
- Datos generales del negocio
- Horarios

Esta area admin tambien consultara/escribira directo en Supabase, sin pasar por FastAPI.

## Variables de entorno esperadas

### Backend
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY (solo backend)
- SUPABASE_ANON_KEY (opcional)

### Frontend
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

## Plan de implementacion sugerido

1. Crear esquema SQL + RLS en Supabase
2. Configurar cliente Supabase en frontend publico
3. Configurar auth admin en frontend (/admin)
4. Implementar CRUD admin directo en Supabase
5. Implementar cliente Supabase en backend para tareas internas
6. Probar flujo completo (lectura publica + gestion privada)

## Riesgos y decisiones pendientes
- Definir si las imagenes se guardaran en Supabase Storage o URL externa
- Definir idioma final de labels y textos de negocio
- Definir si el frontend admin usara SSR o cliente puro
- Definir auditoria de cambios (quien modifico y cuando)

## Entregable siguiente (si avanzamos implementacion)
En el siguiente paso se puede crear una primera version funcional con:
- Supabase schema inicial
- Migracion del frontend para leer solo desde Supabase
- Pantalla /admin minima para editar contenido clave
- Integracion de backend con Supabase para procesos internos
