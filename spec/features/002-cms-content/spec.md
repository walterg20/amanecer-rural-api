# 002 — CMS de Contenido Editorial

## Descripción
Sistema de gestión de contenido: noticias, notas técnicas y revista digital. Indispensable Fase 1. **El cliente crea su contenido sin asistencia del desarrollador.**

## Endpoints
- `GET /api/v1/posts` — Listar publicaciones (filtros: tipo, categoría, tag, estado)
- `GET /api/v1/posts/:slug` — Obtener publicación por slug
- `POST /api/v1/admin/posts` — Crear publicación
- `PATCH /api/v1/admin/posts/:id` — Editar publicación
- `DELETE /api/v1/admin/posts/:id` — Soft delete
- `GET /api/v1/categories` — Listar categorías
- `POST /api/v1/admin/categories` — Crear categoría

## Criterios de aceptación
- [ ] CRUD completo de posts (noticias, notas técnicas, revista)
- [ ] Categorías jerárquicas (padre → hijo)
- [ ] Slug automático desde el título
- [ ] Soft delete (columna deleted_at)
- [ ] Subida de imágenes
- [ ] Paginación con page/limit
- [ ] Editor intuitivo — pensado para que 3 personas del cliente operen sin capacitación técnica
