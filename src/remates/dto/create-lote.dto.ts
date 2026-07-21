import { IsString, IsOptional, IsInt, IsNumber, MinLength, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateLoteDto {
  @ApiProperty({ example: 1, description: 'Número de lote' })
  @IsInt()
  number!: number

  @ApiProperty({ example: 'Lote 1 - 50 vaquillonas Hereford', description: 'Título del lote' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title!: string

  @ApiPropertyOptional({ example: 'Lote de 50 vaquillonas Hereford de primera calidad...', description: 'Descripción del lote' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ example: 500000, description: 'Precio base' })
  @IsOptional()
  @IsNumber()
  basePrice?: number

  @ApiPropertyOptional({ example: 550000, description: 'Precio de venta' })
  @IsOptional()
  @IsNumber()
  soldPrice?: number

  @ApiPropertyOptional({ example: 1, description: 'Orden de visualización' })
  @IsOptional()
  @IsInt()
  orden?: number
}
