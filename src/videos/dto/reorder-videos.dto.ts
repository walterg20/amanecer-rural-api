import { IsArray, ValidateNested, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

class ReorderItem {
  @ApiProperty({ example: 1, description: 'ID del video' })
  @IsInt()
  id!: number

  @ApiProperty({ example: 3, description: 'Nuevo orden' })
  @IsInt()
  @Min(0)
  orden!: number
}

export class ReorderVideosDto {
  @ApiProperty({ type: [ReorderItem], description: 'Lista de pares id-orden' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItem)
  items!: ReorderItem[]
}
