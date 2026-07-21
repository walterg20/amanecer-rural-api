# Tasks — WhatsApp Business & Multi-Channel Messaging

- [ ] Crear entidad `MessagingChannel` (platform enum, label, config jsonb, is_active)
- [ ] Crear entidad `MessageTemplate` (channel_id FK, event_type, template_body)
- [ ] Crear entidad `MessagingLog` (channel_id, recipient, message, status, error, sent_at)
- [ ] Crear `MessengerInterface` con `send(to, message, mediaUrl?): Promise<SendResult>`
- [ ] Implementar `WhatsappMessenger` — enviar texto + media vía WhatsApp Cloud API
- [ ] Implementar `TelegramMessenger` como placeholder (opcional, lanzar `NotImplementedError`)
- [ ] Implementar `MessagingService.enviar(channelId, to, templateData)` — orquestación
- [ ] Implementar `MessagingSubscriber` — escucha eventos de dominio
- [ ] Crear `AdminMessagingController` con CRUD de canales
- [ ] Crear `AdminTemplateController` con CRUD de plantillas
- [ ] Agregar `POST /admin/messaging/channels/:id/test`
- [ ] Extender `MessagingModule` con nuevas entidades y controladores
- [ ] Test: enviar mensaje de WhatsApp real a número de prueba
