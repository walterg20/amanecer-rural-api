import { IsOptional, IsString, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { PostType } from '../entities/post.entity'

export class QueryPostsDto {
  @ApiPropertyOptional({ enum: PostType, example: PostType.NEWS, description: 'Filtrar por tipo de contenido' })
  @IsOptional()
  @IsString()
  type?: PostType

  @ApiPropertyOptional({ example: 'agricultura', description: 'Filtrar por slug de categoría' })
  @IsOptional()
  @IsString()
  category?: string

  @ApiPropertyOptional({ example: 'soja', description: 'Filtrar por slug de etiqueta' })
  @IsOptional()
  @IsString()
  tag?: string

  @ApiPropertyOptional({ example: 'published', description: 'Filtrar por estado (solo admin)' })
  @IsOptional()
  @IsString()
  status?: string

  @ApiPropertyOptional({ example: 1, description: 'Número de página (empieza en 1)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number

  @ApiPropertyOptional({ example: 10, description: 'Cantidad de items por página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number
}
