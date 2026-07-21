# 018 — Meta Graph API (Facebook + Instagram)

## Descripción
Integración con Meta Graph API para publicación en Facebook Page e Instagram Business. Permite conectar cuentas de la organización, gestionar tokens de acceso y publicar contenido (texto + imágenes) en ambas plataformas. Base técnica para el motor de auto-publicación (F020).

## Dependencias
- `facebook-nodejs-business-sdk` — SDK oficial de Meta
- `axios` (ya en nestjs/platform-express via express)

## Entidades
### SocialAccount
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | int (PK) | Auto |
| platform | enum('facebook','instagram') | Plataforma |
| account_name | varchar | Nombre descriptivo |
| page_id | varchar | ID de Facebook Page |
| page_access_token | text | Token de página (no el de usuario) |
| instagram_business_id | varchar | ID de IG Business (nullable, solo instagram) |
| is_active | boolean | Si la cuenta está habilitada |
| created_by | int (FK→users) | Quién conectó |
| created_at | timestamp | |
| updated_at | timestamp | |

## Endpoints
- `POST /api/v1/admin/social/accounts` — Conectar nueva cuenta (recibe page_id + access_token)
- `GET /api/v1/admin/social/accounts` — Listar cuentas conectadas
- `PATCH /api/v1/admin/social/accounts/:id` — Actualizar token o nombre
- `DELETE /api/v1/admin/social/accounts/:id` — Desconectar cuenta
- `POST /api/v1/admin/social/accounts/:id/test` — Publicar post de prueba
- `POST /api/v1/admin/social/facebook/oauth-url` — Obtener URL de OAuth (opcional, para flujo web)

## Criterios de aceptación
- [ ] `facebook-nodejs-business-sdk` instalado
- [ ] CRUD completo de SocialAccount (solo admin/superadmin)
- [ ] Al crear cuenta, se valida el token contra Graph API (`/me/accounts`)
- [ ] Al crear cuenta, se obtiene `instagram_business_id` si la page tiene IG vinculado
- [ ] `POST /test` publica un texto simple + imagen en la plataforma correspondiente
- [ ] Tokens almacenados en texto cifrado o al menos en columna separada (no en .env)
- [ ] Refresh manual de token via `PATCH` (Meta tokens expiran a los 60 días)
- [ ] Soporte para múltiples cuentas de Facebook e Instagram
