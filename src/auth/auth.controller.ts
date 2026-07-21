import { Controller, Post, Get, Patch, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar usuario', description: 'Crea una nueva cuenta de usuario con correo y contraseña' })
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body)
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión', description: 'Autentica con correo y contraseña, devuelve tokens de acceso' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password)
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Renovar tokens', description: 'Intercambia un refresh token válido por un nuevo par access/refresh' })
  async refresh(@Body('refreshToken') refreshToken: string) {
    const tokens = await this.authService.refresh(refreshToken)
    return { data: tokens }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Obtener perfil', description: 'Devuelve el perfil del usuario autenticado' })
  async me(@CurrentUser('id') userId: number) {
    const profile = await this.authService.getProfile(userId)
    return { data: profile }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch('me')
  @ApiOperation({ summary: 'Actualizar perfil', description: 'Actualiza los datos del perfil del usuario autenticado' })
  async updateProfile(@CurrentUser('id') userId: number, @Body() body: UpdateProfileDto) {
    const profile = await this.authService.updateProfile(userId, body)
    return { data: profile }
  }
}
