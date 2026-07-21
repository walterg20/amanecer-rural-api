import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { RematesService } from './remates.service'
import { AuctioneerService } from './auctioneer.service'
import { QueryRematesDto } from './dto/query-remates.dto'

@ApiTags('Remates (público)')
@Controller()
export class RematesController {
  constructor(
    private readonly rematesService: RematesService,
    private readonly auctioneerService: AuctioneerService,
  ) {}

  @Get('remates')
  @ApiOperation({ summary: 'Listar remates', description: 'Devuelve remates activos con filtros por tipo, provincia, estado y rango de fechas' })
  async findAll(@Query() query: QueryRematesDto) {
    return this.rematesService.findAll(query)
  }

  @Get('remates/:slug')
  @ApiOperation({ summary: 'Detalle del remate', description: 'Devuelve un remate con sus lotes y rematador por slug' })
  async findBySlug(@Param('slug') slug: string) {
    const auction = await this.rematesService.findBySlug(slug)
    return { data: auction }
  }

  @Get('rematadores')
  @ApiOperation({ summary: 'Listar rematadores', description: 'Devuelve todos los rematadores con cantidad de remates' })
  async findAllAuctioneers() {
    return this.auctioneerService.findAll()
  }

  @Get('rematadores/:id')
  @ApiOperation({ summary: 'Detalle del rematador', description: 'Devuelve un rematador con sus remates' })
  async findAuctioneer(@Param('id') id: string) {
    const auctioneer = await this.auctioneerService.findOne(+id)
    return { data: auctioneer }
  }
}
