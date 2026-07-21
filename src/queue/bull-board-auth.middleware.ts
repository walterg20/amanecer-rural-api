import { Injectable, NestMiddleware, UnauthorizedException, ForbiddenException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class BullBoardAuthMiddleware implements NestMiddleware {
  private readonly adminRoles = ['superadmin', 'admin']

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  use(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      throw new UnauthorizedException('Token no proporcionado')
    }

    const token = authHeader.split(' ')[1]
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      })

      if (!this.adminRoles.includes(payload.role)) {
        throw new ForbiddenException('Acceso denegado: se requiere rol admin o superadmin')
      }

      next()
    } catch (error) {
      if (error instanceof ForbiddenException) throw error
      throw new UnauthorizedException('Token inválido o expirado')
    }
  }
}
