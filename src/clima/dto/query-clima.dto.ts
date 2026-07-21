import { IsOptional, IsString, MaxLength } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class QueryClimaDto {
  @ApiPropertyOptional({ example: 'Resistencia', description: 'Nombre de la ciudad (default: Resistencia)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ciudad?: string

  @ApiPropertyOptional({ example: 'Chaco', description: 'Provincia' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  provincia?: string
}
