import { IsOptional, IsString, IsInt, IsEnum, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { ClasificadoCondicion, ClasificadoPlan } from '../entities/clasificado.entity'

export class QueryClasificadosDto {
  @ApiPropertyOptional({ example: 'maquinarias', description: 'Filtrar por slug de categoría' })
  @IsOptional()
  @IsString()
  categoria?: string

  @ApiPropertyOptional({ example: 'Chaco', description: 'Filtrar por provincia' })
  @IsOptional()
  @IsString()
  provincia?: string

  @ApiPropertyOptional({ example: 'tractor', description: 'Buscar por nombre (LIKE)' })
  @IsOptional()
  @IsString()
  nombre?: string

  @ApiPropertyOptional({ enum: ClasificadoCondicion, example: ClasificadoCondicion.NUEVO, description: 'Filtrar por condición' })
  @IsOptional()
  @IsEnum(ClasificadoCondicion)
  condicion?: ClasificadoCondicion

  @ApiPropertyOptional({ enum: ClasificadoPlan, example: ClasificadoPlan.GRATIS, description: 'Filtrar por plan' })
  @IsOptional()
  @IsEnum(ClasificadoPlan)
  plan?: ClasificadoPlan

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
