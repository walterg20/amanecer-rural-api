import {
  Controller, Post, Get, Patch, Delete, Param, Body, Query,
  UseGuards, UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger'
import { EventosService } from './eventos.service'
import { CreateEventoDto } from './dto/create-evento.dto'
import { UpdateEventoDto } from './dto/update-evento.dto'
import { UpdateStatusDto } from './dto/update-status.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { ImageUpload } from '../common/decorators/upload.interceptor'

@ApiTags('Admin / Eventos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/eventos')
export class AdminEventosController {
  constructor(private readonly eventosService: EventosService) {}

  @Post('upload')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subir imagen', description: 'Sube una imagen para un evento (máx. 5MB)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { image: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(ImageUpload('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('La imagen es requerida')
    return { data: { url: `/uploads/${file.filename}`, filename: file.filename } }
  }

  @Post()
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear evento', description: 'Crea un nuevo evento (solo admin)' })
  async create(@Body() body: CreateEventoDto) {
    const evento = await this.eventosService.create(body)
    return { data: evento }
  }

  @Get()
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos los eventos', description: 'Devuelve todos los eventos incluyendo pendientes (solo admin)' })
  async findAll(@Query() query: any) {
    return this.eventosService.findAllAdmin(query)
  }

  @Patch(':id')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar evento', description: 'Actualiza un evento existente (solo admin)' })
  async update(@Param('id') id: string, @Body() body: UpdateEventoDto) {
    const evento = await this.eventosService.update(+id, body)
    return { data: evento }
  }

  @Delete(':id')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar evento', description: 'Eliminación lógica de un evento (solo admin)' })
  async remove(@Param('id') id: string) {
    await this.eventosService.softDelete(+id)
    return { data: { id: +id, deleted: true } }
  }

  @Patch(':id/status')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprobar/rechazar evento', description: 'Cambia el estado de un evento a approved o rejected (solo admin)' })
  async updateStatus(@Param('id') id: string, @Body() body: UpdateStatusDto) {
    const evento = await this.eventosService.updateStatus(+id, body.status)
    return { data: evento }
  }
}
