import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Auction } from './entities/auction.entity'
import { Lot } from './entities/lot.entity'
import { Auctioneer } from './entities/auctioneer.entity'
import { AuctionMedia } from './entities/auction-media.entity'
import { RematesService } from './remates.service'
import { AuctioneerService } from './auctioneer.service'
import { RematesController } from './remates.controller'
import { AdminRematesController, AdminLotesController, AdminRematadoresController } from './admin-remates.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Auction, Lot, Auctioneer, AuctionMedia])],
  providers: [RematesService, AuctioneerService],
  controllers: [RematesController, AdminRematesController, AdminLotesController, AdminRematadoresController],
})
export class RematesModule {}
