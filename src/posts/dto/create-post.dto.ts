import { IsString, IsOptional, IsEnum, IsInt, MinLength, MaxLength, IsArray } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PostType, PostStatus } from '../entities/post.entity'

export class CreatePostDto {
  @ApiProperty({ example: 'Nueva variedad de soja resistente a sequía', description: 'Título del artículo' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title!: string

  @ApiProperty({ example: '<p>Contenido completo del artículo...</p>', description: 'Cuerpo del artículo (HTML)' })
  @IsString()
  @MinLength(10)
  content!: string

  @ApiPropertyOptional({ example: 'Breve descripción del artículo...', description: 'Extracto o resumen corto' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string

  @ApiPropertyOptional({ enum: PostType, example: PostType.NEWS, description: 'Tipo de contenido' })
  @IsOptional()
  @IsEnum(PostType)
  type?: PostType

  @ApiPropertyOptional({ enum: PostStatus, example: PostStatus.DRAFT, description: 'Estado de publicación' })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus

  @ApiPropertyOptional({ example: 1, description: 'ID de la categoría' })
  @IsOptional()
  @IsInt()
  categoryId?: number

  @ApiPropertyOptional({ example: [1, 2], description: 'IDs de las etiquetas' })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tagIds?: number[]

  @ApiPropertyOptional({ example: '/uploads/uuid-imagen.jpg', description: 'URL de la imagen destacada' })
  @IsOptional()
  @IsString()
  featuredImage?: string

  @ApiPropertyOptional({ example: 'Chaco Día por día', description: 'Fuente de la información' })
  @IsOptional()
  @IsString()
  fuente?: string
}
