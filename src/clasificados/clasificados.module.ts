import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Clasificado } from './entities/clasificado.entity'
import { CategoriaClasificado } from './entities/categoria-clasificado.entity'
import { ClasificadosService } from './clasificados.service'
import { CategoriaClasificadoService } from './categoria-clasificado.service'
import { ClasificadosController } from './clasificados.controller'
import { AdminClasificadosController } from './admin-clasificados.controller'
import { ClasificadosSubscriber } from './clasificados.subscriber'

@Module({
  imports: [TypeOrmModule.forFeature([Clasificado, CategoriaClasificado])],
  providers: [ClasificadosService, CategoriaClasificadoService, ClasificadosSubscriber],
  controllers: [ClasificadosController, AdminClasificadosController],
})
export class ClasificadosModule {}
