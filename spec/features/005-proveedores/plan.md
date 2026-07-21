# Plan — Directorio de Proveedores

## Archivos a crear

### Módulo
- `src/proveedores/proveedores.module.ts`

### Entidades
- `src/proveedores/entities/proveedor.entity.ts`
- `src/proveedores/entities/rubro.entity.ts`

### Controladores
- `src/proveedores/proveedores.controller.ts` — públicos
- `src/proveedores/admin-proveedores.controller.ts` — admin

### Servicios
- `src/proveedores/proveedores.service.ts`
- `src/proveedores/rubros.service.ts`

### DTOs
- `src/proveedores/dto/create-proveedor.dto.ts`
- `src/proveedores/dto/update-proveedor.dto.ts`
- `src/proveedores/dto/query-proveedores.dto.ts`
- `src/proveedores/dto/update-status.dto.ts`
- `src/proveedores/dto/create-rubro.dto.ts`
- `src/proveedores/dto/update-rubro.dto.ts`

## Archivo de seed rubros
- `src/proveedores/data/rubros.ts` — array con ~140 rubros

## Pasos
1. Crear entidades Proveedor, Rubro
2. Crear seed data de rubros (~140)
3. Implementar servicios con lógica de búsqueda y aprobación
4. Implementar controlador público (listar con filtros, destacados, rubros)
5. Implementar controlador admin (CRUD + aprobar + destacar + upload)
6. Registrar módulo
