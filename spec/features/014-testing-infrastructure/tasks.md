# Tasks — Testing Infrastructure

- [ ] Instalar `@nestjs/testing`, `supertest`, `@types/supertest`
- [ ] Crear `test/jest-e2e.json` (config e2e con ts-jest, setup NestJS TestingModule)
- [ ] Crear `test/app.e2e-spec.ts` — health check retorna 200
- [ ] Crear `test/auth.e2e-spec.ts` — register → login → me (JWT flow)
- [ ] Crear `src/auth/auth.service.spec.ts` — mock repository, test register/login/refresh
- [ ] Crear `src/common/guards/roles.guard.spec.ts` — mock reflector, test allow/deny
- [ ] Verificar `npm run test` pasa sin errores
- [ ] Verificar `npm run test:e2e` pasa sin errores
