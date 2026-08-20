import { Controller, Get, Post, Param, Query, Body, UploadedFiles, UseInterceptors, BadRequestException } from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger'
import { ClasificadosService } from './clasificados.service'
import { CategoriaClasificadoService } from './categoria-clasificado.service'
import { QueryClasificadosDto } from './dto/query-clasificados.dto'
import { CreateClasificadoPublicDto } from './dto/create-clasificado-public.dto'
import { saveUploadedFile } from '../common/decorators/upload.interceptor'

@ApiTags('Clasificados (público)')
@Controller()
export class ClasificadosController {
  constructor(
    private readonly clasificadosService: ClasificadosService,
    private readonly categoriaService: CategoriaClasificadoService,
  ) {}

  @Post('clasificados/public')
  @ApiOperation({ summary: 'Publicar aviso', description: 'Crea un aviso clasificado como pending. Plan: gratis, destacado o premium' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { imagen: { type: 'string', format: 'binary' }, galeria: { type: 'array', items: { type: 'string', format: 'binary' } } } } })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'imagen', maxCount: 1 },
    { name: 'galeria', maxCount: 10 },
  ]))
  async createPublic(
    @Body() body: CreateClasificadoPublicDto,
    @UploadedFiles() files?: { imagen?: Express.Multer.File[]; galeria?: Express.Multer.File[] },
  ) {
    const data = { ...body } as Record<string, unknown>
    if (files?.imagen?.[0]) data.imagenPrincipal = saveUploadedFile(files.imagen[0]).url
    if (files?.galeria?.length) data.galeria = files.galeria.map((f) => saveUploadedFile(f).url)
    const clasificado = await this.clasificadosService.createPublic(data)
    return { data: clasificado }
  }

  @Post('clasificados/upload')
  @ApiOperation({ summary: 'Subir imagen (público)', description: 'Sube una imagen para un clasificado (máx. 5MB, solo jpeg/png/gif/webp)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { image: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  async uploadImage(@UploadedFiles() files?: { image?: Express.Multer.File[] }) {
    const file = files?.image?.[0]
    if (!file) throw new BadRequestException('La imagen es requerida')
    return { data: saveUploadedFile(file) }
  }

  @Get('clasificados')
  @ApiOperation({ summary: 'Listar clasificados', description: 'Devuelve clasificados activos con filtros por categoría, provincia, nombre, condición y plan' })
  async findAll(@Query() query: QueryClasificadosDto) {
    return this.clasificadosService.findAll(query)
  }

  @Get('clasificados/categorias')
  @ApiOperation({ summary: 'Listar categorías', description: 'Devuelve todas las categorías de clasificados' })
  async categorias() {
    return this.categoriaService.findAll()
  }

  @Get('clasificados/:slug')
  @ApiOperation({ summary: 'Detalle del clasificado', description: 'Devuelve un clasificado por su slug' })
  async findBySlug(@Param('slug') slug: string) {
    const clasificado = await this.clasificadosService.findBySlug(slug)
    return { data: clasificado }
  }
}
