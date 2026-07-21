import { IsString, IsOptional, IsEnum, IsInt, MinLength, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { VideoSeccion } from '../entities/video.entity'

export class CreateVideoDto {
  @ApiProperty({ example: 'dQw4w9WgXcQ', description: 'ID del video de YouTube' })
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  youtubeId!: string

  @ApiProperty({ example: 'Resumen semanal del campo', description: 'Título del video' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  title!: string

  @ApiProperty({ enum: VideoSeccion, example: VideoSeccion.AMANECER_RURAL_TV, description: 'Sección/programa al que pertenece' })
  @IsEnum(VideoSeccion)
  seccion!: VideoSeccion

  @ApiPropertyOptional({ example: '2025-03-15', description: 'Fecha de emisión' })
  @IsOptional()
  @IsString()
  fecha?: string

  @ApiPropertyOptional({ example: 1, description: 'Orden de visualización' })
  @IsOptional()
  @IsInt()
  orden?: number
}
