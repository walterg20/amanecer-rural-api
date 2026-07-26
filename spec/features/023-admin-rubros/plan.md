# Plan — Admin / Rubros (listado + paginación)

## Archivos a crear
- src/proveedores/dto/query-rubros.dto.ts

## Archivos a modificar
- src/proveedores/rubros.service.ts (agregar método `findAllAdmin`)
- src/proveedores/admin-proveedores.controller.ts (agregar endpoint `GET` en `AdminRubrosController`)

## Pasos
1. Crear `QueryRubrosDto` con `page?` y `limit?` opcionales
2. Agregar `findAllAdmin()` al servicio con lógica dual: todas o paginadas
3. Agregar `@Get()` en `AdminRubrosController` que use el nuevo DTO y service method
