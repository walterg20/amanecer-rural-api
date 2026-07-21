import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { VideosService } from './videos.service'
import { QueryVideosDto } from './dto/query-videos.dto'

@ApiTags('Videos (público)')
@Controller()
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get('videos')
  @ApiOperation({ summary: 'Listar videos', description: 'Devuelve videos publicados ordenados por orden y fecha. Filtro opcional por sección.' })
  async findAll(@Query() query: QueryVideosDto) {
    return this.videosService.findAll(query)
  }

  @Get('videos/programas')
  @ApiOperation({ summary: 'Metadata de programas', description: 'Devuelve información de los programas (nombre, descripción, horarios, canales)' })
  async programas() {
    return this.videosService.findProgramas()
  }
}
