# 001 — Auth y Roles

## Descripción
Sistema de autenticación con JWT y manejo de 3 roles (Admin, Editor, Usuario). Indispensable Fase 1.

## Endpoints
- `POST /api/v1/auth/register` — Registro de usuario
- `POST /api/v1/auth/login` — Inicio de sesión
- `POST /api/v1/auth/refresh` — Refresh token
- `GET /api/v1/auth/me` — Perfil del usuario autenticado
- `PATCH /api/v1/auth/me` — Actualizar perfil
- `GET /api/v1/admin/users` — Listar usuarios (admin)
- `PATCH /api/v1/admin/users/:id/role` — Cambiar rol (admin)

## Criterios de aceptación
- [ ] Registro con email + password, validación de email único
- [ ] Login devuelve access token (JWT) + refresh token
- [ ] Middleware JWT protege rutas privadas
- [ ] Guards por rol (RolesGuard) para endpoints de admin
- [ ] Seed inicial con 3 roles: admin, editor, user
- [ ] Password hasheado con bcrypt
