import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  DeleteDateColumn, ManyToOne, JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'sender_id' })
  senderId!: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender_id' })
  sender?: User

  @Column({ name: 'receiver_id' })
  receiverId!: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiver_id' })
  receiver?: User

  @Column({ length: 255 })
  subject!: string

  @Column({ type: 'text' })
  body!: string

  @Column({ name: 'read_at', nullable: true })
  readAt?: Date

  @Column({ name: 'parent_id', nullable: true })
  parentId?: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date

  @Column({ name: 'deleted_by_sender', default: false })
  deletedBySender!: boolean

  @Column({ name: 'deleted_by_receiver', default: false })
  deletedByReceiver!: boolean
}
