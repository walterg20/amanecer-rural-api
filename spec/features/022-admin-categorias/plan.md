# Plan — Admin / Categorías (listado + paginación)

## Archivos a crear
- src/posts/dto/query-categories.dto.ts

## Archivos a modificar
- src/posts/posts.service.ts (agregar método `findAllCategoriesAdmin`)
- src/posts/admin-posts.controller.ts (agregar endpoint `GET` en `AdminCategoriesController`)

## Pasos
1. Crear `QueryCategoriesDto` con `page?` y `limit?` opcionales
2. Agregar `findAllCategoriesAdmin()` al servicio con lógica dual: todas o paginadas
3. Agregar `@Get()` en `AdminCategoriesController` que use el nuevo DTO y service method
