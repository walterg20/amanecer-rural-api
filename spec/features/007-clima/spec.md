# 007 — Módulo de Clima

Proxy de API meteorológica con caché Redis. Endpoints para frontend con pronóstico actual y extendido. Sin entidades propias (consume API externa).

## Dependencias externas
- OpenWeatherMap API (One Call 3.0 o 5-day forecast)
- WeatherAPI.com (alternativa gratuita)
- API key en variable de entorno (`WEATHER_API_KEY`)

## Endpoints

| Método | Path | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/v1/clima/actual` | No | Clima actual. Query: `?ciudad=Resistencia&provincia=Chaco` |
| GET | `/api/v1/clima/pronostico` | No | Pronóstico 7 días. Query: `?ciudad=Resistencia&provincia=Chaco` |
| GET | `/api/v1/clima/ciudades` | No | Lista de localidades disponibles (default o configurables) |

## DTOs

### QueryClimaDto
- `ciudad` (IsString, MaxLength 100) — default: 'Resistencia'
- `provincia?` (IsString, MaxLength 100)

## Servicios

### ClimaService
- `getActual(query)`:
  1. Generar cacheKey: `clima:actual:{ciudad}`
  2. Intentar obtener de Redis (TTL: 30 min)
  3. Si no hay cache: fetch a API externa (`/current.json` o `/data/2.5/weather`)
  4. Mapear respuesta a formato uniforme
  5. Guardar en Redis con TTL 30 min
  6. Retornar `{ ciudad, provincia, temperatura, condicion, icono, humedad, viento, sensacion_termica }`

- `getPronostico(query)`:
  1. cacheKey: `clima:pronostico:{ciudad}`
  2. Misma lógica de cache (TTL: 60 min)
  3. Fetch a API externa (`/forecast/daily` o `/data/2.5/forecast`)
  4. Retornar array de 7 días: `{ fecha, temp_max, temp_min, condicion, icono }`

### Formato de respuesta unificado
```typescript
interface ClimaActualResponse {
  ciudad: string
  provincia: string
  temperatura: number
  sensacion_termica: number
  condicion: string
  icono: string       // código de icono (OpenWeather)
  humedad: number
  viento: number       // km/h
  updatedAt: string
}

interface PronosticoResponse {
  ciudad: string
  dias: {
    fecha: string
    temp_max: number
    temp_min: number
    condicion: string
    icono: string
  }[]
}
```

## Estrategia de caché con Redis
- Redis ya configurado en docker-compose (puerto 6379)
- Usar `@nestjs/cache-manager` con Redis store o cache-manager v5
- TTL clima actual: 30 minutos
- TTL pronóstico: 60 minutos
- Fallback: si Redis no disponible, consultar API directamente
- Error handling: si API externa falla, retornar último cache disponible (stale-while-revalidate)

## Ciudades configurables
- Array de localidades en `src/clima/data/ciudades.ts`
- Default: Resistencia (Chaco), Corrientes, Sáenz Peña, etc.
- Cada ciudad mapea a coordenadas o nombre para API externa

## Archivos a crear

### Módulo
- `src/clima/clima.module.ts`

### Controlador
- `src/clima/clima.controller.ts`

### Servicio
- `src/clima/clima.service.ts`

### DTOs
- `src/clima/dto/query-clima.dto.ts`

### Data
- `src/clima/data/ciudades.ts`

### Adicional
- Registrar `CacheModule` en app.module.ts (con Redis, opcional)
- Variable de entorno `WEATHER_API_KEY`
- Inyectar `@nestjs/config` para API key
