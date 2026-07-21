# 004 — Módulo de Clasificados

Anuncios clasificados agropecuarios con 4 categorías, búsqueda, planes gratis/premium y galería de imágenes.

## Entidades

### Clasificado (`clasificados`)
| Columna | Tipo | Opciones |
|---------|------|----------|
| id | INTEGER (PK) | auto-generated |
| title | VARCHAR(255) | not null |
| slug | VARCHAR(255) | unique, not null |
| description | TEXT | nullable |
| categoria_id | INTEGER (FK → categorias_clasificados.id) | not null |
| price | DECIMAL(12,2) | nullable |
| condicion | ENUM('nuevo','usado') | default: 'nuevo' |
| provincia | VARCHAR(100) | nullable |
| localidad | VARCHAR(100) | nullable |
| direccion | VARCHAR(255) | nullable |
| telefono | VARCHAR(50) | nullable |
| email | VARCHAR(255) | nullable |
| website | VARCHAR(255) | nullable |
| imagen_principal | VARCHAR | nullable |
| galeria | JSON | nullable (array de URLs) |
| plan | ENUM('gratis','destacado','premium') | default: 'gratis' |
| status | ENUM('pending','approved','rejected','expired') | default: 'pending' |
| expires_at | TIMESTAMP | nullable |
| user_id | INTEGER (FK → users.id) | nullable (opcional si requiere login) |
| created_at | TIMESTAMP | @CreateDateColumn |
| updated_at | TIMESTAMP | @UpdateDateColumn |
| deleted_at | TIMESTAMP | @DeleteDateColumn |

Relations: `@ManyToOne → CategoriaClasificado`, `@ManyToOne → User`

### CategoriaClasificado (`categorias_clasificados`)
| Columna | Tipo | Opciones |
|---------|------|----------|
| id | INTEGER (PK) | auto-generated |
| name | VARCHAR(100) | not null |
| slug | VARCHAR(100) | unique |
| icon | VARCHAR | nullable |
| order | INTEGER | default: 0 |

Datos semilla (4 categorías fijas):
1. Maquinarias y Vehículos
2. Servicios
3. Campos y Haciendas
4. Productos

## Endpoints

### Públicos
| Método | Path | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/v1/clasificados` | No | Listar clasificados activos. Query: `?categoria=&provincia=&nombre=&condicion=&plan=&page=&limit=` |
| GET | `/api/v1/clasificados/:slug` | No | Detalle con galería |
| GET | `/api/v1/clasificados/categorias` | No | Listar categorías |

### Admin (roles: superadmin, admin)
| Método | Path | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/v1/admin/clasificados` | JWT | Crear clasificado |
| GET | `/api/v1/admin/clasificados` | JWT | Listar todos (incluyendo pending/rejected) |
| PATCH | `/api/v1/admin/clasificados/:id` | JWT | Actualizar |
| DELETE | `/api/v1/admin/clasificados/:id` | JWT | Soft delete |
| PATCH | `/api/v1/admin/clasificados/:id/status` | JWT | Aprobar/rechazar (cambia status) |
| POST | `/api/v1/admin/clasificados/upload` | JWT | Subir imagen |

## DTOs

### CreateClasificadoDto
- `title` (IsString, MinLength 3, MaxLength 255)
- `description?` (IsString)
- `categoriaId` (IsInt)
- `price?` (IsNumber, Min 0)
- `condicion?` (IsEnum: nuevo, usado)
- `provincia?` (IsString)
- `localidad?` (IsString)
- `direccion?` (IsString)
- `telefono?` (IsString)
- `email?` (IsEmail, optional)
- `website?` (IsString)
- `imagenPrincipal?` (IsString)
- `galeria?` (IsArray)
- `plan?` (IsEnum: gratis, destacado, premium)

### QueryClasificadosDto
- `categoria?` (IsString — slug de categoría)
- `provincia?` (IsString)
- `nombre?` (IsString — búsqueda LIKE en title)
- `condicion?` (IsEnum: nuevo, usado)
- `plan?` (IsEnum: gratis, destacado, premium)
- `page?` (IsInt, Min 1)
- `limit?` (IsInt, Min 1, Max 100)

## Servicios
- `ClasificadoService.findAll(query)` — solo status=approved para público; query builder con joins
- `ClasificadoService.findBySlug(slug)` — con categoría
- `ClasificadoService.create(dto)` — auto-slugify
- `ClasificadoService.update(id, dto)` — re-slugify si cambió title
- `ClasificadoService.softDelete(id)` — soft delete
- `ClasificadoService.approve(id)` — cambia status a approved, setea expires_at según plan
- `ClasificadoService.reject(id)` — cambia status a rejected
- `CategoriaClasificadoService.findAll()` — todas las categorías
- `CategoriaClasificadoService.seed()` — seed 4 categorías si tabla vacía

## Planes y expiración
- Gratis: expires_at = 3 meses
- Destacado: expires_at = 6 meses
- Premium: expires_at = 12 meses
- Job programado (cron/scheduler) para marcar como expired los vencidos
