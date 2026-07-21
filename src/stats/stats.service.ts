import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Post } from '../posts/entities/post.entity'
import { User } from '../users/entities/user.entity'
import { Proveedor } from '../proveedores/entities/proveedor.entity'
import { Evento } from '../eventos/entities/evento.entity'
import { Auction } from '../remates/entities/auction.entity'
import { Clasificado } from '../clasificados/entities/clasificado.entity'
import { Transaction } from '../payments/entities/transaction.entity'

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

export interface MonthlyCount {
  mes: number
  anio: number
  count: number
}

export interface MonthlyRevenue {
  mes: number
  anio: number
  total: number
}

@Injectable()
export class StatsService {
  private readonly cache = new Map<string, CacheEntry<any>>()

  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Proveedor) private readonly proveedorRepo: Repository<Proveedor>,
    @InjectRepository(Evento) private readonly eventoRepo: Repository<Evento>,
    @InjectRepository(Auction) private readonly auctionRepo: Repository<Auction>,
    @InjectRepository(Clasificado) private readonly clasificadoRepo: Repository<Clasificado>,
    @InjectRepository(Transaction) private readonly transactionRepo: Repository<Transaction>,
  ) {}

  async getDashboard(anio?: number) {
    const year = anio || new Date().getFullYear()
    const cacheKey = `stats:dashboard:${year}`

    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    const [
      totalPosts, totalUsers, totalProveedores,
      totalEventos, totalRemates, totalClasificados,
      postsPorMes, usersPorMes, revenuePorMes,
    ] = await Promise.all([
      this.postRepo.count(),
      this.userRepo.count(),
      this.proveedorRepo.count(),
      this.eventoRepo.count(),
      this.auctionRepo.count(),
      this.clasificadoRepo.count(),
      this.getPostsByMonth(year),
      this.getUsersByMonth(year),
      this.getRevenueByMonth(year),
    ])

    const result = {
      totalPosts, totalUsers, totalProveedores,
      totalEventos, totalRemates, totalClasificados,
      postsPorMes, usersPorMes, revenuePorMes,
    }

    this.setCache(cacheKey, result, 5 * 60 * 1000)
    return result
  }

  async getPostsByMonth(anio?: number): Promise<MonthlyCount[]> {
    const year = anio || new Date().getFullYear()
    const cacheKey = `stats:posts:${year}`

    const cached = this.getFromCache<MonthlyCount[]>(cacheKey)
    if (cached) return cached

    const raw = await this.postRepo
      .createQueryBuilder('p')
      .select("EXTRACT(MONTH FROM p.createdAt)", "mes")
      .addSelect("EXTRACT(YEAR FROM p.createdAt)", "anio")
      .addSelect("COUNT(*)", "count")
      .where("EXTRACT(YEAR FROM p.createdAt) = :year", { year })
      .groupBy("EXTRACT(YEAR FROM p.createdAt), EXTRACT(MONTH FROM p.createdAt)")
      .orderBy("EXTRACT(MONTH FROM p.createdAt)", "ASC")
      .getRawMany()

    const result = raw.map(r => ({
      mes: Number(r.mes), anio: Number(r.anio), count: Number(r.count),
    }))

    this.setCache(cacheKey, result, 10 * 60 * 1000)
    return result
  }

  async getUsersByMonth(anio?: number): Promise<MonthlyCount[]> {
    const year = anio || new Date().getFullYear()
    const cacheKey = `stats:users:${year}`

    const cached = this.getFromCache<MonthlyCount[]>(cacheKey)
    if (cached) return cached

    const raw = await this.userRepo
      .createQueryBuilder('u')
      .select("EXTRACT(MONTH FROM u.createdAt)", "mes")
      .addSelect("EXTRACT(YEAR FROM u.createdAt)", "anio")
      .addSelect("COUNT(*)", "count")
      .where("EXTRACT(YEAR FROM u.createdAt) = :year", { year })
      .groupBy("EXTRACT(YEAR FROM u.createdAt), EXTRACT(MONTH FROM u.createdAt)")
      .orderBy("EXTRACT(MONTH FROM u.createdAt)", "ASC")
      .getRawMany()

    const result = raw.map(r => ({
      mes: Number(r.mes), anio: Number(r.anio), count: Number(r.count),
    }))

    this.setCache(cacheKey, result, 10 * 60 * 1000)
    return result
  }

  async getRevenueByMonth(anio?: number): Promise<MonthlyRevenue[]> {
    const year = anio || new Date().getFullYear()
    const cacheKey = `stats:revenue:${year}`

    const cached = this.getFromCache<MonthlyRevenue[]>(cacheKey)
    if (cached) return cached

    const raw = await this.transactionRepo
      .createQueryBuilder('t')
      .select("EXTRACT(MONTH FROM t.createdAt)", "mes")
      .addSelect("EXTRACT(YEAR FROM t.createdAt)", "anio")
      .addSelect("SUM(t.amount)", "total")
      .where("EXTRACT(YEAR FROM t.createdAt) = :year", { year })
      .andWhere("t.status = 'approved'")
      .groupBy("EXTRACT(YEAR FROM t.createdAt), EXTRACT(MONTH FROM t.createdAt)")
      .orderBy("EXTRACT(MONTH FROM t.createdAt)", "ASC")
      .getRawMany()

    const result = raw.map(r => ({
      mes: Number(r.mes), anio: Number(r.anio), total: Number(r.total),
    }))

    this.setCache(cacheKey, result, 5 * 60 * 1000)
    return result
  }

  generateCsv(section: string, data: any): string {
    const date = new Date().toISOString().split('T')[0]
    const header = `Reporte generado el ${date}\n\n`

    if (section === 'posts' || section === 'all') {
      const rows = data.postsPorMes?.map((r: MonthlyCount) =>
        `${r.anio},${r.mes},${r.count}`
      ).join('\n') ?? ''
      return `${header}=== Posts por Mes ===\nanio,mes,cantidad\n${rows}\n\n`
    }

    if (section === 'users' || section === 'all') {
      const rows = data.usersPorMes?.map((r: MonthlyCount) =>
        `${r.anio},${r.mes},${r.count}`
      ).join('\n') ?? ''
      return `${header}=== Usuarios por Mes ===\nanio,mes,cantidad\n${rows}\n\n`
    }

    if (section === 'revenue' || section === 'all') {
      const rows = data.revenuePorMes?.map((r: MonthlyRevenue) =>
        `${r.anio},${r.mes},${r.total}`
      ).join('\n') ?? ''
      return `${header}=== Ingresos por Mes ===\nanio,mes,total\n${rows}\n\n`
    }

    if (section === 'all') {
      const posts = data.postsPorMes?.map((r: MonthlyCount) =>
        `${r.anio},${r.mes},${r.count}`
      ).join('\n') ?? ''
      const users = data.usersPorMes?.map((r: MonthlyCount) =>
        `${r.anio},${r.mes},${r.count}`
      ).join('\n') ?? ''
      const revenue = data.revenuePorMes?.map((r: MonthlyRevenue) =>
        `${r.anio},${r.mes},${r.total}`
      ).join('\n') ?? ''

      return [
        `${header}`,
        `=== Dashboard ===\ntotalPosts,totalUsers,totalProveedores,totalEventos,totalRemates,totalClasificados`,
        `${data.totalPosts},${data.totalUsers},${data.totalProveedores},${data.totalEventos},${data.totalRemates},${data.totalClasificados}`,
        ``,
        `=== Posts por Mes ===\nanio,mes,cantidad`,
        posts,
        ``,
        `=== Usuarios por Mes ===\nanio,mes,cantidad`,
        users,
        ``,
        `=== Ingresos por Mes ===\nanio,mes,total`,
        revenue,
        ``,
      ].join('\n')
    }

    return `${header}Sección no encontrada: ${section}`
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) return null
    return entry.data
  }

  private setCache<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, { data, expiresAt: Date.now() + ttl })
  }
}
