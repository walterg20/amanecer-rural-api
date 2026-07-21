import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Message } from './entities/message.entity'
import { MailService } from './mail.service'
import { User } from '../users/entities/user.entity'

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async send(senderId: number, data: { receiverId: number; subject: string; body: string; parentId?: number }) {
    const receiver = await this.userRepo.findOne({ where: { id: data.receiverId } })
    if (!receiver) throw new NotFoundException('Usuario destinatario no encontrado')

    const message = this.messageRepo.create({
      senderId,
      receiverId: data.receiverId,
      subject: data.subject,
      body: data.body,
      parentId: data.parentId,
    })
    await this.messageRepo.save(message)

    const sender = await this.userRepo.findOne({ where: { id: senderId } })
    if (sender) {
      this.mailService.notifyNewMessage(receiver.email, sender.name, data.subject)
    }

    return message
  }

  async findInbox(userId: number, query: { page?: number; limit?: number; unread?: string }) {
    const { page = 1, limit = 10, unread } = query
    const qb = this.messageRepo.createQueryBuilder('m')
      .leftJoinAndSelect('m.sender', 'sender')
      .where('m.receiverId = :userId', { userId })
      .andWhere('m.deletedByReceiver = false')

    if (unread === 'true') qb.andWhere('m.readAt IS NULL')

    qb.orderBy('m.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async findSent(userId: number, query: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = query
    const qb = this.messageRepo.createQueryBuilder('m')
      .leftJoinAndSelect('m.receiver', 'receiver')
      .where('m.senderId = :userId', { userId })
      .andWhere('m.deletedBySender = false')

    qb.orderBy('m.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async findOne(id: number, userId: number): Promise<Message> {
    const message = await this.messageRepo.findOne({
      where: { id },
      relations: { sender: true, receiver: true },
    })
    if (!message) throw new NotFoundException('Mensaje no encontrado')
    if (message.senderId !== userId && message.receiverId !== userId) {
      throw new ForbiddenException('No tienes permiso para ver este mensaje')
    }
    return message
  }

  async markRead(id: number, userId: number): Promise<Message> {
    const message = await this.findOne(id, userId)
    if (message.receiverId !== userId) {
      throw new ForbiddenException('Solo el destinatario puede marcar como leído')
    }
    message.readAt = new Date()
    return this.messageRepo.save(message)
  }

  async softDelete(id: number, userId: number): Promise<void> {
    const message = await this.messageRepo.findOne({ where: { id } })
    if (!message) throw new NotFoundException('Mensaje no encontrado')

    if (message.senderId === userId) {
      message.deletedBySender = true
    } else if (message.receiverId === userId) {
      message.deletedByReceiver = true
    } else {
      throw new ForbiddenException('No tienes permiso para eliminar este mensaje')
    }

    if (message.deletedBySender && message.deletedByReceiver) {
      await this.messageRepo.softDelete(id)
    } else {
      await this.messageRepo.save(message)
    }
  }
}
