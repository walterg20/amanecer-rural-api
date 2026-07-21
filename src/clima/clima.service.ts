import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ciudades } from './data/ciudades'

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

@Injectable()
export class ClimaService {
  private readonly apiKey: string
  private readonly baseUrl = 'https://api.weatherapi.com/v1'
  private readonly cache = new Map<string, CacheEntry<any>>()

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('WEATHER_API_KEY', '')
  }

  async getActual(query: { ciudad?: string; provincia?: string }) {
    const ciudad = query.ciudad || 'Resistencia'
    const cacheKey = `clima:actual:${ciudad.toLowerCase()}`

    const cached = this.getFromCache<any>(cacheKey)
    if (cached) return cached

    const data = await this.fetchFromApi(`/current.json?q=${encodeURIComponent(ciudad)}`)

    const result = {
      ciudad,
      provincia: query.provincia || this.findProvincia(ciudad),
      temperatura: data.current.temp_c,
      sensacion_termica: data.current.feelslike_c,
      condicion: data.current.condition.text,
      icono: data.current.condition.icon,
      humedad: data.current.humidity,
      viento: Math.round(data.current.wind_kph),
      updatedAt: data.current.last_updated,
    }

    this.setCache(cacheKey, result, 30 * 60 * 1000)
    return result
  }

  async getPronostico(query: { ciudad?: string; provincia?: string }) {
    const ciudad = query.ciudad || 'Resistencia'
    const cacheKey = `clima:pronostico:${ciudad.toLowerCase()}`

    const cached = this.getFromCache<any>(cacheKey)
    if (cached) return cached

    const data = await this.fetchFromApi(`/forecast.json?q=${encodeURIComponent(ciudad)}&days=7`)

    const result = {
      ciudad,
      provincia: query.provincia || this.findProvincia(ciudad),
      dias: data.forecast.forecastday.map((d: any) => ({
        fecha: d.date,
        temp_max: d.day.maxtemp_c,
        temp_min: d.day.mintemp_c,
        condicion: d.day.condition.text,
        icono: d.day.condition.icon,
      })),
    }

    this.setCache(cacheKey, result, 60 * 60 * 1000)
    return result
  }

  getCiudades() {
    return ciudades.map(c => ({
      ciudad: c.nombre,
      provincia: c.provincia,
    }))
  }

  private findProvincia(ciudad: string): string {
    const found = ciudades.find(
      c => c.nombre.toLowerCase() === ciudad.toLowerCase(),
    )
    return found?.provincia || ''
  }

  private async fetchFromApi(path: string): Promise<any> {
    if (!this.apiKey) {
      throw new HttpException(
        'Weather API key not configured',
        HttpStatus.SERVICE_UNAVAILABLE,
      )
    }

    const url = `${this.baseUrl}${path}&key=${this.apiKey}&lang=es`
    const response = await fetch(url)

    if (!response.ok) {
      const cached = this.getStaleCache<any>(path)
      if (cached) return cached

      throw new HttpException(
        `Weather API error: ${response.statusText}`,
        HttpStatus.BAD_GATEWAY,
      )
    }

    return response.json()
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) return null
    return entry.data
  }

  private getStaleCache<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    return entry.data
  }

  private setCache<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl,
    })
  }
}
