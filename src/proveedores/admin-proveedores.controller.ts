import {
  Controller, Post, Get, Patch, Delete, Param, Body, Query,
  UseGuards, UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger'
import { ProveedoresService } from './proveedores.service'
import { RubrosService } from './rubros.service'
import { CreateProveedorDto } from './dto/create-proveedor.dto'
import { UpdateProveedorDto } from './dto/update-proveedor.dto'
import { UpdateStatusDto } from './dto/update-status.dto'
import { ToggleDestacadoDto } from './dto/toggle-destacado.dto'
import { CreateRubroDto } from './dto/create-rubro.dto'
import { UpdateRubroDto } from './dto/update-rubro.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { ImageUpload } from '../common/decorators/upload.interceptor'

@ApiTags('Admin / Proveedores')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/proveedores')
export class AdminProveedoresController {
  constructor(
    private readonly proveedoresService: ProveedoresService,
  ) {}

  @Post('upload')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subir logo/imagen', description: 'Sube un logo o imagen para un proveedor (máx. 5MB)' })
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
  @ApiOperation({ summary: 'Crear proveedor', description: 'Crea un nuevo proveedor (solo admin)' })
  async create(@Body() body: CreateProveedorDto) {
    const proveedor = await this.proveedoresService.create(body)
    return { data: proveedor }
  }

  @Get()
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos', description: 'Devuelve todos los proveedores incluyendo pendientes (solo admin)' })
  async findAll(@Query() query: any) {
    return this.proveedoresService.findAllAdmin(query)
  }

  @Patch(':id')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar proveedor', description: 'Actualiza un proveedor existente (solo admin)' })
  async update(@Param('id') id: string, @Body() body: UpdateProveedorDto) {
    const proveedor = await this.proveedoresService.update(+id, body)
    return { data: proveedor }
  }

  @Delete(':id')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar proveedor', description: 'Eliminación lógica de un proveedor (solo admin)' })
  async remove(@Param('id') id: string) {
    await this.proveedoresService.softDelete(+id)
    return { data: { id: +id, deleted: true } }
  }

  @Patch(':id/status')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprobar/rechazar', description: 'Aprueba o rechaza un proveedor. Al aprobar se calcula expires_at según el plan (solo admin)' })
  async updateStatus(@Param('id') id: string, @Body() body: UpdateStatusDto) {
    const proveedor = await this.proveedoresService.updateStatus(+id, body.status)
    return { data: proveedor }
  }

  @Patch(':id/destacado')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alternar destacado', description: 'Activa o desactiva el estado destacado de un proveedor (solo admin)' })
  async toggleDestacado(@Param('id') id: string, @Body() body: ToggleDestacadoDto) {
    const proveedor = await this.proveedoresService.toggleDestacado(+id, body.destacado)
    return { data: proveedor }
  }
}

@ApiTags('Admin / Rubros')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/rubros')
export class AdminRubrosController {
  constructor(private readonly rubrosService: RubrosService) {}

  @Post()
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear rubro', description: 'Crea un nuevo rubro (solo admin)' })
  async create(@Body() body: CreateRubroDto) {
    const rubro = await this.rubrosService.create(body)
    return { data: rubro }
  }

  @Patch(':id')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar rubro', description: 'Actualiza un rubro existente (solo admin)' })
  async update(@Param('id') id: string, @Body() body: UpdateRubroDto) {
    const rubro = await this.rubrosService.update(+id, body)
    return { data: rubro }
  }

  @Delete(':id')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar rubro', description: 'Elimina un rubro (solo admin)' })
  async remove(@Param('id') id: string) {
    await this.rubrosService.delete(+id)
    return { data: { id: +id, deleted: true } }
  }
}
