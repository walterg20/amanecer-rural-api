# 020 — Auto-Publishing Engine

## Descripción
Motor de publicación automática que orquesta el envío de contenido a múltiples plataformas (Facebook, Instagram, WhatsApp) cuando se publica/aprueba contenido en la API. Usa BullMQ (F015) para procesamiento asíncrono con reintentos. Integra los publishers de Meta (F018) y los messengers multicanal (F019).

## Dependencias
- `@nestjs/bullmq` (desde F015)
- `@nestjs/event-emitter` (desde F016)
- `facebook-nodejs-business-sdk` (desde F018)

## Entidades
### SocialPost
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | int (PK) | Auto |
| entity_type | varchar | 'post', 'remate', 'clasificado', 'evento' |
| entity_id | int | ID de la entidad origen |
| platform | enum('facebook','instagram','whatsapp','telegram') | Plataforma destino |
| platform_post_id | varchar | ID devuelto por la plataforma (ej: FB post ID) |
| status | enum('queued','publishing','published','failed','partial') | Estado |
| error_message | text | Último error (si failed) |
| retry_count | int | Número de reintentos |
| published_at | timestamp | Cuándo se publicó |
| created_at | timestamp | |
| updated_at | timestamp | |

## Flujo
```
Evento de dominio (PostPublishedEvent)
  → EventSubscriber escucha
  → Busca cuentas activas (SocialAccount)
  → Crea SocialPost entries (queued)
  → Encola job en BullMQ (social-publish)
  → Worker procesa:
      → Usa FacebookPublisher / InstagramPublisher / WhatsappMessenger
      → Formatea contenido según plataforma
      → Sube media si aplica
      → Publica
      → Actualiza SocialPost.status
  → Si falla: retry con backoff (3 intentos)
```

## Endpoints
- `GET /api/v1/admin/social/posts` — Historial de publicaciones automáticas
- `GET /api/v1/admin/social/posts/:id` — Detalle de una publicación
- `POST /api/v1/admin/social/posts/:id/retry` — Reintentar publicación fallida
- `GET /api/v1/admin/social/pending` — Contenido pendiente de publicar (cola)

## Criterios de aceptación
- [ ] Al publicar un post (F016), se crea SocialPost en estado `queued` para cada cuenta activa
- [ ] Al aprobar un clasificado/evento, igual
- [ ] BullMQ worker `social-publish` procesa los jobs:
  - Obtiene datos de la entidad origen (titulo, descripcion, imagen)
  - Formatea caption según plataforma
  - Llama al publisher correspondiente
  - Actualiza SocialPost.status
- [ ] Retry con backoff exponencial: 1min → 5min → 30min (máx 3)
- [ ] Si un post tiene múltiples imágenes, sube carrusel en FB/IG
- [ ] Logging detallado de cada intento
- [ ] Endpoint `POST /retry` para reintentar manualmente publicaciones fallidas
- [ ] Filtros visuales en historial: por plataforma, por estado, por tipo de entidad
- [ ] No bloquear el request del usuario — todo es asíncrono vía BullMQ
