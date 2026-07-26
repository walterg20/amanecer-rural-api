import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, MoreThan, LessThan, IsNull } from 'typeorm'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { SubscriptionPlan } from './entities/subscription-plan.entity'
import { Subscription, SubscriptionStatus } from './entities/subscription.entity'
import { SubscriptionPayment } from './entities/subscription-payment.entity'
import { SubscriptionStatusHistory } from './entities/subscription-status-history.entity'
import { CreateSubscriptionDto } from './dto/create-subscription.dto'
import { SubscriptionActivatedEvent } from './events/subscription-activated.event'
import { SubscriptionRenewedEvent } from './events/subscription-renewed.event'
import { SubscriptionExpiredEvent } from './events/subscription-expired.event'
import { SubscriptionCancelledEvent } from './events/subscription-cancelled.event'

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly planRepo: Repository<SubscriptionPlan>,
    @InjectRepository(Subscription)
    private readonly subRepo: Repository<Subscription>,
    @InjectRepository(SubscriptionPayment)
    private readonly paymentRepo: Repository<SubscriptionPayment>,
    @InjectRepository(SubscriptionStatusHistory)
    private readonly historyRepo: Repository<SubscriptionStatusHistory>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // ── Planes ──

  async listPlans(includeInactive = false): Promise<SubscriptionPlan[]> {
    const where = includeInactive ? {} : { isActive: true }
    return this.planRepo.find({ where, order: { price: 'ASC' } })
  }

  async getPlan(id: number): Promise<SubscriptionPlan> {
    const plan = await this.planRepo.findOne({ where: { id } })
    if (!plan) throw new NotFoundException('Plan no encontrado')
    return plan
  }

  async createPlan(data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const plan = this.planRepo.create(data)
    return this.planRepo.save(plan)
  }

  async updatePlan(id: number, data: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    await this.getPlan(id)
    await this.planRepo.update(id, data)
    return this.getPlan(id)
  }

  async deletePlan(id: number): Promise<void> {
    const plan = await this.getPlan(id)
    plan.isActive = false
    await this.planRepo.save(plan)
  }

  // ── Suscripciones ──

  async create(dto: CreateSubscriptionDto): Promise<Subscription> {
    const plan = await this.getPlan(dto.planId)
    if (!plan.isActive) throw new BadRequestException('El plan no está activo')

    const sub = this.subRepo.create({
      planId: plan.id,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      status: SubscriptionStatus.PENDING_PAYMENT,
    })
    const saved = await this.subRepo.save(sub)
    return this.getDetail(saved.id)
  }

  async activate(id: number, transactionId?: number): Promise<Subscription> {
    const sub = await this.subRepo.findOne({ where: { id }, relations: { plan: true } })
    if (!sub) throw new NotFoundException('Suscripción no encontrada')
    if (sub.status === SubscriptionStatus.ACTIVE) {
      return this.renew(id, transactionId)
    }

    const now = new Date()
    const periodEnd = new Date(now)
    periodEnd.setDate(periodEnd.getDate() + (sub.plan?.durationDays ?? 30))

    await this.historyRepo.save({
      subscriptionId: id,
      fromStatus: sub.status,
      toStatus: SubscriptionStatus.ACTIVE,
      reason: 'Pago exitoso',
    })

    await this.subRepo.update(id, {
      status: SubscriptionStatus.ACTIVE,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    })

    if (transactionId) {
      await this.paymentRepo.save({
        subscriptionId: id,
        transactionId,
        amount: Number(sub.plan?.price ?? 0),
        periodStart: now,
        periodEnd,
      })
    }

    this.eventEmitter.emit(
      'subscription.activated',
      new SubscriptionActivatedEvent(id, transactionId),
    )

    return this.getDetail(id)
  }

  async renew(id: number, transactionId?: number): Promise<Subscription> {
    const sub = await this.subRepo.findOne({ where: { id }, relations: { plan: true } })
    if (!sub) throw new NotFoundException('Suscripción no encontrada')

    const now = new Date()
    const currentEnd = sub.currentPeriodEnd ?? now
    const newEnd = new Date(currentEnd)
    newEnd.setDate(newEnd.getDate() + (sub.plan?.durationDays ?? 30))

    await this.historyRepo.save({
      subscriptionId: id,
      fromStatus: sub.status,
      toStatus: SubscriptionStatus.ACTIVE,
      reason: 'Renovación',
    })

    await this.subRepo.update(id, {
      status: SubscriptionStatus.ACTIVE,
      currentPeriodEnd: newEnd,
      cancelledAt: undefined as any,
    })

    if (transactionId) {
      await this.paymentRepo.save({
        subscriptionId: id,
        transactionId,
        amount: Number(sub.plan?.price ?? 0),
        periodStart: currentEnd,
        periodEnd: newEnd,
      })
    }

    this.eventEmitter.emit(
      'subscription.renewed',
      new SubscriptionRenewedEvent(id, transactionId, newEnd),
    )

    return this.getDetail(id)
  }

  async cancel(id: number, reason?: string): Promise<Subscription> {
    const sub = await this.subRepo.findOne({ where: { id } })
    if (!sub) throw new NotFoundException('Suscripción no encontrada')

    await this.historyRepo.save({
      subscriptionId: id,
      fromStatus: sub.status,
      toStatus: SubscriptionStatus.CANCELLED,
      reason: reason ?? 'Cancelación manual',
    })

    await this.subRepo.update(id, {
      status: SubscriptionStatus.CANCELLED,
      cancelledAt: new Date(),
    })

    this.eventEmitter.emit(
      'subscription.cancelled',
      new SubscriptionCancelledEvent(id, reason),
    )

    return this.getDetail(id)
  }

  async expire(id: number): Promise<Subscription> {
    const sub = await this.subRepo.findOne({ where: { id } })
    if (!sub) throw new NotFoundException('Suscripción no encontrada')

    await this.historyRepo.save({
      subscriptionId: id,
      fromStatus: sub.status,
      toStatus: SubscriptionStatus.EXPIRED,
      reason: 'Período vencido',
    })

    await this.subRepo.update(id, { status: SubscriptionStatus.EXPIRED })

    this.eventEmitter.emit(
      'subscription.expired',
      new SubscriptionExpiredEvent(id),
    )

    return this.getDetail(id)
  }

  async updateStatus(id: number, status: SubscriptionStatus, reason?: string): Promise<Subscription> {
    const sub = await this.subRepo.findOne({ where: { id } })
    if (!sub) throw new NotFoundException('Suscripción no encontrada')

    await this.historyRepo.save({
      subscriptionId: id,
      fromStatus: sub.status,
      toStatus: status,
      reason: reason ?? 'Cambio manual',
    })

    const updateData: Partial<Subscription> = { status }
    if (status === SubscriptionStatus.CANCELLED) {
      updateData.cancelledAt = new Date()
    }

    await this.subRepo.update(id, updateData)
    return this.getDetail(id)
  }

  async getDetail(id: number): Promise<Subscription> {
    const sub = await this.subRepo.findOne({
      where: { id },
      relations: { plan: true },
    })
    if (!sub) throw new NotFoundException('Suscripción no encontrada')

    const payments = await this.paymentRepo.find({
      where: { subscriptionId: id },
      order: { createdAt: 'DESC' },
    })
    const history = await this.historyRepo.find({
      where: { subscriptionId: id },
      order: { createdAt: 'DESC' },
    })

    return { ...sub, payments, statusHistory: history } as any
  }

  async findAll(query: {
    status?: SubscriptionStatus
    type?: string
    page?: number
    limit?: number
  }) {
    const { status, type, page = 1, limit = 10 } = query
    const qb = this.subRepo.createQueryBuilder('s')
      .leftJoinAndSelect('s.plan', 'plan')

    if (status) qb.andWhere('s.status = :status', { status })
    if (type) qb.andWhere('plan.type = :type', { type })

    qb.orderBy('s.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [data, total] = await qb.getManyAndCount()
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  // ── Renovaciones próximas ──

  async findExpiringSoon(daysAhead = 7): Promise<Subscription[]> {
    const now = new Date()
    const future = new Date()
    future.setDate(future.getDate() + daysAhead)

    return this.subRepo.find({
      where: {
        status: SubscriptionStatus.ACTIVE,
        currentPeriodEnd: LessThan(future),
      },
      relations: { plan: true },
    })
  }

  async expirePastDue(): Promise<number> {
    const now = new Date()
    const expired = await this.subRepo.find({
      where: {
        status: SubscriptionStatus.ACTIVE,
        currentPeriodEnd: LessThan(now),
      },
    })

    for (const sub of expired) {
      await this.expire(sub.id)
    }

    return expired.length
  }

  // ── Seed ──

  async seedPlans(): Promise<void> {
    const count = await this.planRepo.count()
    if (count > 0) return

    const plans = [
      { name: 'Digital Mensual', type: 'digital' as any, durationDays: 30, price: 1500 },
      { name: 'Digital Anual', type: 'digital' as any, durationDays: 365, price: 15000 },
      { name: 'Impreso Mensual', type: 'print' as any, durationDays: 30, price: 3000 },
      { name: 'Impreso Anual', type: 'print' as any, durationDays: 365, price: 30000 },
      { name: 'Combo Mensual', type: 'both' as any, durationDays: 30, price: 4000 },
      { name: 'Combo Anual', type: 'both' as any, durationDays: 365, price: 40000 },
    ]

    for (const plan of plans) {
      await this.planRepo.save(this.planRepo.create(plan))
    }

    console.log('Subscription plans seeded (6 planes)')
  }

  // ── Para integración con payments ──

  async handlePaymentProcessed(event: {
    transactionId: number
    conceptType?: string
    conceptId?: number
    status: string
  }) {
    if (event.conceptType !== 'subscription' || !event.conceptId) return
    if (event.status !== 'approved') return

    await this.activate(event.conceptId, event.transactionId)
  }
}
