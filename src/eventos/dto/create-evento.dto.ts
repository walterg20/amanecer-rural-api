import { IsString, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { EventoPlan } from '../entities/evento.entity'

export class CreateEventoDto {
  @ApiProperty({ example: 'Expo Rural Chaco 2025', description: 'Título del evento' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title!: string

  @ApiPropertyOptional({ example: 'La exposición agropecuaria más importante del norte argentino...', description: 'Descripción del evento' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ example: '2025-08-15', description: 'Fecha del evento' })
  @IsString()
  fecha!: string

  @ApiPropertyOptional({ example: '2025-08-20', description: 'Fecha de fin del evento' })
  @IsOptional()
  @IsString()
  fechaFin?: string

  @ApiProperty({ example: 'Predio Ferial de Resistencia', description: 'Ubicación del evento' })
  @IsString()
  @MaxLength(255)
  ubicacion!: string

  @ApiProperty({ example: 'Chaco', description: 'Provincia' })
  @IsString()
  @MaxLength(100)
  provincia!: string

  @ApiPropertyOptional({ example: 'Resistencia', description: 'Localidad' })
  @IsOptional()
  @IsString()
  localidad?: string

  @ApiPropertyOptional({ example: 'Sociedad Rural del Chaco', description: 'Organizador' })
  @IsOptional()
  @IsString()
  organizador?: string

  @ApiPropertyOptional({ example: '/uploads/evento-imagen.jpg', description: 'URL de la imagen' })
  @IsOptional()
  @IsString()
  image?: string

  @ApiPropertyOptional({ enum: EventoPlan, example: EventoPlan.GRATIS, description: 'Plan del evento' })
  @IsOptional()
  @IsEnum(EventoPlan)
  plan?: EventoPlan
}
