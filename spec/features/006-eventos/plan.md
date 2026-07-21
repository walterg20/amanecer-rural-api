# Plan — Módulo de Eventos

## Archivos a crear

### Módulo
- `src/eventos/eventos.module.ts`

### Entidades
- `src/eventos/entities/evento.entity.ts`

### Controladores
- `src/eventos/eventos.controller.ts` — públicos
- `src/eventos/admin-eventos.controller.ts` — admin

### Servicios
- `src/eventos/eventos.service.ts`

### DTOs
- `src/eventos/dto/create-evento.dto.ts`
- `src/eventos/dto/update-evento.dto.ts`
- `src/eventos/dto/query-eventos.dto.ts`
- `src/eventos/dto/update-status.dto.ts`

## Pasos
1. Crear entidad Evento
2. Implementar servicio con lógica de próximos vs pasados
3. Implementar controlador público (próximos, pasados, detalle)
4. Implementar controlador admin (CRUD + aprobar/rechazar)
5. Registrar módulo
