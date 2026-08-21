import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { ProveedoresService } from './proveedores.service'
import { ProveedorStatus } from './entities/proveedor.entity'

@Injectable()
export class ProveedoresSubscriber {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @OnEvent('payment.processed')
  async handlePaymentProcessed(event: {
    transactionId: number
    conceptType?: string
    conceptId?: number
    status: string
  }) {
    if (event.conceptType !== 'proveedor' || !event.conceptId) return
    if (event.status !== 'approved') return

    await this.proveedoresService.updateStatus(event.conceptId, ProveedorStatus.APPROVED)
  }
}
