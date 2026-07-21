import { IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ProveedorStatus } from '../entities/proveedor.entity'

export class UpdateStatusDto {
  @ApiProperty({ enum: [ProveedorStatus.APPROVED, ProveedorStatus.REJECTED], example: ProveedorStatus.APPROVED, description: 'Nuevo estado del proveedor' })
  @IsEnum(ProveedorStatus)
  status!: ProveedorStatus
}
