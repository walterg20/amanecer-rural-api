import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { SubscriptionPlan } from './subscription-plan.entity'

export enum SubscriptionStatus {
  PENDING_PAYMENT = 'pending_payment',
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'plan_id' })
  planId!: number

  @ManyToOne(() => SubscriptionPlan)
  @JoinColumn({ name: 'plan_id' })
  plan?: SubscriptionPlan

  @Column({ length: 255 })
  name!: string

  @Column({ length: 255 })
  email!: string

  @Column({ length: 50, nullable: true })
  phone?: string

  @Column({ type: 'enum', enum: SubscriptionStatus, default: SubscriptionStatus.PENDING_PAYMENT })
  status!: SubscriptionStatus

  @Column({ name: 'current_period_start', type: 'timestamptz', nullable: true })
  currentPeriodStart?: Date

  @Column({ name: 'current_period_end', type: 'timestamptz', nullable: true })
  currentPeriodEnd?: Date

  @Column({ name: 'cancelled_at', type: 'timestamptz', nullable: true })
  cancelledAt?: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
