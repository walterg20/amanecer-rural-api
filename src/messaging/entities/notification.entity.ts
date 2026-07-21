import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'

export enum NotificationType {
  MESSAGE = 'message',
  STATUS = 'status',
  PAYMENT = 'payment',
  SYSTEM = 'system',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'user_id' })
  userId!: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type!: NotificationType

  @Column({ length: 255 })
  title!: string

  @Column({ type: 'text', nullable: true })
  body?: string

  @Column({ length: 255, nullable: true })
  link?: string

  @Column({ name: 'read_at', nullable: true })
  readAt?: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date
}
