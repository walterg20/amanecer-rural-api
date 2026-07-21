# 014 — Testing Infrastructure

## Descripción
Infraestructura base de testing para la API. Cero tests existen actualmente — esta feature establece el framework, configuración y primeros tests unitarios y de integración.

## Dependencias
- `@nestjs/testing`
- `supertest`
- `@types/supertest`
- `ts-jest` (ya en devDependencies)

## Endpoints a testear
- `GET /api/v1` — Health check
- `POST /api/v1/auth/register` — Registro
- `POST /api/v1/auth/login` — Login
- `GET /api/v1/auth/me` — Perfil autenticado

## Criterios de aceptación
- [ ] `@nestjs/testing` y `supertest` instalados como devDependencies
- [ ] `test/jest-e2e.json` creado con configuración funcional
- [ ] Test unitario del health check controller
- [ ] Test unitario de AuthService (register, login, refresh)
- [ ] Test unitario de RolesGuard (acceso concedido/denegado según rol)
- [ ] Test de integración: registro → login → access token → endpoint protegido
- [ ] Script `npm run test` ejecuta sin errores
- [ ] Script `npm run test:e2e` ejecuta sin errores
- [ ] Cobertura mínima del 30% en módulos core (auth, common)
