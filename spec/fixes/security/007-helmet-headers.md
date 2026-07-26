# Fix 007 — Agregar Helmet (seguridad de headers HTTP)

## Problema
La aplicación no usa `helmet`. No se envían headers de seguridad HTTP como `X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`, `Strict-Transport-Security`, etc.

## Impacto
**Medio** — Mayor superficie de ataque:
- Clickjacking (falta `X-Frame-Options` o `Content-Security-Policy`)
- MIME sniffing (falta `X-Content-Type-Options`)
- Downgrade de HTTPS (falta `Strict-Transport-Security`)
- XSS en ciertos contextos (falta `Content-Security-Policy`)

## Archivos afectados
- `src/main.ts`
- `package.json`

## Causa raíz
No se configuró middleware de seguridad HTTP. `helmet` es el estándar de facto en aplicaciones Express/NestJS.

## Cambios necesarios

### 1. Instalar dependencia
```bash
npm install helmet
```
> Nota: Si hay conflictos de tipos, instalar también `@types/helmet` (innecesario en algunas versiones recientes).

### 2. Agregar Helmet en `main.ts`
```typescript
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(helmet())

  // ... resto de la configuración
}
```

### 3. Revisar compatibilidad con Swagger UI
Swagger UI puede necesitar `Content-Security-Policy` más permisiva:
```typescript
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production'
    ? undefined  // CSP estricto en producción
    : false,     // Deshabilitado en desarrollo para Swagger
  crossOriginEmbedderPolicy: false,  // Necesario para Swagger UI
}))
```

## Criterios de aceptación
- [ ] Las respuestas HTTP incluyen headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Strict-Transport-Security`, `X-XSS-Protection: 0`
- [ ] Swagger UI funciona correctamente después de agregar helmet
- [ ] Los tests e2e pasan (no deberían verse afectados)
- [ ] La política CSP no bloquea recursos legítimos (imágenes, fuentes, scripts)
