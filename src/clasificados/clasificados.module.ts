import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Clasificado } from './entities/clasificado.entity'
import { CategoriaClasificado } from './entities/categoria-clasificado.entity'
import { ClasificadosService } from './clasificados.service'
import { CategoriaClasificadoService } from './categoria-clasificado.service'
import { ClasificadosController } from './clasificados.controller'
import { AdminClasificadosController } from './admin-clasificados.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Clasificado, CategoriaClasificado])],
  providers: [ClasificadosService, CategoriaClasificadoService],
  controllers: [ClasificadosController, AdminClasificadosController],
})
export class ClasificadosModule {}
