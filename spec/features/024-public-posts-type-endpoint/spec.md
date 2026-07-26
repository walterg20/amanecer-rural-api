# 024 — Endpoint público: GET /posts con filtro type=magazine

## Objetivo

Asegurar que el endpoint público `GET /posts` acepte el filtro `type=magazine` y filtre solo posts con status=published, para que el frontend pueda consumir revistas publicadas desde la API.

## Problema

Actualmente `GET /posts` (público) no existe como ruta independiente. El `PostsController` tiene `@Controller('posts')` solo con `GET /posts` (listado público) pero su implementación actual en `posts.service.ts:findAll()` no filtra por `status=published` cuando se usa sin parámetro `status`. El admin sí filtra, pero el público necesita solo published.

## Solución

En `posts/posts.service.ts`, el método `findAll()` ya acepta `status` como query param. Si no se pasa status, debemos asegurarnos que desde el controlador público se fuerce `status=published` cuando no se especifique otro filtro.

### Opción recomendada

Crear un método separado `findPublished(query)` en el service que siempre agregue `status: 'published'`, y usarlo desde el controlador público. El `findAll()` actual queda solo para admin.

```ts
async findPublished(query: { type?: string; category?: string; page?: number; limit?: number }) {
  return this.findAll({ ...query, status: 'published' })
}
```

## Archivos afectados

| Archivo | Acción |
|---|---|
| `src/posts/posts.service.ts` | MODIFICAR — agregar `findPublished()` |
| `src/posts/posts.controller.ts` | MODIFICAR — usar `findPublished()` en vez de `findAll()` |

## Criterios de aceptación

- [ ] `GET /posts?type=magazine` devuelve solo revistas publicadas
- [ ] `GET /posts` devuelve solo posts publicados (todos los tipos)
- [ ] Admin `GET /admin/posts` sigue mostrando todos los estados
- [ ] `npm run build` compila exitosamente
