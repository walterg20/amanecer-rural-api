# Plan — Testing Infrastructure

## Dependencias nuevas
```json
"@nestjs/testing": "^11.x",
"supertest": "^7.x",
"@types/supertest": "^6.x"
```

## Archivos a crear
```
test/
├── jest-e2e.json
├── app.e2e-spec.ts           # Smoke test: health check + auth flow
└── unit/
    ├── auth.service.spec.ts   # Unit: register/login/refresh
    └── roles.guard.spec.ts    # Unit: role-based access
```

## Archivos a modificar
- `package.json` — agregar devDependencies, verificar scripts `test` y `test:e2e`

## Pasos
1. Instalar dependencias de testing
2. Crear `test/jest-e2e.json` con configuración NestJS
3. Crear test e2e de health check (`GET /api/v1`)
4. Crear test e2e de auth flow completo (register → login → me)
5. Crear test unitario de `AuthService.register()` y `AuthService.login()`
6. Crear test unitario de `RolesGuard` (rol permitido, rol denegado, sin rol)
7. Ejecutar `npm run test` y `npm run test:e2e` y verificar
