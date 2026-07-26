import { IsString, IsOptional, IsEnum, IsInt, IsEmail, IsBoolean, MinLength, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ProveedorPlan } from '../entities/proveedor.entity'

export class CreateProveedorDto {
  @ApiProperty({ example: 'Agroinsumos Chaco SRL', description: 'Nombre del proveedor' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  nombre!: string

  @ApiProperty({ example: 1, description: 'ID del rubro' })
  @IsInt()
  rubroId!: number

  @ApiPropertyOptional({ example: 'Empresa dedicada a la venta de insumos agrícolas...', description: 'Descripción del proveedor' })
  @IsOptional()
  @IsString()
  descripcion?: string

  @ApiPropertyOptional({ example: '/uploads/logo-empresa.jpg', description: 'URL del logo' })
  @IsOptional()
  @IsString()
  logo?: string

  @ApiPropertyOptional({ example: 'Av. San Martín 1234', description: 'Dirección' })
  @IsOptional()
  @IsString()
  direccion?: string

  @ApiProperty({ example: 'Chaco', description: 'Provincia' })
  @IsString()
  provincia!: string

  @ApiPropertyOptional({ example: 'Resistencia', description: 'Localidad' })
  @IsOptional()
  @IsString()
  localidad?: string

  @ApiPropertyOptional({ example: '+543624567890', description: 'Teléfono' })
  @IsOptional()
  @IsString()
  telefono?: string

  @ApiPropertyOptional({ example: 'contacto@agroinsumos.com', description: 'Email' })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional({ example: 'https://www.agroinsumos.com', description: 'Sitio web' })
  @IsOptional()
  @IsString()
  website?: string

  @ApiPropertyOptional({ example: '+543624567890', description: 'WhatsApp' })
  @IsOptional()
  @IsString()
  whatsapp?: string

  @ApiPropertyOptional({ enum: ProveedorPlan, example: ProveedorPlan.GRATIS, description: 'Plan del proveedor' })
  @IsOptional()
  @IsEnum(ProveedorPlan)
  plan?: ProveedorPlan

  @ApiPropertyOptional({ example: true, description: 'Estado destacado del proveedor' })
  @IsOptional()
  @IsBoolean()
  destacado?: boolean
}
