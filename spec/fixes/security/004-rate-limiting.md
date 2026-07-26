# Fix 004 — Rate limiting en endpoints de autenticación

## Problema
No hay protección contra fuerza bruta. El endpoint `POST /auth/login` acepta peticiones ilimitadas, permitiendo a un atacante probar contraseñas de forma masiva contra cuentas de usuario.

## Impacto
**Medio** — Un atacante puede:
- Probar millones de contraseñas contra cuentas de usuario registradas
- Atacar cuentas de administrador por diccionario
- Degradar el rendimiento del servidor

## Archivos afectados
- `src/app.module.ts`
- `src/main.ts`
- `package.json`

## Causa raíz
No se implementó ningún middleware de rate limiting en la aplicación.

## Cambios necesarios

### 1. Instalar dependencia
```bash
npm install @nestjs/throttler
```

### 2. Agregar `ThrottlerModule` en `app.module.ts`
```typescript
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,       // ventana de 1 minuto
      limit: 30,        // máximo 30 peticiones por minuto global
    }]),
    // ... otros módulos
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // ... otros providers
  ],
})
```

### 3. Configurar un throttle más restrictivo para login
```typescript
// Opción A: Usar @SkipThrottle / @Throttle en el controlador
import { Throttle } from '@nestjs/throttler'

@Post('login')
@Throttle({ default: { limit: 5, ttl: 60000 } })  // 5 intentos por minuto
async login(@Body() body: LoginDto) {
  return this.authService.login(body.email, body.password)
}
```

### 4. Opcional: Configurar límites por ambiente
```typescript
ThrottlerModule.forRoot([{
  ttl: 60000,
  limit: process.env.NODE_ENV === 'production' ? 30 : 100,
}])
```

## Criterios de aceptación
- [ ] Más de 30 peticiones por minuto desde una misma IP reciben `429 Too Many Requests`
- [ ] Login específicamente limitado a 5 intentos por minuto
- [ ] Los tests e2e pasan correctamente (pueden necesitar `@SkipThrottle()` en el ambiente de test)
- [ ] Las respuestas `429` incluyen headers `Retry-After`
