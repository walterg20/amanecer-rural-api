import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Subscription, SubscriptionStatus } from './subscription.entity'

@Entity('subscription_status_history')
export class SubscriptionStatusHistory {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'subscription_id' })
  subscriptionId!: number

  @ManyToOne(() => Subscription)
  @JoinColumn({ name: 'subscription_id' })
  subscription?: Subscription

  @Column({ name: 'from_status', type: 'enum', enum: SubscriptionStatus, nullable: true })
  fromStatus?: SubscriptionStatus

  @Column({ name: 'to_status', type: 'enum', enum: SubscriptionStatus })
  toStatus!: SubscriptionStatus

  @Column({ length: 255, nullable: true })
  reason?: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date
}
