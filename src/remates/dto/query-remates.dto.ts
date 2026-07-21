import { IsOptional, IsString, IsInt, IsEnum, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { AuctionType, AuctionStatus } from '../entities/auction.entity'

export class QueryRematesDto {
  @ApiPropertyOptional({ enum: AuctionType, example: AuctionType.GENERAL, description: 'Filtrar por tipo' })
  @IsOptional()
  @IsEnum(AuctionType)
  type?: AuctionType

  @ApiPropertyOptional({ example: 'Chaco', description: 'Filtrar por provincia' })
  @IsOptional()
  @IsString()
  province?: string

  @ApiPropertyOptional({ enum: AuctionStatus, example: AuctionStatus.SCHEDULED, description: 'Filtrar por estado' })
  @IsOptional()
  @IsEnum(AuctionStatus)
  status?: AuctionStatus

  @ApiPropertyOptional({ example: '2025-09-01', description: 'Fecha desde' })
  @IsOptional()
  @IsString()
  from?: string

  @ApiPropertyOptional({ example: '2025-09-30', description: 'Fecha hasta' })
  @IsOptional()
  @IsString()
  to?: string

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
