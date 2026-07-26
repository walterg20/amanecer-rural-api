import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { BullBoardModule } from '@bull-board/nestjs'
import { ExpressAdapter } from '@bull-board/express'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { BullBoardAuthMiddleware } from './bull-board-auth.middleware'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'super-secret-key'),
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get<string>('REDIS_PASSWORD') || undefined,
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: 'social-publish' },
      { name: 'messaging-send' },
    ),
    BullBoardModule.forRoot({
      route: '/api/v1/admin/queues',
      adapter: ExpressAdapter,
    }),
    BullBoardModule.forFeature(
      { name: 'social-publish', adapter: BullMQAdapter },
      { name: 'messaging-send', adapter: BullMQAdapter },
    ),
  ],
})
export class QueueModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BullBoardAuthMiddleware)
      .forRoutes('/api/v1/admin/queues')
  }
}
