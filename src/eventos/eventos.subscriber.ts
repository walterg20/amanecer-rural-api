import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EventosService } from './eventos.service'
import { EventoStatus } from './entities/evento.entity'

@Injectable()
export class EventosSubscriber {
  constructor(private readonly eventosService: EventosService) {}

  @OnEvent('payment.processed')
  async handlePaymentProcessed(event: {
    transactionId: number
    conceptType?: string
    conceptId?: number
    status: string
  }) {
    if (event.conceptType !== 'evento' || !event.conceptId) return
    if (event.status !== 'approved') return

    await this.eventosService.updateStatus(event.conceptId, EventoStatus.APPROVED, 0)
  }
}
