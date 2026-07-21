# 003 — Módulo de Remates

Sistema de gestión de remates agropecuarios con lotes, fechas, resultados, contacto de rematadores y plan premium.

## Entidades

### Auction (`remates`)
| Columna | Tipo | Opciones |
|---------|------|----------|
| id | INTEGER (PK) | auto-generated |
| title | VARCHAR(255) | not null |
| slug | VARCHAR(255) | unique, not null |
| description | TEXT | nullable |
| date | DATE | not null |
| time | TIME | nullable |
| location | VARCHAR(255) | not null |
| province | VARCHAR(100) | not null |
| type | ENUM('cabana','exposicion','general') | not null |
| status | ENUM('scheduled','in_progress','finished','cancelled') | default: 'scheduled' |
| auctioneer_id | INTEGER (FK → auctioneers.id) | nullable |
| featured_image | VARCHAR | nullable |
| premium | BOOLEAN | default: false |
| destacado | BOOLEAN | default: false |
| created_at | TIMESTAMP | @CreateDateColumn |
| updated_at | TIMESTAMP | @UpdateDateColumn |
| deleted_at | TIMESTAMP | @DeleteDateColumn |

Relations: `@ManyToOne → Auctioneer`, `@OneToMany → Lot`

### Lot (`lotes`)
| Columna | Tipo | Opciones |
|---------|------|----------|
| id | INTEGER (PK) | auto-generated |
| auction_id | INTEGER (FK → remates.id) | not null, onDelete CASCADE |
| number | INTEGER | not null |
| title | VARCHAR(255) | not null |
| description | TEXT | nullable |
| base_price | DECIMAL(12,2) | nullable |
| sold_price | DECIMAL(12,2) | nullable |
| status | ENUM('available','sold','withdrawn') | default: 'available' |
| order | INTEGER | default: 0 |
| images | JSON | nullable (array de URLs) |
| created_at | TIMESTAMP | @CreateDateColumn |

Relations: `@ManyToOne → Auction`, `@OneToMany → LotMedia`

### Auctioneer (`rematadores`)
| Columna | Tipo | Opciones |
|---------|------|----------|
| id | INTEGER (PK) | auto-generated |
| name | VARCHAR(255) | not null |
| phone | VARCHAR(50) | nullable |
| email | VARCHAR(255) | nullable |
| website | VARCHAR(255) | nullable |
| logo | VARCHAR | nullable |
| description | TEXT | nullable |
| created_at | TIMESTAMP | @CreateDateColumn |

Relations: `@OneToMany → Auction`

### AuctionMedia (`remates_media`)
| Columna | Tipo | Opciones |
|---------|------|----------|
| id | INTEGER (PK) | auto-generated |
| auction_id | INTEGER (FK → remates.id) | nullable, onDelete CASCADE |
| lot_id | INTEGER (FK → lotes.id) | nullable, onDelete CASCADE |
| url | VARCHAR | not null |
| type | ENUM('image','video','pdf') | default: 'image' |
| created_at | TIMESTAMP | @CreateDateColumn |

## Endpoints

### Públicos
| Método | Path | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/v1/remates` | No | Listar remates activos. Query: `?type=&province=&status=&from=&to=&page=&limit=` |
| GET | `/api/v1/remates/:slug` | No | Detalle de remate con lotes |
| GET | `/api/v1/rematadores` | No | Listar rematadores |
| GET | `/api/v1/rematadores/:id` | No | Detalle de rematador con sus remates |

### Admin (roles: superadmin, admin, editor)
| Método | Path | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/v1/admin/remates` | JWT | Crear remate |
| GET | `/api/v1/admin/remates` | JWT | Listar todos (incluyendo borrados) |
| PATCH | `/api/v1/admin/remates/:id` | JWT | Actualizar remate |
| DELETE | `/api/v1/admin/remates/:id` | JWT | Soft delete |
| POST | `/api/v1/admin/remates/:id/lotes` | JWT | Agregar lote |
| PATCH | `/api/v1/admin/lotes/:id` | JWT | Actualizar lote |
| DELETE | `/api/v1/admin/lotes/:id` | JWT | Eliminar lote |
| POST | `/api/v1/admin/rematadores` | JWT | Crear rematador |
| PATCH | `/api/v1/admin/rematadores/:id` | JWT | Actualizar rematador |
| DELETE | `/api/v1/admin/rematadores/:id` | JWT | Eliminar rematador |
| POST | `/api/v1/admin/remates/upload` | JWT | Subir imagen (misma lógica que posts) |

## DTOs

### CreateRemateDto
- `title` (IsString, MinLength 3, MaxLength 255)
- `description?` (IsString)
- `date` (IsDateString)
- `time?` (IsString)
- `location` (IsString, MaxLength 255)
- `province` (IsString, MaxLength 100)
- `type` (IsEnum: cabana, exposicion, general)
- `status?` (IsEnum: scheduled, in_progress, finished, cancelled)
- `auctioneerId?` (IsInt)
- `featuredImage?` (IsString)
- `premium?` (IsBoolean)
- `destacado?` (IsBoolean)

### CreateLoteDto
- `title` (IsString, MinLength 3, MaxLength 255)
- `number` (IsInt)
- `description?` (IsString)
- `basePrice?` (IsNumber)
- `soldPrice?` (IsNumber)
- `order?` (IsInt)

## Servicios
- `AuctionService.findAll(query)` — QueryBuilder con filtros, paginación, solo status != cancelled por defecto
- `AuctionService.findBySlug(slug)` — con lotes ordenados, auctioneer eager
- `AuctionService.create(dto)` — auto-slugify title
- `AuctionService.update(id, dto)` — re-slugify si cambió title
- `AuctionService.softDelete(id)` — soft delete en cascada
- `AuctionService.addLot(auctionId, dto)` — validar que auction existe
- `AuctionService.updateLot(id, dto)` — actualizar lote
- `AuctionService.deleteLot(id)` — hard delete (no crítico)
- `AuctioneerService.findAll()` — con count de remates
- `AuctioneerService.create(dto)` — crear rematador

## Máquina de estados
```
scheduled → in_progress → finished
scheduled → cancelled
in_progress → finished
```
