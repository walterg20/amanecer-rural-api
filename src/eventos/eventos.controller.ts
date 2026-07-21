import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { EventosService } from './eventos.service'
import { QueryEventosDto } from './dto/query-eventos.dto'

@ApiTags('Eventos (público)')
@Controller()
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Get('eventos')
  @ApiOperation({ summary: 'Eventos próximos', description: 'Devuelve eventos próximos aprobados con filtros por mes/año/provincia' })
  async findProximos(@Query() query: QueryEventosDto) {
    return this.eventosService.findProximos(query)
  }

  @Get('eventos/pasados')
  @ApiOperation({ summary: 'Eventos pasados', description: 'Devuelve eventos pasados aprobados con filtros por mes/año/provincia' })
  async findPasados(@Query() query: QueryEventosDto) {
    return this.eventosService.findPasados(query)
  }

  @Get('eventos/:slug')
  @ApiOperation({ summary: 'Detalle del evento', description: 'Devuelve un evento por su slug' })
  async findBySlug(@Param('slug') slug: string) {
    const evento = await this.eventosService.findBySlug(slug)
    return { data: evento }
  }
}
