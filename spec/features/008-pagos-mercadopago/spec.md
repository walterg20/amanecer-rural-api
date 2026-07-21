# 008 — Pagos con Mercado Pago

## Descripción
Pasarela de pagos Mercado Pago. **Indispensable Fase 1.** Para clasificados pagos, suscripciones y publicidad.

## Criterios de aceptación
- [ ] Creación de preferencias de pago (MP API)
- [ ] Webhook de notificaciones (IPN)
- [ ] Manejo de estados: pending, approved, rejected, refunded
- [ ] Historial de transacciones por usuario
- [ ] Checkout transparente (Brick de MP)

## Endpoints
- POST /api/v1/payments/create-preference
- POST /api/v1/payments/webhook
- GET /api/v1/payments/transactions
