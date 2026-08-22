import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { createHmac } from 'crypto'
import MercadoPagoConfig, { Preference, Payment } from 'mercadopago'
import { Transaction, TransactionStatus } from './entities/transaction.entity'
import { CreatePreferenceDto } from './dto/create-preference.dto'
import { ProcessPaymentDto } from './dto/process-payment.dto'

@Injectable()
export class PaymentsService {
  private readonly client: MercadoPagoConfig
  private readonly preference: Preference
  private readonly payment: Payment

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    private readonly config: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.client = new MercadoPagoConfig({
      accessToken: this.config.get<string>('MP_ACCESS_TOKEN', ''),
      options: { timeout: 5000 },
    })
    this.preference = new Preference(this.client)
    this.payment = new Payment(this.client)
  }

  getPublicKey(): string {
    return this.config.get<string>('MP_PUBLIC_KEY', '')
  }

  async createPreference(userId: number | undefined, data: CreatePreferenceDto) {
    const transaction = this.transactionRepo.create({
      userId,
      amount: data.amount,
      status: TransactionStatus.PENDING,
      conceptType: data.conceptType,
      conceptId: data.conceptId,
    })
    await this.transactionRepo.save(transaction)

    const result = await this.preference.create({
      body: {
        items: [
          {
            id: data.conceptType ? `${data.conceptType}-${data.conceptId ?? ''}` : data.title,
            title: data.title,
            description: data.description,
            quantity: 1,
            currency_id: 'ARS',
            unit_price: data.amount,
          },
        ],
        notification_url: `${this.config.get('API_URL', 'http://localhost:3000')}/api/v1/payments/webhook`,
        external_reference: String(transaction.id),
      },
    })

    transaction.mpPreferenceId = result.id
    await this.transactionRepo.save(transaction)

    return {
      preferenceId: result.id,
      initPoint: result.init_point,
      sandboxInitPoint: result.sandbox_init_point,
      transactionId: transaction.id,
    }
  }

  async processPayment(data: ProcessPaymentDto) {
    const transaction = await this.transactionRepo.findOne({
      where: { mpPreferenceId: data.preferenceId },
    })
    if (!transaction) {
      throw new NotFoundException('Transacción no encontrada para esta preferencia')
    }
    if (transaction.status !== TransactionStatus.PENDING) {
      throw new BadRequestException('La transacción ya fue procesada')
    }

    try {
      const paymentResponse = await this.payment.create({
        body: {
          token: data.token,
          transaction_amount: data.transaction_amount,
          payment_method_id: data.payment_method_id,
          installments: data.installments,
          payer: { email: data.payer.email },
          description: `Pago transacción #${transaction.id}`,
        },
      })

      const status = this.mapStatus(paymentResponse.status ?? 'pending')

      await this.transactionRepo.update(transaction.id, {
        status,
        mpPaymentId: paymentResponse.id,
      })

      this.eventEmitter.emit('payment.processed', {
        transactionId: transaction.id,
        conceptType: transaction.conceptType,
        conceptId: transaction.conceptId,
        status,
      })

      return {
        paymentId: paymentResponse.id,
        status,
        transactionId: transaction.id,
      }
    } catch (error: any) {
      if (error?.status === 400 || error?.status === 422) {
        const mpMessage = error?.cause?.[0]?.description ?? error?.message ?? 'Error al procesar el pago'
        await this.transactionRepo.update(transaction.id, { status: TransactionStatus.REJECTED })
        throw new BadRequestException(mpMessage)
      }
      throw error
    }
  }

  async handleWebhook(body: any) {
    const { type, data } = body

    if (type !== 'payment' || !data?.id) return

    const paymentId = data.id
    try {
      const paymentResponse = await this.payment.get({ id: paymentId })
      const status = this.mapStatus(paymentResponse.status ?? 'pending')

      if (paymentResponse.external_reference) {
        const transactionId = Number(paymentResponse.external_reference)
        const transaction = await this.transactionRepo.findOne({ where: { id: transactionId } })
        if (transaction) {
          await this.transactionRepo.update(transaction.id, { status, mpPaymentId: paymentId })
          this.eventEmitter.emit('payment.processed', {
            transactionId: transaction.id,
            conceptType: transaction.conceptType,
            conceptId: transaction.conceptId,
            status,
          })
        }
      }
    } catch (error) {
      console.error('Error processing webhook:', error)
    }
  }

  async getTransactions(userId: number) {
    return this.transactionRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    })
  }

  verifyWebhookSignature(rawBody: string, signature: string, requestId: string): boolean {
    const secret = this.config.get<string>('MP_WEBHOOK_SECRET', '')
    if (!secret) return false

    const parts = signature.split(',')
    const ts = parts.find(p => p.startsWith('ts='))?.split('=')[1]
    const hash = parts.find(p => p.startsWith('v1='))?.split('=')[1]
    if (!ts || !hash) return false

    const manifest = `id:${requestId};request-id:${requestId};ts:${ts};`
    const expected = createHmac('sha256', secret)
      .update(manifest)
      .digest('hex')

    return expected === hash
  }

  private mapStatus(mpStatus: string): TransactionStatus {
    const map: Record<string, TransactionStatus> = {
      approved: TransactionStatus.APPROVED,
      rejected: TransactionStatus.REJECTED,
      refunded: TransactionStatus.REFUNDED,
      charged_back: TransactionStatus.REFUNDED,
    }
    return map[mpStatus] || TransactionStatus.PENDING
  }
}
