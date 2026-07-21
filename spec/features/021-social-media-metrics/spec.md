# 021 — Social Media Metrics

## Descripción
Módulo de métricas de redes sociales que recolecta datos de engagement (likes, shares, comments, views, reach) desde Meta Graph API para las publicaciones realizadas por el motor de auto-publicación (F020). Almacena el histórico y lo expone en el dashboard de administración.

## Dependencias
- `facebook-nodejs-business-sdk` (desde F018)
- `@nestjs/schedule` — Cron jobs para sincronización periódica

## Entidades
### SocialMetric
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | int (PK) | Auto |
| social_post_id | int (FK→social_posts) | Publicación asociada |
| platform | enum('facebook','instagram') | |
| platform_post_id | varchar | ID en la plataforma |
| likes | int | |
| shares | int | |
| comments | int | |
| views | int | (Instagram: plays, FB: post impressions) |
| reach | int | Alcance |
| engagements | int | Interacciones totales |
| fetched_at | timestamp | Cuándo se consultó la API |
| created_at | timestamp | |

## Endpoints
- `GET /api/v1/admin/social/metrics` — Dashboard de métricas agregadas
  - Query params: `?platform=facebook&from=2025-01-01&to=2025-12-31`
- `GET /api/v1/admin/social/metrics/:socialPostId` — Detalle de una publicación
- `GET /api/v1/admin/social/metrics/top` — Top publicaciones por engagement
  - Query params: `?period=week&limit=10`
- `POST /api/v1/admin/social/metrics/sync` — Forzar sincronización manual

## Criterios de aceptación
- [ ] `@nestjs/schedule` instalado
- [ ] Cron job diario (configurable) que sincroniza métricas de todas las publicaciones de los últimos 30 días
- [ ] Para Facebook: `/{post-id}?fields=likes.summary(true),shares,comments.summary(true),insights`
- [ ] Para Instagram: `/{media-id}?fields=like_count,comments_count,play_count,reach`
- [ ] Se almacena un snapshot diario en `SocialMetric` (no se sobreescribe, se agrega nueva fila para tracking histórico)
- [ ] Dashboard devuelve métricas agregadas (totales, promedios) por período y plataforma
- [ ] Endpoint `GET /metrics/top` devuelve top 10 publicaciones con más engagement en el período
- [ ] Endpoint `POST /sync` permite forzar sincronización inmediata (protegido admin)
- [ ] Integración con StatsService: se agrega `totalSocialMetrics` al dashboard general (F017)
