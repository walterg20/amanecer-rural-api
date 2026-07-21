# Tasks — Stats Realignment

- [ ] Filtrar `totalPosts` por `status = 'published'`
- [ ] Filtrar `totalEventos` por `status = 'approved'`
- [ ] Filtrar `totalClasificados` por `status = 'approved'`
- [ ] Filtrar `totalRemates` excluyendo `CANCELLED`
- [ ] Agregar `totalPostsPublishedThisMonth` al dashboard
- [ ] Agregar `totalContentQueuedForSocial` (consulta a SocialPost)
- [ ] Agregar `totalContentPublishedToSocial` (consulta a SocialPost)
- [ ] Modificar `getPostsByMonth()` para agrupar por mes de `publishedAt` filtrando solo published
- [ ] Verificar que StatsService usa Redis cache (TTL 5 min)
