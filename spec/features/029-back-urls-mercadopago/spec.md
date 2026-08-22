# Feature 029: Back URLs de Mercado Pago

## Objetivo

Que Mercado Pago redirija al usuario a páginas de resultado del frontend al
finalizar un pago, cubriendo métodos offline (Rapipago/PagoFácil) y futuros
flujos Checkout Pro.

## Problema

`createPreference` solo configuraba `notification_url` y `external_reference`.
Sin `back_urls`, MP no devuelve al usuario a ningún lado: quien paga con
voucher queda sin feedback y no hay ruta canónica de success/pending/failure.

## Cambios

| Archivo | Cambio |
|---|---|
| `src/payments/payments.service.ts` | En `createPreference` se agregan `back_urls` (success/pending/failure → `${FRONTEND_URL}/pagos/<estado>`) y `auto_return: 'approved'`. `FRONTEND_URL` se lee de ConfigService con fallback `http://localhost:3001` (puerto del front en dev). |

## Frontend relacionado

`amanecer-rural-nextjs` feature/056-paginas-resultado-pago crea las rutas
`/pagos/success`, `/pagos/pending` y `/pagos/failure`.

MP agrega query params a la URL de retorno (`payment_id`, `status`,
`external_reference`, etc.) que las páginas usan para mostrar el resultado.

## Verificación

- `npm run build` sin errores.
