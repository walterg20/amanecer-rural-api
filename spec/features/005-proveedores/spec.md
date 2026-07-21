# 005 — Directorio de Proveedores

Directorio de empresas y proveedores del sector agropecuario con perfiles, ~140 rubros, planes gratis/premium y slider destacados.

## Entidades

### Proveedor (`proveedores`)
| Columna | Tipo | Opciones |
|---------|------|----------|
| id | INTEGER (PK) | auto-generated |
| nombre | VARCHAR(255) | not null |
| slug | VARCHAR(255) | unique |
| rubro_id | INTEGER (FK → rubros.id) | not null |
| descripcion | TEXT | nullable |
| logo | VARCHAR | nullable |
| direccion | VARCHAR(255) | nullable |
| provincia | VARCHAR(100) | not null |
| localidad | VARCHAR(100) | nullable |
| telefono | VARCHAR(50) | nullable |
| email | VARCHAR(255) | nullable |
| website | VARCHAR(255) | nullable |
| whatsapp | VARCHAR(50) | nullable |
| galeria | JSON | nullable (array de URLs) |
| plan | ENUM('gratis','destacado','premium') | default: 'gratis' |
| status | ENUM('pending','approved','rejected') | default: 'pending' |
| expires_at | TIMESTAMP | nullable |
| destacado | BOOLEAN | default: false |
| user_id | INTEGER (FK → users.id) | nullable |
| created_at | TIMESTAMP | @CreateDateColumn |
| updated_at | TIMESTAMP | @UpdateDateColumn |
| deleted_at | TIMESTAMP | @DeleteDateColumn |

Relations: `@ManyToOne → Rubro`, `@ManyToOne → User`

### Rubro (`rubros`)
| Columna | Tipo | Opciones |
|---------|------|----------|
| id | INTEGER (PK) | auto-generated |
| nombre | VARCHAR(100) | not null |
| slug | VARCHAR(100) | unique |
| description | VARCHAR | nullable |

Seed: ~140 rubros (ACOPIADORES DE CEREALES, AGROQUIMICOS, CABAÑAS, CONSIGNATARIAS, MAQUINARIAS E IMPLEMENTOS AGRICOLAS, SEMILLAS, VETERINARIAS, etc.)

## Endpoints

### Públicos
| Método | Path | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/v1/proveedores` | No | Listar proveedores. Query: `?rubro=&provincia=&nombre=&plan=&destacado=&page=&limit=` |
| GET | `/api/v1/proveedores/:slug` | No | Perfil completo |
| GET | `/api/v1/proveedores/destacados` | No | Lista corta para slider (limit=10, destacados) |
| GET | `/api/v1/rubros` | No | Listar rubros con count de proveedores |

### Admin (roles: superadmin, admin)
| Método | Path | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/v1/admin/proveedores` | JWT | Crear proveedor |
| GET | `/api/v1/admin/proveedores` | JWT | Listar todos (incluyendo pending) |
| PATCH | `/api/v1/admin/proveedores/:id` | JWT | Actualizar |
| DELETE | `/api/v1/admin/proveedores/:id` | JWT | Soft delete |
| PATCH | `/api/v1/admin/proveedores/:id/status` | JWT | Aprobar/rechazar |
| PATCH | `/api/v1/admin/proveedores/:id/destacado` | JWT | Alternar destacado |
| POST | `/api/v1/admin/proveedores/upload` | JWT | Subir logo/imagen |
| POST | `/api/v1/admin/rubros` | JWT | Crear rubro |
| PATCH | `/api/v1/admin/rubros/:id` | JWT | Actualizar rubro |
| DELETE | `/api/v1/admin/rubros/:id` | JWT | Eliminar rubro |

## DTOs

### CreateProveedorDto
- `nombre` (IsString, MinLength 2, MaxLength 255)
- `rubroId` (IsInt)
- `descripcion?` (IsString)
- `logo?` (IsString)
- `direccion?` (IsString)
- `provincia` (IsString)
- `localidad?` (IsString)
- `telefono?` (IsString)
- `email?` (IsEmail)
- `website?` (IsString)
- `whatsapp?` (IsString)
- `plan?` (IsEnum: gratis, destacado, premium)

### QueryProveedoresDto
- `rubro?` (IsString — slug o id)
- `provincia?` (IsString)
- `nombre?` (IsString — búsqueda LIKE)
- `plan?` (IsEnum)
- `destacado?` (IsBooleanString)
- `page?` (IsInt, Min 1)
- `limit?` (IsInt, Min 1, Max 100)

## Servicios
- `ProveedorService.findAll(query)` — solo approved para público
- `ProveedorService.findBySlug(slug)` — eager load rubro
- `ProveedorService.findDestacados(limit)` — approved + destacado true
- `ProveedorService.create(dto)` — auto-slugify nombre
- `ProveedorService.update(id, dto)` — re-slugify
- `ProveedorService.approve(id)` / `reject(id)`
- `ProveedorService.toggleDestacado(id)`
- `RubroService.findAll()` — con count de proveedores approved
- `RubroService.create(dto)` / `update(id, dto)` / `delete(id)`
- `RubroService.seed()` — seed ~140 rubros si tabla vacía
