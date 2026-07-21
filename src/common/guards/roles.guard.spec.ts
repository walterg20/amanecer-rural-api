import { Reflector } from '@nestjs/core'
import { ExecutionContext } from '@nestjs/common'
import { RolesGuard } from './roles.guard'

describe('RolesGuard', () => {
  let guard: RolesGuard
  let reflector: jest.Mocked<Reflector>
  let mockContext: jest.Mocked<ExecutionContext>

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any

    guard = new RolesGuard(reflector)

    mockContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnThis(),
      getRequest: jest.fn(),
    } as any

    ;(mockContext as any).switchToHttp().getRequest = jest.fn()
  })

  it('allows access when no roles are required', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined)

    const result = guard.canActivate(mockContext)

    expect(result).toBe(true)
  })

  it('allows access when user has required role', () => {
    reflector.getAllAndOverride.mockReturnValue(['admin'])
    ;(mockContext as any).switchToHttp().getRequest.mockReturnValue({
      user: { role: 'admin' },
    })

    const result = guard.canActivate(mockContext)

    expect(result).toBe(true)
  })

  it('denies access when user lacks required role', () => {
    reflector.getAllAndOverride.mockReturnValue(['admin'])
    ;(mockContext as any).switchToHttp().getRequest.mockReturnValue({
      user: { role: 'user' },
    })

    const result = guard.canActivate(mockContext)

    expect(result).toBe(false)
  })

  it('denies access when user has no role property', () => {
    reflector.getAllAndOverride.mockReturnValue(['admin'])
    ;(mockContext as any).switchToHttp().getRequest.mockReturnValue({
      user: {},
    })

    const result = guard.canActivate(mockContext)

    expect(result).toBe(false)
  })

  it('handles multiple required roles', () => {
    reflector.getAllAndOverride.mockReturnValue(['admin', 'editor'])
    ;(mockContext as any).switchToHttp().getRequest.mockReturnValue({
      user: { role: 'editor' },
    })

    const result = guard.canActivate(mockContext)

    expect(result).toBe(true)
  })

  it('allows superadmin access when superadmin is in required roles', () => {
    reflector.getAllAndOverride.mockReturnValue(['superadmin'])
    ;(mockContext as any).switchToHttp().getRequest.mockReturnValue({
      user: { role: 'superadmin' },
    })

    const result = guard.canActivate(mockContext)

    expect(result).toBe(true)
  })
})
