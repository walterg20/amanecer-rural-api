import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn,
} from 'typeorm'

export enum EventoPlan {
  GRATIS = 'gratis',
  DESTACADO = 'destacado',
  PREMIUM = 'premium',
}

export enum EventoStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('eventos')
export class Evento {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 255 })
  title!: string

  @Column({ unique: true, length: 255 })
  slug!: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ type: 'date' })
  fecha!: string

  @Column({ name: 'fecha_fin', type: 'date', nullable: true })
  fechaFin?: string

  @Column({ length: 255 })
  ubicacion!: string

  @Column({ length: 100 })
  provincia!: string

  @Column({ length: 100, nullable: true })
  localidad?: string

  @Column({ length: 255, nullable: true })
  organizador?: string

  @Column({ nullable: true })
  image?: string

  @Column({ nullable: true })
  logo?: string

  @Column({ nullable: true })
  afiche?: string

  @Column({ nullable: true })
  pdf?: string

  @Column({ nullable: true })
  audio?: string

  @Column({ type: 'jsonb', nullable: true })
  galeria?: string[]

  @Column({
    type: 'enum',
    enum: EventoPlan,
    default: EventoPlan.GRATIS,
  })
  plan!: EventoPlan

  @Column({
    type: 'enum',
    enum: EventoStatus,
    default: EventoStatus.PENDING,
  })
  status!: EventoStatus

  @Column({ name: 'user_id', nullable: true })
  userId?: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date
}
