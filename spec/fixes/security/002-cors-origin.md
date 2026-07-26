# Fix 002 — CORS con `origin: *` en producción

## Problema
`main.ts` configura CORS con `origin: process.env.CORS_ORIGIN || '*'` y `credentials: true`. En `.env`, `CORS_ORIGIN=*`. En producción, cualquier sitio web puede hacer solicitudes cross-origin a la API.

## Impacto
**Alto** — Aunque el JWT se envía por `Authorization` header (no cookies), un `*` con `credentials: true` permite:
- CSRI (Cross-Site Request Inclusion): un sitio malicioso puede leer respuestas de la API
- Riesgo aumentado si algún cliente frontend usa cookies en el futuro
- Exposición a ataques de tipo speculative side-channel

## Archivos afectados
- `src/main.ts`

## Causa raíz
La configuración de CORS no diferencia entre entornos. En desarrollo `*` es aceptable, pero la misma config iría a producción.

## Cambios necesarios

### 1. Modificar `main.ts` para usar orígenes específicos en producción
```typescript
app.enableCors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CORS_ORIGIN?.split(',').map(s => s.trim()) || 'https://amanecerrural.com'
    : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})
```

### 2. Actualizar `.env.example` con el dominio real
```env
# CORS — lista separada por comas para producción
CORS_ORIGIN=https://amanecerrural.com,https://admin.amanecerrural.com
```

## Criterios de aceptación
- [ ] En desarrollo (`NODE_ENV=development`), CORS sigue siendo `*`
- [ ] En producción, solo los orígenes listados en `CORS_ORIGIN` son aceptados
- [ ] `credentials: true` se mantiene (necesario para el frontend Angular)
- [ ] Las peticiones OPTIONS (preflight) funcionan correctamente
