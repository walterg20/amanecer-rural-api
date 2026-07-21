import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Message } from './entities/message.entity'
import { Notification } from './entities/notification.entity'
import { User } from '../users/entities/user.entity'
import { MessagesService } from './messages.service'
import { NotificationsService } from './notifications.service'
import { MailService } from './mail.service'
import { MessagesController } from './messages.controller'
import { NotificationsController } from './notifications.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Message, Notification, User])],
  providers: [MessagesService, NotificationsService, MailService],
  controllers: [MessagesController, NotificationsController],
})
export class MessagingModule {}
