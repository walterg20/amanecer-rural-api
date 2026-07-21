# AGENTS.md — Amanecer Rural API

## Quick facts
- NestJS 11 + TypeORM 1.x + PostgreSQL 16 + Redis 7 + JWT/Passport
- TypeScript 5.7, strict null checks enabled
- Global prefix `/api/v1/` set in `src/main.ts`
- DB port **5433** locally (mapped from container 5432)
- Sin scripts de lint ni typecheck — ejecutar `npm run build` para verificar tipos

## Commands
```bash
npm run start:dev          # watch mode
npm run build              # compila a dist/
npm run test               # unit tests (jest, rootDir=src)
npm run test:e2e           # e2e tests (test/jest-e2e.json)
npm run migrate:php -- <path>  # migración desde PHP a PostgreSQL
docker compose up -d       # postgres + redis + pgadmin

# TypeORM migrations
npm run typeorm:generate -- --name MigrationName
npm run typeorm:run
npm run typeorm:revert
```

## Environment variables
| Variable | Default | Description |
|----------|---------|-------------|
| DB_HOST | localhost | PostgreSQL host |
| DB_PORT | 5433 | PostgreSQL port |
| DB_NAME | amanecer_rural | Database name |
| DB_USER | ar_user | Database user |
| DB_PASSWORD | ar_password | Database password |
| JWT_SECRET | super-secret-key | JWT signing secret |
| API_PORT | 3000 | API port |
| CORS_ORIGIN | * | CORS allowed origin |
| MP_ACCESS_TOKEN | — | Mercado Pago access token |
| FRONTEND_URL | http://localhost:4200 | Frontend URL for MP redirects |
| API_URL | http://localhost:3000 | API URL for MP webhook |
| NODE_ENV | development | Environment (sync=true when not production) |

## Architecture
- `src/main.ts` — bootstrap, global pipes, CORS, prefix, static uploads serving
- `src/app.module.ts` — root module, TypeORM async config
- Feature modules: `auth/`, `users/`, `posts/`, `payments/`
- Shared: `common/decorators/`, `common/guards/`
- Entities usan snake_case en columnas; soft-delete en posts
- Uploads servidos estáticamente en `/uploads/`
- Migración PHP: `scripts/migrate-from-php.ts` (ts-node)

## Auth
- Roles se seedean automáticamente al iniciar (`AuthModule.onModuleInit`)
- Roles: `superadmin`, `admin`, `editor`, `provider`, `user`
- `@Roles('admin')` decorator + `RolesGuard` para endpoints protegidos
- JWT payload: `{ sub, email, role }`
- Access token: 15min, Refresh token: 7d
- `POST /api/v1/auth/refresh` para renovar tokens

## Endpoints

### Auth (`/api/v1/auth`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /register | No | Registro de usuario |
| POST | /login | No | Inicio de sesión |
| POST | /refresh | No | Refresh token |
| GET | /me | JWT | Perfil del usuario |
| PATCH | /me | JWT | Actualizar perfil |

### Users (`/api/v1/admin/users`)
| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | / | superadmin, admin | Listar usuarios |
| PATCH | /:id/role | superadmin, admin | Cambiar rol |

### Posts (público)
| Method | Path | Description |
|--------|------|-------------|
| GET | /posts | Listar (filtros: type, category, tag, page, limit) |
| GET | /posts/:slug | Obtener por slug |
| GET | /categories | Listar categorías |
| GET | /tags | Listar tags |

### Posts (admin)
| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| POST | /admin/posts | admin, editor | Crear post |
| GET | /admin/posts | admin, editor | Listar todos |
| PATCH | /admin/posts/:id | admin, editor | Editar post |
| DELETE | /admin/posts/:id | admin, editor | Soft delete |
| POST | /admin/posts/upload | admin, editor | Subir imagen |
| POST | /admin/categories | admin, editor | Crear categoría |

### Payments
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /payments/create-preference | JWT | Crear preferencia MP |
| POST | /payments/webhook | No | Webhook IPN |
| GET | /payments/transactions | JWT | Historial de transacciones |

### System
| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |

## Conventions
- Feature modules en `src/<feature>/` con module/controller/service/entities
- DTOs con `class-validator`, `ValidationPipe` con `whitelist: true`
- Response shape: `{ data, meta, error }`
- Entities: `@Entity`, `@PrimaryGeneratedColumn`, columnas con nombre explícito
- Endpoints admin protegidos con `JwtAuthGuard` + `RolesGuard`
- Subida de imágenes: `POST /admin/posts/upload` (max 5MB, jpeg/png/gif/webp)

## Spec system
- `spec/constitution/` — identidad del proyecto, tech stack, roadmap
- `spec/features/NNN-name/` — spec.md → plan.md → tasks.md por feature
