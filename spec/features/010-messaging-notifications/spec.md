# 010 — Mensajería y Notificaciones

Sistema de mensajería interna entre usuarios con notificaciones in-app + email. Polling-based (sin WebSocket).

## Entidades

### Message (`messages`)
| Columna | Tipo | Opciones |
|---------|------|----------|
| id | INTEGER (PK) | auto-generated |
| sender_id | INTEGER (FK → users.id) | not null |
| receiver_id | INTEGER (FK → users.id) | not null |
| subject | VARCHAR(255) | not null |
| body | TEXT | not null |
| read_at | TIMESTAMP | nullable |
| parent_id | INTEGER (FK → messages.id) | nullable (para hilos/replies) |
| created_at | TIMESTAMP | @CreateDateColumn |
| deleted_at | TIMESTAMP | @DeleteDateColumn |

Relations: `@ManyToOne → User (sender)`, `@ManyToOne → User (receiver)`

### Notification (`notifications`)
| Columna | Tipo | Opciones |
|---------|------|----------|
| id | INTEGER (PK) | auto-generated |
| user_id | INTEGER (FK → users.id) | not null |
| type | ENUM('message','status','payment','system') | not null |
| title | VARCHAR(255) | not null |
| body | TEXT | nullable |
| link | VARCHAR(255) | nullable (URL relacionada) |
| read_at | TIMESTAMP | nullable |
| created_at | TIMESTAMP | @CreateDateColumn |

Relations: `@ManyToOne → User`

## Endpoints

### Mensajería
| Método | Path | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/v1/messages` | JWT | Enviar mensaje |
| GET | `/api/v1/messages/inbox` | JWT | Bandeja recibidos. Query: `?page=&limit=&unread=` |
| GET | `/api/v1/messages/sent` | JWT | Bandeja enviados. Query: `?page=&limit=` |
| GET | `/api/v1/messages/:id` | JWT | Detalle mensaje (solo sender/receiver) |
| PATCH | `/api/v1/messages/:id/read` | JWT | Marcar leído |
| DELETE | `/api/v1/messages/:id` | JWT | Soft delete (sender o receiver) |

### Notificaciones
| Método | Path | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/v1/notifications` | JWT | Listar notificaciones. Query: `?page=&limit=&unread=` |
| GET | `/api/v1/notifications/unread-count` | JWT | Cantidad de no leídas |
| PATCH | `/api/v1/notifications/:id/read` | JWT | Marcar leída |
| PATCH | `/api/v1/notifications/read-all` | JWT | Marcar todas leídas |

## DTOs

### CreateMessageDto
- `receiverId` (IsInt, not null)
- `subject` (IsString, MinLength 1, MaxLength 255)
- `body` (IsString, MinLength 1)
- `parentId?` (IsInt)

### CreateNotificationDto (admin/system)
- `userId` (IsInt)
- `type` (IsEnum: message, status, payment, system)
- `title` (IsString, MaxLength 255)
- `body?` (IsString)
- `link?` (IsString)

### Servicios adicionales
- `NotificationService.create(dto)` — crear y enviar email si corresponde
- `NotificationService.findByUser(userId, query)` — paginado
- `NotificationService.markRead(id, userId)`
- `NotificationService.markAllRead(userId)`
- `NotificationService.unreadCount(userId)`

## Email (Nodemailer)
- Configurar transport SMTP vía variables de entorno (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`)
- Plantillas simples (texto + HTML básico)
- Eventos: bienvenida, nuevo mensaje, cambio de status (clasificado/remate/proveedor)
- Usar `@nestjs-modules/mailer` o Nodemailer directo
