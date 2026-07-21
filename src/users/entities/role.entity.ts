import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { User } from './user.entity'

export enum RoleName {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  EDITOR = 'editor',
  PROVIDER = 'provider',
  USER = 'user',
}

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true, length: 50 })
  name!: string

  @Column({ unique: true, length: 50 })
  slug!: string

  @Column({ nullable: true })
  description?: string

  @OneToMany(() => User, user => user.role)
  users?: User[]
}
