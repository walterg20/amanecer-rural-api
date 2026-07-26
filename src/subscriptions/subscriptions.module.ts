import { Module, OnModuleInit } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SubscriptionPlan } from './entities/subscription-plan.entity'
import { Subscription } from './entities/subscription.entity'
import { SubscriptionPayment } from './entities/subscription-payment.entity'
import { SubscriptionStatusHistory } from './entities/subscription-status-history.entity'
import { SubscriptionsService } from './subscriptions.service'
import { SubscriptionsController } from './subscriptions.controller'
import { AdminSubscriptionsController } from './admin-subscriptions.controller'
import { SubscriptionsSubscriber } from './subscriptions.subscriber'
import { SubscriptionsRenewalTask } from './subscriptions-renewal.task'

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionPlan, Subscription, SubscriptionPayment, SubscriptionStatusHistory]),
  ],
  providers: [SubscriptionsService, SubscriptionsSubscriber, SubscriptionsRenewalTask],
  controllers: [SubscriptionsController, AdminSubscriptionsController],
})
export class SubscriptionsModule implements OnModuleInit {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  async onModuleInit() {
    await this.subscriptionsService.seedPlans()
  }
}
