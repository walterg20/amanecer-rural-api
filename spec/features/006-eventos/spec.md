# 006 — Módulo de Eventos

Agenda de eventos agropecuarios con filtros por mes/año/provincia, eventos próximos y pasados, planes gratis/premium.

## Entidades

### Evento (`eventos`)
| Columna | Tipo | Opciones |
|---------|------|----------|
| id | INTEGER (PK) | auto-generated |
| title | VARCHAR(255) | not null |
| slug | VARCHAR(255) | unique |
| description | TEXT | nullable |
| fecha | DATE | not null |
| fecha_fin | DATE | nullable |
| ubicacion | VARCHAR(255) | not null |
| provincia | VARCHAR(100) | not null |
| localidad | VARCHAR(100) | nullable |
| organizador | VARCHAR(255) | nullable |
| image | VARCHAR | nullable |
| plan | ENUM('gratis','destacado','premium') | default: 'gratis' |
| status | ENUM('pending','approved','rejected') | default: 'pending' |
| user_id | INTEGER (FK → users.id) | nullable |
| created_at | TIMESTAMP | @CreateDateColumn |
| updated_at | TIMESTAMP | @UpdateDateColumn |
| deleted_at | TIMESTAMP | @DeleteDateColumn |

## Endpoints

### Públicos
| Método | Path | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/v1/eventos` | No | Listar eventos próximos. Query: `?mes=&anio=&provincia=&page=&limit=` |
| GET | `/api/v1/eventos/pasados` | No | Listar eventos pasados. Query: `?mes=&anio=&provincia=&page=&limit=` |
| GET | `/api/v1/eventos/:slug` | No | Detalle del evento |

### Admin (roles: superadmin, admin)
| Método | Path | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/v1/admin/eventos` | JWT | Crear evento |
| GET | `/api/v1/admin/eventos` | JWT | Listar todos (incluyendo pending) |
| PATCH | `/api/v1/admin/eventos/:id` | JWT | Actualizar |
| DELETE | `/api/v1/admin/eventos/:id` | JWT | Soft delete |
| PATCH | `/api/v1/admin/eventos/:id/status` | JWT | Aprobar/rechazar |
| POST | `/api/v1/admin/eventos/upload` | JWT | Subir imagen |

## DTOs

### CreateEventoDto
- `title` (IsString, MinLength 3, MaxLength 255)
- `description?` (IsString)
- `fecha` (IsDateString)
- `fechaFin?` (IsDateString)
- `ubicacion` (IsString, MaxLength 255)
- `provincia` (IsString, MaxLength 100)
- `localidad?` (IsString)
- `organizador?` (IsString)
- `image?` (IsString)
- `plan?` (IsEnum: gratis, destacado, premium)

### QueryEventosDto
- `mes?` (IsInt, Min 1, Max 12)
- `anio?` (IsInt)
- `provincia?` (IsString)
- `page?` (IsInt, Min 1)
- `limit?` (IsInt, Min 1, Max 100)

## Servicios
- `EventoService.findProximos(query)` — fecha >= hoy, status=approved, orden ASC
- `EventoService.findPasados(query)` — fecha < hoy, status=approved, orden DESC
- `EventoService.findBySlug(slug)` — detalle
- `EventoService.create(dto)` — auto-slugify
- `EventoService.update(id, dto)` — re-slugify
- `EventoService.softDelete(id)`
- `EventoService.approve(id)` / `reject(id)`
