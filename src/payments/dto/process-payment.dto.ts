import { IsString, IsNumber, IsObject, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

class PayerDto {
  @ApiProperty({ example: 'comprador@email.com', description: 'Email del pagador' })
  @IsString()
  email!: string
}

export class ProcessPaymentDto {
  @ApiProperty({ example: '123456789', description: 'ID de la preferencia creada previamente' })
  @IsString()
  preferenceId!: string

  @ApiProperty({ description: 'Card token generado por Payment Brick' })
  @IsString()
  token!: string

  @ApiProperty({ example: 5000, description: 'Monto a pagar' })
  @IsNumber()
  @Min(1)
  transaction_amount!: number

  @ApiProperty({ example: 'visa', description: 'ID del método de pago' })
  @IsString()
  payment_method_id!: string

  @ApiProperty({ example: 1, description: 'Cantidad de cuotas' })
  @IsNumber()
  @Min(1)
  installments!: number

  @ApiProperty({ description: 'Datos del pagador' })
  @IsObject()
  payer!: PayerDto
}
