import { IsOptional, IsInt, IsBooleanString, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class QueryMessagesDto {
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

  @ApiPropertyOptional({ example: true, description: 'Filtrar solo no leídos' })
  @IsOptional()
  @IsBooleanString()
  unread?: string
}
