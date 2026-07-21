import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Rubro } from './entities/rubro.entity'
import { rubrosSeed } from './data/rubros'

@Injectable()
export class RubrosService implements OnModuleInit {
  constructor(
    @InjectRepository(Rubro)
    private readonly rubroRepo: Repository<Rubro>,
  ) {}

  async onModuleInit() {
    const count = await this.rubroRepo.count()
    if (count === 0) {
      const rubros = rubrosSeed.map(nombre => ({
        nombre,
        slug: nombre
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
      }))
      await this.rubroRepo.save(this.rubroRepo.create(rubros as Rubro[]))
    }
  }

  async findAll() {
    return this.rubroRepo.find({
      order: { nombre: 'ASC' },
      relations: { proveedores: true },
    })
  }

  async findOne(id: number): Promise<Rubro> {
    const rubro = await this.rubroRepo.findOne({ where: { id } })
    if (!rubro) throw new NotFoundException('Rubro not found')
    return rubro
  }

  async create(data: { nombre: string; description?: string }): Promise<Rubro> {
    const slug = data.nombre
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    const rubro = this.rubroRepo.create({ ...data, slug })
    return this.rubroRepo.save(rubro)
  }

  async update(id: number, data: { nombre?: string; description?: string }): Promise<Rubro> {
    const updateData: Record<string, any> = { ...data }
    if (data.nombre) {
      updateData.slug = data.nombre
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }
    await this.rubroRepo.update(id, updateData as any)
    const updated = await this.rubroRepo.findOne({ where: { id } })
    if (!updated) throw new NotFoundException('Rubro not found')
    return updated
  }

  async delete(id: number): Promise<void> {
    const result = await this.rubroRepo.delete(id)
    if (result.affected === 0) throw new NotFoundException('Rubro not found')
  }
}
