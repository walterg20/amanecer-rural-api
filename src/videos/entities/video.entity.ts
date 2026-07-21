import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
} from 'typeorm'

export enum VideoSeccion {
  AMANECER_RURAL_TV = 'amanecer-rural-tv',
  AVANCE_RURAL_TV = 'avance-rural-tv',
}

export enum VideoStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
}

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ name: 'youtube_id', length: 50 })
  youtubeId!: string

  @Column({ length: 255 })
  title!: string

  @Column({
    type: 'enum',
    enum: VideoSeccion,
  })
  seccion!: VideoSeccion

  @Column({ nullable: true })
  fecha?: Date

  @Column({ default: 0 })
  orden!: number

  @Column({
    type: 'enum',
    enum: VideoStatus,
    default: VideoStatus.PUBLISHED,
  })
  status!: VideoStatus

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}
