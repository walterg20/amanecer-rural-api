import { IsOptional, IsString, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { VideoSeccion } from '../entities/video.entity'

export class QueryVideosDto {
  @ApiPropertyOptional({ enum: VideoSeccion, example: VideoSeccion.AMANECER_RURAL_TV, description: 'Filtrar por sección/programa' })
  @IsOptional()
  @IsString()
  seccion?: VideoSeccion

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
