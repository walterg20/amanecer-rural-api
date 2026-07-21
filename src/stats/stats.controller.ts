import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { Response } from 'express'
import { StatsService } from './stats.service'
import { QueryStatsDto } from './dto/query-stats.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'

@ApiTags('Admin / Stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('dashboard')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dashboard KPIs', description: 'Devuelve KPIs globales del sistema: totales por entidad y agrupaciones mensuales' })
  async dashboard(@Query() query: QueryStatsDto) {
    return this.statsService.getDashboard(query.anio)
  }

  @Get('posts')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Posts por mes', description: 'Devuelve cantidad de posts agrupados por mes del año indicado' })
  async posts(@Query() query: QueryStatsDto) {
    return this.statsService.getPostsByMonth(query.anio)
  }

  @Get('users')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Usuarios por mes', description: 'Devuelve cantidad de registros de usuarios agrupados por mes' })
  async users(@Query() query: QueryStatsDto) {
    return this.statsService.getUsersByMonth(query.anio)
  }

  @Get('revenue')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ingresos por mes', description: 'Devuelve ingresos (transacciones aprobadas) agrupados por mes' })
  async revenue(@Query() query: QueryStatsDto) {
    return this.statsService.getRevenueByMonth(query.anio)
  }

  @Get('export/csv')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exportar CSV', description: 'Exporta estadísticas a CSV. Sección: posts, users, revenue o all' })
  async exportCsv(@Query() query: QueryStatsDto, @Res() res: Response) {
    const section = query.section || 'all'
    const data = await this.statsService.getDashboard(query.anio)
    const csv = this.statsService.generateCsv(section, data)
    const date = new Date().toISOString().split('T')[0]

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename=reporte-${section}-${date}.csv`)
    return res.send(csv)
  }
}
