import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 255 })
  name!: string

  @Column({ unique: true, length: 255 })
  slug!: string
}
