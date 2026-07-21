import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, LessThan, MoreThanOrEqual } from 'typeorm'
import { Evento, EventoStatus } from './entities/evento.entity'

@Injectable()
export class EventosService {
  constructor(
    @InjectRepository(Evento)
    private readonly eventoRepo: Repository<Evento>,
  ) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  async findProximos(query: { mes?: number; anio?: number; provincia?: string; page?: number; limit?: number }) {
    const { mes, anio, provincia, page = 1, limit = 10 } = query
    const qb = this.eventoRepo.createQueryBuilder('evento')

    qb.andWhere('evento.status = :status', { status: EventoStatus.APPROVED })
    qb.andWhere('evento.fecha >= :hoy', { hoy: new Date().toISOString().split('T')[0] })

    if (mes) qb.andWhere('EXTRACT(MONTH FROM evento.fecha) = :mes', { mes })
    if (anio) qb.andWhere('EXTRACT(YEAR FROM evento.fecha) = :anio', { anio })
    if (provincia) qb.andWhere('evento.provincia = :provincia', { provincia })

    qb.orderBy('evento.fecha', 'ASC')
      .addOrderBy('evento.createdAt', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async findPasados(query: { mes?: number; anio?: number; provincia?: string; page?: number; limit?: number }) {
    const { mes, anio, provincia, page = 1, limit = 10 } = query
    const qb = this.eventoRepo.createQueryBuilder('evento')

    qb.andWhere('evento.status = :status', { status: EventoStatus.APPROVED })
    qb.andWhere('evento.fecha < :hoy', { hoy: new Date().toISOString().split('T')[0] })

    if (mes) qb.andWhere('EXTRACT(MONTH FROM evento.fecha) = :mes', { mes })
    if (anio) qb.andWhere('EXTRACT(YEAR FROM evento.fecha) = :anio', { anio })
    if (provincia) qb.andWhere('evento.provincia = :provincia', { provincia })

    qb.orderBy('evento.fecha', 'DESC')
      .addOrderBy('evento.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async findBySlug(slug: string): Promise<Evento> {
    const evento = await this.eventoRepo.findOne({ where: { slug } })
    if (!evento) throw new NotFoundException('Evento not found')
    return evento
  }

  async create(data: Partial<Evento>): Promise<Evento> {
    const slug = data.title ? this.slugify(data.title) : ''
    const evento = this.eventoRepo.create({ ...data, slug })
    return this.eventoRepo.save(evento)
  }

  async update(id: number, data: Partial<Evento>): Promise<Evento> {
    const updateData = { ...data }
    if (data.title) {
      updateData.slug = this.slugify(data.title)
    }
    await this.eventoRepo.update(id, updateData)
    const updated = await this.eventoRepo.findOne({ where: { id } })
    if (!updated) throw new NotFoundException('Evento not found')
    return updated
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.eventoRepo.softDelete(id)
    if (result.affected === 0) throw new NotFoundException('Evento not found')
  }

  async updateStatus(id: number, status: EventoStatus): Promise<Evento> {
    if (![EventoStatus.APPROVED, EventoStatus.REJECTED].includes(status)) {
      throw new BadRequestException('Status must be approved or rejected')
    }
    await this.eventoRepo.update(id, { status })
    const updated = await this.eventoRepo.findOne({ where: { id } })
    if (!updated) throw new NotFoundException('Evento not found')
    return updated
  }

  async findAllAdmin(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = query
    const qb = this.eventoRepo.createQueryBuilder('evento')

    qb.orderBy('evento.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }
}
