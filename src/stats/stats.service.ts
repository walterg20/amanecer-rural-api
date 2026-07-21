import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Not, Equal, Between } from 'typeorm'
import { Post, PostStatus } from '../posts/entities/post.entity'
import { User } from '../users/entities/user.entity'
import { Proveedor } from '../proveedores/entities/proveedor.entity'
import { Evento, EventoStatus } from '../eventos/entities/evento.entity'
import { Auction, AuctionStatus } from '../remates/entities/auction.entity'
import { Clasificado, ClasificadoStatus } from '../clasificados/entities/clasificado.entity'
import { Transaction } from '../payments/entities/transaction.entity'
import { CacheService } from '../cache/cache.service'

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
  constructor(
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Proveedor) private readonly proveedorRepo: Repository<Proveedor>,
    @InjectRepository(Evento) private readonly eventoRepo: Repository<Evento>,
    @InjectRepository(Auction) private readonly auctionRepo: Repository<Auction>,
    @InjectRepository(Clasificado) private readonly clasificadoRepo: Repository<Clasificado>,
    @InjectRepository(Transaction) private readonly transactionRepo: Repository<Transaction>,
    private readonly cache: CacheService,
  ) {}

  async getDashboard(anio?: number) {
    const year = anio || new Date().getFullYear()
    const cacheKey = `stats:dashboard:${year}`
    const now = new Date()

    return this.cache.wrap(cacheKey, async () => {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      const [
        totalPosts, totalUsers, totalProveedores,
        totalEventos, totalRemates, totalClasificados,
        totalPostsPublishedThisMonth,
        postsPorMes, usersPorMes, revenuePorMes,
      ] = await Promise.all([
        this.postRepo.count({ where: { status: PostStatus.PUBLISHED } }),
        this.userRepo.count(),
        this.proveedorRepo.count(),
        this.eventoRepo.count({ where: { status: EventoStatus.APPROVED } }),
        this.auctionRepo.count({ where: { status: Not(Equal(AuctionStatus.CANCELLED)) } }),
        this.clasificadoRepo.count({ where: { status: ClasificadoStatus.APPROVED } }),
        this.postRepo.count({
          where: {
            status: PostStatus.PUBLISHED,
            publishedAt: Between(startOfMonth, now),
          },
        }),
        this.getPostsByMonth(year),
        this.getUsersByMonth(year),
        this.getRevenueByMonth(year),
      ])

      return {
        totalPosts, totalUsers, totalProveedores,
        totalEventos, totalRemates, totalClasificados,
        totalPostsPublishedThisMonth,
        totalContentQueuedForSocial: 0,
        totalContentPublishedToSocial: 0,
        postsPorMes, usersPorMes, revenuePorMes,
      }
    }, 300)
  }

  async getPostsByMonth(anio?: number): Promise<MonthlyCount[]> {
    const year = anio || new Date().getFullYear()

    return this.cache.wrap(`stats:posts:${year}`, async () => {
      const raw = await this.postRepo
        .createQueryBuilder('p')
        .select("EXTRACT(MONTH FROM p.publishedAt)", "mes")
        .addSelect("EXTRACT(YEAR FROM p.publishedAt)", "anio")
        .addSelect("COUNT(*)", "count")
        .where("p.status = :status", { status: PostStatus.PUBLISHED })
        .andWhere("EXTRACT(YEAR FROM p.publishedAt) = :year", { year })
        .groupBy("EXTRACT(YEAR FROM p.publishedAt), EXTRACT(MONTH FROM p.publishedAt)")
        .orderBy("EXTRACT(MONTH FROM p.publishedAt)", "ASC")
        .getRawMany()

      return raw.map(r => ({
        mes: Number(r.mes), anio: Number(r.anio), count: Number(r.count),
      }))
    }, 600)
  }

  async getUsersByMonth(anio?: number): Promise<MonthlyCount[]> {
    const year = anio || new Date().getFullYear()

    return this.cache.wrap(`stats:users:${year}`, async () => {
      const raw = await this.userRepo
        .createQueryBuilder('u')
        .select("EXTRACT(MONTH FROM u.createdAt)", "mes")
        .addSelect("EXTRACT(YEAR FROM u.createdAt)", "anio")
        .addSelect("COUNT(*)", "count")
        .where("EXTRACT(YEAR FROM u.createdAt) = :year", { year })
        .groupBy("EXTRACT(YEAR FROM u.createdAt), EXTRACT(MONTH FROM u.createdAt)")
        .orderBy("EXTRACT(MONTH FROM u.createdAt)", "ASC")
        .getRawMany()

      return raw.map(r => ({
        mes: Number(r.mes), anio: Number(r.anio), count: Number(r.count),
      }))
    }, 600)
  }

  async getRevenueByMonth(anio?: number): Promise<MonthlyRevenue[]> {
    const year = anio || new Date().getFullYear()

    return this.cache.wrap(`stats:revenue:${year}`, async () => {
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

      return raw.map(r => ({
        mes: Number(r.mes), anio: Number(r.anio), total: Number(r.total),
      }))
    }, 300)
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
        `=== Dashboard ===\ntotalPosts,totalUsers,totalProveedores,totalEventos,totalRemates,totalClasificados,totalPostsPublishedThisMonth`,
        `${data.totalPosts},${data.totalUsers},${data.totalProveedores},${data.totalEventos},${data.totalRemates},${data.totalClasificados},${data.totalPostsPublishedThisMonth}`,
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
}
