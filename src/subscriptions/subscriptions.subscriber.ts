import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { SubscriptionsService } from './subscriptions.service'

@Injectable()
export class SubscriptionsSubscriber {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @OnEvent('payment.processed')
  async handlePaymentProcessed(event: {
    transactionId: number
    conceptType?: string
    conceptId?: number
    status: string
  }) {
    await this.subscriptionsService.handlePaymentProcessed(event)
  }
}
