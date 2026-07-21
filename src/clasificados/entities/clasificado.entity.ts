import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { CategoriaClasificado } from './categoria-clasificado.entity'

export enum ClasificadoCondicion {
  NUEVO = 'nuevo',
  USADO = 'usado',
}

export enum ClasificadoPlan {
  GRATIS = 'gratis',
  DESTACADO = 'destacado',
  PREMIUM = 'premium',
}

export enum ClasificadoStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

@Entity('clasificados')
export class Clasificado {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 255 })
  title!: string

  @Column({ unique: true, length: 255 })
  slug!: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ name: 'categoria_id' })
  categoriaId!: number

  @ManyToOne(() => CategoriaClasificado)
  @JoinColumn({ name: 'categoria_id' })
  categoria?: CategoriaClasificado

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  price?: number

  @Column({
    type: 'enum',
    enum: ClasificadoCondicion,
    default: ClasificadoCondicion.NUEVO,
  })
  condicion!: ClasificadoCondicion

  @Column({ length: 100, nullable: true })
  provincia?: string

  @Column({ length: 100, nullable: true })
  localidad?: string

  @Column({ length: 255, nullable: true })
  direccion?: string

  @Column({ length: 50, nullable: true })
  telefono?: string

  @Column({ length: 255, nullable: true })
  email?: string

  @Column({ length: 255, nullable: true })
  website?: string

  @Column({ name: 'imagen_principal', nullable: true })
  imagenPrincipal?: string

  @Column({ type: 'json', nullable: true })
  galeria?: string[]

  @Column({
    type: 'enum',
    enum: ClasificadoPlan,
    default: ClasificadoPlan.GRATIS,
  })
  plan!: ClasificadoPlan

  @Column({
    type: 'enum',
    enum: ClasificadoStatus,
    default: ClasificadoStatus.PENDING,
  })
  status!: ClasificadoStatus

  @Column({ name: 'expires_at', nullable: true })
  expiresAt?: Date

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
