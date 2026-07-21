import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm'
import { Post } from './post.entity'

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 255 })
  name!: string

  @Column({ unique: true, length: 255 })
  slug!: string

  @Column({ nullable: true })
  description?: string

  @Column({ name: 'parent_id', nullable: true })
  parentId?: number

  @ManyToOne(() => Category, category => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent?: Category

  @OneToMany(() => Category, category => category.parent)
  children?: Category[]

  @OneToMany(() => Post, post => post.category)
  posts?: Post[]
}
