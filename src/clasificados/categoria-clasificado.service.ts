import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CategoriaClasificado } from './entities/categoria-clasificado.entity'

const SEED_CATEGORIAS = [
  { name: 'Maquinarias y Vehículos', slug: 'maquinarias-y-vehiculos', icon: 'tractor', orden: 1 },
  { name: 'Servicios', slug: 'servicios', icon: 'services', orden: 2 },
  { name: 'Campos y Haciendas', slug: 'campos-y-haciendas', icon: 'land', orden: 3 },
  { name: 'Productos', slug: 'productos', icon: 'package', orden: 4 },
]

@Injectable()
export class CategoriaClasificadoService implements OnModuleInit {
  constructor(
    @InjectRepository(CategoriaClasificado)
    private readonly repo: Repository<CategoriaClasificado>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count()
    if (count === 0) {
      await this.repo.save(this.repo.create(SEED_CATEGORIAS))
    }
  }

  async findAll() {
    return this.repo.find({ order: { orden: 'ASC' } })
  }
}
