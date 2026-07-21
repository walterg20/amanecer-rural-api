import {
  Entity, PrimaryGeneratedColumn, Column, OneToMany,
} from 'typeorm'
import { Proveedor } from './proveedor.entity'

@Entity('rubros')
export class Rubro {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 100 })
  nombre!: string

  @Column({ unique: true, length: 100 })
  slug!: string

  @Column({ nullable: true })
  description?: string

  @OneToMany(() => Proveedor, p => p.rubro)
  proveedores?: Proveedor[]
}
