import {
  Controller, Post, Get, Patch, Delete, Param, Body, Query,
  UseGuards, UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger'
import { RematesService } from './remates.service'
import { AuctioneerService } from './auctioneer.service'
import { CreateRemateDto } from './dto/create-remate.dto'
import { UpdateRemateDto } from './dto/update-remate.dto'
import { CreateLoteDto } from './dto/create-lote.dto'
import { UpdateLoteDto } from './dto/update-lote.dto'
import { CreateRematadorDto } from './dto/create-rematador.dto'
import { UpdateRematadorDto } from './dto/update-rematador.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { ImageUpload } from '../common/decorators/upload.interceptor'

@ApiTags('Admin / Remates')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/remates')
export class AdminRematesController {
  constructor(
    private readonly rematesService: RematesService,
  ) {}

  @Post('upload')
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subir imagen', description: 'Sube una imagen para un remate (máx. 5MB)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { image: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(ImageUpload('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('La imagen es requerida')
    return { data: { url: `/uploads/${file.filename}`, filename: file.filename } }
  }

  @Post()
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear remate', description: 'Crea un nuevo remate (solo admin/editor)' })
  async create(@Body() body: CreateRemateDto) {
    const auction = await this.rematesService.create(body)
    return { data: auction }
  }

  @Get()
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos', description: 'Devuelve todos los remates incluyendo eliminados (solo admin/editor)' })
  async findAll(@Query() query: any) {
    return this.rematesService.findAllAdmin(query)
  }

  @Patch(':id')
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar remate', description: 'Actualiza un remate existente (solo admin/editor)' })
  async update(@Param('id') id: string, @Body() body: UpdateRemateDto) {
    const auction = await this.rematesService.update(+id, body)
    return { data: auction }
  }

  @Delete(':id')
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar remate', description: 'Eliminación lógica de un remate (solo admin/editor)' })
  async remove(@Param('id') id: string) {
    await this.rematesService.softDelete(+id)
    return { data: { id: +id, deleted: true } }
  }

  @Post(':id/lotes')
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Agregar lote', description: 'Agrega un lote a un remate existente (solo admin/editor)' })
  async addLot(@Param('id') id: string, @Body() body: CreateLoteDto) {
    const lot = await this.rematesService.addLot(+id, body)
    return { data: lot }
  }
}

@ApiTags('Admin / Lotes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/lotes')
export class AdminLotesController {
  constructor(private readonly rematesService: RematesService) {}

  @Patch(':id')
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar lote', description: 'Actualiza un lote existente (solo admin/editor)' })
  async update(@Param('id') id: string, @Body() body: UpdateLoteDto) {
    const lot = await this.rematesService.updateLot(+id, body)
    return { data: lot }
  }

  @Delete(':id')
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar lote', description: 'Elimina un lote definitivamente (solo admin/editor)' })
  async remove(@Param('id') id: string) {
    await this.rematesService.deleteLot(+id)
    return { data: { id: +id, deleted: true } }
  }
}

@ApiTags('Admin / Rematadores')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/rematadores')
export class AdminRematadoresController {
  constructor(private readonly auctioneerService: AuctioneerService) {}

  @Post()
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear rematador', description: 'Crea un nuevo rematador (solo admin/editor)' })
  async create(@Body() body: CreateRematadorDto) {
    const auctioneer = await this.auctioneerService.create(body)
    return { data: auctioneer }
  }

  @Patch(':id')
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar rematador', description: 'Actualiza un rematador existente (solo admin/editor)' })
  async update(@Param('id') id: string, @Body() body: UpdateRematadorDto) {
    const auctioneer = await this.auctioneerService.update(+id, body)
    return { data: auctioneer }
  }

  @Delete(':id')
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar rematador', description: 'Elimina un rematador (solo admin/editor)' })
  async remove(@Param('id') id: string) {
    await this.auctioneerService.delete(+id)
    return { data: { id: +id, deleted: true } }
  }
}
