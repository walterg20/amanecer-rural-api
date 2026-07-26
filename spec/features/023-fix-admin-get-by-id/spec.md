# 023 — Fix: Agregar endpoints `GET /admin/{entity}/:id` faltantes

## Objetivo

Agregar los handlers `@Get(':id')` faltantes en los 5 controladores admin para que los edit pages del frontend puedan obtener un registro individual por ID.

Actualmente ningún controlador admin implementa `GET /admin/{entity}/:id`. Los edit pages de noticias, revistas, eventos, remates y proveedores llaman a estos endpoints y reciben 404. Categorías usa un workaround (fetch all + `.find()` en el frontend).

## Arquitectura

Cada controlador necesita:
1. Un método `findOne(id)` en su **service** que busque por ID con relaciones necesarias y lance `NotFoundException` si no existe
2. Un handler `@Get(':id')` en su **controller** que lo exponga como endpoint

## Endpoints a agregar

| Endpoint | Controller | Service method |
|---|---|---|
| `GET /admin/posts/:id` | `AdminPostsController` | `postsService.findOne(id)` |
| `GET /admin/categories/:id` | `AdminCategoriesController` | `postsService.findCategory(id)` |
| `GET /admin/eventos/:id` | `AdminEventosController` | `eventosService.findOne(id)` |
| `GET /admin/remates/:id` | `AdminRematesController` | `rematesService.findOne(id)` |
| `GET /admin/proveedores/:id` | `AdminProveedoresController` | `proveedoresService.findOne(id)` |

## Detalle por archivo

### 1. `posts/posts.service.ts` — Agregar 2 métodos

```ts
async findOne(id: number): Promise<Post> {
  const post = await this.postRepo.findOne({
    where: { id },
    relations: { category: true, author: true, tags: true },
  })
  if (!post) throw new NotFoundException('Post not found')
  return post
}

async findCategory(id: number): Promise<Category> {
  const category = await this.catRepo.findOne({
    where: { id },
    relations: { children: true },
  })
  if (!category) throw new NotFoundException('Category not found')
  return category
}
```

### 2. `posts/admin-posts.controller.ts` — Agregar 2 handlers

En `AdminPostsController` (después de `findAll`):
```ts
@Get(':id')
@Roles('superadmin', 'admin', 'editor')
@ApiBearerAuth()
@ApiOperation({ summary: 'Obtener artículo por ID' })
async findOne(@Param('id') id: string) {
  const post = await this.postsService.findOne(+id)
  return { data: post }
}
```

En `AdminCategoriesController` (después de `findAll`):
```ts
@Get(':id')
@Roles('superadmin', 'admin', 'editor')
@ApiBearerAuth()
@ApiOperation({ summary: 'Obtener categoría por ID' })
async findOne(@Param('id') id: string) {
  const category = await this.postsService.findCategory(+id)
  return { data: category }
}
```

### 3. `eventos/eventos.service.ts` — Agregar método

```ts
async findOne(id: number): Promise<Evento> {
  const evento = await this.eventoRepo.findOne({
    where: { id },
    relations: ['organizador'],
  })
  if (!evento) throw new NotFoundException('Evento no encontrado')
  return evento
}
```

### 4. `eventos/admin-eventos.controller.ts` — Agregar handler

Después de `findAll`:
```ts
@Get(':id')
@Roles('superadmin', 'admin')
@ApiBearerAuth()
@ApiOperation({ summary: 'Obtener evento por ID' })
async findOne(@Param('id') id: string) {
  const evento = await this.eventosService.findOne(+id)
  return { data: evento }
}
```

### 5. `remates/remates.service.ts` — Agregar método

```ts
async findOne(id: number): Promise<Remate> {
  const auction = await this.remateRepo.findOne({
    where: { id },
    relations: ['lotes', 'rematador'],
  })
  if (!auction) throw new NotFoundException('Remate no encontrado')
  return auction
}
```

### 6. `remates/admin-remates.controller.ts` — Agregar handler

Después de `findAll`:
```ts
@Get(':id')
@Roles('superadmin', 'admin', 'editor')
@ApiBearerAuth()
@ApiOperation({ summary: 'Obtener remate por ID' })
async findOne(@Param('id') id: string) {
  const auction = await this.rematesService.findOne(+id)
  return { data: auction }
}
```

### 7. `proveedores/proveedores.service.ts` — Agregar método

```ts
async findOne(id: number): Promise<Proveedor> {
  const proveedor = await this.proveedorRepo.findOne({
    where: { id },
    relations: ['rubro'],
  })
  if (!proveedor) throw new NotFoundException('Proveedor no encontrado')
  return proveedor
}
```

### 8. `proveedores/admin-proveedores.controller.ts` — Agregar handler

Después de `findAll`:
```ts
@Get(':id')
@Roles('superadmin', 'admin')
@ApiBearerAuth()
@ApiOperation({ summary: 'Obtener proveedor por ID' })
async findOne(@Param('id') id: string) {
  const proveedor = await this.proveedoresService.findOne(+id)
  return { data: proveedor }
}
```

## Archivos afectados

| Archivo | Acción |
|---|---|
| `src/posts/posts.service.ts` | MODIFICAR — agregar `findOne()` y `findCategory()` |
| `src/posts/admin-posts.controller.ts` | MODIFICAR — agregar `@Get(':id')` en ambos controllers |
| `src/eventos/eventos.service.ts` | MODIFICAR — agregar `findOne()` |
| `src/eventos/admin-eventos.controller.ts` | MODIFICAR — agregar `@Get(':id')` |
| `src/remates/remates.service.ts` | MODIFICAR — agregar `findOne()` |
| `src/remates/admin-remates.controller.ts` | MODIFICAR — agregar `@Get(':id')` |
| `src/proveedores/proveedores.service.ts` | MODIFICAR — agregar `findOne()` |
| `src/proveedores/admin-proveedores.controller.ts` | MODIFICAR — agregar `@Get(':id')` |

## Criterios de aceptación

- [ ] `GET /admin/posts/:id` devuelve `{ data: Post }` con relaciones author/category/tags
- [ ] `GET /admin/categories/:id` devuelve `{ data: Category }` con children
- [ ] `GET /admin/eventos/:id` devuelve `{ data: Evento }` con organizador
- [ ] `GET /admin/remates/:id` devuelve `{ data: Remate }` con lotes
- [ ] `GET /admin/proveedores/:id` devuelve `{ data: Proveedor }` con rubro
- [ ] Todos lanzan 404 si el ID no existe
- [ ] `npm run build` compila exitosamente
