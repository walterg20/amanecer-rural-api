import { IsString, IsOptional, IsEnum, IsInt, IsNumber, IsArray, IsEmail, IsIn, Min, MinLength, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ClasificadoCondicion, ClasificadoPlan } from '../entities/clasificado.entity'

export const CLASIFICADO_PUBLIC_METHODS = ['mercadopago', 'transferencia'] as const

export class CreateClasificadoPublicDto {
  @ApiProperty({ example: 'Tractor John Deere 5075E', description: 'Título del clasificado' })
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title!: string

  @ApiPropertyOptional({ example: 'Tractor en excelente estado...', description: 'Descripción del clasificado' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ example: 1, description: 'ID de la categoría' })
  @IsInt()
  categoriaId!: number

  @ApiPropertyOptional({ example: 25000, description: 'Precio' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number

  @ApiPropertyOptional({ enum: ClasificadoCondicion, example: ClasificadoCondicion.NUEVO, description: 'Condición' })
  @IsOptional()
  @IsEnum(ClasificadoCondicion)
  condicion?: ClasificadoCondicion

  @ApiPropertyOptional({ example: 'Chaco', description: 'Provincia' })
  @IsOptional()
  @IsString()
  provincia?: string

  @ApiPropertyOptional({ example: 'Resistencia', description: 'Localidad' })
  @IsOptional()
  @IsString()
  localidad?: string

  @ApiPropertyOptional({ example: 'Av. Sarmiento 123', description: 'Dirección' })
  @IsOptional()
  @IsString()
  direccion?: string

  @ApiPropertyOptional({ example: '+543624567890', description: 'Teléfono' })
  @IsOptional()
  @IsString()
  telefono?: string

  @ApiPropertyOptional({ example: 'contacto@example.com', description: 'Email' })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional({ example: 'https://example.com', description: 'Sitio web' })
  @IsOptional()
  @IsString()
  website?: string

  @ApiPropertyOptional({ enum: ClasificadoPlan, example: ClasificadoPlan.GRATIS, description: 'Plan del clasificado' })
  @IsOptional()
  @IsIn([ClasificadoPlan.GRATIS, ClasificadoPlan.PREMIUM, ClasificadoPlan.DESTACADO])
  plan?: ClasificadoPlan

  @ApiPropertyOptional({ enum: ['mercadopago', 'transferencia'], example: 'mercadopago', description: 'Método de pago' })
  @IsOptional()
  @IsIn(['mercadopago', 'transferencia'])
  payment_method?: string

  @ApiPropertyOptional({ description: 'Token de verificación (Turnstile)' })
  @IsOptional()
  @IsString()
  captchaToken?: string
}