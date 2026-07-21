import { Controller, Post, Get, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { VideosService } from './videos.service'
import { CreateVideoDto } from './dto/create-video.dto'
import { UpdateVideoDto } from './dto/update-video.dto'
import { ReorderVideosDto } from './dto/reorder-videos.dto'
import { QueryVideosDto } from './dto/query-videos.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'

@ApiTags('Admin / Videos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/videos')
export class AdminVideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear video', description: 'Agrega un nuevo video de YouTube (solo admin)' })
  async create(@Body() body: CreateVideoDto) {
    const video = await this.videosService.create(body)
    return { data: video }
  }

  @Get()
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos los videos', description: 'Devuelve todos los videos incluyendo borradores (solo admin)' })
  async findAll(@Query() query: QueryVideosDto) {
    return this.videosService.findAllAdmin(query)
  }

  @Patch(':id')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar video', description: 'Actualiza los datos de un video (solo admin)' })
  async update(@Param('id') id: string, @Body() body: UpdateVideoDto) {
    const video = await this.videosService.update(+id, body)
    return { data: video }
  }

  @Delete(':id')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar video', description: 'Eliminación lógica de un video (solo admin)' })
  async remove(@Param('id') id: string) {
    await this.videosService.softDelete(+id)
    return { data: { id: +id, deleted: true } }
  }

  @Post('reorder')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reordenar videos', description: 'Actualiza el orden de múltiples videos en batch (solo admin)' })
  async reorder(@Body() body: ReorderVideosDto) {
    return this.videosService.reorder(body.items)
  }
}
