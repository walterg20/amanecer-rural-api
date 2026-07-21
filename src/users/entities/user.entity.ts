import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm'
import { Role } from './role.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true, length: 255 })
  email!: string

  @Column({ length: 255 })
  password!: string

  @Column({ length: 255 })
  name!: string

  @Column({ nullable: true })
  avatar?: string

  @Column({ default: true })
  active!: boolean

  @Column({ name: 'role_id' })
  roleId!: number

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role?: Role

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
