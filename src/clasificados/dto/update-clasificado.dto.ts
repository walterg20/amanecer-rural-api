import { PartialType } from '@nestjs/swagger'
import { CreateClasificadoDto } from './create-clasificado.dto'

export class UpdateClasificadoDto extends PartialType(CreateClasificadoDto) {}
