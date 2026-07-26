import { Controller, Get, Post, Param, Query, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger'
import { EventosService } from './eventos.service'
import { QueryEventosDto } from './dto/query-eventos.dto'
import { CreateEventoPublicDto } from './dto/create-evento-public.dto'
import { ImageUpload, saveUploadedFile } from '../common/decorators/upload.interceptor'

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

  @Post('eventos')
  @ApiOperation({ summary: 'Crear evento', description: 'Crea un nuevo evento como pending. Plan: gratis o premium' })
  async create(@Body() body: CreateEventoPublicDto) {
    const evento = await this.eventosService.createPublic(body)
    return { data: evento }
  }

  @Post('eventos/upload')
  @ApiOperation({ summary: 'Subir imagen (público)', description: 'Sube una imagen para un evento (máx. 5MB, solo jpeg/png/gif/webp)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { image: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(ImageUpload('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('La imagen es requerida')
    return { data: saveUploadedFile(file) }
  }
}
