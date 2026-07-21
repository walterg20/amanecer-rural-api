import { IsOptional, IsString, IsInt, IsEnum, IsBooleanString, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { ProveedorPlan } from '../entities/proveedor.entity'

export class QueryProveedoresDto {
  @ApiPropertyOptional({ example: 'agroquimicos', description: 'Filtrar por slug de rubro' })
  @IsOptional()
  @IsString()
  rubro?: string

  @ApiPropertyOptional({ example: 'Chaco', description: 'Filtrar por provincia' })
  @IsOptional()
  @IsString()
  provincia?: string

  @ApiPropertyOptional({ example: 'agro', description: 'Buscar por nombre (LIKE)' })
  @IsOptional()
  @IsString()
  nombre?: string

  @ApiPropertyOptional({ enum: ProveedorPlan, example: ProveedorPlan.GRATIS, description: 'Filtrar por plan' })
  @IsOptional()
  @IsEnum(ProveedorPlan)
  plan?: ProveedorPlan

  @ApiPropertyOptional({ example: true, description: 'Filtrar solo destacados' })
  @IsOptional()
  @IsBooleanString()
  destacado?: string

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
