import { IsString, IsOptional, IsEnum, IsInt, IsBoolean, MinLength, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { AuctionType, AuctionStatus } from '../entities/auction.entity'

export class CreateRemateDto {
  @ApiProperty({ example: 'Remate Anual Cabaña Los Remolinos', description: 'Título del remate' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title!: string

  @ApiPropertyOptional({ example: 'Remate de 200 cabezas de ganado Hereford...', description: 'Descripción del remate' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ example: '2025-09-15', description: 'Fecha del remate' })
  @IsString()
  date!: string

  @ApiPropertyOptional({ example: '10:00', description: 'Hora del remate' })
  @IsOptional()
  @IsString()
  time?: string

  @ApiProperty({ example: 'Sociedad Rural del Chaco', description: 'Ubicación' })
  @IsString()
  @MaxLength(255)
  location!: string

  @ApiProperty({ example: 'Chaco', description: 'Provincia' })
  @IsString()
  @MaxLength(100)
  province!: string

  @ApiProperty({ enum: AuctionType, example: AuctionType.GENERAL, description: 'Tipo de remate' })
  @IsEnum(AuctionType)
  type!: AuctionType

  @ApiPropertyOptional({ enum: AuctionStatus, example: AuctionStatus.SCHEDULED, description: 'Estado del remate' })
  @IsOptional()
  @IsEnum(AuctionStatus)
  status?: AuctionStatus

  @ApiPropertyOptional({ example: 1, description: 'ID del rematador' })
  @IsOptional()
  @IsInt()
  auctioneerId?: number

  @ApiPropertyOptional({ example: '/uploads/remate-imagen.jpg', description: 'URL de la imagen destacada' })
  @IsOptional()
  @IsString()
  featuredImage?: string

  @ApiPropertyOptional({ example: false, description: 'Remate premium' })
  @IsOptional()
  @IsBoolean()
  premium?: boolean

  @ApiPropertyOptional({ example: false, description: 'Remate destacado' })
  @IsOptional()
  @IsBoolean()
  destacado?: boolean
}
