import { IsOptional, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class QueryCategoriesDto {
  @ApiPropertyOptional({ example: 1, description: 'Número de página (empieza en 1). Si se omite, devuelve todas las categorías sin paginar' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number

  @ApiPropertyOptional({ example: 10, description: 'Cantidad de items por página. Si se omite junto con page, devuelve todas' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number
}
