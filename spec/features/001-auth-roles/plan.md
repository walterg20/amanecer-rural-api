# Plan — Auth y Roles

## Módulos NestJS
```
src/
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   └── guards/
│       ├── jwt-auth.guard.ts
│       └── roles.guard.ts
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── entities/
│       ├── user.entity.ts
│       └── role.entity.ts
└── common/
    └── decorators/
        ├── roles.decorator.ts
        └── current-user.decorator.ts
```

## Pasos
1. Instalar dependencias: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt`
2. Crear entidades Role (3 roles: admin, editor, user) y User con TypeORM
3. Crear seed de roles en migración inicial
4. Implementar AuthService (register, login, refresh)
5. Implementar JwtStrategy
6. Implementar RolesGuard
7. Proteger rutas del admin
