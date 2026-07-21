import { IsString, IsOptional, IsEnum, IsInt, IsNumber, IsArray, IsEmail, Min, MinLength, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ClasificadoCondicion, ClasificadoPlan } from '../entities/clasificado.entity'

export class CreateClasificadoDto {
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

  @ApiPropertyOptional({ example: '/uploads/clasificado.jpg', description: 'URL de la imagen principal' })
  @IsOptional()
  @IsString()
  imagenPrincipal?: string

  @ApiPropertyOptional({ example: ['/uploads/img1.jpg', '/uploads/img2.jpg'], description: 'Galería de imágenes' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  galeria?: string[]

  @ApiPropertyOptional({ enum: ClasificadoPlan, example: ClasificadoPlan.GRATIS, description: 'Plan del clasificado' })
  @IsOptional()
  @IsEnum(ClasificadoPlan)
  plan?: ClasificadoPlan
}
