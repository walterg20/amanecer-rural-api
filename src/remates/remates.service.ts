import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Auction, AuctionStatus } from './entities/auction.entity'
import { Lot, LotStatus } from './entities/lot.entity'
import { RemateActivatedEvent } from './events/remate-activated.event'
import { RemateCancelledEvent } from './events/remate-cancelled.event'

@Injectable()
export class RematesService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepo: Repository<Auction>,
    @InjectRepository(Lot)
    private readonly lotRepo: Repository<Lot>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findTipos(): Promise<{ slug: string; type: string; nombre: string; desc: string; count: number }[]> {
    const qb = this.auctionRepo.createQueryBuilder('a')
      .select('a.type', 'type')
      .addSelect('COUNT(a.id)', 'count')
      .where('a.status != :cancelled', { cancelled: AuctionStatus.CANCELLED })
      .groupBy('a.type')
      .orderBy('COUNT(a.id)', 'DESC')

    const rows = await qb.getRawMany()
    return rows.map((r: any) => ({
      slug: r.type.toLowerCase().replace(/\s+/g, '-'),
      type: r.type,
      nombre: r.type.charAt(0).toUpperCase() + r.type.slice(1),
      desc: `Explora nuestros remates de tipo ${r.type}`,
      count: parseInt(r.count, 10),
    }))
  }

  async publish(id: number, userId: number): Promise<Auction> {
    const auction = await this.auctionRepo.findOne({ where: { id } })
    if (!auction) throw new NotFoundException('Remate not found')
    if (auction.status !== AuctionStatus.SCHEDULED) {
      throw new BadRequestException('Solo se pueden activar remates en estado scheduled')
    }

    auction.status = AuctionStatus.IN_PROGRESS
    const saved = await this.auctionRepo.save(auction)

    this.eventEmitter.emit(
      'remate.activated',
      new RemateActivatedEvent(saved.id, userId),
    )

    return saved
  }

  async cancel(id: number, userId: number): Promise<Auction> {
    const auction = await this.auctionRepo.findOne({ where: { id } })
    if (!auction) throw new NotFoundException('Remate not found')

    auction.status = AuctionStatus.CANCELLED
    const saved = await this.auctionRepo.save(auction)

    this.eventEmitter.emit(
      'remate.cancelled',
      new RemateCancelledEvent(saved.id, userId),
    )

    return saved
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  async findAll(query: {
    type?: string; province?: string; status?: string;
    from?: string; to?: string; page?: number; limit?: number
  }) {
    const { type, province, status, from, to, page = 1, limit = 10 } = query
    const qb = this.auctionRepo.createQueryBuilder('a')
      .leftJoinAndSelect('a.auctioneer', 'auctioneer')

    if (status) {
      qb.andWhere('a.status = :status', { status })
    } else {
      qb.andWhere('a.status != :cancelled', { cancelled: AuctionStatus.CANCELLED })
    }

    if (type) qb.andWhere('a.type = :type', { type })
    if (province) qb.andWhere('a.province = :province', { province })
    if (from) qb.andWhere('a.date >= :from', { from })
    if (to) qb.andWhere('a.date <= :to', { to })

    qb.orderBy('a.date', 'ASC')
      .addOrderBy('a.destacado', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async findOne(id: number): Promise<Auction> {
    const auction = await this.auctionRepo.findOne({
      where: { id },
      relations: { auctioneer: true, lots: true },
      order: { lots: { orden: 'ASC' as const } },
    })
    if (!auction) throw new NotFoundException('Remate no encontrado')
    return auction
  }

  async findBySlug(slug: string): Promise<Auction> {
    const auction = await this.auctionRepo.findOne({
      where: { slug },
      relations: { auctioneer: true, lots: true },
      order: { lots: { orden: 'ASC' as const } },
    })
    if (!auction) throw new NotFoundException('Remate not found')
    return auction
  }

  async create(data: Partial<Auction>): Promise<Auction> {
    const slug = data.title ? this.slugify(data.title) : ''
    const auction = this.auctionRepo.create({ ...data, slug })
    return this.auctionRepo.save(auction)
  }

  async update(id: number, data: Partial<Auction>): Promise<Auction> {
    const updateData = { ...data }
    if (data.title) {
      updateData.slug = this.slugify(data.title)
    }
    await this.auctionRepo.update(id, updateData as any)
    const updated = await this.auctionRepo.findOne({
      where: { id },
      relations: { auctioneer: true },
    })
    if (!updated) throw new NotFoundException('Remate not found')
    return updated
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.auctionRepo.softDelete(id)
    if (result.affected === 0) throw new NotFoundException('Remate not found')
  }

  async addLot(auctionId: number, data: Partial<Lot>): Promise<Lot> {
    const auction = await this.auctionRepo.findOne({ where: { id: auctionId } })
    if (!auction) throw new NotFoundException('Remate not found')

    const lot = this.lotRepo.create({ ...data, auctionId })
    return this.lotRepo.save(lot)
  }

  async updateLot(id: number, data: Partial<Lot>): Promise<Lot> {
    await this.lotRepo.update(id, data as any)
    const updated = await this.lotRepo.findOne({ where: { id } })
    if (!updated) throw new NotFoundException('Lote not found')
    return updated
  }

  async deleteLot(id: number): Promise<void> {
    const result = await this.lotRepo.delete(id)
    if (result.affected === 0) throw new NotFoundException('Lote not found')
  }

  async findAllAdmin(query: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = query
    const qb = this.auctionRepo.createQueryBuilder('a')
      .leftJoinAndSelect('a.auctioneer', 'auctioneer')
      .withDeleted()

    qb.orderBy('a.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }
}
