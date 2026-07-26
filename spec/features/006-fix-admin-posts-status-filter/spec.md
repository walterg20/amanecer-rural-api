# 006 — Fix: Admin posts status filter excluye drafts

## Problema

`GET /admin/posts?limit=20&page=1` devuelve `data: []` aunque existan posts creados. Lo mismo para `?type=magazine` en revistas.

## Causa raíz

En `posts.service.ts:findAll()`, cuando **no** se provee `?status=...` en la query, el backend filtra automáticamente por `PostStatus.PUBLISHED`.

```typescript
if (status) qb.andWhere('post.status = :status', { status })
else qb.andWhere('post.status = :defaultStatus', { defaultStatus: PostStatus.PUBLISHED })
```

Pero:
- La entidad `Post` tiene `default: PostStatus.DRAFT` en la columna `status`
- Los posts creados via `POST /admin/posts` sin `status` se guardan como `'draft'`
- El admin necesita ver **todos** los estados (draft, published, archived), no solo published

El endpoint público (`PostsController.findAll`) sí debe filtrar solo published — ese comportamiento no se toca.

## Solución

Eliminar el `else` en `posts.service.ts:findAll()`. Sin `?status=`, el admin ve todos los estados.

```typescript
if (status) qb.andWhere('post.status = :status', { status })
// Admin sin ?status= no filtra por estado
```

## Archivos modificados

| Archivo | Cambio |
|---------|--------|
| `src/posts/posts.service.ts` | Eliminar `else` que filtra por `PUBLISHED` |

## Verificación

1. `npm run build` compila sin errores
2. `GET /admin/posts` devuelve drafts + published + archived
3. `GET /admin/posts?status=published` solo published
4. `GET /posts` (público) sigue filtrando solo published
5. `npx playwright test e2e/` en frontend — 68 tests pasan
