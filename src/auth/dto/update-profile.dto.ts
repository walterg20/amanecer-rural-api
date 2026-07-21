import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Juan Pérez', description: 'Nombre completo del usuario' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name?: string

  @ApiPropertyOptional({ example: 'https://ejemplo.com/avatar.jpg', description: 'URL de la imagen de perfil' })
  @IsOptional()
  @IsString()
  avatar?: string
}
