import { IsString, IsOptional, IsInt, MaxLength, MinLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateCategoryDto {
  @ApiProperty({ example: 'Agricultura', description: 'Nombre de la categoría' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name!: string

  @ApiPropertyOptional({ example: 'Artículos sobre agricultura y cultivos', description: 'Descripción de la categoría' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string

  @ApiPropertyOptional({ example: null, description: 'ID de la categoría padre (null para raíz)' })
  @IsOptional()
  @IsInt()
  parentId?: number
}
