# Fix 008 — Validación de archivos por magic bytes

## Problema
El interceptor `ImageUpload` solo valida el `Content-Type` del header HTTP (`image/jpeg`, `image/png`, etc.). Este header puede ser falseado por un atacante, permitiendo la subida de archivos con contenido ejecutable pero extensión/mimetype de imagen.

## Impacto
**Bajo** (defensa en profundidad) — Actualmente el directorio `uploads/` se sirve estáticamente. Un atacante podría:
- Subir un archivo `.php` o `.html` con mimetype falseado (si el servidor lo ejecutara)
- En el estado actual (NestJS sirve estáticamente sin ejecución), el riesgo es bajo
- Sin embargo, si en el futuro se agrega procesamiento de archivos (thumbnails, PDF parsing), el riesgo aumenta

## Archivos afectados
- `src/common/decorators/upload.interceptor.ts`
- `package.json`

## Causa raíz
La validación se basa en el mimetype declarado por el cliente, que es un campo confiable solo para clientes legítimos.

## Cambios necesarios

### 1. Instalar dependencia para detectar magic bytes
```bash
npm install file-type
```

### 2. Modificar el `fileFilter` para validar magic bytes
```typescript
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { randomUUID } from 'crypto'
import { fileTypeFromBuffer } from 'file-type'
import { BadRequestException } from '@nestjs/common'

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export const ImageUpload = (fieldName = 'file') =>
  FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: join(process.cwd(), 'uploads'),
      filename: (_req, file, cb) => {
        const name = randomUUID()
        const ext = extname(file.originalname)
        cb(null, `${name}${ext}`)
      },
    }),
    fileFilter: async (_req, file, cb) => {
      // 1. Validar mimetype del header (rápido)
      if (!ALLOWED_MIMES.includes(file.mimetype)) {
        cb(new BadRequestException('Invalid file type'), false)
        return
      }

      // 2. Validar magic bytes del archivo
      try {
        const buffer = file.buffer || await new Promise<Buffer>((resolve, reject) => {
          const chunks: Buffer[] = []
          file.stream.on('data', (chunk: Buffer) => chunks.push(chunk))
          file.stream.on('end', () => resolve(Buffer.concat(chunks)))
          file.stream.on('error', reject)
        })
        const type = await fileTypeFromBuffer(buffer)
        if (!type || !ALLOWED_MIMES.includes(type.mime)) {
          cb(new BadRequestException('File content does not match allowed types'), false)
          return
        }
      } catch {
        cb(new BadRequestException('Could not validate file'), false)
        return
      }

      cb(null, true)
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  })
```

### 3. Alternativa más simple: validar por extensión + firma básica
Si `file-type` resulta problemático (es ESM-only en versiones recientes), se puede validar manualmente:
```typescript
const MAGIC_BYTES: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47]],
  'image/gif': [[0x47, 0x49, 0x46, 0x38]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]],  // "RIFF" + 4 bytes + "WEBP"
}

function validateMagicBytes(buffer: Buffer, mime: string): boolean {
  const signatures = MAGIC_BYTES[mime]
  if (!signatures) return false
  return signatures.some(sig =>
    sig.every((byte, i) => buffer[i] === byte)
  )
}
```

## Criterios de aceptación
- [ ] Archivos con mimetype falseado (ej: `shell.php` con `Content-Type: image/jpeg`) son rechazados
- [ ] Archivos de imagen válidos (JPEG, PNG, GIF, WebP) se suben correctamente
- [ ] La validación no degrada significativamente el rendimiento de subida
- [ ] Los tests de subida de imágenes existentes siguen funcionando
