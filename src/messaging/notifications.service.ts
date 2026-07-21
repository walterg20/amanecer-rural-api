import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, IsNull } from 'typeorm'
import { Notification, NotificationType } from './entities/notification.entity'
import { MailService } from './mail.service'
import { User } from '../users/entities/user.entity'

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notifRepo: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async create(data: { userId: number; type: NotificationType; title: string; body?: string; link?: string }) {
    const notification = this.notifRepo.create(data)
    await this.notifRepo.save(notification)

    const user = await this.userRepo.findOne({ where: { id: data.userId } })
    if (user) {
      this.mailService.notifyStatusChange(user.email, data.type, data.title, '')
    }

    return notification
  }

  async findByUser(userId: number, query: { page?: number; limit?: number; unread?: string }) {
    const { page = 1, limit = 10, unread } = query
    const qb = this.notifRepo.createQueryBuilder('n')
      .where('n.userId = :userId', { userId })

    if (unread === 'true') qb.andWhere('n.readAt IS NULL')

    qb.orderBy('n.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async markRead(id: number, userId: number) {
    await this.notifRepo.update(
      { id, userId },
      { readAt: new Date() },
    )
    return this.notifRepo.findOne({ where: { id } })
  }

  async markAllRead(userId: number) {
    await this.notifRepo.update(
      { userId, readAt: IsNull() as any },
      { readAt: new Date() },
    )
    return { success: true }
  }

  async unreadCount(userId: number) {
    const count = await this.notifRepo.count({
      where: { userId, readAt: IsNull() as any },
    })
    return { count }
  }
}
