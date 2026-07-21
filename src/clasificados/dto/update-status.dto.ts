import { IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ClasificadoStatus } from '../entities/clasificado.entity'

export class UpdateStatusDto {
  @ApiProperty({ enum: [ClasificadoStatus.APPROVED, ClasificadoStatus.REJECTED], example: ClasificadoStatus.APPROVED, description: 'Nuevo estado del clasificado' })
  @IsEnum(ClasificadoStatus)
  status!: ClasificadoStatus
}
