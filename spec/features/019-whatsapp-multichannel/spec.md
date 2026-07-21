# 019 — WhatsApp Business & Multi-Channel Messaging

## Descripción
Sistema de mensajería multicanal que integra WhatsApp Business API (Meta Cloud API) como canal principal, con arquitectura extensible para agregar otros canales (Telegram, SMS, email).Envía notificaciones cuando se publica contenido nuevo, hay remates próximos, eventos aprobados, etc.

## Dependencias
- `axios` (ya disponible via Express)
- `@nestjs/event-emitter` (desde F016)

## Entidades
### MessagingChannel
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | int (PK) | Auto |
| platform | enum('whatsapp','telegram','sms','email') | Canal |
| label | varchar | Nombre descriptivo |
| config | jsonb | Config del canal (phone_number_id, token, etc.) |
| is_active | boolean | |
| created_at | timestamp | |

### MessageTemplate
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | int (PK) | Auto |
| channel_id | int (FK→messaging_channels) | Canal al que pertenece |
| event_type | varchar | Tipo de evento (post.published, remate.activated, etc.) |
| template_body | text | Plantilla con variables {{titulo}}, {{url}}, {{fecha}} |
| created_at | timestamp | |

## Endpoints
- `POST /api/v1/admin/messaging/channels` — Configurar canal
- `GET /api/v1/admin/messaging/channels` — Listar canales
- `PATCH /api/v1/admin/messaging/channels/:id` — Actualizar canal
- `DELETE /api/v1/admin/messaging/channels/:id` — Eliminar canal
- `POST /api/v1/admin/messaging/channels/:id/test` — Enviar mensaje de prueba
- `POST /api/v1/admin/messaging/templates` — Crear plantilla
- `GET /api/v1/admin/messaging/templates` — Listar plantillas
- `PATCH /api/v1/admin/messaging/templates/:id` — Editar plantilla

## Criterios de aceptación
- [ ] CRUD completo de canales de mensajería (admin)
- [ ] WhatsApp Cloud API integrado: enviar mensajes de texto + media
- [ ] Plantillas de mensaje configurables por tipo de evento
- [ ] Soporte para variables en plantillas: `{{titulo}}`, `{{url}}`, `{{fecha}}`, `{{descripcion}}`
- [ ] `POST /test` envía un mensaje real al número configurado
- [ ] Arquitectura extensible: interface `IMessenger` para agregar nuevos canales
- [ ] Números de destino configurables (para broadcast a usuarios, no hardcoded)
- [ ] Log de mensajes enviados (MessagingLog entity)
