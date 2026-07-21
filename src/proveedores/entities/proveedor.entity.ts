import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Rubro } from './rubro.entity'

export enum ProveedorPlan {
  GRATIS = 'gratis',
  DESTACADO = 'destacado',
  PREMIUM = 'premium',
}

export enum ProveedorStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 255 })
  nombre!: string

  @Column({ unique: true, length: 255 })
  slug!: string

  @Column({ name: 'rubro_id' })
  rubroId!: number

  @ManyToOne(() => Rubro, r => r.proveedores)
  @JoinColumn({ name: 'rubro_id' })
  rubro?: Rubro

  @Column({ type: 'text', nullable: true })
  descripcion?: string

  @Column({ nullable: true })
  logo?: string

  @Column({ length: 255, nullable: true })
  direccion?: string

  @Column({ length: 100 })
  provincia!: string

  @Column({ length: 100, nullable: true })
  localidad?: string

  @Column({ length: 50, nullable: true })
  telefono?: string

  @Column({ length: 255, nullable: true })
  email?: string

  @Column({ length: 255, nullable: true })
  website?: string

  @Column({ length: 50, nullable: true })
  whatsapp?: string

  @Column({ type: 'json', nullable: true })
  galeria?: string[]

  @Column({
    type: 'enum',
    enum: ProveedorPlan,
    default: ProveedorPlan.GRATIS,
  })
  plan!: ProveedorPlan

  @Column({
    type: 'enum',
    enum: ProveedorStatus,
    default: ProveedorStatus.PENDING,
  })
  status!: ProveedorStatus

  @Column({ name: 'expires_at', nullable: true })
  expiresAt?: Date

  @Column({ default: false })
  destacado!: boolean

  @Column({ name: 'user_id', nullable: true })
  userId?: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user?: User

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date
}
