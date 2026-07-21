# Plan — Stats Realignment

## Archivos a modificar
- `src/stats/stats.service.ts` — filtrar queries, agregar nuevas métricas

## Pasos
1. Modificar `totalPosts`: cambiar `this.postRepo.count()` → `this.postRepo.count({ where: { status: PostStatus.PUBLISHED } })`
2. Modificar `totalEventos`: cambiar `this.eventoRepo.count()` → `this.eventoRepo.count({ where: { status: EventoStatus.APPROVED } })`
3. Modificar `totalClasificados`: cambiar count → filtro por `ClasificadoStatus.APPROVED`
4. Modificar `totalRemates`: cambiar count → filtrar `Not(Equal(AuctionStatus.CANCELLED))`
5. Agregar `totalPostsPublishedThisMonth`: count posts con publishedAt en el mes actual
6. Agregar `totalContentQueuedForSocial`: count desde entidad SocialPost (F020) con status='queued'
7. Agregar `totalContentPublishedToSocial`: count desde SocialPost con status='published' (distinct entityId)
8. Modificar `getPostsByMonth()`: filtrar por `status: PostStatus.PUBLISHED` y agrupar por mes de `publishedAt`
9. Verificar que StatsService usa CacheService de Redis (desde F015)
