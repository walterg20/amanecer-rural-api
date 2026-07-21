import { IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { EventoStatus } from '../entities/evento.entity'

export class UpdateStatusDto {
  @ApiProperty({ enum: EventoStatus, example: EventoStatus.APPROVED, description: 'Nuevo estado del evento' })
  @IsEnum(EventoStatus)
  status!: EventoStatus
}
