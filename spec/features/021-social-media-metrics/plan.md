# Plan — Social Media Metrics

## Dependencias nuevas
```json
"@nestjs/schedule": "^11.x"
```

## Archivos a crear
```
src/
├── social/
│   ├── social-metrics.controller.ts    # Dashboard + sync (admin)
│   ├── social-metrics.service.ts       # Sincronización + consultas
│   ├── entities/
│   │   └── social-metric.entity.ts
│   ├── dto/
│   │   └── social-metrics-query.dto.ts # Filtros: plataforma, fechas
│   └── cron/
│       └── social-metrics.cron.ts      # Cron job diario
```

## Archivos a modificar
- `src/social/social.module.ts` — agregar SocialMetric entity, servicios, ScheduleModule
- `src/stats/stats.service.ts` — agregar totalSocialMetrics al dashboard (desde F017)

## Pasos
1. Instalar `@nestjs/schedule`
2. Crear entidad `SocialMetric` (social_post_id FK, platform, platform_post_id, likes, shares, comments, views, reach, engagements, fetched_at)
3. Implementar `SocialMetricsService.fetchFacebookMetrics(postId, platformPostId)`:
   - Llamar a Graph API `/{post-id}?fields=likes.summary(true),shares,comments.summary(true)`
   - Retornar métricas
4. Implementar `SocialMetricsService.fetchInstagramMetrics(postId, platformPostId)`:
   - Llamar a Graph API `/{media-id}?fields=like_count,comments_count,play_count,reach`
5. Implementar `SocialMetricsService.syncAll()`:
   - Buscar SocialPost con status=published de los últimos 30 días
   - Para cada uno, fetch métricas según plataforma
   - Crear nuevo SocialMetric snapshot
   - Manejar rate limits de Meta (30 calls/seg)
6. Crear cron job `@Cron('0 6 * * *')` — ejecuta syncAll() cada día a las 6 AM
7. Crear `AdminSocialMetricsController`:
   - GET `/metrics` — agregadas por período + plataforma
   - GET `/metrics/top` — top 10 por engagement
   - GET `/metrics/:socialPostId` — histórico de una publicación
   - POST `/metrics/sync` — forzar sync inmediato (protegido admin)
8. Integrar en StatsService: agregar métrica `totalSocialEngagements` al dashboard
