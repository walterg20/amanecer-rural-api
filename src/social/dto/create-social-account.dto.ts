import { IsEnum, IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { SocialPlatform } from '../entities/social-account.entity'

export class CreateSocialAccountDto {
  @ApiProperty({ enum: SocialPlatform })
  @IsEnum(SocialPlatform)
  platform!: SocialPlatform

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountName!: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pageId!: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pageAccessToken!: string
}
