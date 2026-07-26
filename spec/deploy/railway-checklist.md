# Railway Deploy Checklist — Amanecer Rural API

## Pre-requisitos

- [ ] Cuenta Railway activa
- [ ] CLI Railway instalado (`npm i -g @railway/cli`)
- [ ] Repositorio GitHub conectado a Railway
- [ ] `.env.example` actualizado en el repo

## 1. Crear servicios en Railway

- [ ] Crear proyecto Railway desde el dashboard
- [ ] Agregar servicio **PostgreSQL** (Railway template)
- [ ] Agregar servicio **Redis** (Railway template)
- [ ] Agregar servicio **API** desde GitHub (conectar repo)
- [ ] Enlazar el proyecto localmente: `railway link`

## 2. Variables de entorno — API Service

### Conexiones a infraestructura (referencias)

| Variable | Referencia Railway |
|----------|--------------------|
| `DB_HOST` | `${{ Postgres.HOST }}` |
| `DB_PORT` | `${{ Postgres.PORT }}` |
| `DB_NAME` | `${{ Postgres.DB_NAME }}` |
| `DB_USER` | `${{ Postgres.USER }}` |
| `DB_PASSWORD` | `${{ Postgres.PASSWORD }}` |
| `REDIS_HOST` | `${{ Redis.REDIS_HOST }}` |
| `REDIS_PORT` | `${{ Redis.REDIS_PORT }}` |
| `REDIS_CACHE_TTL` | `300` |

### Configuración de la API

| Variable | Valor |
|----------|-------|
| `NODE_ENV` | `development` |
| `API_PORT` | `3000` |
| `JWT_SECRET` | `<mismo-secret-que-en-local>` |
| `JWT_EXPIRES_IN` | `7d` |
| `CORS_ORIGIN` | `*` (o la URL del frontend) |
| `API_URL` | `https://<api>.up.railway.app` |
| `FRONTEND_URL` | URL del frontend |

### Servicios externos

| Variable | Valor |
|----------|-------|
| `MP_ACCESS_TOKEN` | Token de producción o test |
| `MP_PUBLIC_KEY` | Public key de MP |
| `MP_WEBHOOK_SECRET` | Secret del webhook MP |
| `WEATHER_API_KEY` | API key de WeatherAPI |
| `SMTP_HOST` | Host SMTP |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` |
| `SMTP_USER` | Usuario SMTP |
| `SMTP_PASS` | Password SMTP |
| `SMTP_FROM` | `noreply@amanecerrural.com` |

## 3. Configurar servicio API

- [ ] **Root Directory**: `/` (o ruta del monorepo)
- [ ] **Build Command**: `npm run build`
- [ ] **Start Command**: `npm run start:prod`
- [ ] **Healthcheck Path**: `/api/v1/health`
- [ ] **Healthcheck Timeout**: `300` segundos
- [ ] **Restart Policy**: `ON_FAILURE`

## 4. Post-deploy — Verificación

- [ ] Healthcheck responde: `GET /api/v1/health` → `{ "status": "ok" }`
- [ ] Login funciona: `POST /api/v1/auth/login` → devuelve tokens
- [ ] Swagger accesible: `GET /api/v1/docs`
- [ ] Base de datos conectada (probar listar entidades)
- [ ] Redis conectado (verificar caché / colas)

## 5. Post-deploy — Configuración externa

- [ ] Configurar webhook de MercadoPago:
  - URL: `https://<api>.up.railway.app/api/v1/payments/webhook`
  - Eventos: `payment`
- [ ] Actualizar DNS / dominio personalizado (opcional)
- [ ] Configurar SSL (Railway lo maneja automáticamente con dominios custom)

## 6. Notas importantes

| Aspecto | Detalle |
|---------|---------|
| **Uploads efímeros** | El directorio `uploads/` se pierde al redeploy. Para persistencia real, agregar un **Volume** de Railway montado en `/uploads` o usar un bucket S3 |
| **synchronize: false** | `NODE_ENV=production` desactiva `synchronize` de TypeORM automáticamente (`app.module.ts:40`). En desarrollo se puede dejar activo |
| **Puerto** | Railway asigna `PORT` automáticamente. El código usa `API_PORT` con fallback `3000` |
| **JWT** | Todos los tokens existentes quedan inválidos. Usuarios deben re-login |
| **CORS** | Con `CORS_ORIGIN=*` en dev, no hay restricción. En producción, especificar orígenes |
| **Rate limiting** | 100 req/min global en dev, 30 en prod. Login: 5 intentos/min |
| **Logs** | Usar `railway logs --service api` o el dashboard para ver errores de build/deploy |
| **Migraciones** | Por ahora `synchronize` se encarga del schema. Para producción, migrar a migraciones formales con TypeORM |
