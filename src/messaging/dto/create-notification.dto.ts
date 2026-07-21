import { IsString, IsInt, IsEnum, IsOptional, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { NotificationType } from '../entities/notification.entity'

export class CreateNotificationDto {
  @ApiProperty({ example: 1, description: 'ID del usuario destinatario' })
  @IsInt()
  userId!: number

  @ApiProperty({ enum: NotificationType, example: NotificationType.SYSTEM, description: 'Tipo de notificación' })
  @IsEnum(NotificationType)
  type!: NotificationType

  @ApiProperty({ example: 'Su clasificado fue aprobado', description: 'Título de la notificación' })
  @IsString()
  @MaxLength(255)
  title!: string

  @ApiPropertyOptional({ example: 'El clasificado "Tractor JDE 5075E" ha sido aprobado y ya está visible.', description: 'Cuerpo de la notificación' })
  @IsOptional()
  @IsString()
  body?: string

  @ApiPropertyOptional({ example: '/clasificados/tractor-john-deere', description: 'Link relacionado' })
  @IsOptional()
  @IsString()
  link?: string
}
