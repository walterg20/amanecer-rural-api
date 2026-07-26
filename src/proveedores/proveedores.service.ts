import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Proveedor, ProveedorStatus, ProveedorPlan } from './entities/proveedor.entity'

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private readonly proveedorRepo: Repository<Proveedor>,
  ) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  async findAll(query: {
    rubro?: string; provincia?: string; nombre?: string;
    plan?: string; destacado?: string; page?: number; limit?: number
  }) {
    const { rubro, provincia, nombre, plan, destacado, page = 1, limit = 10 } = query
    const qb = this.proveedorRepo.createQueryBuilder('p')
      .leftJoinAndSelect('p.rubro', 'rubro')

    qb.andWhere('p.status = :status', { status: ProveedorStatus.APPROVED })

    if (rubro) qb.andWhere('rubro.slug = :rubro', { rubro })
    if (provincia) qb.andWhere('p.provincia = :provincia', { provincia })
    if (nombre) qb.andWhere('p.nombre ILIKE :nombre', { nombre: `%${nombre}%` })
    if (plan) qb.andWhere('p.plan = :plan', { plan })
    if (destacado === 'true') qb.andWhere('p.destacado = :destacado', { destacado: true })

    qb.orderBy('p.destacado', 'DESC')
      .addOrderBy('p.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async findDestacados(limit = 10) {
    const qb = this.proveedorRepo.createQueryBuilder('p')
      .leftJoinAndSelect('p.rubro', 'rubro')
      .andWhere('p.status = :status', { status: ProveedorStatus.APPROVED })
      .andWhere('p.destacado = :destacado', { destacado: true })
      .orderBy('p.createdAt', 'DESC')
      .take(limit)

    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total } }
  }

  async findOne(id: number): Promise<Proveedor> {
    const proveedor = await this.proveedorRepo.findOne({
      where: { id },
      relations: { rubro: true },
    })
    if (!proveedor) throw new NotFoundException('Proveedor no encontrado')
    return proveedor
  }

  async findBySlug(slug: string): Promise<Proveedor> {
    const proveedor = await this.proveedorRepo.findOne({
      where: { slug, status: ProveedorStatus.APPROVED },
      relations: { rubro: true },
    })
    if (!proveedor) throw new NotFoundException('Proveedor not found')
    return proveedor
  }

  async create(data: Partial<Proveedor>): Promise<Proveedor> {
    const slug = data.nombre ? this.slugify(data.nombre) : ''
    const proveedor = this.proveedorRepo.create({ ...data, slug })
    return this.proveedorRepo.save(proveedor)
  }

  async update(id: number, data: Partial<Proveedor>): Promise<Proveedor> {
    const updateData = { ...data }
    if (data.nombre) {
      updateData.slug = this.slugify(data.nombre)
    }
    await this.proveedorRepo.update(id, updateData as any)
    const updated = await this.proveedorRepo.findOne({
      where: { id },
      relations: { rubro: true },
    })
    if (!updated) throw new NotFoundException('Proveedor not found')
    return updated
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.proveedorRepo.softDelete(id)
    if (result.affected === 0) throw new NotFoundException('Proveedor not found')
  }

  async updateStatus(id: number, status: ProveedorStatus): Promise<Proveedor> {
    if (![ProveedorStatus.APPROVED, ProveedorStatus.REJECTED].includes(status)) {
      throw new BadRequestException('Status must be approved or rejected')
    }

    const proveedor = await this.proveedorRepo.findOne({ where: { id } })
    if (!proveedor) throw new NotFoundException('Proveedor not found')

    if (status === ProveedorStatus.APPROVED) {
      const expirationMap = {
        [ProveedorPlan.GRATIS]: 3,
        [ProveedorPlan.DESTACADO]: 6,
        [ProveedorPlan.PREMIUM]: 12,
      }
      const months = expirationMap[proveedor.plan]
      const expiresAt = new Date()
      expiresAt.setMonth(expiresAt.getMonth() + months)
      proveedor.expiresAt = expiresAt
    }

    proveedor.status = status
    return this.proveedorRepo.save(proveedor)
  }

  async toggleDestacado(id: number, destacado: boolean): Promise<Proveedor> {
    const proveedor = await this.proveedorRepo.findOne({ where: { id } })
    if (!proveedor) throw new NotFoundException('Proveedor not found')
    proveedor.destacado = destacado
    return this.proveedorRepo.save(proveedor)
  }

  async findAllAdmin(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = query
    const qb = this.proveedorRepo.createQueryBuilder('p')
      .leftJoinAndSelect('p.rubro', 'rubro')

    qb.orderBy('p.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }
}
