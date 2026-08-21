import { Controller, Get, Post, Param, Query, Body, UseInterceptors, UploadedFile, UploadedFiles, BadRequestException } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
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

  @Post('eventos/public')
  @ApiOperation({ summary: 'Publicar evento', description: 'Crea un evento público como pending con archivos adjuntos. Plan: gratis o premium' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: {
    image: { type: 'string', format: 'binary' },
    logo: { type: 'string', format: 'binary' },
    afiche: { type: 'string', format: 'binary' },
    pdf: { type: 'string', format: 'binary' },
    audio: { type: 'string', format: 'binary' },
    galeria: { type: 'array', items: { type: 'string', format: 'binary' } },
  } } })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
    { name: 'afiche', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'galeria', maxCount: 10 },
  ]))
  async createPublic(
    @Body() body: CreateEventoPublicDto,
    @UploadedFiles() files?: {
      image?: Express.Multer.File[]
      logo?: Express.Multer.File[]
      afiche?: Express.Multer.File[]
      pdf?: Express.Multer.File[]
      audio?: Express.Multer.File[]
      galeria?: Express.Multer.File[]
    },
  ) {
    const data = { ...body } as Record<string, unknown>
    if (files?.image?.[0]) data.image = saveUploadedFile(files.image[0]).url
    if (files?.logo?.[0]) data.logo = saveUploadedFile(files.logo[0]).url
    if (files?.afiche?.[0]) data.afiche = saveUploadedFile(files.afiche[0]).url
    if (files?.pdf?.[0]) data.pdf = saveUploadedFile(files.pdf[0]).url
    if (files?.audio?.[0]) data.audio = saveUploadedFile(files.audio[0]).url
    if (files?.galeria?.length) data.galeria = files.galeria.map((f) => saveUploadedFile(f).url)
    const evento = await this.eventosService.createPublic(data as unknown as CreateEventoPublicDto)
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
