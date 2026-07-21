# Plan — Meta Graph API

## Dependencias nuevas
```json
"facebook-nodejs-business-sdk": "^21.x"
```

## Archivos a crear
```
src/
├── social/
│   ├── social.module.ts
│   ├── social-accounts.controller.ts     # CRUD de cuentas (admin)
│   ├── social-accounts.service.ts        # Lógica de conexión/validación
│   ├── entities/
│   │   └── social-account.entity.ts      # TypeORM entity
│   ├── dto/
│   │   ├── create-social-account.dto.ts
│   │   └── update-social-account.dto.ts
│   ├── publishers/
│   │   ├── facebook.publisher.ts         # Publicación a Facebook Page
│   │   └── instagram.publisher.ts        # Publicación a Instagram Business
│   └── publishers/
│       └── publisher.interface.ts        # Interface IPublisher
```

## Archivos a modificar
- `src/app.module.ts` — importar SocialModule

## Pasos
1. Instalar `facebook-nodejs-business-sdk`
2. Crear entidad SocialAccount en TypeORM
3. Crear DTOs de creación y actualización
4. Implementar SocialAccountsService:
   - `create()`: validar token contra Meta, obtener page info, detectar IG vinculado
   - `findAll()`: listar cuentas activas
   - `update()`: actualizar token
   - `remove()`: soft delete o desactivar
5. Implementar `PublisherInterface` con método `publish(text, mediaUrl[]): Promise<PublishResult>`
6. Implementar `FacebookPublisher`:
   - Subir foto a Facebook Page (`/{page-id}/photos`)
   - Crear post con texto (`/{page-id}/feed`)
7. Implementar `InstagramPublisher`:
   - Subir media como `{media_type, media_url, caption}` a IG Container
   - Publicar container (`/{ig-user-id}/media_publish`)
8. Implementar `POST /admin/social/accounts/:id/test` que usa el publisher correspondiente
9. Registrar SocialModule en app.module.ts
