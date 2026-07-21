# Tasks — Meta Graph API

- [ ] Instalar `facebook-nodejs-business-sdk`
- [ ] Crear entidad `SocialAccount` (id, platform, account_name, page_id, page_access_token, instagram_business_id, is_active, created_by, timestamps)
- [ ] Crear `CreateSocialAccountDto` (platform, accountName, pageId, pageAccessToken)
- [ ] Crear `UpdateSocialAccountDto` (accountName?, pageAccessToken?)
- [ ] Implementar `SocialAccountsService.create()` — validar token vs Meta /me/accounts
- [ ] Implementar `SocialAccountsService.findAll()` — listar cuentas
- [ ] Implementar `SocialAccountsService.update()` — actualizar token
- [ ] Implementar `SocialAccountsService.remove()` — desactivar cuenta
- [ ] Crear `PublisherInterface` con `publish(text: string, mediaUrls: string[]): Promise<PublishResult>`
- [ ] Implementar `FacebookPublisher` — post a feed + subida de fotos
- [ ] Implementar `InstagramPublisher` — container + media_publish
- [ ] Crear `AdminSocialAccountsController` con CRUD + test endpoint
- [ ] Registrar SocialModule en `app.module.ts`
- [ ] Test manual: conectar cuenta de Facebook de prueba
- [ ] Test: publicar post de prueba a Facebook e Instagram
