# Feature 028: Auto-aprobación por pago de Mercado Pago para eventos y proveedores

## Objetivo

Extender la auto-aprobación por pago (ya existente para clasificados) a los
conceptos `evento` y `proveedor`: cuando una transacción de Mercado Pago se
procesa con estado `approved`, el contenido asociado pasa automáticamente a
`APPROVED` sin intervención del administrador.

## Contexto

- `ClasificadosSubscriber` ya escucha el evento interno `payment.processed`
  y aprueba clasificados pagos. Los avisos gratis siguen quedando `PENDING`.
- `PaymentsService.processPayment` emite `payment.processed` con
  `{ transactionId, conceptType, conceptId, status }` tras confirmar el pago
  contra la API de MP.
- Eventos y proveedores tenían `updateStatus` pero ningún subscriber, por lo
  que un pago aprobado no producía efecto sobre ellos.

## Cambios

| Archivo | Cambio |
|---|---|
| `src/eventos/eventos.subscriber.ts` | **Nuevo.** `@OnEvent('payment.processed')`: si `conceptType === 'evento'` y `status === 'approved'`, llama a `updateStatus(conceptId, EventoStatus.APPROVED, 0)` (emite `evento.approved`). |
| `src/eventos/eventos.module.ts` | Registra `EventosSubscriber` en providers. |
| `src/proveedores/proveedores.subscriber.ts` | **Nuevo.** Ídem con `conceptType === 'proveedor'`; `updateStatus(conceptId, ProveedorStatus.APPROVED)` setea `expiresAt` automáticamente. |
| `src/proveedores/proveedores.module.ts` | Registra `ProveedoresSubscriber` en providers. |

## Comportamiento

- Pago aprobado → contenido `PENDING` pasa a `APPROVED` al instante.
- Pago pendiente/rechazado (`in_process`, `rejected`) → sin cambios; el
  webhook de MP es el respaldo para notificaciones diferidas (pendiente de
  configurar secreto real).
- Moderación manual queda intacta.

## Configuración requerida (Railway api-dev / desarrollo)

- `MP_ACCESS_TOKEN` / `MP_PUBLIC_KEY`: credenciales TEST de la cuenta.
- `API_URL=https://api-dev-desarrollo.up.railway.app` para que
  `notification_url` deje de apuntar a localhost.
- `MP_WEBHOOK_SECRET`: pendiente (placeholder actual); el flujo principal vía
  Checkout Brick + `processPayment` no lo necesita.

## Verificación

- `npm run build` compila sin errores.
- Prueba end-to-end con tarjeta TEST documentada en la sesión.
