# Plan — Pagos con Mercado Pago

## Entidades
- Transaction (id, user_id, amount, status, mp_preference_id, mp_payment_id, concept_type, concept_id, created_at)

## Pasos
1. Crear entidad Transaction
2. Configurar SDK de Mercado Pago
3. Crear PaymentService (crear preferencia, procesar webhook)
4. Endpoint POST /api/v1/payments/create-preference
5. Endpoint POST /api/v1/payments/webhook (IPN)
6. Vincular con classifieds/providers según concepto
