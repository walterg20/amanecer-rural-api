import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
} from 'typeorm'
import { Clasificado } from './clasificado.entity'

@Entity('categorias_clasificados')
export class CategoriaClasificado {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 100 })
  name!: string

  @Column({ unique: true, length: 100 })
  slug!: string

  @Column({ nullable: true })
  icon?: string

  @Column({ default: 0 })
  orden!: number

  @OneToMany(() => Clasificado, c => c.categoria)
  clasificados?: Clasificado[]
}
