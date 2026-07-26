import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'

export enum TransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REFUNDED = 'refunded',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'user_id', nullable: true })
  userId?: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status!: TransactionStatus

  @Column({ name: 'mp_preference_id', nullable: true })
  mpPreferenceId?: string

  @Column({ name: 'mp_payment_id', nullable: true })
  mpPaymentId?: number

  @Column({ name: 'concept_type', nullable: true })
  conceptType?: string

  @Column({ name: 'concept_id', nullable: true })
  conceptId?: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date
}
