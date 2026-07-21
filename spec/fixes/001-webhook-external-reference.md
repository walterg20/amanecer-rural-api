# Fix 001 — Webhook Mercado Pago: external_reference

## Bug
`createPreference()` no setea `external_reference` en la preferencia de Mercado Pago.
`handleWebhook()` busca la transacción por `external_reference` (que es `null`) → nunca actualiza el estado del pago.

## Impacto
Cuando MP notifica al webhook que un pago fue aprobado/rechazado, la transacción en DB queda siempre como `pending` aunque el pago se haya completado.

## Archivo
`src/payments/payments.service.ts`

## Causa raíz
La transacción se crea **después** de la preferencia, pero necesitamos el ID de la transacción para pasarlo como `external_reference` a MP.

## Cambios necesarios

### 1. `createPreference()` — Reordenar operaciones

**Actual:** Crea preferencia → crea transacción
**Nuevo:** Crea transacción → crea preferencia con `external_reference` → actualiza `mpPreferenceId`

```
// 1. Crear y guardar transacción PRIMERO (obtener ID)
const transaction = this.transactionRepo.create({ ... })
await this.transactionRepo.save(transaction)

// 2. Crear preferencia CON external_reference
const result = await this.preference.create({
  body: {
    items: [...],
    external_reference: String(transaction.id),  // ← NUEVO
    back_urls: { ... },
    notification_url: '...',
  },
})

// 3. Actualizar mpPreferenceId en la transacción
transaction.mpPreferenceId = result.id
await this.transactionRepo.save(transaction)
```

### 2. `handleWebhook()` — Cambiar lookup

**Actual:** `{ mpPreferenceId: paymentResponse.external_reference }`
**Nuevo:** `{ id: Number(paymentResponse.external_reference) }`

## Criterios de aceptación
- [ ] `createPreference()` guarda la transacción antes de llamar a MP
- [ ] La preferencia de MP incluye `external_reference` igual al `id` de la transacción
- [ ] `transaction.mpPreferenceId` se actualiza correctamente después de crear la preferencia
- [ ] `handleWebhook()` recibe la notificación y actualiza el `status` + `mpPaymentId` de la transacción correcta
- [ ] Si el webhook falla (MP no responde, parse error), se loguea el error sin lanzar excepción
