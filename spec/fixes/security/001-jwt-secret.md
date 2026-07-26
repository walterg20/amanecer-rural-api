# Fix 001 — JWT Secret hardcodeado y .env versionado

## Problema
La clave JWT (`JWT_SECRET=super-secret-jwt-key-change-in-production`) está en texto plano en `.env` y ese archivo está siendo versionado en git. Cualquiera con acceso al repositorio puede forjar tokens JWT. Además, hay un fallback hardcodeado `'super-secret-key'` en `jwt.strategy.ts`.

## Impacto
**Crítico** — Un atacante que conozca el secret puede generar un JWT para cualquier `sub` (ID de usuario) y `role` (`superadmin`), obteniendo acceso completo a todos los endpoints: admin, pagos, datos personales de usuarios, capacidad de modificar/eliminar contenido.

## Archivos afectados
- `.env`
- `.gitignore` (puede no existir o no incluir `.env`)
- `src/auth/strategies/jwt.strategy.ts`

## Causa raíz
1. El `.env` se generó con valores por defecto y se commiteó al repositorio.
2. El fallback en `jwt.strategy.ts` es una constante débil predecible.

## Cambios necesarios

### 1. Agregar `.env` a `.gitignore`
```
# .gitignore
.env
.env.local
.env.production
```

### 2. Crear/actualizar `.env.example` con valores placeholder
```env
JWT_SECRET=change-this-to-a-random-secret
JWT_EXPIRES_IN=7d
# ... resto de variables sin valores reales
```

### 3. Generar nuevo JWT_SECRET y rotarlo
```bash
openssl rand -base64 64
# Copiar el resultado a .env como JWT_SECRET
```

### 4. Eliminar el fallback hardcodeado en `jwt.strategy.ts`
```typescript
// ANTES
secretOrKey: config.get<string>('JWT_SECRET', 'super-secret-key'),

// DESPUÉS
secretOrKey: config.get<string>('JWT_SECRET'),
```
> Nota: Si `JWT_SECRET` no está definida, NestJS lanzará un error en startup — comportamiento deseado.

### 5. Eliminar `.env` del historial de git (opcional pero recomendado)
```bash
git rm --cached .env
echo ".env" >> .gitignore
git add .gitignore .env.example
git commit -m "chore: remove .env from version control, add .env.example"
```
> ⚠️ Esto elimina el `.env` del tracking futuro pero lo mantiene en el historial. Para limpiarlo completamente del historial usar `git filter-branch` o `BFG Repo-Cleaner`.

## Criterios de aceptación
- [ ] `.env` está en `.gitignore` y no aparece en `git status`
- [ ] `.env.example` existe con todas las variables pero sin valores reales
- [ ] Se generó y aplicó un nuevo `JWT_SECRET` (todos los tokens existentes quedan inválidos — los usuarios deben re-login)
- [ ] `jwt.strategy.ts` ya no tiene fallback hardcodeado
- [ ] La API arranca correctamente con el nuevo `.env`
- [ ] Login, refresh y acceso a rutas protegidas funcionan con nuevos tokens
