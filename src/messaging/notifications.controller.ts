import {
  Controller, Get, Patch, Param, Query, UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { NotificationsService } from './notifications.service'
import { QueryNotificationsDto } from './dto/query-notifications.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@ApiTags('Notificaciones')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar notificaciones', description: 'Lista las notificaciones del usuario autenticado con paginación (polling)' })
  async findAll(@Query() query: QueryNotificationsDto, @CurrentUser('id') userId: number) {
    return this.notificationsService.findByUser(userId, query)
  }

  @Get('unread-count')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Contador no leídas', description: 'Devuelve la cantidad de notificaciones no leídas (ideal para badges)' })
  async unreadCount(@CurrentUser('id') userId: number) {
    return this.notificationsService.unreadCount(userId)
  }

  @Patch(':id/read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marcar leída', description: 'Marca una notificación como leída' })
  async markRead(@Param('id') id: string, @CurrentUser('id') userId: number) {
    const notif = await this.notificationsService.markRead(+id, userId)
    return { data: notif }
  }

  @Patch('read-all')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marcar todas leídas', description: 'Marca todas las notificaciones del usuario como leídas' })
  async markAllRead(@CurrentUser('id') userId: number) {
    return this.notificationsService.markAllRead(userId)
  }
}
