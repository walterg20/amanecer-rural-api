# Fix 006 — Endpoints de suscripciones sin autenticación

## Problema
Los endpoints `GET /subscriptions/:id`, `POST /subscriptions/:id/renew` y `POST /subscriptions` no tienen guards de autenticación. Cualquier persona puede consultar datos personales de cualquier suscriptor (nombre, email, teléfono) y manipular renovaciones.

## Impacto
**Medio** — Un atacante puede:
- Enumerar IDs secuenciales de suscripciones y extraer PII (nombre, email, teléfono)
- Forzar renovaciones de suscripciones ajenas
- Obtener el historial de pagos de otros usuarios

## Archivos afectados
- `src/subscriptions/subscriptions.controller.ts`
- `src/subscriptions/subscriptions.service.ts`

## Causa raíz
El `SubscriptionsController` no tiene `@UseGuards(JwtAuthGuard)` a nivel de clase ni en los endpoints individuales que exponen datos sensibles.

## Cambios necesarios

### 1. Agregar `JwtAuthGuard` a los endpoints que exponen datos de una suscripción específica
```typescript
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@Get(':id')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
async getDetail(
  @Param('id') id: string,
  @CurrentUser('id') userId: number,
) {
  const sub = await this.subscriptionsService.getDetail(Number(id), userId)
  return { data: sub }
}
```

### 2. Agregar verificación de ownership en `getDetail()`
```typescript
// subscriptions.service.ts
async getDetail(id: number, userId?: number): Promise<Subscription> {
  const sub = await this.subRepo.findOne({
    where: { id },
    relations: { plan: true },
  })
  if (!sub) throw new NotFoundException('Suscripción no encontrada')

  // Si hay userId, verificar ownership (a menos que sea admin)
  if (userId && sub.createdBy && sub.createdBy !== userId) {
    throw new ForbiddenException('No tienes permiso para ver esta suscripción')
  }

  // ... resto del método
}
```

### 3. El endpoint `POST /subscriptions` (creación) puede permanecer público
```typescript
@Post()
@ApiOperation({ summary: 'Crear suscripción' })
async create(@Body() body: CreateSubscriptionDto) {
  const sub = await this.subscriptionsService.create(body)
  return { data: { id: sub.id, price: (sub as any).plan?.price, plan: (sub as any).plan } }
}
```
> Se mantiene público porque un usuario debe poder crear una suscripción antes de autenticarse (flujo de pago).

### 4. Opcional: Agregar campo `createdBy` a la entidad `Subscription` si no existe
```typescript
// entities/subscription.entity.ts
@Column({ name: 'created_by', nullable: true })
createdBy?: number
```

## Criterios de aceptación
- [ ] `GET /subscriptions/:id` requiere JWT válido
- [ ] Un usuario no puede ver suscripciones de otro usuario
- [ ] `POST /subscriptions` sigue siendo público (creación)
- [ ] `POST /subscriptions/:id/renew` requiere autenticación y verifica ownership
- [ ] Los admins pueden ver cualquier suscripción (roles guard)
