import { Injectable } from '@nestjs/common'
import Redis from 'ioredis'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class CacheService {
  private readonly redis: Redis
  private readonly defaultTtl: number

  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6379),
    })
    this.defaultTtl = configService.get<number>('REDIS_CACHE_TTL', 300)
  }

  async get<T>(key: string): Promise<T | null> {
    const raw = await this.redis.get(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const seconds = ttl ?? this.defaultTtl
    await this.redis.setex(key, seconds, JSON.stringify(value))
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key)
  }

  async wrap<T>(key: string, fn: () => Promise<T>, ttl?: number): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached !== null) return cached
    const data = await fn()
    await this.set(key, data, ttl)
    return data
  }

  async ping(): Promise<string> {
    return this.redis.ping()
  }
}
