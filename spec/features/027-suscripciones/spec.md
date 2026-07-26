# 027 — Suscripciones con Mercado Pago

## Descripción
Sistema de suscripciones para revistas digitales/impresas con planes configurables y pago integrado via Mercado Pago (Payment Brick). Incluye renovación automática con aviso previo y renovación manual.

## Dependencias
- `@nestjs/schedule` (cron para renovaciones)
- Módulo Payments existente (create-preference, process, webhook)

## Entidades

### SubscriptionPlan
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | int (PK) | Auto |
| name | varchar(255) | "Digital Mensual" |
| type | enum(digital,print,both) | Tipo de suscripción |
| duration_days | int | 30, 365, etc. |
| price | decimal(10,2) | Precio en ARS |
| is_active | boolean | Soft delete / ocultar |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### Subscription
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | int (PK) | Auto |
| plan_id | int (FK→subscription_plans) | Plan elegido |
| name | varchar(255) | Nombre del suscriptor |
| email | varchar(255) | Email |
| phone | varchar(50)? | Teléfono opcional |
| status | enum(pending_payment,active,cancelled,expired) | Estado actual |
| current_period_start | timestamptz? | Inicio del período actual |
| current_period_end | timestamptz? | Fin del período actual |
| cancelled_at | timestamptz? | Fecha de cancelación |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### SubscriptionPayment
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | int (PK) | Auto |
| subscription_id | int (FK→subscriptions) | Suscripción |
| transaction_id | int? | FK a Transaction (payments) |
| amount | decimal(10,2) | Monto pagado |
| period_start | timestamptz | Período que cubre |
| period_end | timestamptz | Período que cubre |
| created_at | timestamptz | |

### SubscriptionStatusHistory
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | int (PK) | Auto |
| subscription_id | int (FK→subscriptions) | Suscripción |
| from_status | enum? | Estado anterior |
| to_status | enum | Estado nuevo |
| reason | varchar(255)? | Motivo |
| created_at | timestamptz | |

## Endpoints

### Públicos
| Método | Ruta | Auth |
|--------|------|------|
| GET | /subscriptions/plans | No |
| POST | /subscriptions | No |
| GET | /subscriptions/:id | No |
| POST | /subscriptions/:id/renew | No |

### Admin
| Método | Ruta | Auth |
|--------|------|------|
| GET | /admin/subscriptions | JWT + Roles |
| PATCH | /admin/subscriptions/:id/status | JWT + Roles |
| POST | /admin/subscriptions/plans | JWT + Roles |
| GET | /admin/subscriptions/plans | JWT + Roles |
| PATCH | /admin/subscriptions/plans/:id | JWT + Roles |
| DELETE | /admin/subscriptions/plans/:id | JWT + Roles |

## Criterios de aceptación
- [ ] Catálogo de planes administrable (CRUD admin)
- [ ] Suscripción se crea con status pending_payment
- [ ] Pago via Payment Brick → cambia a active
- [ ] StatusHistory registra cada cambio de estado
- [ ] SubscriptionPayment registra cada pago
- [ ] Renovación automática: task diaria detecta suscripciones próximas a vencer, crea preferencia y notifica
- [ ] Renovación manual: POST /subscriptions/:id/renew crea nueva preferencia
- [ ] Al pagar renovación, se extiende current_period_end
- [ ] Seed data con 6 planes iniciales
