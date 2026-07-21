import {
  Controller, Post, Get, Patch, Delete, Param, Body,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { SocialAccountsService } from './social-accounts.service'
import { CreateSocialAccountDto } from './dto/create-social-account.dto'
import { UpdateSocialAccountDto } from './dto/update-social-account.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@ApiTags('Admin / Social Accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin/social/accounts')
export class AdminSocialAccountsController {
  constructor(private readonly socialAccountsService: SocialAccountsService) {}

  @Post()
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Conectar cuenta social', description: 'Valida el token contra Meta y guarda la cuenta' })
  async create(@Body() body: CreateSocialAccountDto, @CurrentUser('id') userId: number) {
    const account = await this.socialAccountsService.create(body, userId)
    return { data: account }
  }

  @Get()
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar cuentas sociales', description: 'Devuelve todas las cuentas activas' })
  async findAll() {
    const accounts = await this.socialAccountsService.findAll()
    return { data: accounts }
  }

  @Patch(':id')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar cuenta social', description: 'Actualiza token o nombre de la cuenta' })
  async update(@Param('id') id: string, @Body() body: UpdateSocialAccountDto) {
    const account = await this.socialAccountsService.update(+id, body)
    return { data: account }
  }

  @Delete(':id')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Desconectar cuenta', description: 'Eliminación lógica de la cuenta social' })
  async remove(@Param('id') id: string) {
    await this.socialAccountsService.remove(+id)
    return { data: { id: +id, deleted: true } }
  }

  @Post(':id/test')
  @Roles('superadmin', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publicar post de prueba', description: 'Publica un texto de prueba en la plataforma vinculada' })
  async test(@Param('id') id: string) {
    const result = await this.socialAccountsService.testPublish(+id)
    return { data: result }
  }
}
