import { IsString, IsNumber, IsOptional, Min, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateSubscriptionDto {
  @ApiProperty({ example: 1, description: 'ID del plan' })
  @IsNumber()
  @Min(1)
  planId!: number

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del suscriptor' })
  @IsString()
  name!: string

  @ApiProperty({ example: 'juan@email.com', description: 'Email del suscriptor' })
  @IsString()
  email!: string

  @ApiPropertyOptional({ example: '+5491123456789', description: 'Teléfono opcional' })
  @IsOptional()
  @IsString()
  phone?: string
}
