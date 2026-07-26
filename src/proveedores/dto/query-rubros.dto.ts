import { IsOptional, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class QueryRubrosDto {
  @ApiPropertyOptional({ example: 1, description: 'Número de página (empieza en 1). Si se omite, devuelve todos los rubros sin paginar' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number

  @ApiPropertyOptional({ example: 10, description: 'Cantidad de items por página. Si se omite junto con page, devuelve todos' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number
}
