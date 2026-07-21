# Plan — Mensajería y Notificaciones

## Entidades
- Message (id, sender_id, receiver_id, subject, body, read_at, created_at)
- Notification (id, user_id, type, title, body, read_at, created_at)

## Pasos
1. Crear entidades Message y Notification
2. CRUD de mensajes (enviar, inbox, sent, marcar leído)
3. Notificaciones email con Nodemailer
4. Notificaciones in-app almacenadas en DB
5. Polling endpoint (GET notificaciones/no-leídas)
6. Sin WebSocket — sin Socket.io
