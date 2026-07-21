import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany,
} from 'typeorm'
import { Auctioneer } from './auctioneer.entity'
import { Lot } from './lot.entity'

export enum AuctionType {
  CABANA = 'cabana',
  EXPOSICION = 'exposicion',
  GENERAL = 'general',
}

export enum AuctionStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
}

@Entity('remates')
export class Auction {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 255 })
  title!: string

  @Column({ unique: true, length: 255 })
  slug!: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ type: 'date' })
  date!: string

  @Column({ nullable: true })
  time?: string

  @Column({ length: 255 })
  location!: string

  @Column({ length: 100 })
  province!: string

  @Column({
    type: 'enum',
    enum: AuctionType,
  })
  type!: AuctionType

  @Column({
    type: 'enum',
    enum: AuctionStatus,
    default: AuctionStatus.SCHEDULED,
  })
  status!: AuctionStatus

  @Column({ name: 'auctioneer_id', nullable: true })
  auctioneerId?: number

  @ManyToOne(() => Auctioneer, a => a.auctions)
  @JoinColumn({ name: 'auctioneer_id' })
  auctioneer?: Auctioneer

  @Column({ name: 'featured_image', nullable: true })
  featuredImage?: string

  @Column({ default: false })
  premium!: boolean

  @Column({ default: false })
  destacado!: boolean

  @OneToMany(() => Lot, l => l.auction)
  lots?: Lot[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date
}
