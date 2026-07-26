# 026 — Agregar campo `fuente` a la entidad Post

## Objetivo

Agregar un campo opcional `fuente` (source) a la entidad Post para que las
noticias puedan mostrar la fuente de la información (ej: "Chaco Día por día").

## Archivos a modificar

| Archivo | Cambio |
|---|---|
| `src/posts/entities/post.entity.ts` | Agregar columna `fuente` nullable string |
| `src/posts/dto/create-post.dto.ts` | Agregar campo opcional `fuente` con validación `@IsString()` |

## Detalle

### 1. `post.entity.ts`

Agregar después de `featuredImage` (línea 75):

```typescript
@Column({ nullable: true, type: 'varchar', length: 255 })
fuente?: string
```

### 2. `create-post.dto.ts`

Agregar después de `featuredImage?`:

```typescript
@IsOptional()
@IsString()
fuente?: string
```

### Notas

- No se necesita migración explícita porque TypeORM sincroniza en desarrollo
- El service `create()` y `update()` ya usan `Partial<Post>`, pasan el campo automáticamente
- El controller devuelve la entidad completa, `fuente` se incluirá en la respuesta
