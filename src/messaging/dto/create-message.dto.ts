import { IsString, IsInt, IsOptional, MinLength, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateMessageDto {
  @ApiProperty({ example: 2, description: 'ID del usuario destinatario' })
  @IsInt()
  receiverId!: number

  @ApiProperty({ example: 'Consulta sobre maquinaria', description: 'Asunto del mensaje' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  subject!: string

  @ApiProperty({ example: 'Hola, quería consultar sobre el tractor que publicaron...', description: 'Cuerpo del mensaje' })
  @IsString()
  @MinLength(1)
  body!: string

  @ApiPropertyOptional({ example: 5, description: 'ID del mensaje padre (para respuestas en hilo)' })
  @IsOptional()
  @IsInt()
  parentId?: number
}
