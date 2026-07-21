# Tasks — Auto-Publishing Engine

- [ ] Crear entidad `SocialPost` (entity_type, entity_id, platform, platform_post_id, status, error_message, retry_count, published_at, timestamps)
- [ ] Crear `SocialPublishSubscriber` que escucha eventos de dominio
- [ ] En subscriber: por cada evento, buscar cuentas activas + crear SocialPost + encolar job
- [ ] Crear `ContentFormatterInterface` con `format(entity): FormattedContent`
- [ ] Implementar `FacebookFormatter` (título + descripción + link + primeras 3 imágenes)
- [ ] Implementar `InstagramFormatter` (caption corto + hashtags + 1 imagen)
- [ ] Crear `SocialPublishProcessor` (BullMQ worker):
  - [ ] Resolver entidad origen por entity_type + entity_id
  - [ ] Formatear contenido según plataforma
  - [ ] Llamar al publisher/messenger
  - [ ] Actualizar SocialPost con resultado o error
- [ ] Configurar backoff exponencial: 1min→5min→30min, retry=3
- [ ] Crear `AdminSocialPostsController` con list (filtros), detail, retry
- [ ] Agregar SocialPost entity al TypeORM forFeature de SocialModule
- [ ] Registrar subscriber y processor en SocialModule
- [ ] Test: publicar post → ver SocialPost creado → ver worker ejecutado
