# Plan — Módulo de Remates

## Archivos a crear

### Módulo
- `src/remates/remates.module.ts`

### Entidades
- `src/remates/entities/auction.entity.ts`
- `src/remates/entities/lot.entity.ts`
- `src/remates/entities/auctioneer.entity.ts`
- `src/remates/entities/auction-media.entity.ts`

### Controladores
- `src/remates/remates.controller.ts` — públicos
- `src/remates/admin-remates.controller.ts` — admin

### Servicios
- `src/remates/remates.service.ts`
- `src/remates/auctioneer.service.ts`

### DTOs
- `src/remates/dto/create-remate.dto.ts`
- `src/remates/dto/update-remate.dto.ts`
- `src/remates/dto/query-remates.dto.ts`
- `src/remates/dto/create-lote.dto.ts`
- `src/remates/dto/update-lote.dto.ts`
- `src/remates/dto/create-rematador.dto.ts`
- `src/remates/dto/update-rematador.dto.ts`

## Registro
- Importar `RematesModule` en `app.module.ts`
- Registrar entidades en TypeOrmModule.forFeature()

## Pasos
1. Crear entidades Auction, Lot, Auctioneer, AuctionMedia
2. Crear servicios con lógica CRUD y slugificación
3. Crear controlador público con endpoints listar/detalle/filtros
4. Crear controlador admin con CRUD completo + subida de imágenes
5. Registrar módulo en app.module.ts
6. Agregar tags Swagger
