# 017 — Stats Realignment

## Descripción
Los contadores del dashboard de estadísticas (`GET /admin/stats/dashboard`) actualmente cuentan todos los registros sin filtrar por estado. Esto infla las métricas: incluye borradores, pendientes, cancelados. Esta feature corrige los contadores para reflejar solo contenido realmente publicado/aprobado, y agrega métricas de publicación social.

## Endpoints modificados
- `GET /api/v1/admin/stats/dashboard` — Contadores filtrados + nuevas métricas

## Criterios de aceptación
- [ ] `totalPosts` cuenta solo `status = 'published'`
- [ ] `totalEventos` cuenta solo `status = 'approved'`
- [ ] `totalClasificados` cuenta solo `status = 'approved'`
- [ ] `totalRemates` excluye `status = 'cancelled'`
- [ ] Se agrega `totalPostsPublishedThisMonth` al dashboard
- [ ] Se agrega `totalContentQueuedForSocial` (contenido encolado para publicar en redes)
- [ ] Se agrega `totalContentPublishedToSocial` (contenido ya publicado en al menos una red)
- [ ] `postsPorMes` cuenta solo posts publicados en ese mes
- [ ] `usersPorMes` se mantiene igual (todos los usuarios registrados)
- [ ] Cache con Redis (desde F015) mantiene TTL de 5 min para dashboard
