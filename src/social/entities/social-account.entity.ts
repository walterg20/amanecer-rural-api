import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn,
} from 'typeorm'

export enum SocialPlatform {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
}

@Entity('social_accounts')
export class SocialAccount {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'enum', enum: SocialPlatform })
  platform!: SocialPlatform

  @Column({ name: 'account_name', length: 255 })
  accountName!: string

  @Column({ name: 'page_id', length: 255 })
  pageId!: string

  @Column({ name: 'page_access_token', type: 'text' })
  pageAccessToken!: string

  @Column({ name: 'instagram_business_id', length: 255, nullable: true })
  instagramBusinessId?: string

  @Column({ name: 'is_active', default: true })
  isActive!: boolean

  @Column({ name: 'created_by', nullable: true })
  createdBy?: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date
}
