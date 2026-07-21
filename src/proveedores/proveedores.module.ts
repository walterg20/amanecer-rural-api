import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Proveedor } from './entities/proveedor.entity'
import { Rubro } from './entities/rubro.entity'
import { ProveedoresService } from './proveedores.service'
import { RubrosService } from './rubros.service'
import { ProveedoresController } from './proveedores.controller'
import { AdminProveedoresController, AdminRubrosController } from './admin-proveedores.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Proveedor, Rubro])],
  providers: [ProveedoresService, RubrosService],
  controllers: [ProveedoresController, AdminProveedoresController, AdminRubrosController],
})
export class ProveedoresModule {}
