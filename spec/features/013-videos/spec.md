# 013 — Videos (TV) API

Endpoint para servir datos de videos de YouTube organizados por programa. Simple CRUD administrable.

## Entidades

### Video (`videos`)
| Columna | Tipo | Opciones |
|---------|------|----------|
| id | INTEGER (PK) | auto-generated |
| youtube_id | VARCHAR(50) | not null |
| title | VARCHAR(255) | not null |
| seccion | ENUM('amanecer-rural-tv','avance-rural-tv') | not null |
| fecha | DATE | nullable |
| orden | INTEGER | default: 0 |
| status | ENUM('published','draft') | default: 'published' |
| created_at | TIMESTAMP | @CreateDateColumn |
| updated_at | TIMESTAMP | @UpdateDateColumn |

## Endpoints

### Públicos
| Método | Path | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/v1/videos` | No | Listar videos publicados. Query: `?seccion=&page=&limit=` |
| GET | `/api/v1/videos/programas` | No | Metadata de programas (descripción, horarios, canales) |

### Admin (roles: superadmin, admin)
| Método | Path | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/v1/admin/videos` | JWT | Crear video |
| GET | `/api/v1/admin/videos` | JWT | Listar todos (incluyendo drafts) |
| PATCH | `/api/v1/admin/videos/:id` | JWT | Actualizar |
| DELETE | `/api/v1/admin/videos/:id` | JWT | Soft delete |
| POST | `/api/v1/admin/videos/reorder` | JWT | Reordenar (batch update orden) |

## DTOs

### CreateVideoDto
- `youtubeId` (IsString, MinLength 5, MaxLength 50)
- `title` (IsString, MinLength 2, MaxLength 255)
- `seccion` (IsEnum: amanecer-rural-tv, avance-rural-tv)
- `fecha?` (IsDateString)
- `orden?` (IsInt)

### ProgramaTV data (configurable, desde DB o archivo)
```typescript
interface ProgramaTV {
  seccion: string
  nombre: string
  descripcion: string
  horarios: string
  canales: string[]
}
```

### Archivo de seed
- `src/videos/data/programas.ts` — datos fijos de los dos programas
- `src/videos/data/videos.seed.ts` — videos iniciales si aplica

## Servicios
- `VideosService.findAll(seccion?, page?, limit?)` — published, orden ASC
- `VideosService.findProgramas()` — retorna array con metadata de los 2 programas
- `VideosService.create(dto)`
- `VideosService.update(id, dto)`
- `VideosService.softDelete(id)`
- `VideosService.reorder(items: {id, orden}[])` — actualizar orden en batch
