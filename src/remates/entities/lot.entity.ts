import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm'
import { Auction } from './auction.entity'

export enum LotStatus {
  AVAILABLE = 'available',
  SOLD = 'sold',
  WITHDRAWN = 'withdrawn',
}

@Entity('lotes')
export class Lot {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'auction_id' })
  auctionId!: number

  @ManyToOne(() => Auction, a => a.lots, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'auction_id' })
  auction?: Auction

  @Column()
  number!: number

  @Column({ length: 255 })
  title!: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'base_price', nullable: true })
  basePrice?: number

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'sold_price', nullable: true })
  soldPrice?: number

  @Column({
    type: 'enum',
    enum: LotStatus,
    default: LotStatus.AVAILABLE,
  })
  status!: LotStatus

  @Column({ default: 0 })
  orden!: number

  @Column({ type: 'json', nullable: true })
  images?: string[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date
}
