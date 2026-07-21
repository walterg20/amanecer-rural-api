# Plan — Módulo de Clima

## Archivos a crear

- `src/clima/clima.module.ts`
- `src/clima/clima.controller.ts`
- `src/clima/clima.service.ts`
- `src/clima/dto/query-clima.dto.ts`
- `src/clima/data/ciudades.ts`

## Configuración
- Agregar `WEATHER_API_KEY` a .env
- Instalar `@nestjs/cache-manager` y cache-manager (si no está)

## Pasos
1. Crear módulo Clima con ConfigService
2. Implementar ClimaService con fetch a API externa + cache
3. Implementar endpoints actual, pronóstico, ciudades
4. Configurar caché con Redis
5. Registrar módulo en app.module.ts
