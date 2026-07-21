# Plan — Content Publishing Enhancement

## Dependencias nuevas
```json
"@nestjs/event-emitter": "^4.x"
```

## Archivos a crear
```
src/
├── posts/
│   └── events/
│       ├── post-published.event.ts
│       └── post-archived.event.ts
├── remates/
│   └── events/
│       ├── remate-activated.event.ts
│       └── remate-cancelled.event.ts
└── common/
    └── events/
        ├── clasificado-approved.event.ts
        └── evento-approved.event.ts
```

## Archivos a modificar
- `src/app.module.ts` — importar EventEmitterModule.forRoot()
- `src/posts/posts.module.ts` — agregar imports de eventos
- `src/posts/admin-posts.controller.ts` — agregar endpoints publish/archive
- `src/posts/posts.service.ts` — agregar métodos publish() y archive()
- `src/remates/remates.module.ts` — agregar imports de eventos
- `src/remates/admin-remates.controller.ts` — agregar endpoints publish/cancel
- `src/remates/remates.service.ts` — agregar métodos publish() y cancel()
- `src/clasificados/clasificados.service.ts` — emitir evento al aprobar
- `src/eventos/eventos.service.ts` — emitir evento al aprobar

## Pasos
1. Instalar `@nestjs/event-emitter`
2. Crear EventEmitterModule en app.module.ts
3. Definir eventos de dominio (clases con props: entityId, entityType, userId)
4. Agregar endpoints publish/archive a AdminPostsController
5. Agregar lógica en PostsService: validar estado actual, setear publishedAt, emitir evento
6. Agregar endpoints publish/cancel a AdminRematesController
7. Agregar lógica en RematesService
8. Modificar ClasificadosService.updateStatus() para emitir ClasificadoApprovedEvent
9. Modificar EventosService.updateStatus() para emitir EventoApprovedEvent
