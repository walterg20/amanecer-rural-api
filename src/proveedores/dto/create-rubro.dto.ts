import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateRubroDto {
  @ApiProperty({ example: 'MAQUINARIAS E IMPLEMENTOS AGRICOLAS', description: 'Nombre del rubro' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nombre!: string

  @ApiPropertyOptional({ example: 'Empresas dedicadas a la venta de maquinaria agrícola', description: 'Descripción del rubro' })
  @IsOptional()
  @IsString()
  description?: string
}
