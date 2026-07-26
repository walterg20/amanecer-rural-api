# Plan — Suscripciones con Mercado Pago

## Archivos a crear
```
src/subscriptions/
├── entities/
│   ├── subscription-plan.entity.ts
│   ├── subscription.entity.ts
│   ├── subscription-payment.entity.ts
│   └── subscription-status-history.entity.ts
├── dto/
│   ├── create-subscription-plan.dto.ts
│   ├── update-subscription-plan.dto.ts
│   ├── create-subscription.dto.ts
│   ├── update-subscription-status.dto.ts
│   └── query-subscriptions.dto.ts
├── events/
│   ├── subscription-activated.event.ts
│   ├── subscription-renewed.event.ts
│   ├── subscription-expired.event.ts
│   └── subscription-cancelled.event.ts
├── subscriptions.module.ts
├── subscriptions.service.ts
├── subscriptions.controller.ts
└── admin-subscriptions.controller.ts
```

## Archivos a modificar
- `src/app.module.ts` — importar SubscriptionsModule + ScheduleModule.forRoot()
- `package.json` — agregar @nestjs/schedule

## Pasos
1. Instalar @nestjs/schedule
2. Crear 4 entidades con enums inline y decoradores TypeORM
3. Crear DTOs con class-validator + Swagger
4. Crear event classes (extienden patrón existente)
5. Implementar SubscriptionsService (CRUD, activate, renew, manejo de eventos)
6. Implementar SubscriptionsController (público: plans, create, detail, renew)
7. Implementar AdminSubscriptionsController (admin: CRUD plans + gestion)
8. Configurar modulo (TypeOrmModule.forFeature + ScheduleModule)
9. Agregar seed de planes (app init o endpoint)
10. Agregar suscriptor que escucha payment.processed -> activate()
11. Agregar tarea cron @daily para chequeo de renovaciones
