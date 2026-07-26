# Fix 005 — Webhook de MercadoPago sin verificación de firma

## Problema
El endpoint `POST /payments/webhook` acepta cualquier body sin validar la firma criptográfica de MercadoPago (`X-Signature`). Un atacante puede falsificar notificaciones de pago.

## Impacto
**Medio** — Un atacante que conozca o fuerce IDs de transacción puede:
- Simular pagos aprobados sin pagar
- Activar suscripciones premium fraudulentas
- Publicar clasificados destacados sin costo
- Degradar la integridad contable del sistema

## Archivos afectados
- `src/payments/payments.controller.ts` (para acceder al header)
- `src/payments/payments.service.ts`

## Causa raíz
El webhook IPN solo verifica `body.type === 'payment'` pero no valida que la notificación realmente venga de MercadoPago mediante la firma HMAC.

## Cambios necesarios

### 1. Agregar método de validación en `PaymentsService`
```typescript
import { createHmac } from 'crypto'

private verifyWebhookSignature(
  body: string,
  signature: string,
  requestId: string,
): boolean {
  const secret = this.config.get<string>('MP_WEBHOOK_SECRET', '')
  if (!secret) return false

  // Formato esperado: ts=12345,v1=hash
  const parts = signature.split(',')
  const ts = parts.find(p => p.startsWith('ts='))?.split('=')[1]
  const hash = parts.find(p => p.startsWith('v1='))?.split('=')[1]
  if (!ts || !hash) return false

  const manifest = `id:${requestId};request-id:${requestId};ts:${ts};`
  const expected = createHmac('sha256', secret)
    .update(manifest)
    .digest('hex')

  return expected === hash
}
```

### 2. Modificar `handleWebhook` para recibir y validar headers
```typescript
// payments.controller.ts
@Post('webhook')
async webhook(
  @Body() body: any,
  @Req() req: Request,
) {
  const signature = req.headers['x-signature'] as string
  const requestId = req.headers['x-request-id'] as string

  // Solo validar si está configurado (retrocompatible)
  const secret = this.config.get<string>('MP_WEBHOOK_SECRET')
  if (secret) {
    const rawBody = (req as any).rawBody // requiere raw-body middleware
    if (!this.paymentsService.verifyWebhookSignature(rawBody, signature, requestId)) {
      throw new UnauthorizedException('Invalid webhook signature')
    }
  }

  await this.paymentsService.handleWebhook(body)
  return { status: 'ok' }
}
```

### 3. Configurar raw-body middleware para obtener el body crudo
```typescript
// main.ts
app.use(express.json({
  verify: (req: any, _res, buf) => {
    req.rawBody = buf.toString()
  },
}))
```

### 4. Agregar `MP_WEBHOOK_SECRET` a `.env.example`
```env
# Webhook secret desde el panel de MercadoPago -> Notificaciones -> Webhooks
MP_WEBHOOK_SECRET=
```

## Criterios de aceptación
- [ ] Notificaciones con firma inválida son rechazadas con `401 Unauthorized`
- [ ] Notificaciones válidas de MercadoPago se procesan correctamente
- [ ] Si `MP_WEBHOOK_SECRET` no está configurado, el webhook funciona sin validación (retrocompatible)
- [ ] El body crudo (`rawBody`) está disponible en el request para generar el HMAC
