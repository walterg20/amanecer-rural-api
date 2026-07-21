import { IsNumber, IsString, IsOptional, Min } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreatePreferenceDto {
  @ApiProperty({ example: 1500, description: 'Monto en ARS' })
  @IsNumber()
  @Min(1)
  amount!: number

  @ApiProperty({ example: 'Anuncio clasificado - Venta tractor', description: 'Título del pago' })
  @IsString()
  title!: string

  @ApiPropertyOptional({ example: 'Publicación destacada por 30 días', description: 'Descripción del pago' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ example: 'classified', description: 'Tipo de entidad (classified, provider, etc.)' })
  @IsOptional()
  @IsString()
  conceptType?: string

  @ApiPropertyOptional({ example: 42, description: 'ID de la entidad por la que se paga' })
  @IsOptional()
  @IsNumber()
  conceptId?: number
}
