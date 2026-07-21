import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'

@ApiTags('Admin / Usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar usuarios', description: 'Devuelve todos los usuarios registrados (solo admin)' })
  @ApiResponse({ status: 403, description: 'Acceso denegado — se requiere rol admin' })
  async findAll() {
    const users = await this.usersService.findAll()
    return { data: users.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role, active: u.active })) }
  }

  @Patch(':id/role')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar rol de usuario', description: 'Actualiza el rol de un usuario (solo admin)' })
  @ApiResponse({ status: 403, description: 'Acceso denegado — se requiere rol admin' })
  async updateRole(@Param('id') id: string, @Body('role') role: string) {
    const user = await this.usersService.updateRole(+id, role)
    return { data: { id: user.id, email: user.email, name: user.name, role: user.role } }
  }
}
