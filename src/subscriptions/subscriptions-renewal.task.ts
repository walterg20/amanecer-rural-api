import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { SubscriptionsService } from './subscriptions.service'

@Injectable()
export class SubscriptionsRenewalTask {
  private readonly logger = new Logger(SubscriptionsRenewalTask.name)

  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleRenewals() {
    this.logger.log('Verificando suscripciones próximas a vencer...')

    const expired = await this.subscriptionsService.expirePastDue()
    if (expired > 0) {
      this.logger.log(`${expired} suscripciones vencidas`)
    }

    const expiring = await this.subscriptionsService.findExpiringSoon(7)
    if (expiring.length > 0) {
      this.logger.log(`${expiring.length} suscripciones próximas a vencer en 7 días`)
      for (const sub of expiring) {
        this.logger.log(`- #${sub.id} (${sub.email}) vence ${sub.currentPeriodEnd?.toISOString()}`)
      }
    }
  }
}
