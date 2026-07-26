import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { SubscriptionsService } from './subscriptions.service'
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto'
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto'
import { UpdateSubscriptionStatusDto } from './dto/update-subscription-status.dto'
import { QuerySubscriptionsDto } from './dto/query-subscriptions.dto'

@ApiTags('Admin / Suscripciones')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@Controller('admin/subscriptions')
export class AdminSubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // ── Planes CRUD ──

  @Post('plans')
  @Roles('superadmin', 'admin')
  @ApiOperation({ summary: 'Crear plan de suscripción' })
  async createPlan(@Body() body: CreateSubscriptionPlanDto) {
    const plan = await this.subscriptionsService.createPlan(body)
    return { data: plan }
  }

  @Get('plans')
  @Roles('superadmin', 'admin', 'editor')
  @ApiOperation({ summary: 'Listar planes (incluye inactivos)' })
  async listPlans() {
    const plans = await this.subscriptionsService.listPlans(true)
    return { data: plans }
  }

  @Patch('plans/:id')
  @Roles('superadmin', 'admin')
  @ApiOperation({ summary: 'Actualizar plan de suscripción' })
  async updatePlan(@Param('id') id: string, @Body() body: UpdateSubscriptionPlanDto) {
    const plan = await this.subscriptionsService.updatePlan(Number(id), body)
    return { data: plan }
  }

  @Delete('plans/:id')
  @Roles('superadmin', 'admin')
  @ApiOperation({ summary: 'Desactivar plan (soft delete)' })
  async deletePlan(@Param('id') id: string) {
    await this.subscriptionsService.deletePlan(Number(id))
    return { status: 'ok' }
  }

  // ── Suscripciones ──

  @Get()
  @Roles('superadmin', 'admin', 'editor')
  @ApiOperation({ summary: 'Listar suscripciones con filtros' })
  async findAll(@Query() query: QuerySubscriptionsDto) {
    return this.subscriptionsService.findAll(query)
  }

  @Patch(':id/status')
  @Roles('superadmin', 'admin')
  @ApiOperation({ summary: 'Cambiar estado de una suscripción manualmente' })
  async updateStatus(@Param('id') id: string, @Body() body: UpdateSubscriptionStatusDto) {
    const sub = await this.subscriptionsService.updateStatus(Number(id), body.status, body.reason)
    return { data: sub }
  }
}
