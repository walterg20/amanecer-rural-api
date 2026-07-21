import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { Video, VideoStatus } from './entities/video.entity'
import { programas } from './data/programas'

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private readonly videoRepo: Repository<Video>,
  ) {}

  async findAll(query: { seccion?: string; page?: number; limit?: number }) {
    const { seccion, page = 1, limit = 10 } = query
    const qb = this.videoRepo.createQueryBuilder('video')

    qb.andWhere('video.status = :status', { status: VideoStatus.PUBLISHED })

    if (seccion) qb.andWhere('video.seccion = :seccion', { seccion })

    qb.orderBy('video.orden', 'ASC')
      .addOrderBy('video.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  findProgramas() {
    return programas
  }

  async findOne(id: number): Promise<Video> {
    const video = await this.videoRepo.findOne({ where: { id } })
    if (!video) throw new NotFoundException('Video not found')
    return video
  }

  async create(data: { youtubeId: string; title: string; seccion: Video['seccion']; fecha?: string; orden?: number }): Promise<Video> {
    const video = this.videoRepo.create({
      ...data,
      fecha: data.fecha ? new Date(data.fecha) : undefined,
    })
    return this.videoRepo.save(video)
  }

  async update(id: number, data: { youtubeId?: string; title?: string; seccion?: Video['seccion']; fecha?: string; orden?: number }): Promise<Video> {
    const updateData = {
      ...data,
      fecha: data.fecha !== undefined ? (data.fecha ? new Date(data.fecha) : null) : undefined,
    }
    await this.videoRepo.update(id, updateData as any)
    const updated = await this.videoRepo.findOne({ where: { id } })
    if (!updated) throw new NotFoundException('Video not found')
    return updated
  }

  async softDelete(id: number): Promise<void> {
    const result = await this.videoRepo.softDelete(id)
    if (result.affected === 0) throw new NotFoundException('Video not found')
  }

  async reorder(items: { id: number; orden: number }[]) {
    if (!items.length) throw new BadRequestException('Items array is empty')

    const ids = items.map(i => i.id)
    const existing = await this.videoRepo.findBy({ id: In(ids) })
    if (existing.length !== items.length) {
      throw new NotFoundException('One or more videos not found')
    }

    const query = items
      .map(({ id, orden }) => `UPDATE videos SET orden = ${orden} WHERE id = ${id}`)
      .join('; ')

    await this.videoRepo.query(query)
    return { data: { reordered: items.length } }
  }

  async findAllAdmin(query: { seccion?: string; page?: number; limit?: number }) {
    const { seccion, page = 1, limit = 10 } = query
    const qb = this.videoRepo.createQueryBuilder('video')

    if (seccion) qb.andWhere('video.seccion = :seccion', { seccion })

    qb.orderBy('video.orden', 'ASC')
      .addOrderBy('video.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }
}
