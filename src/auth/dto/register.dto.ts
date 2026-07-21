import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
  @ApiProperty({ example: 'usuario@ejemplo.com', description: 'Correo electrónico del usuario' })
  @IsEmail()
  email!: string

  @ApiProperty({ example: 'contraseñaSegura123', description: 'Contraseña del usuario (mín. 6 caracteres)' })
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password!: string

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del usuario' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name!: string
}
