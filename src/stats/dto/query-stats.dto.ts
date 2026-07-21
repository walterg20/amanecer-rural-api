import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class QueryStatsDto {
  @ApiPropertyOptional({ example: 2025, description: 'Año para filtrar (default: año actual)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  anio?: number

  @ApiPropertyOptional({ example: '2025-01-01', description: 'Fecha desde (para export CSV)' })
  @IsOptional()
  @IsString()
  from?: string

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Fecha hasta (para export CSV)' })
  @IsOptional()
  @IsString()
  to?: string

  @ApiPropertyOptional({ example: 'all', description: 'Sección para exportar: posts, users, revenue, all' })
  @IsOptional()
  @IsString()
  section?: string
}
