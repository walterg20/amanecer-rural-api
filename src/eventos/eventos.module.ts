import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Evento } from './entities/evento.entity'
import { EventosService } from './eventos.service'
import { EventosController } from './eventos.controller'
import { AdminEventosController } from './admin-eventos.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Evento])],
  providers: [EventosService],
  controllers: [EventosController, AdminEventosController],
})
export class EventosModule {}
