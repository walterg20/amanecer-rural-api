import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Subscription } from './subscription.entity'

@Entity('subscription_payments')
export class SubscriptionPayment {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'subscription_id' })
  subscriptionId!: number

  @ManyToOne(() => Subscription)
  @JoinColumn({ name: 'subscription_id' })
  subscription?: Subscription

  @Column({ name: 'transaction_id', nullable: true })
  transactionId?: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number

  @Column({ name: 'period_start', type: 'timestamptz' })
  periodStart!: Date

  @Column({ name: 'period_end', type: 'timestamptz' })
  periodEnd!: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date
}
