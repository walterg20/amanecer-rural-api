import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Clasificado, ClasificadoStatus, ClasificadoPlan } from './entities/clasificado.entity'

@Injectable()
export class ClasificadosService {
  constructor(
    @InjectRepository(Clasificado)
    private readonly clasificadoRepo: Repository<Clasificado>,
  ) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  async findAll(query: {
    categoria?: string; provincia?: string; nombre?: string;
    condicion?: string; plan?: string; page?: number; limit?: number
  }) {
    const { categoria, provincia, nombre, condicion, plan, page = 1, limit = 10 } = query
    const qb = this.clasificadoRepo.createQueryBuilder('c')
      .leftJoinAndSelect('c.categoria', 'categoria')

    qb.andWhere('c.status = :status', { status: ClasificadoStatus.APPROVED })

    if (categoria) qb.andWhere('categoria.slug = :categoria', { categoria })
    if (provincia) qb.andWhere('c.provincia = :provincia', { provincia })
    if (nombre) qb.andWhere('c.title ILIKE :nombre', { nombre: `%${nombre}%` })
    if (condicion) qb.andWhere('c.condicion = :condicion', { condicion })
    if (plan) qb.andWhere('c.plan = :plan', { plan })

    qb.orderBy('c.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async findBySlug(slug: string): Promise<Clasificado> {
    const clasificado = await this.clasificadoRepo.findOne({
      where: { slug, status: ClasificadoStatus.APPROVED },
      relations: { categoria: true },
    })
    if (!clasificado) throw new NotFoundException('Clasificado not found')
    return clasificado
  }

  async create(data: Partial<Clasificado>): Promise<Clasificado> {
    const slug = data.title ? this.slugify(data.title) : ''
    const clasificado = this.clasificadoRepo.create({ ...data, slug })
    return this.clasificadoRepo.save(clasificado)
  }

  async update(id: number, data: Partial<Clasificado>): Promise<Clasificado> {
    const updateData = { ...data }
    if (data.title) {
      updateData.slug = this.slugify(data.title)
    }
    await this.clasificadoRepo.update(id, updateData as any)
    const updated = await this.clasificadoRepo.findOne({
      where: { id },
      relations: { categoria: true },
    })
    if (!updated) throw new NotFoundException('Clasificado not found')
    return updated
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.clasificadoRepo.softDelete(id)
    if (result.affected === 0) throw new NotFoundException('Clasificado not found')
  }

  async updateStatus(id: number, status: ClasificadoStatus): Promise<Clasificado> {
    if (![ClasificadoStatus.APPROVED, ClasificadoStatus.REJECTED].includes(status)) {
      throw new BadRequestException('Status must be approved or rejected')
    }

    const clasificado = await this.clasificadoRepo.findOne({ where: { id } })
    if (!clasificado) throw new NotFoundException('Clasificado not found')

    if (status === ClasificadoStatus.APPROVED) {
      const expirationMap = {
        [ClasificadoPlan.GRATIS]: 3,
        [ClasificadoPlan.DESTACADO]: 6,
        [ClasificadoPlan.PREMIUM]: 12,
      }
      const months = expirationMap[clasificado.plan]
      const expiresAt = new Date()
      expiresAt.setMonth(expiresAt.getMonth() + months)
      clasificado.expiresAt = expiresAt
    }

    clasificado.status = status
    return this.clasificadoRepo.save(clasificado)
  }

  async findAllAdmin(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = query
    const qb = this.clasificadoRepo.createQueryBuilder('c')
      .leftJoinAndSelect('c.categoria', 'categoria')

    qb.orderBy('c.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }
}
