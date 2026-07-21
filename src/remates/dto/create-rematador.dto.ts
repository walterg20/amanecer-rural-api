import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateRematadorDto {
  @ApiProperty({ example: 'Martillero Pérez', description: 'Nombre del rematador' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name!: string

  @ApiPropertyOptional({ example: '+543624567890', description: 'Teléfono' })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiPropertyOptional({ example: 'martillero@example.com', description: 'Email' })
  @IsOptional()
  @IsString()
  email?: string

  @ApiPropertyOptional({ example: 'https://www.martilleroperez.com', description: 'Sitio web' })
  @IsOptional()
  @IsString()
  website?: string

  @ApiPropertyOptional({ example: '/uploads/logo-rematador.jpg', description: 'URL del logo' })
  @IsOptional()
  @IsString()
  logo?: string

  @ApiPropertyOptional({ example: 'Martillero público con 20 años de experiencia...', description: 'Descripción' })
  @IsOptional()
  @IsString()
  description?: string
}
