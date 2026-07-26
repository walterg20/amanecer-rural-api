import { Controller, Get, Post, Param, Body, UseGuards, NotFoundException } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { SubscriptionsService } from './subscriptions.service'
import { CreateSubscriptionDto } from './dto/create-subscription.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'

@ApiTags('Suscripciones')
@Controller()
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('subscriptions/plans')
  @ApiOperation({ summary: 'Listar planes', description: 'Devuelve los planes de suscripción activos' })
  async listPlans() {
    const plans = await this.subscriptionsService.listPlans()
    return { data: plans }
  }

  @Post('subscriptions')
  @ApiOperation({ summary: 'Crear suscripción', description: 'Crea una nueva suscripción con estado pending_payment' })
  async create(@Body() body: CreateSubscriptionDto) {
    const sub = await this.subscriptionsService.create(body)
    return { data: { id: sub.id, price: (sub as any).plan?.price, plan: (sub as any).plan } }
  }

  @Get('subscriptions/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Detalle suscripción (admin)', description: 'Devuelve detalle de la suscripción con pagos e historial de estados' })
  async getDetail(@Param('id') id: string) {
    const sub = await this.subscriptionsService.getDetail(Number(id))
    return { data: sub }
  }

  @Post('subscriptions/:id/renew')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Renovar suscripción (admin)', description: 'Inicia flujo de renovación manual (crea preferencia de pago)' })
  async renew(@Param('id') id: string) {
    const sub = await this.subscriptionsService.getDetail(Number(id))
    if (sub.status !== 'active' && sub.status !== 'expired') {
      throw new NotFoundException('Suscripción no puede renovarse en su estado actual')
    }
    return { data: { subscriptionId: sub.id, price: (sub as any).plan?.price } }
  }
}
