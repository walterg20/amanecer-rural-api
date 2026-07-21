# Plan — WhatsApp Business & Multi-Channel Messaging

## Archivos a crear
```
src/
├── messaging/
│   ├── admin-messaging.controller.ts     # CRUD canales + plantillas (admin)
│   ├── messaging.service.ts              # Orquestación multicanal
│   ├── entities/
│   │   ├── messaging-channel.entity.ts
│   │   ├── message-template.entity.ts
│   │   └── messaging-log.entity.ts
│   ├── dto/
│   │   ├── create-channel.dto.ts
│   │   ├── update-channel.dto.ts
│   │   ├── create-template.dto.ts
│   │   └── update-template.dto.ts
│   ├── messengers/
│   │   ├── messenger.interface.ts        # Interface IMessenger
│   │   ├── whatsapp.messenger.ts         # WhatsApp Cloud API
│   │   └── telegram.messenger.ts         # Telegram Bot API (placeholder)
│   └── subscribers/
│       └── messaging.subscriber.ts       # Escucha eventos → envía mensajes
```

## Archivos a modificar
- `src/app.module.ts` — MessagingModule ya existe, extenderlo
- `src/messaging/messaging.module.ts` — agregar nuevas entidades y controladores

## Pasos
1. Crear entidad `MessagingChannel` (platform, label, config jsonb, is_active)
2. Crear entidad `MessageTemplate` (channel_id FK, event_type, template_body)
3. Crear entidad `MessagingLog` (channel_id, to, message, status, error, sent_at)
4. Implementar `IMessenger` interface con método `send(to: string, message: string): Promise<SendResult>`
5. Implementar `WhatsappMessenger`:
   - POST a `https://graph.facebook.com/v21.0/{phone-number-id}/messages`
   - Enviar mensaje de texto y media
   - Manejar errores de API (números no válidos, límite de tasa)
6. Implementar `MessagingService.sendToChannel(channelId, to, templateData)`:
   - Buscar canal, buscar plantilla por event_type, reemplazar variables, enviar
7. Implementar `MessagingSubscriber`:
   - Escucha eventos de dominio (PostPublishedEvent, RemateActivatedEvent, etc.)
   - Para cada canal activo, busca plantilla y envía
8. CRUD de canales y plantillas en controller admin
9. Endpoint `POST /test` para enviar mensaje de prueba
