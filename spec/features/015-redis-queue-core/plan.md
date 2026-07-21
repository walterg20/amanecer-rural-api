# Plan — Redis + Queue Core

## Dependencias nuevas
```json
"ioredis": "^5.x",
"@nestjs/bullmq": "^11.x",
"bullmq": "^5.x",
"@bull-board/nestjs": "^6.x",
"@bull-board/express": "^6.x",
"@types/bull-board": "^6.x"
```

## Archivos a crear
```
src/
├── queue/
│   ├── queue.module.ts
│   ├── queue.processor.ts         # Base processor (abstract)
│   └── bull-board.controller.ts   # BullBoard UI
├── cache/
│   ├── cache.module.ts
│   └── cache.service.ts           # Wrapper Redis cache
```

## Archivos a modificar
- `src/app.module.ts` — importar QueueModule y CacheModule
- `src/stats/stats.service.ts` — reemplazar `Map` por `CacheService`
- `.env` — agregar `REDIS_CACHE_TTL=300`

## Pasos
1. Instalar dependencias Redis + Bull + BullBoard
2. Crear `cache.module.ts` con `CacheModule.registerAsync` usando ioredis
3. Crear `cache.service.ts` con métodos `get()`, `set()`, `del()`, `wrap()` (get-or-set)
4. Refactorizar `StatsService` para usar `CacheService` en lugar del Map interno
5. Crear `queue.module.ts` con `BullModule.forRoot` conectado a Redis
6. Registrar colas `social-publish` y `messaging-send` en QueueModule
7. Integrar BullBoard en un controller protegido por admin
8. Probar que Redis responde (`PING → PONG`)
9. Probar que colas aceptan jobs
