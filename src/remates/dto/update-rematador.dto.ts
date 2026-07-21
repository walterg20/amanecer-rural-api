import { PartialType } from '@nestjs/swagger'
import { CreateRematadorDto } from './create-rematador.dto'

export class UpdateRematadorDto extends PartialType(CreateRematadorDto) {}
