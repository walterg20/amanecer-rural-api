import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

export enum SubscriptionType {
  DIGITAL = 'digital',
  PRINT = 'print',
  BOTH = 'both',
}

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 255 })
  name!: string

  @Column({ type: 'enum', enum: SubscriptionType })
  type!: SubscriptionType

  @Column({ name: 'duration_days' })
  durationDays!: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number

  @Column({ name: 'is_active', default: true })
  isActive!: boolean

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
