import { IsEnum, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { SubscriptionStatus } from '../entities/subscription.entity'

export class UpdateSubscriptionStatusDto {
  @ApiProperty({ enum: SubscriptionStatus, example: SubscriptionStatus.ACTIVE })
  @IsEnum(SubscriptionStatus)
  status!: SubscriptionStatus

  @ApiPropertyOptional({ example: 'Cambio manual por administración' })
  @IsOptional()
  @IsString()
  reason?: string
}
