import { IsBoolean } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ToggleDestacadoDto {
  @ApiProperty({ example: true, description: 'Estado destacado del proveedor' })
  @IsBoolean()
  destacado!: boolean
}
