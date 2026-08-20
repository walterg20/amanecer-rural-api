import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { ClasificadosService } from './clasificados.service'
import { ClasificadoStatus } from './entities/clasificado.entity'

@Injectable()
export class ClasificadosSubscriber {
  constructor(private readonly clasificadosService: ClasificadosService) {}

  @OnEvent('payment.processed')
  async handlePaymentProcessed(event: {
    transactionId: number
    conceptType?: string
    conceptId?: number
    status: string
  }) {
    if (event.conceptType !== 'clasificado' || !event.conceptId) return
    if (event.status !== 'approved') return

    await this.clasificadosService.updateStatus(event.conceptId, ClasificadoStatus.APPROVED, 0)
  }
}