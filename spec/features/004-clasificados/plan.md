# Plan — Módulo de Clasificados

## Archivos a crear

### Módulo
- `src/clasificados/clasificados.module.ts`

### Entidades
- `src/clasificados/entities/clasificado.entity.ts`
- `src/clasificados/entities/categoria-clasificado.entity.ts`

### Controladores
- `src/clasificados/clasificados.controller.ts` — públicos
- `src/clasificados/admin-clasificados.controller.ts` — admin

### Servicios
- `src/clasificados/clasificados.service.ts`
- `src/clasificados/categoria-clasificado.service.ts`

### DTOs
- `src/clasificados/dto/create-clasificado.dto.ts`
- `src/clasificados/dto/update-clasificado.dto.ts`
- `src/clasificados/dto/query-clasificados.dto.ts`
- `src/clasificados/dto/update-status.dto.ts`

## Registro
- Importar `ClasificadosModule` en `app.module.ts`
- Seed de 4 categorías en onModuleInit

## Pasos
1. Crear entidades Clasificado, CategoriaClasificado
2. Crear servicios con CRUD, filtros, slugificación
3. Crear controlador público (listar + detalle + categorías)
4. Crear controlador admin (CRUD + aprobar/rechazar + upload)
5. Implementar lógica de expiración por plan
6. Registrar módulo
