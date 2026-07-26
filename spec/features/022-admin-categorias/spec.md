# 022 — Admin / Categorías (listado + paginación)

Endpoint `GET /admin/categories` que devuelve categorías de contenido con dos modos: **todas** (sin paginar) o **paginadas** (con meta). El modo se define por la presencia de los query params `page` o `limit`.

## DTOs

### `QueryCategoriesDto`
| Campo | Tipo | Decoradores | Descripción |
|-------|------|-------------|-------------|
| `page` | `number?` | `@IsOptional() @Type(() => Number) @IsInt() @Min(1)` | Número de página (empieza en 1). Si se omite junto con `limit`, se devuelven todas. |
| `limit` | `number?` | `@IsOptional() @Type(() => Number) @IsInt() @Min(1)` | Cantidad de items por página. Si se omite junto con `page`, se devuelven todas. |

## Endpoints

### Admin (requiere autenticación)
| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| GET | `/admin/categories` | JWT + Roles | superadmin, admin, editor | Listar categorías. Sin params devuelve todas. Con `page`/`limit` devuelve paginado. |

## Servicio

### `PostsService.findAllCategoriesAdmin(query)`

```
findAllCategoriesAdmin(query: { page?: number; limit?: number }): Promise<{ data: Category[] } | { data: Category[]; meta: PaginationMeta }>
```

Comportamiento:

- Si **no** se recibe `page` ni `limit`:
  - Ejecuta `find({ relations: { children: true } })`
  - Retorna `{ data: categories }`

- Si se recibe `page` o `limit`:
  - Usa valores default: `page = 1`, `limit = 10`
  - Usa `createQueryBuilder` con `leftJoinAndSelect('children')`, ordenado por `name ASC`
  - Aplica `.skip((page-1) * limit).take(limit)`
  - Retorna `{ data, meta: { total, page, limit, totalPages } }`

## Respuestas

### Todas (sin paginación)
```json
{
  "data": [
    { "id": 1, "name": "Agricultura", "slug": "agricultura", "description": "...", "parentId": null, "children": [...] },
    { "id": 2, "name": "Ganadería", "slug": "ganaderia", "description": "...", "parentId": null, "children": [] }
  ]
}
```

### Paginado
```json
{
  "data": [
    { "id": 1, "name": "Agricultura", "slug": "agricultura", "description": "...", "parentId": null, "children": [...] }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```
