import { Controller, Post, Get, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'
import { PaymentsService } from './payments.service'
import { CreatePreferenceDto } from './dto/create-preference.dto'
import { ProcessPaymentDto } from './dto/process-payment.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@ApiTags('Pagos')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly config: ConfigService,
  ) {}

  @Get('public-key')
  @ApiOperation({ summary: 'Obtener public key', description: 'Devuelve la public key de Mercado Pago para inicializar Checkout Bricks' })
  async getPublicKey() {
    return { data: { publicKey: this.paymentsService.getPublicKey() } }
  }

  @Post('create-preference')
  @ApiOperation({ summary: 'Crear preferencia de pago', description: 'Crea una preferencia de pago en Mercado Pago (público - sin autenticación)' })
  async createPreference(@Body() body: CreatePreferenceDto) {
    const result = await this.paymentsService.createPreference(undefined, body)
    return { data: result }
  }

  @Post('process')
  @ApiOperation({ summary: 'Procesar pago', description: 'Procesa un pago con los datos del Payment Brick (público)' })
  async processPayment(@Body() body: ProcessPaymentDto) {
    const result = await this.paymentsService.processPayment(body)
    return { data: result }
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Webhook de pagos', description: 'Endpoint IPN de Mercado Pago para notificaciones de pago' })
  async webhook(@Body() body: any, @Req() req: Request) {
    const secret = this.config.get<string>('MP_WEBHOOK_SECRET')
    if (secret) {
      const signature = req.headers['x-signature'] as string
      const requestId = req.headers['x-request-id'] as string
      const rawBody = (req as any).rawBody
      if (!this.paymentsService.verifyWebhookSignature(rawBody, signature, requestId)) {
        throw new UnauthorizedException('Invalid webhook signature')
      }
    }

    await this.paymentsService.handleWebhook(body)
    return { status: 'ok' }
  }

  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar transacciones', description: 'Devuelve el historial de transacciones del usuario autenticado' })
  async getTransactions(@CurrentUser('id') userId: number) {
    const transactions = await this.paymentsService.getTransactions(userId)
    return { data: transactions }
  }
}
