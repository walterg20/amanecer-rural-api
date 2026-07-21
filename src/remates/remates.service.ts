import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Auction, AuctionStatus } from './entities/auction.entity'
import { Lot, LotStatus } from './entities/lot.entity'

@Injectable()
export class RematesService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepo: Repository<Auction>,
    @InjectRepository(Lot)
    private readonly lotRepo: Repository<Lot>,
  ) {}

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
