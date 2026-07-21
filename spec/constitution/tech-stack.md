# Amanecer Rural API — Tech Stack

| Capa | Tecnología | Versión |
|---|---|---|
| Runtime | Node.js | 20 LTS |
| Framework | NestJS | 10.x |
| Lenguaje | TypeScript | 5.x |
| ORM | TypeORM | 0.3.x |
| Base de datos | PostgreSQL | 16 |
| Caché / Colas | Redis | 7.x |
| Autenticación | JWT + Passport | — |
| Pagos | Mercado Pago SDK | — |
| Clima | OpenWeather API | — |
| Migración | Script Node.js + csv/pg-dump | — |
| Testing | Jest | — |
| Container | Docker | — |
| CI/CD | GitHub Actions | — |
| Hosting | Railway | — |

## Convenciones
- Estilo: ESLint + Prettier (configuración estándar NestJS)
- Commits: Convencional Commits (feat:, fix:, chore:, docs:)
- Branch: main, develop, feature/*
- API: RESTful, versionada (/api/v1/)
- Respuestas: JSON uniforme ({ data, meta, error })
- Errores: HttpException con códigos estándar HTTP
