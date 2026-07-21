import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from './entities/user.entity'
import { Role, RoleName } from './entities/role.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email }, relations: { role: true } })
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id }, relations: { role: true } })
  }

  async create(data: { email: string; password: string; name: string; roleSlug?: string }): Promise<User> {
    const existing = await this.findByEmail(data.email)
    if (existing) {
      throw new ConflictException('Email already registered')
    }

    const role = await this.roleRepo.findOne({ where: { slug: data.roleSlug || RoleName.USER } })
    if (!role) {
      throw new NotFoundException('Role not found')
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    const user = this.userRepo.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      roleId: role.id,
    })

    return this.userRepo.save(user)
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find({ relations: { role: true } })
  }

  async updateRole(id: number, roleSlug: string): Promise<User> {
    const user = await this.findById(id)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const role = await this.roleRepo.findOne({ where: { slug: roleSlug } })
    if (!role) {
      throw new NotFoundException('Role not found')
    }

    user.roleId = role.id
    return this.userRepo.save(user)
  }

  async updateProfile(id: number, data: { name?: string; avatar?: string }): Promise<User> {
    const user = await this.findById(id)
    if (!user) throw new NotFoundException('User not found')

    if (data.name) user.name = data.name
    if (data.avatar !== undefined) user.avatar = data.avatar

    return this.userRepo.save(user)
  }

  async seedRoles(): Promise<void> {
    const count = await this.roleRepo.count()
    if (count > 0) return

    const roles = [
      { name: 'Superadmin', slug: RoleName.SUPERADMIN, description: 'Full system access' },
      { name: 'Admin', slug: RoleName.ADMIN, description: 'Full access to all features' },
      { name: 'Editor', slug: RoleName.EDITOR, description: 'Can manage content' },
      { name: 'Provider', slug: RoleName.PROVIDER, description: 'Supplier account' },
      { name: 'User', slug: RoleName.USER, description: 'Regular registered user' },
    ]

    await this.roleRepo.save(this.roleRepo.create(roles))
    console.log('Roles seeded successfully (superadmin, admin, editor, provider, user)')
  }
}
