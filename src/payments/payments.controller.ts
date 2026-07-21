import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { PaymentsService } from './payments.service'
import { CreatePreferenceDto } from './dto/create-preference.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@ApiTags('Pagos')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-preference')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear preferencia de pago', description: 'Crea una preferencia de pago en Mercado Pago y devuelve la URL de checkout' })
  async createPreference(@CurrentUser('id') userId: number, @Body() body: CreatePreferenceDto) {
    const result = await this.paymentsService.createPreference(userId, body)
    return { data: result }
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Webhook de pagos', description: 'Endpoint IPN de Mercado Pago para notificaciones de pago' })
  async webhook(@Body() body: any) {
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
