# 023 — Admin / Rubros (listado + paginación)

Endpoint `GET /admin/rubros` que devuelve rubros del directorio de proveedores con dos modos: **todas** (sin paginar) o **paginadas** (con meta). El modo se define por la presencia de los query params `page` o `limit`.

## DTOs

### `QueryRubrosDto`
| Campo | Tipo | Decoradores | Descripción |
|-------|------|-------------|-------------|
| `page` | `number?` | `@IsOptional() @Type(() => Number) @IsInt() @Min(1)` | Número de página (empieza en 1). Si se omite junto con `limit`, se devuelven todos. |
| `limit` | `number?` | `@IsOptional() @Type(() => Number) @IsInt() @Min(1)` | Cantidad de items por página. Si se omite junto con `page`, se devuelven todos. |

## Endpoints

### Admin (requiere autenticación)
| Método | Ruta | Auth | Roles | Descripción |
|--------|------|------|-------|-------------|
| GET | `/admin/rubros` | JWT + Roles | superadmin, admin | Listar rubros. Sin params devuelve todos. Con `page`/`limit` devuelve paginado. |
| GET | `/admin/rubros/:id` | JWT + Roles | superadmin, admin | Obtener rubro individual por ID. |

## Servicio

### `RubrosService.findAllAdmin(query)`

```
findAllAdmin(query: { page?: number; limit?: number }): Promise<{ data: Rubro[] } | { data: Rubro[]; meta: PaginationMeta }>
```

Comportamiento:

- Si **no** se recibe `page` ni `limit`:
  - Ejecuta `find({ order: { nombre: 'ASC' }, relations: { proveedores: true } })`
  - Retorna `{ data: rubros }`

- Si se recibe `page` o `limit`:
  - Usa valores default: `page = 1`, `limit = 10`
  - Usa `createQueryBuilder` con `leftJoinAndSelect('proveedores')`, ordenado por `nombre ASC`
  - Aplica `.skip((page-1) * limit).take(limit)`
  - Retorna `{ data, meta: { total, page, limit, totalPages } }`

## Respuestas

### Todos (sin paginación)
```json
{
  "data": [
    { "id": 1, "nombre": "Agroquímicos", "slug": "agroquimicos", "description": "...", "proveedores": [...] },
    { "id": 2, "nombre": "Semillas", "slug": "semillas", "description": null, "proveedores": [] }
  ]
}
```

### Paginado
```json
{
  "data": [
    { "id": 1, "nombre": "Agroquímicos", "slug": "agroquimicos", "description": "...", "proveedores": [...] }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```
