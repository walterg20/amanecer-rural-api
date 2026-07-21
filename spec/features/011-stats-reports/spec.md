# 011 — Estadísticas y Reportes

Dashboard de KPIs para administradores con caché Redis. Métricas agregadas de todas las entidades del sistema.

## Entidades

### PageView (`page_views`) — opcional
| Columna | Tipo | Opciones |
|---------|------|----------|
| id | INTEGER (PK) | auto-generated |
| path | VARCHAR(255) | not null |
| ip | VARCHAR(45) | nullable |
| user_agent | VARCHAR(500) | nullable |
| user_id | INTEGER (FK) | nullable |
| created_at | TIMESTAMP | @CreateDateColumn |

Alternativa: usar Google Analytics 4 Data API (GA4) en lugar de tabla propia para page views.

## Endpoints

### Admin (roles: superadmin, admin)
| Método | Path | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/v1/admin/stats/dashboard` | JWT | KPIs globales (totales: posts, users, provenientes, eventos, remates, clasificados) |
| GET | `/api/v1/admin/stats/posts` | JWT | Posts agrupados por mes/año. Query: `?anio=` |
| GET | `/api/v1/admin/stats/users` | JWT | Registros de usuarios por mes/año |
| GET | `/api/v1/admin/stats/revenue` | JWT | Ingresos por mes/año (desde payments) |
| GET | `/api/v1/admin/stats/export/csv` | JWT | Exportar dashboard como CSV. Query: `?from=&to=&section=` |

## DTOs

### QueryStatsDto
- `anio?` (IsInt, Min 2000, Max 2100) — default: año actual
- `from?` (IsDateString)
- `to?` (IsDateString)
- `section?` (IsString — 'posts', 'users', 'revenue', 'all')

### Response dashboard
```typescript
interface DashboardResponse {
  totalPosts: number
  totalUsers: number
  totalProveedores: number
  totalEventos: number
  totalRemates: number
  totalClasificados: number
  postsPorMes: { mes: number, anio: number, count: number }[]
  usersPorMes: { mes: number, anio: number, count: number }[]
  revenuePorMes: { mes: number, anio: number, total: number }[]
}
```

## Caché
- CacheKey: `stats:dashboard:{anio}` (TTL: 5 min)
- CacheKey: `stats:posts:{anio}` (TTL: 10 min)
- CacheKey: `stats:users:{anio}` (TTL: 10 min)
- CacheKey: `stats:revenue:{anio}` (TTL: 5 min)
- Invalidar al crear/editar una entidad del tipo correspondiente
- Usar Redis a través de `@nestjs/cache-manager`

## Exportación CSV
- Usar `csv-stringify` o `json2csv`
- Headers dinámicos según sección
- Stream directo a response (`res.setHeader('Content-Type', 'text/csv')`)
- Filename: `reporte-{section}-{YYYY-MM-DD}.csv`
