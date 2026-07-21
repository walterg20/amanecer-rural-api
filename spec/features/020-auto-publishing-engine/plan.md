# Plan — Auto-Publishing Engine

## Archivos a crear
```
src/
├── social/
│   ├── social-posts.controller.ts      # Historial + retry (admin)
│   ├── entities/
│   │   └── social-post.entity.ts
│   ├── dto/
│   │   └── social-post-query.dto.ts    # Filtros: plataforma, estado, tipo
│   ├── subscribers/
│   │   └── social-publish.subscriber.ts # Escucha eventos → encola jobs
│   ├── processors/
│   │   └── social-publish.processor.ts  # BullMQ worker
│   └── formatters/
│       ├── content-formatter.interface.ts
│       ├── facebook.formatter.ts        # Formato óptimo para FB (más texto, link)
│       └── instagram.formatter.ts       # Formato óptimo para IG (hashtags, breve)
```

## Archivos a modificar
- `src/social/social.module.ts` — agregar SocialPost entity, subscriber, processor
- `src/queue/queue.module.ts` — registrar worker (o registrar en social.module)

## Pasos
1. Crear entidad `SocialPost` (entity_type, entity_id, platform, platform_post_id, status, error, retry_count, published_at)
2. Crear `SocialPublishSubscriber`:
   - Escucha `PostPublishedEvent`, `RemateActivatedEvent`, `ClasificadoApprovedEvent`, `EventoApprovedEvent`
   - Por cada evento: busca SocialAccounts activas
   - Por cada cuenta: crea SocialPost (queued) + encola job BullMQ
3. Crear formateadores de contenido:
   - Facebook: título + descripción + link a la web
   - Instagram: título corto + hashtags + primera imagen
   - WhatsApp: título + link directo
4. Crear `SocialPublishProcessor` (BullMQ worker):
   - Obtener datos de la entidad origen (Post/Remate/etc) por entity_type + entity_id
   - Obtener publisher/messenger según platform
   - Formatear contenido
   - Publicar
   - Actualizar SocialPost
   - Si falla: incrementar retry_count, backoff
5. Crear `AdminSocialPostsController`:
   - GET list con filtros (platform, status, entity_type)
   - GET detail
   - POST retry
6. Endpoint `GET /admin/social/pending` — muestra cola actual (jobs waiting en BullMQ)
