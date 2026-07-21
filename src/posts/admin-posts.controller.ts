import { Controller, Post, Get, Patch, Delete, Param, Body, Query, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger'
import { PostsService } from './posts.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { CreateCategoryDto } from './dto/create-category.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { ImageUpload } from '../common/decorators/upload.interceptor'

@ApiTags('Admin / Posts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/posts')
export class AdminPostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('upload')
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Subir imagen', description: 'Sube un archivo de imagen para un artículo (máx. 5MB)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { image: { type: 'string', format: 'binary' } } } })
  @ApiResponse({ status: 400, description: 'Archivo inválido o no se envió ninguna imagen' })
  @UseInterceptors(ImageUpload('image'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('La imagen es requerida')
    return { data: { url: `/uploads/${file.filename}`, filename: file.filename } }
  }

  @Post()
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear artículo', description: 'Crea un nuevo artículo (solo admin/editor)' })
  async create(@Body() body: CreatePostDto, @CurrentUser('id') userId: number) {
    const post = await this.postsService.create({ ...body, authorId: userId })
    return { data: post }
  }

  @Get()
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos los artículos', description: 'Devuelve todos los artículos incluyendo borradores (solo admin/editor)' })
  async findAll(@Query() query: any) {
    return this.postsService.findAll(query)
  }

  @Patch(':id')
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar artículo', description: 'Actualiza un artículo existente (solo admin/editor)' })
  async update(@Param('id') id: string, @Body() body: UpdatePostDto) {
    const post = await this.postsService.update(+id, body)
    return { data: post }
  }

  @Delete(':id')
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar artículo', description: 'Eliminación lógica (soft delete) de un artículo (solo admin/editor)' })
  async remove(@Param('id') id: string) {
    await this.postsService.softDelete(+id)
    return { data: { id: +id, deleted: true } }
  }

  @Post(':id/publish')
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publicar artículo', description: 'Cambia un post de draft a published y setea publishedAt' })
  async publish(@Param('id') id: string, @CurrentUser('id') userId: number) {
    const post = await this.postsService.publish(+id, userId)
    return { data: post }
  }

  @Post(':id/archive')
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Archivar artículo', description: 'Cambia un post de published a archived' })
  async archive(@Param('id') id: string, @CurrentUser('id') userId: number) {
    const post = await this.postsService.archive(+id, userId)
    return { data: post }
  }
}

@ApiTags('Admin / Categorías')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/categories')
export class AdminCategoriesController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @Roles('superadmin', 'admin', 'editor')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear categoría', description: 'Crea una nueva categoría de contenido (solo admin/editor)' })
  async create(@Body() body: CreateCategoryDto) {
    const category = await this.postsService.createCategory(body)
    return { data: category }
  }
}
