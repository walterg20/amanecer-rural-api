# 012 — Migración de Datos del Sitio PHP Actual

Script para importar contenido de amanecerrural.com.ar (PHP + MySQL) a la nueva base de datos PostgreSQL.

## Enfoque

Dos alternativas:
1. **DB directa** — conectar a MySQL del sitio actual y leer tablas
2. **Script standalone** — leer dump SQL o CSV exportado

Priorizar opción 1 si hay acceso a credenciales de la DB actual.

## Entidades a migrar

| Entidad destino | Fuente PHP | Notas |
|----------------|------------|-------|
| posts (noticias) | `wp_posts` (tipo: post) | Mapear wp_categories a categorías nuevas |
| posts (notas técnicas) | `wp_posts` (tipo: nota_tecnica o categoría) | Si son custom post type |
| posts (revistas) | `wp_posts` (tipo: revista) | PDF adjunto → metadata.post |
| media | `wp_posts` (tipo: attachment) | Descargar imágenes al servidor nuevo |
| categories | `wp_terms` + `wp_term_taxonomy` | Mapear slugs a categorías nuevas |
| users | `wp_users` | Opcional — migrar autores |
| proveedores | Tabla custom `proveedores` | Según estructura PHP |
| eventos | Tabla custom `eventos` | Según estructura PHP |
| remates | Tabla custom `remates` | Según estructura PHP |
| clasificados | Tabla custom `clasificados` | Según estructura PHP |

## Script

Archivo: `scripts/migrate.ts`

### Parámetros vía .env
```
MIGRATE_SOURCE=mysql://user:pass@host:3306/amanecer_rural
MIGRATE_TYPES=posts,media,proveedores,eventos,remates,clasificados
MIGRATE_DRY_RUN=true
```

### Flujo
1. Conectar a MySQL fuente
2. Leer tablas una por una
3. Transformar datos al schema TypeORM destino
4. Insertar batch en PostgreSQL
5. Registrar en tabla `migration_log` cada registro procesado

### Tabla aux: migration_log
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | INTEGER PK | auto |
| source_table | VARCHAR | tabla origen |
| source_id | INTEGER | ID en origen |
| target_table | VARCHAR | tabla destino |
| target_id | INTEGER | ID generado |
| status | ENUM('ok','error') | |
| error_message | TEXT | nullable |
| created_at | TIMESTAMP | |

### Idempotencia
- Antes de insertar, verificar `migration_log.source_table + source_id`
- Si ya existe, skip o actualizar según flag `--force`
- Segunda ejecución no duplica registros

### Post-migración
- Contar registros fuente vs destino
- Verificar slugs únicos
- Verificar que imágenes existen en disco
- Generar reporte: `migration-report-{timestamp}.json`
