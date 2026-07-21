import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Auctioneer } from './entities/auctioneer.entity'

@Injectable()
export class AuctioneerService {
  constructor(
    @InjectRepository(Auctioneer)
    private readonly auctioneerRepo: Repository<Auctioneer>,
  ) {}

  async findAll() {
    return this.auctioneerRepo.find({
      relations: { auctions: true },
      order: { name: 'ASC' },
    })
  }

  async findOne(id: number): Promise<Auctioneer> {
    const auctioneer = await this.auctioneerRepo.findOne({
      where: { id },
      relations: { auctions: true },
    })
    if (!auctioneer) throw new NotFoundException('Auctioneer not found')
    return auctioneer
  }

  async create(data: Partial<Auctioneer>): Promise<Auctioneer> {
    const auctioneer = this.auctioneerRepo.create(data)
    return this.auctioneerRepo.save(auctioneer)
  }

  async update(id: number, data: Partial<Auctioneer>): Promise<Auctioneer> {
    await this.auctioneerRepo.update(id, data)
    const updated = await this.auctioneerRepo.findOne({ where: { id } })
    if (!updated) throw new NotFoundException('Auctioneer not found')
    return updated
  }

  async delete(id: number): Promise<void> {
    const result = await this.auctioneerRepo.delete(id)
    if (result.affected === 0) throw new NotFoundException('Auctioneer not found')
  }
}
