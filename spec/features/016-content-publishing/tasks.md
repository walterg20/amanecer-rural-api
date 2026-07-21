# Tasks — Content Publishing Enhancement

- [ ] Instalar `@nestjs/event-emitter`
- [ ] Configurar `EventEmitterModule.forRoot()` en `app.module.ts`
- [ ] Crear `PostPublishedEvent` (entityId, userId, publishedAt)
- [ ] Crear `PostArchivedEvent` (entityId, userId)
- [ ] Crear `RemateActivatedEvent` (entityId, userId)
- [ ] Crear `RemateCancelledEvent` (entityId, userId)
- [ ] Crear `ClasificadoApprovedEvent` (entityId, userId)
- [ ] Crear `EventoApprovedEvent` (entityId, userId)
- [ ] Agregar `POST /admin/posts/:id/publish` en controller + service
- [ ] Agregar `POST /admin/posts/:id/archive` en controller + service
- [ ] Agregar `POST /admin/remates/:id/publish` en controller + service
- [ ] Agregar `POST /admin/remates/:id/cancel` en controller + service
- [ ] Modificar `ClasificadosService.updateStatus()` para emitir evento al approved
- [ ] Modificar `EventosService.updateStatus()` para emitir evento al approved
- [ ] Test: publish post cambia status y setea publishedAt
- [ ] Test: publish post ya publicado devuelve 400
- [ ] Test: activar remate cambia status a ACTIVE
