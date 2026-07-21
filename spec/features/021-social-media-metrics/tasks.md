# Tasks — Social Media Metrics

- [ ] Instalar `@nestjs/schedule`
- [ ] Configurar `ScheduleModule.forRoot()` en módulo
- [ ] Crear entidad `SocialMetric` (social_post_id FK, platform, platform_post_id, likes, shares, comments, views, reach, engagements, fetched_at, created_at)
- [ ] Implementar `fetchFacebookMetrics()` — consultar likes, shares, comments desde Graph API
- [ ] Implementar `fetchInstagramMetrics()` — consultar like_count, comments_count, play_count, reach
- [ ] Implementar `syncAll()` — iterar SocialPost publicados + fetch + guardar snapshot
- [ ] Crear cron job: `@Cron('0 6 * * *')` para sync diario a las 6 AM
- [ ] Crear `AdminSocialMetricsController`:
  - [ ] GET `/admin/social/metrics` — dashboard agregado
  - [ ] GET `/admin/social/metrics/top` — top 10
  - [ ] GET `/admin/social/metrics/:socialPostId` — histórico
  - [ ] POST `/admin/social/metrics/sync` — sync manual
- [ ] Crear `SocialMetricsQueryDto` (platform?, from?, to?)
- [ ] Agregar `totalSocialEngagements` al StatsService dashboard
- [ ] Registrar todas las nuevas dependencias en SocialModule
- [ ] Test: sync manual de una publicación existente
