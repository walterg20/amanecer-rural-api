import {
  Controller, Post, Get, Patch, Delete, Param, Body, Query, UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { MessagesService } from './messages.service'
import { CreateMessageDto } from './dto/create-message.dto'
import { QueryMessagesDto } from './dto/query-messages.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@ApiTags('Mensajería')
@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enviar mensaje', description: 'Envía un mensaje a otro usuario (JWT requerido)' })
  async send(@Body() body: CreateMessageDto, @CurrentUser('id') userId: number) {
    const message = await this.messagesService.send(userId, body)
    return { data: message }
  }

  @Get('inbox')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bandeja de entrada', description: 'Lista los mensajes recibidos con paginación y filtro de no leídos' })
  async inbox(@Query() query: QueryMessagesDto, @CurrentUser('id') userId: number) {
    return this.messagesService.findInbox(userId, query)
  }

  @Get('sent')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bandeja de enviados', description: 'Lista los mensajes enviados con paginación' })
  async sent(@Query() query: QueryMessagesDto, @CurrentUser('id') userId: number) {
    return this.messagesService.findSent(userId, query)
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Detalle del mensaje', description: 'Devuelve un mensaje (solo sender o receiver)' })
  async findOne(@Param('id') id: string, @CurrentUser('id') userId: number) {
    const message = await this.messagesService.findOne(+id, userId)
    return { data: message }
  }

  @Patch(':id/read')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marcar leído', description: 'Marca un mensaje como leído (solo el destinatario)' })
  async markRead(@Param('id') id: string, @CurrentUser('id') userId: number) {
    const message = await this.messagesService.markRead(+id, userId)
    return { data: message }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar mensaje', description: 'Eliminación lógica (soft delete) del mensaje para sender o receiver' })
  async remove(@Param('id') id: string, @CurrentUser('id') userId: number) {
    await this.messagesService.softDelete(+id, userId)
    return { data: { id: +id, deleted: true } }
  }
}
