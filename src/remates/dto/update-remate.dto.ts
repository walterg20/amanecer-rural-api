import { PartialType } from '@nestjs/swagger'
import { CreateRemateDto } from './create-remate.dto'

export class UpdateRemateDto extends PartialType(CreateRemateDto) {}
