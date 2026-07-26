# 025 — Endpoint público: GET /remates/tipos

## Objetivo

Crear un endpoint público `GET /remates/tipos` que devuelva los tipos de remate disponibles (basado en datos reales de la BD), para reemplazar la constante hardcoded `REMATE_TYPES` del frontend.

## Solución

Agregar método en `remates/remates.service.ts` que agrupe remates publicados por `type` y devuelva metadatos de cada tipo:

```ts
async findTipos(): Promise<{ slug: string; type: string; nombre: string; desc: string; count: number }[]> {
  const qb = this.auctionRepo.createQueryBuilder('a')
    .select('a.type', 'type')
    .addSelect('COUNT(a.id)', 'count')
    .where('a.status != :cancelled', { cancelled: AuctionStatus.CANCELLED })
    .groupBy('a.type')
    .orderBy('COUNT(a.id)', 'DESC')

  const rows = await qb.getRawMany()
  return rows.map((r) => ({
    slug: r.type.toLowerCase().replace(/\s+/g, '-'),
    type: r.type,
    nombre: r.type.charAt(0).toUpperCase() + r.type.slice(1),
    desc: `Explora nuestros remates de tipo ${r.type}`,
    count: parseInt(r.count, 10),
  }))
}
```

Agregar handler en `remates/remates.controller.ts` (público):

```ts
@Get('tipos')
@ApiOperation({ summary: 'Listar tipos de remate' })
async findTipos() {
  return this.rematesService.findTipos()
}
```

## Archivos afectados

| Archivo | Acción |
|---|---|
| `src/remates/remates.service.ts` | MODIFICAR — agregar `findTipos()` |
| `src/remates/remates.controller.ts` | MODIFICAR — agregar `@Get('tipos')` |

## Criterios de aceptación

- [ ] `GET /remates/tipos` devuelve array con `{ slug, type, nombre, desc, count }`
- [ ] Los tipos vienen de remates existentes en la BD (no hardcoded)
- [ ] `npm run build` compila exitosamente
