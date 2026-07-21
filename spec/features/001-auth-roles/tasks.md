# Tasks — Auth y Roles

- [ ] Crear entidad `Role` (id, name, slug, description)
- [ ] Crear entidad `User` (id, email, password, name, role_id, active, avatar, created_at, updated_at)
- [ ] Crear seed de 3 roles: admin, editor, user
- [ ] Configurar módulo Auth con JWT y Passport
- [ ] Implementar `register()` — validar email único, hashear password
- [ ] Implementar `login()` — validar credenciales, firmar JWT
- [ ] Implementar `refreshToken()` — renovar access token
- [ ] Implementar `getProfile()` / `updateProfile()`
- [ ] Crear JwtStrategy (extrae user del token)
- [ ] Crear JwtAuthGuard (protege rutas)
- [ ] Crear RolesGuard (controla acceso por rol)
- [ ] CRUD de usuarios para admin (listar, cambiar rol, desactivar)
- [ ] Tests de integración para auth
