import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ClimaService } from './clima.service'
import { QueryClimaDto } from './dto/query-clima.dto'

@ApiTags('Clima')
@Controller('clima')
export class ClimaController {
  constructor(private readonly climaService: ClimaService) {}

  @Get('actual')
  @ApiOperation({ summary: 'Clima actual', description: 'Devuelve el clima actual de una ciudad (cache 30 min)' })
  async actual(@Query() query: QueryClimaDto) {
    return this.climaService.getActual(query)
  }

  @Get('pronostico')
  @ApiOperation({ summary: 'Pronóstico 7 días', description: 'Devuelve el pronóstico extendido a 7 días (cache 60 min)' })
  async pronostico(@Query() query: QueryClimaDto) {
    return this.climaService.getPronostico(query)
  }

  @Get('ciudades')
  @ApiOperation({ summary: 'Lista de ciudades', description: 'Devuelve las localidades disponibles para consultar clima' })
  async ciudades() {
    return this.climaService.getCiudades()
  }
}
