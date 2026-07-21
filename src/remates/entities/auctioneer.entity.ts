import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany,
} from 'typeorm'
import { Auction } from './auction.entity'

@Entity('rematadores')
export class Auctioneer {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 255 })
  name!: string

  @Column({ length: 50, nullable: true })
  phone?: string

  @Column({ length: 255, nullable: true })
  email?: string

  @Column({ length: 255, nullable: true })
  website?: string

  @Column({ nullable: true })
  logo?: string

  @Column({ type: 'text', nullable: true })
  description?: string

  @OneToMany(() => Auction, a => a.auctioneer)
  auctions?: Auction[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date
}
