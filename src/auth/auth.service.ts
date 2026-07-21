import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'
import { RegisterDto } from './dto/register.dto'
import { UpdateProfileDto } from './dto/update-profile.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const user = await this.usersService.create(data)
    const tokens = this.generateTokens(user)
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, ...tokens }
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email)
    if (!user || !user.active) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const tokens = this.generateTokens(user)
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, ...tokens }
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken)
      const user = await this.usersService.findById(payload.sub)
      if (!user || !user.active) {
        throw new UnauthorizedException('Invalid refresh token')
      }
      return this.generateTokens(user)
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token')
    }
  }

  async getProfile(userId: number) {
    const user = await this.usersService.findById(userId)
    if (!user) throw new UnauthorizedException('User not found')
    return { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar }
  }

  async updateProfile(userId: number, data: UpdateProfileDto) {
    const user = await this.usersService.updateProfile(userId, data)
    return { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar }
  }

  private generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role?.slug }
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    }
  }
}
