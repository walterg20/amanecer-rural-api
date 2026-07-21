import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn,
  ManyToMany, JoinTable,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Category } from './category.entity'
import { Tag } from './tag.entity'

export enum PostType {
  NEWS = 'news',
  TECH_NOTE = 'tech_note',
  MAGAZINE = 'magazine',
}

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 255 })
  title!: string

  @Column({ unique: true, length: 255 })
  slug!: string

  @Column({ type: 'text' })
  content!: string

  @Column({ nullable: true })
  excerpt?: string

  @Column({
    type: 'enum',
    enum: PostType,
    default: PostType.NEWS,
  })
  type!: PostType

  @Column({
    type: 'enum',
    enum: PostStatus,
    default: PostStatus.DRAFT,
  })
  status!: PostStatus

  @Column({ name: 'category_id', nullable: true })
  categoryId?: number

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category?: Category

  @Column({ name: 'author_id' })
  authorId!: number

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author?: User

  @ManyToMany(() => Tag)
  @JoinTable({
    name: 'posts_tags',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags?: Tag[]

  @Column({ nullable: true })
  featuredImage?: string

  @Column({ name: 'published_at', nullable: true })
  publishedAt?: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date
}
