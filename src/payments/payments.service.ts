import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import MercadoPagoConfig, { Preference, Payment } from 'mercadopago'
import { Transaction, TransactionStatus } from './entities/transaction.entity'
import { CreatePreferenceDto } from './dto/create-preference.dto'

@Injectable()
export class PaymentsService {
  private readonly client: MercadoPagoConfig
  private readonly preference: Preference
  private readonly payment: Payment

  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    private readonly config: ConfigService,
  ) {
    this.client = new MercadoPagoConfig({
      accessToken: this.config.get<string>('MP_ACCESS_TOKEN', ''),
      options: { timeout: 5000 },
    })
    this.preference = new Preference(this.client)
    this.payment = new Payment(this.client)
  }

  async createPreference(userId: number, data: CreatePreferenceDto) {
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
        back_urls: {
          success: `${this.config.get('FRONTEND_URL', 'http://localhost:4200')}/payments/success`,
          failure: `${this.config.get('FRONTEND_URL', 'http://localhost:4200')}/payments/failure`,
          pending: `${this.config.get('FRONTEND_URL', 'http://localhost:4200')}/payments/pending`,
        },
        auto_return: 'approved',
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

  async handleWebhook(body: any) {
    const { type, data } = body

    if (type !== 'payment' || !data?.id) return

    const paymentId = data.id
    try {
      const paymentResponse = await this.payment.get({ id: paymentId })
      const status = this.mapStatus(paymentResponse.status ?? 'pending')

      if (paymentResponse.external_reference) {
        await this.transactionRepo.update(
          { id: Number(paymentResponse.external_reference) },
          { status, mpPaymentId: paymentId },
        )
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
