import { IsString, IsEnum, IsNumber, Min, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { SubscriptionType } from '../entities/subscription-plan.entity'

export class CreateSubscriptionPlanDto {
  @ApiProperty({ example: 'Digital Mensual', description: 'Nombre del plan' })
  @IsString()
  name!: string

  @ApiProperty({ enum: SubscriptionType, example: SubscriptionType.DIGITAL })
  @IsEnum(SubscriptionType)
  type!: SubscriptionType

  @ApiProperty({ example: 30, description: 'Duración en días' })
  @IsNumber()
  @Min(1)
  durationDays!: number

  @ApiProperty({ example: 1500, description: 'Precio en ARS' })
  @IsNumber()
  @Min(0)
  price!: number

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  isActive?: boolean
}
