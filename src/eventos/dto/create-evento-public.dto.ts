import { IsString, IsOptional, IsEnum, IsArray, IsIn, MinLength, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { EventoPlan } from '../entities/evento.entity'

export class CreateEventoPublicDto {
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

  @ApiPropertyOptional({ enum: [EventoPlan.GRATIS, EventoPlan.PREMIUM], example: EventoPlan.GRATIS, description: 'Plan del evento (solo gratis o premium)' })
  @IsOptional()
  @IsIn([EventoPlan.GRATIS, EventoPlan.PREMIUM])
  plan?: EventoPlan

  @ApiPropertyOptional({ example: '/uploads/imagen-principal.jpg', description: 'Imagen principal del evento' })
  @IsOptional()
  @IsString()
  image?: string

  @ApiPropertyOptional({ example: '/uploads/logo-evento.jpg', description: 'Logo del evento (solo premium)' })
  @IsOptional()
  @IsString()
  logo?: string

  @ApiPropertyOptional({ example: '/uploads/afiche-evento.jpg', description: 'Afiche del evento (solo premium)' })
  @IsOptional()
  @IsString()
  afiche?: string

  @ApiPropertyOptional({ example: '/uploads/programa-evento.pdf', description: 'Archivo PDF (solo premium)' })
  @IsOptional()
  @IsString()
  pdf?: string

  @ApiPropertyOptional({ example: '/uploads/audio-evento.mp3', description: 'Archivo de audio (solo premium)' })
  @IsOptional()
  @IsString()
  audio?: string

  @ApiPropertyOptional({ example: '/uploads/video-evento.mp4', description: 'Archivo de video (solo premium)' })
  @IsOptional()
  @IsString()
  video?: string

  @ApiPropertyOptional({ example: ['/uploads/galeria1.jpg', '/uploads/galeria2.jpg'], description: 'Galería de imágenes (solo premium)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  galeria?: string[]

  @ApiPropertyOptional({ enum: ['mercadopago', 'transferencia'], description: 'Método de pago elegido' })
  @IsOptional()
  @IsIn(['mercadopago', 'transferencia'])
  payment_method?: string

  @ApiPropertyOptional({ description: 'Token de Cloudflare Turnstile' })
  @IsOptional()
  @IsString()
  captchaToken?: string
}
