import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { PostsService } from './posts.service'
import { QueryPostsDto } from './dto/query-posts.dto'

@ApiTags('Posts (público)')
@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('posts')
  @ApiOperation({ summary: 'Listar artículos', description: 'Devuelve artículos publicados con filtros y paginación' })
  async findAll(@Query() query: QueryPostsDto) {
    return this.postsService.findAll(query)
  }

  @Get('posts/:slug')
  @ApiOperation({ summary: 'Obtener artículo por slug', description: 'Devuelve un artículo individual por su slug URL' })
  async findBySlug(@Param('slug') slug: string) {
    const post = await this.postsService.findBySlug(slug)
    return { data: post }
  }

  @Get('categories')
  @ApiOperation({ summary: 'Listar categorías', description: 'Devuelve todas las categorías de contenido' })
  async categories() {
    return this.postsService.findAllCategories()
  }

  @Get('tags')
  @ApiOperation({ summary: 'Listar etiquetas', description: 'Devuelve todas las etiquetas de contenido' })
  async tags() {
    return this.postsService.findAllTags()
  }
}
