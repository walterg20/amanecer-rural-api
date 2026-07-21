# Tasks — Redis + Queue Core

- [ ] Instalar `ioredis`, `@nestjs/bullmq`, `bullmq`, `@bull-board/nestjs`, `@bull-board/express`, `@types/bull-board`
- [ ] Crear `src/cache/cache.module.ts` con `CacheModule.registerAsync`
- [ ] Crear `src/cache/cache.service.ts` — métodos get/set/del/wrap con Redis
- [ ] Refactorizar `StatsService` para inyectar `CacheService` y eliminar Map interno
- [ ] Crear `src/queue/queue.module.ts` con BullModule.forRoot + colas registradas
- [ ] Registrar colas `social-publish` y `messaging-send`
- [ ] Crear `src/queue/bull-board.controller.ts` (protegido admin/superadmin)
- [ ] Integrar BullBoard UI en el controller
- [ ] Importar QueueModule y CacheModule en `app.module.ts`
- [ ] Agregar `REDIS_CACHE_TTL=300` a `.env`
- [ ] Verificar `redis-cli PING → PONG` con docker-compose up
- [ ] Verificar queue acepta jobs en BullBoard UI
