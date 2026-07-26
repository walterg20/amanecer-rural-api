---
name: nestjs-auth-jwt
description: JWT authentication with Passport in NestJS 11 at Amanecer Rural — login, register, refresh token, roles guard, auto-seed. Use when working with auth flow, roles, guards, or user authentication.
license: MIT
metadata:
  author: Amanecer Rural
  version: "1.0.0"
---

# JWT Auth with NestJS + Passport

## Auth flow

1. `POST /auth/register` → crea usuario con role `'user'` (no acepta `role` en body)
2. `POST /auth/login` → devuelve `{ user, accessToken, refreshToken }`
3. `POST /auth/refresh` → renueva tokens con `refreshToken`
4. `GET /auth/me` → perfil del usuario autenticado
5. `PATCH /auth/me` → actualizar perfil

## JWT config

- Access token: 15min (configurable via `JWT_EXPIRES_IN` en `.env`)
- Refresh token: 7d
- Secret: `JWT_SECRET` en `.env`
- Payload: `{ sub: userId, email, role: user.role.slug }`

## Guards

### JwtAuthGuard
```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### RolesGuard
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles) return true
    const { user } = context.switchToHttp().getRequest()
    return requiredRoles.some(role => user.role === role)
  }
}
```

### Usage
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/posts')
export class AdminPostsController {
  @Delete(':id')
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  async remove(@Param('id') id: string) {
    await this.postsService.softDelete(+id)
    return { data: { id: +id, deleted: true } }
  }
}
```

## Role levels

| Role | Slug | Description |
|------|------|-------------|
| Super Admin | `superadmin` | Full access |
| Admin | `admin` | Manage content and users |
| Editor | `editor` | Create and edit content (same CRUD as admin) |
| Provider | `provider` | Manage their own provider profile |
| User | `user` | Regular registered user |

## Auto-seed

Los roles se seedean automáticamente al iniciar la app en `AuthModule.onModuleInit()`:

```
superadmin, admin, editor, provider, user
```

No hay seed de usuarios — se crean via `POST /auth/register` con role `'user'`. Para crear admin/editor, actualizar `role_id` directamente en BD.

## Current endpoints table

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /auth/register | No | Registro (role=user siempre) |
| POST | /auth/login | No | Login |
| POST | /auth/refresh | No | Refresh token |
| GET | /auth/me | JWT | Perfil |
| PATCH | /auth/me | JWT | Actualizar perfil |

### Users (admin)
| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | /admin/users | superadmin, admin | Listar usuarios |
| PATCH | /admin/users/:id/role | superadmin, admin | Cambiar rol |

## Decorators

```typescript
// @Roles('admin', 'editor') — define roles permitidos
import { Roles } from '../common/decorators/roles.decorator'

// @CurrentUser('id') — extrae propiedad del user del request
import { CurrentUser } from '../common/decorators/current-user.decorator'

async create(@Body() body: CreatePostDto, @CurrentUser('id') userId: number) {
  const post = await this.postsService.create({ ...body, authorId: userId })
  return { data: post }
}
```
