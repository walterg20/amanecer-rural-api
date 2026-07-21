import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Post } from '../posts/entities/post.entity'
import { User } from '../users/entities/user.entity'
import { Proveedor } from '../proveedores/entities/proveedor.entity'
import { Evento } from '../eventos/entities/evento.entity'
import { Auction } from '../remates/entities/auction.entity'
import { Clasificado } from '../clasificados/entities/clasificado.entity'
import { Transaction } from '../payments/entities/transaction.entity'
import { StatsService } from './stats.service'
import { StatsController } from './stats.controller'
import { CacheModule } from '../cache/cache.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post, User, Proveedor, Evento, Auction, Clasificado, Transaction,
    ]),
    CacheModule,
  ],
  providers: [StatsService],
  controllers: [StatsController],
})
export class StatsModule {}
