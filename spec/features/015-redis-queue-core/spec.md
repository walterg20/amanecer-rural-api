# 015 — Redis + Queue Core

## Descripción
Redis está configurado en infraestructura (docker-compose + variables de entorno) pero sin uso en la aplicación. Esta feature integra Redis como caché y como backend de colas BullMQ para procesamiento asíncrono, habilitando la base técnica para auto-publicación y mensajería.

## Dependencias
- `ioredis` — Cliente Redis para NestJS
- `@nestjs/bullmq` — Colas BullMQ con Redis
- `bull-board` — UI web para monitorear colas

## Endpoints
- `GET /api/v1/admin/queues` — BullBoard UI (monitoreo de colas)

## Criterios de aceptación
- [ ] `ioredis` y `@nestjs/bullmq` instalados como dependencias
- [ ] RedisModule configurado globalmente en `app.module.ts`
- [ ] BullModule registrado con conexión a Redis (host/port desde .env)
- [ ] CacheManager reemplaza el `Map<string, CacheEntry>` de StatsService
- [ ] Cola base `social-publish` creada (vacía, lista para workers)
- [ ] Cola base `messaging-send` creada (vacía, lista para workers)
- [ ] BullBoard accesible en `/api/v1/admin/queues` (protegido por JwtAuthGuard + RolesGuard, solo superadmin/admin)
- [ ] BullBoard embebida vía `@bull-board/nestjs` o middleware Express
- [ ] Redis TTL configurable via `.env` (`REDIS_CACHE_TTL`)
