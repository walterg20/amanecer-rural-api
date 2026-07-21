import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SocialAccount } from './entities/social-account.entity'
import { SocialAccountsService } from './social-accounts.service'
import { AdminSocialAccountsController } from './social-accounts.controller'
import { FacebookPublisher } from './publishers/facebook.publisher'
import { InstagramPublisher } from './publishers/instagram.publisher'

@Module({
  imports: [TypeOrmModule.forFeature([SocialAccount])],
  providers: [
    SocialAccountsService,
    FacebookPublisher,
    InstagramPublisher,
  ],
  controllers: [AdminSocialAccountsController],
  exports: [SocialAccountsService, FacebookPublisher, InstagramPublisher],
})
export class SocialModule {}
