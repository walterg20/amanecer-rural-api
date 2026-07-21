import {
  Controller, Post, Get, Patch, Delete, Param, Body, Query,
  UseGuards, UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger'
import { ClasificadosService } from './clasificados.service'
import { CreateClasificadoDto } from './dto/create-clasificado.dto'
import { UpdateClasificadoDto } from './dto/update-clasificado.dto'
import { UpdateStatusDto } from './dto/update-status.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { ImageUpload } from '../common/decorators/upload.interceptor'

@ApiTags('Admin / Clasificados')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/clasificados')
export class AdminClasificadosController {
  constructor(private readonly clasificadosService: ClasificadosService) {}

  @Post('upload')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subir imagen', description: 'Sube una imagen para un clasificado (máx. 5MB)' })
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
  @ApiOperation({ summary: 'Crear clasificado', description: 'Crea un nuevo clasificado (solo admin)' })
  async create(@Body() body: CreateClasificadoDto) {
    const clasificado = await this.clasificadosService.create(body)
    return { data: clasificado }
  }

  @Get()
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos', description: 'Devuelve todos los clasificados incluyendo pendientes/rechazados (solo admin)' })
  async findAll(@Query() query: any) {
    return this.clasificadosService.findAllAdmin(query)
  }

  @Patch(':id')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar clasificado', description: 'Actualiza un clasificado existente (solo admin)' })
  async update(@Param('id') id: string, @Body() body: UpdateClasificadoDto) {
    const clasificado = await this.clasificadosService.update(+id, body)
    return { data: clasificado }
  }

  @Delete(':id')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar clasificado', description: 'Eliminación lógica de un clasificado (solo admin)' })
  async remove(@Param('id') id: string) {
    await this.clasificadosService.softDelete(+id)
    return { data: { id: +id, deleted: true } }
  }

  @Patch(':id/status')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprobar/rechazar', description: 'Aprueba o rechaza un clasificado. Al aprobar se calcula expires_at según el plan (solo admin)' })
  async updateStatus(@Param('id') id: string, @Body() body: UpdateStatusDto, @CurrentUser('id') userId: number) {
    const clasificado = await this.clasificadosService.updateStatus(+id, body.status, userId)
    return { data: clasificado }
  }
}
