import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { AppController } from './app.controller'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { PostsModule } from './posts/posts.module'
import { PaymentsModule } from './payments/payments.module'
import { VideosModule } from './videos/videos.module'
import { ClimaModule } from './clima/clima.module'
import { EventosModule } from './eventos/eventos.module'
import { ClasificadosModule } from './clasificados/clasificados.module'
import { ProveedoresModule } from './proveedores/proveedores.module'
import { RematesModule } from './remates/remates.module'
import { MessagingModule } from './messaging/messaging.module'
import { StatsModule } from './stats/stats.module'
import { CacheModule } from './cache/cache.module'
import { QueueModule } from './queue/queue.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5433),
        database: config.get<string>('DB_NAME', 'amanecer_rural'),
        username: config.get<string>('DB_USER', 'ar_user'),
        password: config.get<string>('DB_PASSWORD', 'ar_password'),
        autoLoadEntities: true,
        synchronize: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    PaymentsModule,
    VideosModule,
    ClimaModule,
    EventosModule,
    ClasificadosModule,
    ProveedoresModule,
    RematesModule,
    MessagingModule,
    StatsModule,
    CacheModule,
    QueueModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
