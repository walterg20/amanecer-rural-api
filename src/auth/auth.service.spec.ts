import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'

jest.mock('bcrypt')

describe('AuthService', () => {
  let service: AuthService
  let usersService: jest.Mocked<UsersService>
  let jwtService: jest.Mocked<JwtService>

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashed-password',
    active: true,
    role: { id: 3, name: 'User', slug: 'user', description: '' },
    roleId: 3,
    avatar: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
            findById: jest.fn(),
            updateProfile: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-token'),
            verify: jest.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    usersService = module.get(UsersService) as jest.Mocked<UsersService>
    jwtService = module.get(JwtService) as jest.Mocked<JwtService>
  })

  describe('register', () => {
    it('creates user and returns tokens', async () => {
      usersService.create.mockResolvedValue(mockUser as any)

      const result = await service.register({
        email: 'test@example.com',
        password: 'Test1234!',
        name: 'Test User',
      })

      expect(usersService.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Test1234!',
        name: 'Test User',
      })
      expect(result).toHaveProperty('accessToken')
      expect(result).toHaveProperty('refreshToken')
      expect(result.user.email).toBe('test@example.com')
    })

    it('propagates error when usersService.create throws', async () => {
      usersService.create.mockRejectedValue(new Error('Email already registered'))

      await expect(
        service.register({ email: 'test@example.com', password: 'Test1234!', name: 'Test' }),
      ).rejects.toThrow('Email already registered')
    })
  })

  describe('login', () => {
    it('returns tokens for valid credentials', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser as any)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

      const result = await service.login('test@example.com', 'Test1234!')

      expect(result).toHaveProperty('accessToken')
      expect(result).toHaveProperty('refreshToken')
      expect(result.user.email).toBe('test@example.com')
    })

    it('throws for invalid password', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser as any)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      await expect(service.login('test@example.com', 'wrongpass')).rejects.toThrow(
        UnauthorizedException,
      )
    })

    it('throws for non-existent user', async () => {
      usersService.findByEmail.mockResolvedValue(null)

      await expect(service.login('nobody@example.com', 'pass')).rejects.toThrow(
        UnauthorizedException,
      )
    })

    it('throws for inactive user', async () => {
      usersService.findByEmail.mockResolvedValue({ ...mockUser, active: false } as any)

      await expect(service.login('test@example.com', 'pass')).rejects.toThrow(
        UnauthorizedException,
      )
    })
  })

  describe('refresh', () => {
    it('returns new tokens for valid refresh token', async () => {
      jwtService.verify.mockReturnValue({ sub: 1, email: 'test@example.com' })
      usersService.findById.mockResolvedValue(mockUser as any)

      const result = await service.refresh('valid-refresh-token')

      expect(result).toHaveProperty('accessToken')
      expect(result).toHaveProperty('refreshToken')
    })

    it('throws for invalid refresh token', async () => {
      jwtService.verify.mockImplementation(() => { throw new Error() })

      await expect(service.refresh('invalid-token')).rejects.toThrow(UnauthorizedException)
    })

    it('throws if user not found', async () => {
      jwtService.verify.mockReturnValue({ sub: 999 })
      usersService.findById.mockResolvedValue(null)

      await expect(service.refresh('valid-token')).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('getProfile', () => {
    it('returns user profile', async () => {
      usersService.findById.mockResolvedValue(mockUser as any)

      const result = await service.getProfile(1)

      expect(result.id).toBe(1)
      expect(result.email).toBe('test@example.com')
    })

    it('throws if user not found', async () => {
      usersService.findById.mockResolvedValue(null)

      await expect(service.getProfile(999)).rejects.toThrow(UnauthorizedException)
    })
  })
})
