# Plan — Videos (TV) API

## Archivos a crear

### Módulo
- `src/videos/videos.module.ts`

### Entidades
- `src/videos/entities/video.entity.ts`

### Controladores
- `src/videos/videos.controller.ts` — públicos
- `src/videos/admin-videos.controller.ts` — admin

### Servicios
- `src/videos/videos.service.ts`

### DTOs
- `src/videos/dto/create-video.dto.ts`
- `src/videos/dto/update-video.dto.ts`
- `src/videos/dto/query-videos.dto.ts`
- `src/videos/dto/reorder-videos.dto.ts`

### Data
- `src/videos/data/programas.ts`

## Pasos
1. Crear entidad Video
2. Implementar VideosService con CRUD + reorden
3. Implementar controlador público (listar por sección, metadata programas)
4. Implementar controlador admin (CRUD + reorder)
5. Registrar módulo
