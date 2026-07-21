import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
} from 'typeorm'

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  PDF = 'pdf',
}

@Entity('remates_media')
export class AuctionMedia {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'auction_id', nullable: true })
  auctionId?: number

  @Column({ name: 'lot_id', nullable: true })
  lotId?: number

  @Column()
  url!: string

  @Column({
    type: 'enum',
    enum: MediaType,
    default: MediaType.IMAGE,
  })
  type!: MediaType

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date
}
