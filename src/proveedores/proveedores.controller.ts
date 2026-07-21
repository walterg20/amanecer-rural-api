import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ProveedoresService } from './proveedores.service'
import { RubrosService } from './rubros.service'
import { QueryProveedoresDto } from './dto/query-proveedores.dto'

@ApiTags('Proveedores (público)')
@Controller()
export class ProveedoresController {
  constructor(
    private readonly proveedoresService: ProveedoresService,
    private readonly rubrosService: RubrosService,
  ) {}

  @Get('proveedores')
  @ApiOperation({ summary: 'Listar proveedores', description: 'Devuelve proveedores aprobados con filtros por rubro, provincia, nombre, plan y destacado' })
  async findAll(@Query() query: QueryProveedoresDto) {
    return this.proveedoresService.findAll(query)
  }

  @Get('proveedores/destacados')
  @ApiOperation({ summary: 'Proveedores destacados', description: 'Devuelve hasta 10 proveedores destacados para slider' })
  async destacados() {
    return this.proveedoresService.findDestacados(10)
  }

  @Get('proveedores/:slug')
  @ApiOperation({ summary: 'Detalle del proveedor', description: 'Devuelve un proveedor por su slug' })
  async findBySlug(@Param('slug') slug: string) {
    const proveedor = await this.proveedoresService.findBySlug(slug)
    return { data: proveedor }
  }

  @Get('rubros')
  @ApiOperation({ summary: 'Listar rubros', description: 'Devuelve todos los rubros del directorio' })
  async rubros() {
    return this.rubrosService.findAll()
  }
}
