import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ClasificadosService } from './clasificados.service'
import { CategoriaClasificadoService } from './categoria-clasificado.service'
import { QueryClasificadosDto } from './dto/query-clasificados.dto'

@ApiTags('Clasificados (público)')
@Controller()
export class ClasificadosController {
  constructor(
    private readonly clasificadosService: ClasificadosService,
    private readonly categoriaService: CategoriaClasificadoService,
  ) {}

  @Get('clasificados')
  @ApiOperation({ summary: 'Listar clasificados', description: 'Devuelve clasificados activos con filtros por categoría, provincia, nombre, condición y plan' })
  async findAll(@Query() query: QueryClasificadosDto) {
    return this.clasificadosService.findAll(query)
  }

  @Get('clasificados/:slug')
  @ApiOperation({ summary: 'Detalle del clasificado', description: 'Devuelve un clasificado por su slug' })
  async findBySlug(@Param('slug') slug: string) {
    const clasificado = await this.clasificadosService.findBySlug(slug)
    return { data: clasificado }
  }

  @Get('clasificados/categorias')
  @ApiOperation({ summary: 'Listar categorías', description: 'Devuelve todas las categorías de clasificados' })
  async categorias() {
    return this.categoriaService.findAll()
  }
}
