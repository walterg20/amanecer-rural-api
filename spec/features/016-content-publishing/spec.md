# 016 — Content Publishing Enhancement

## Descripción
Los módulos de contenido (Post, Remate) carecen de endpoints dedicados para publicar/aprobar con lógica automática (seteo de `publishedAt`, cambio de estado controlado). Esta feature agrega endpoints explícitos y emite eventos de dominio para disparar las colas de auto-publicación.

## Endpoints nuevos
- `POST /api/v1/admin/posts/:id/publish` — Publicar post (DRAFT → PUBLISHED, setea `publishedAt`)
- `POST /api/v1/admin/posts/:id/archive` — Archivar post (PUBLISHED → ARCHIVED)
- `POST /api/v1/admin/remates/:id/publish` — Publicar remate (SCHEDULED → ACTIVE)
- `POST /api/v1/admin/remates/:id/cancel` — Cancelar remate (→ CANCELLED)

## Endpoints existentes que se mantienen
- `PATCH /api/v1/admin/posts/:id` — Editar borrador (no cambia estado)
- `PATCH /api/v1/admin/clasificados/:id/status` — Ya existe, mantener
- `PATCH /api/v1/admin/eventos/:id/status` — Ya existe, mantener

## Criterios de aceptación
- [ ] `POST /admin/posts/:id/publish` cambia status a `published` y setea `publishedAt = new Date()`
- [ ] `POST /admin/posts/:id/publish` rechaza si el post ya está publicado o archivado (400)
- [ ] `POST /admin/posts/:id/archive` cambia status a `archived`
- [ ] `POST /admin/remates/:id/publish` cambia status a `ACTIVE` (de SCHEDULED)
- [ ] `POST /admin/remates/:id/publish` rechaza si no está SCHEDULED (400)
- [ ] `POST /admin/remates/:id/cancel` cambia a CANCELLED
- [ ] Se emite `PostPublishedEvent` al publicar un post
- [ ] Se emite `RemateActivatedEvent` al activar un remate
- [ ] Se emite `ClasificadoApprovedEvent` al aprobar un clasificado (endpoint existente)
- [ ] Se emite `EventoApprovedEvent` al aprobar un evento (endpoint existente)
- [ ] Eventos son escuchables por `@nestjs/event-emitter` o similar
