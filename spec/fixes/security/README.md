# Security Hardening Roadmap — Amanecer Rural API

## Prioridades

| # | Finding | Severidad | Dependencias | Esfuerzo |
|---|---|---|---|---|
| 001 | JWT Secret hardcodeado + .env versionado | **Crítico** | Ninguna | ~15 min |
| 002 | CORS `*` con `credentials: true` | **Alto** | Ninguna | ~10 min |
| 003 | PgAdmin eliminado (se usa DBeaver) | **Resuelto** | — | — |
| 004 | Sin rate limiting en login | **Medio** | `npm install @nestjs/throttler` | ~20 min |
| 005 | Webhook MP sin validación de firma | **Medio** | Investigar SDK / firma MP | ~30 min |
| 006 | Subscriptions sin autenticación (IDOR) | **Medio** | Ninguna | ~15 min |
| 007 | Sin Helmet (headers de seguridad) | **Medio** | `npm install helmet` | ~15 min |
| 008 | File upload solo valida mimetype | **Bajo** | `npm install file-type` | ~20 min |

## Orden sugerido

1. **001** (crítico — riesgo inmediato de compromiso total)
2. **002 + 003** (alto — pueden combinarse en un PR)
3. **007 + 004** (medio — dependencias npm, combinables)
4. **006** (medio — independiente)
5. **005** (medio — requiere investigación)
6. **008** (bajo — defensa en profundidad)

## Notas

- Todos los cambios son retrocompatibles.
- Ninguno requiere migración de base de datos.
- Los cambios 001, 002, 003 implican modificar `.env` o `docker-compose.yml` — notificar al equipo.
